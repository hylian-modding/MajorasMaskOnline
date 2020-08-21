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
exports.MMOnlineConfigCategory = exports.WEEK_EVENT_ARR_SIZE = exports.MASK_FLAG_ARR_SIZE = exports.ITEM_FLAG_ARR_SIZE = exports.EVENT_ARR_SIZE = exports.SCENE_ARR_SIZE = void 0;
const EventHandler_1 = require("modloader64_api/EventHandler");
const Core_1 = require("./MMAPI/Core");
const MMOAPI_1 = require("./MMOAPI/MMOAPI");
// @Drahsid TODO: Move to Z64lib?
const MMAPI_1 = require("./MMAPI/MMAPI");
const MMOPackets_1 = require("./data/MMOPackets");
const MMOnlineStorage_1 = require("./MMOnlineStorage");
const MMOnlineStorageClient_1 = require("./MMOnlineStorageClient");
const NetworkHandler_1 = require("modloader64_api/NetworkHandler");
const PuppetOverlord_1 = require("./data/linkPuppet/PuppetOverlord");
const zzstatic_1 = require("./Z64Lib/API/zzstatic");
const Discord_1 = require("modloader64_api/Discord");
const ModelManager_1 = require("./data/models/ModelManager");
const printf_1 = __importDefault(require("./printf"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.SCENE_ARR_SIZE = 0xd20;
exports.EVENT_ARR_SIZE = 0x8;
exports.ITEM_FLAG_ARR_SIZE = 0x18;
exports.MASK_FLAG_ARR_SIZE = 0x18;
exports.WEEK_EVENT_ARR_SIZE = 0x64;
class MMOnlineConfigCategory {
    constructor() {
        this.mapTracker = false;
        this.keySync = true;
    }
}
exports.MMOnlineConfigCategory = MMOnlineConfigCategory;
class MMO {
    constructor() {
        // Storage
        this.clientStorage = new MMOnlineStorageClient_1.MMOnlineStorageClient;
        this.core = new Core_1.MMCore();
        this.puppets = new PuppetOverlord_1.PuppetOverlord(this, this.core);
        this.models = new ModelManager_1.ModelManager();
    }
    // This packet is basically 'where the hell are you?' if a player has a puppet on file but doesn't know what scene its suppose to be in.
    onSceneRequest_client(packet) {
        if (this.core.save !== undefined) {
            this.ModLoader.clientSide.sendPacketToSpecificPlayer(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, this.core.global.scene_frame_count, this.core.save.form), packet.player);
        }
    }
    onPlayerJoin_server(evt) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(evt.lobby, this);
        if (storage === null) {
            return;
        }
        storage.players[evt.player.uuid] = -1;
        storage.networkPlayerInstances[evt.player.uuid] = evt.player;
    }
    onPlayerLeft_server(evt) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(evt.lobby, this);
        if (storage === null) {
            return;
        }
        delete storage.players[evt.player.uuid];
        delete storage.networkPlayerInstances[evt.player.uuid];
    }
    sendPacketToPlayersInScene(packet) {
        try {
            let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this);
            if (storage === null) {
                return;
            }
            Object.keys(storage.players).forEach((key) => {
                if (storage.players[key] === storage.players[packet.player.uuid]) {
                    if (storage.networkPlayerInstances[key].uuid !== packet.player.uuid) {
                        this.ModLoader.serverSide.sendPacketToSpecificPlayer(packet, storage.networkPlayerInstances[key]);
                    }
                }
            });
        }
        catch (err) { }
    }
    preinit() {
    }
    init() { }
    postinit() {
        this.ModLoader.gui.setDiscordStatus(new Discord_1.DiscordStatus("No peeking", "Testing a secret project"));
        this.writeModel();
    }
    writeModel() {
        // These use the OOT adult format.
        let zz = new zzstatic_1.zzstatic(1 /* MAJORAS_MASK */);
        this.ModLoader.emulator.rdramWriteBuffer(0x80900000, zz.doRepoint(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "data", "models", "zobjs", "Deity.zobj")), 0, true, 0x80900000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80910000, zz.doRepoint(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "data", "models", "zobjs", "Goron.zobj")), 0, true, 0x80910000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80920000, zz.doRepoint(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "data", "models", "zobjs", "Zora.zobj")), 0, true, 0x80920000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80930000, zz.doRepoint(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "data", "models", "zobjs", "Deku.zobj")), 0, true, 0x80930000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80940000, zz.doRepoint(fs_1.default.readFileSync(path_1.default.resolve(__dirname, "data", "models", "zobjs", "Human.zobj")), 0, true, 0x80940000));
    }
    onTick(frame) {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid())
            return;
        printf_1.default(this.ModLoader);
    }
    onLobbyCreated(lobby) {
        try {
            this.ModLoader.lobbyManager.createLobbyStorage(lobby, this, new MMOnlineStorage_1.MMOnlineStorage());
        }
        catch (err) {
            this.ModLoader.logger.error(err);
        }
    }
    onSceneChange(scene) {
        this.ModLoader.logger.debug(scene.toString(16));
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, scene, this.core.save.form));
    }
    onSceneChange_server(packet) {
        try {
            let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this);
            if (storage === null) {
                return;
            }
            storage.players[packet.player.uuid] = packet.scene;
            this.ModLoader.logger.info('Server: Player ' +
                packet.player.nickname +
                ' moved to scene ' +
                packet.scene +
                '.');
            EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.SERVER_PLAYER_CHANGED_SCENES, new MMOAPI_1.MMOnline_PlayerScene(packet.player, packet.lobby, packet.scene));
        }
        catch (err) {
            console.log(err);
        }
    }
    onSceneChange_client(packet) {
        this.ModLoader.logger.info('client receive: Player ' + packet.player.nickname + ' moved to scene ' + packet.scene + '.');
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.CLIENT_REMOTE_PLAYER_CHANGED_SCENES, new MMOAPI_1.MMOnline_PlayerScene(packet.player, packet.lobby, packet.scene));
    }
    onLoadingZone(evt) {
        this.ModLoader.logger.debug("I've touched a loading zone.");
    }
    onAgeChange(age) {
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, this.core.global.current_scene, age));
    }
    onPayload(evt) {
        let f = path_1.default.parse(evt.file);
        if (f.ext === ".ovl") {
            if (f.name === "link") {
                this.ModLoader.logger.info("Puppet assigned.");
                this.ModLoader.emulator.rdramWrite16(0x800000, evt.result);
            }
        }
    }
    getServerURL() {
        return "192.99.70.23:8035";
    }
}
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_SceneRequestPacket')
], MMO.prototype, "onSceneRequest_client", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_JOIN)
], MMO.prototype, "onPlayerJoin_server", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_LEAVE)
], MMO.prototype, "onPlayerLeft_server", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_CREATE)
], MMO.prototype, "onLobbyCreated", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_SCENE_CHANGE)
], MMO.prototype, "onSceneChange", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_ScenePacket')
], MMO.prototype, "onSceneChange_server", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_ScenePacket')
], MMO.prototype, "onSceneChange_client", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_LOADING_ZONE)
], MMO.prototype, "onLoadingZone", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_AGE_CHANGE)
], MMO.prototype, "onAgeChange", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_PAYLOAD_INJECTED)
], MMO.prototype, "onPayload", null);
module.exports = MMO;
exports.default = MMO;
//# sourceMappingURL=MMO.js.map