"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetOverlord = void 0;
const Puppet_1 = require("./Puppet");
const MMAPI_1 = require("../../MMAPI/MMAPI");
const NetworkHandler_1 = require("modloader64_api/NetworkHandler");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
const MMOPackets_1 = require("../MMOPackets");
const fs_1 = __importDefault(require("fs"));
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const PluginLifecycle_1 = require("modloader64_api/PluginLifecycle");
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMoAPI_1 = require("../../MMOAPI/MMoAPI");
class PuppetOverlord {
    constructor(parent, core) {
        this.puppets = new Map();
        this.awaiting_spawn = new Array();
        this.amIAlone = true;
        this.playersAwaitingPuppets = new Array();
        this.queuedSpawn = false;
        this.parent = parent;
        this.core = core;
    }
    postinit() {
        this.fakeClientPuppet = new Puppet_1.Puppet(this.ModLoader.me, this.core, 
        // The pointer here points to blank space, so should be fine.
        0x6011e8, this.ModLoader, this.parent);
    }
    get current_scene() {
        return this.fakeClientPuppet.scene;
    }
    localPlayerLoadingZone() {
        this.puppets.forEach((value, key, map) => {
            value.despawn();
        });
        this.awaiting_spawn.splice(0, this.awaiting_spawn.length);
    }
    localPlayerChangingScenes(entering_scene, form) {
        this.awaiting_spawn.splice(0, this.awaiting_spawn.length);
        this.fakeClientPuppet.scene = entering_scene;
        this.fakeClientPuppet.form = form;
    }
    registerPuppet(player) {
        this.ModLoader.logger.info('Player ' + player.nickname + ' awaiting puppet assignment.');
        this.playersAwaitingPuppets.push(player);
    }
    unregisterPuppet(player) {
        if (this.puppets.has(player.uuid)) {
            let puppet = this.puppets.get(player.uuid);
            puppet.despawn();
            this.puppets.delete(player.uuid);
        }
        if (this.playersAwaitingPuppets.length > 0) {
            let index = -1;
            for (let i = 0; i < this.playersAwaitingPuppets.length; i++) {
                if (this.playersAwaitingPuppets[i].uuid === player.uuid) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.playersAwaitingPuppets.splice(index, 1);
            }
        }
    }
    changePuppetScene(player, entering_scene, form) {
        if (this.puppets.has(player.uuid)) {
            let puppet = this.puppets.get(player.uuid);
            if (puppet.isSpawned && puppet.form !== form) {
                puppet.despawn();
            }
            puppet.scene = entering_scene;
            puppet.form = form;
            this.ModLoader.logger.info('Puppet ' + puppet.id + ' moved to scene ' + puppet.scene);
            if (this.fakeClientPuppet.scene === puppet.scene) {
                this.ModLoader.logger.info('Queueing puppet ' + puppet.id + ' for immediate spawning.');
                this.awaiting_spawn.push(puppet);
            }
        }
        else {
            this.ModLoader.logger.info('No puppet found for player ' + player.nickname + '.');
        }
    }
    processNewPlayers() {
        if (this.playersAwaitingPuppets.length > 0) {
            let player = this.playersAwaitingPuppets.splice(0, 1)[0];
            this.puppets.set(player.uuid, new Puppet_1.Puppet(player, this.core, 0x0, this.ModLoader, this.parent));
            this.ModLoader.logger.info('Player ' +
                player.nickname +
                ' assigned new puppet ' +
                this.puppets.get(player.uuid).id +
                '.');
            this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_SceneRequestPacket(this.ModLoader.clientLobby));
        }
    }
    processAwaitingSpawns() {
        if (this.awaiting_spawn.length > 0 && !this.queuedSpawn) {
            let puppet = this.awaiting_spawn.shift();
            puppet.spawn();
        }
    }
    lookForMissingOrStrandedPuppets() {
        let check = false;
        this.puppets.forEach((value, key, map) => {
            if (value.scene === this.fakeClientPuppet.scene) {
                if (!value.isSpawned && this.awaiting_spawn.indexOf(value) === -1) {
                    this.awaiting_spawn.push(value);
                }
                check = true;
            }
            if (value.scene !== this.fakeClientPuppet.scene &&
                value.isSpawned &&
                !value.isShoveled) {
                value.shovel();
            }
        });
        if (check) {
            this.amIAlone = false;
        }
        else {
            this.amIAlone = true;
        }
    }
    sendPuppetPacket() {
        if (!this.amIAlone) {
            let packet = new MMOPackets_1.MMO_PuppetPacket(this.fakeClientPuppet.data, this.ModLoader.clientLobby);
            /*       if (this.Epona !== undefined) {
                    packet.setHorseData(this.Epona);
                  } */
            this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_PuppetWrapperPacket(packet, this.ModLoader.clientLobby));
        }
    }
    processPuppetPacket(packet) {
        if (this.puppets.has(packet.player.uuid)) {
            let puppet = this.puppets.get(packet.player.uuid);
            let actualPacket = JSON.parse(packet.data);
            puppet.processIncomingPuppetData(actualPacket.data);
            //if (actualPacket.horse_data !== undefined) {
            /*         puppet.processIncomingHorseData(actualPacket.horse_data); */
            //}
        }
    }
    generateCrashDump() {
        let _puppets = {};
        this.puppets.forEach((value, key, map) => {
            _puppets[key] = {
                isSpawned: value.isSpawned,
                isSpawning: value.isSpawning,
                isShoveled: value.isShoveled,
                pointer: value.data.pointer,
                player: value.player,
            };
        });
        fs_1.default.writeFileSync('./PuppetOverlord_crashdump.json', JSON.stringify(_puppets, null, 2));
    }
    // TODO
    isCurrentlyWarping() {
        return false;
    }
    onTick() {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid() ||
            this.core.helper.isPaused()) {
            return;
        }
        if (!this.core.helper.isLinkEnteringLoadingZone() &&
            this.core.helper.isInterfaceShown() &&
            !this.isCurrentlyWarping()) {
            this.processNewPlayers();
            this.processAwaitingSpawns();
            this.lookForMissingOrStrandedPuppets();
        }
        this.sendPuppetPacket();
    }
    onPlayerJoin(player) {
        this.registerPuppet(player);
    }
    onPlayerLeft(player) {
        this.unregisterPuppet(player);
    }
    onLoadingZone(evt) {
        this.localPlayerLoadingZone();
    }
    onSceneChange(scene) {
        this.localPlayerLoadingZone();
        this.localPlayerChangingScenes(scene, this.core.save.form);
    }
    onSceneChange_client(packet) {
        this.changePuppetScene(packet.player, packet.scene, packet.form);
    }
    onPuppetData_server(packet) {
        this.parent.sendPacketToPlayersInScene(packet);
    }
    onPuppetData_client(packet) {
        if (this.core.helper.isTitleScreen() ||
            this.core.helper.isPaused() ||
            this.core.helper.isLinkEnteringLoadingZone()) {
            return;
        }
        this.processPuppetPacket(packet);
    }
    onformChange(form) {
        //this.localPlayerLoadingZone();
    }
    onEmuCrash(evt) {
        this.generateCrashDump();
    }
    onEponaSpawned(actor) {
        /*     if (actor.actorID === 0x0014) {
              // Epona spawned.
              this.ModLoader.logger.debug("Epona spawned");
              this.Epona = new HorseData(actor, this.fakeClientPuppet, this.core);
            } */
    }
    onEponaDespawned(actor) {
        /*     if (actor.actorID === 0x0014) {
              // Epona despawned.
              //@ts-ignore
              this.Epona = undefined;
              this.ModLoader.logger.debug("Epona despawned");
            } */
    }
    onRoguePuppet(puppet) {
        if (this.puppets.has(puppet.player.uuid)) {
            this.puppets.delete(puppet.player.uuid);
        }
    }
    onReset(evt) {
        this.localPlayerLoadingZone();
    }
    onSpawn(puppet) {
        this.ModLoader.logger.debug("Unlocking puppet spawner.");
        this.queuedSpawn = false;
    }
    onPreSpawn(puppet) {
        this.ModLoader.logger.debug("Locking puppet spawner.");
        this.queuedSpawn = true;
    }
}
__decorate([
    ModLoaderAPIInjector_1.ModLoaderAPIInject()
], PuppetOverlord.prototype, "ModLoader", void 0);
__decorate([
    PluginLifecycle_1.Postinit()
], PuppetOverlord.prototype, "postinit", null);
__decorate([
    PluginLifecycle_1.onTick()
], PuppetOverlord.prototype, "onTick", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_PLAYER_JOIN)
], PuppetOverlord.prototype, "onPlayerJoin", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_PLAYER_LEAVE)
], PuppetOverlord.prototype, "onPlayerLeft", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_LOADING_ZONE)
], PuppetOverlord.prototype, "onLoadingZone", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_SCENE_CHANGE)
], PuppetOverlord.prototype, "onSceneChange", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_ScenePacket')
], PuppetOverlord.prototype, "onSceneChange_client", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_PuppetPacket')
], PuppetOverlord.prototype, "onPuppetData_server", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_PuppetPacket')
], PuppetOverlord.prototype, "onPuppetData_client", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_AGE_CHANGE)
], PuppetOverlord.prototype, "onformChange", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_CRASH)
], PuppetOverlord.prototype, "onEmuCrash", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_ACTOR_SPAWN)
], PuppetOverlord.prototype, "onEponaSpawned", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_ACTOR_DESPAWN)
], PuppetOverlord.prototype, "onEponaDespawned", null);
__decorate([
    EventHandler_1.EventHandler("MMOnline:RoguePuppet")
], PuppetOverlord.prototype, "onRoguePuppet", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_SOFT_RESET_PRE)
], PuppetOverlord.prototype, "onReset", null);
__decorate([
    EventHandler_1.EventHandler(MMoAPI_1.MMOnlineEvents.PLAYER_PUPPET_SPAWNED)
], PuppetOverlord.prototype, "onSpawn", null);
__decorate([
    EventHandler_1.EventHandler(MMoAPI_1.MMOnlineEvents.PLAYER_PUPPET_PRESPAWN)
], PuppetOverlord.prototype, "onPreSpawn", null);
exports.PuppetOverlord = PuppetOverlord;
//# sourceMappingURL=PuppetOverlord.js.map