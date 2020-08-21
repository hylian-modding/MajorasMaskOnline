"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMOServer = void 0;
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMOnlineStorage_1 = require("./MMOnlineStorage");
const SidedProxy_1 = require("modloader64_api/SidedProxy/SidedProxy"); //BRUH
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
const NetworkHandler_1 = require("modloader64_api/NetworkHandler");
const MMOAPI_1 = require("./MMOAPI/MMOAPI"); //Add MMOnline_PlayerScene
const MMOPackets_1 = require("./data/MMOPackets");
const MMOSaveData_1 = require("./data/MMOSaveData"); //Needs porting
class MMOServer {
    sendPacketToPlayersInScene(packet) {
        try {
            let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
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
    onLobbyCreated(lobby) {
        try {
            this.ModLoader.lobbyManager.createLobbyStorage(lobby, this.parent, new MMOnlineStorage_1.MMOnlineStorage());
        }
        catch (err) {
            this.ModLoader.logger.error(err);
        }
    }
    onPlayerJoin_server(evt) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(evt.lobby, this.parent);
        if (storage === null) {
            return;
        }
        storage.players[evt.player.uuid] = -1;
        storage.networkPlayerInstances[evt.player.uuid] = evt.player;
    }
    onPlayerLeft_server(evt) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(evt.lobby, this.parent);
        if (storage === null) {
            return;
        }
        delete storage.players[evt.player.uuid];
        delete storage.networkPlayerInstances[evt.player.uuid];
    }
    onSceneChange_server(packet) {
        try {
            let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
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
        }
    }
    //------------------------------
    // Subscreen Syncing
    //------------------------------
    onFIELD_BOTTLEserver(packet) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
        if (storage === null) {
            return;
        }
        switch (packet.slot) {
            case 0:
                storage.inventoryStorage.FIELD_BOTTLE1 = packet.contents;
                break;
            case 1:
                storage.inventoryStorage.FIELD_BOTTLE2 = packet.contents;
                break;
            case 2:
                storage.inventoryStorage.FIELD_BOTTLE3 = packet.contents;
                break;
            case 3:
                storage.inventoryStorage.FIELD_BOTTLE4 = packet.contents;
                break;
        }
    }
    // Client is logging in and wants to know how to proceed.
    onDownloadPacket_server(packet) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
        if (storage === null) {
            return;
        }
        if (storage.saveGameSetup) {
            // Game is running, get data.
            this.ModLoader.serverSide.sendPacketToSpecificPlayer(new MMOPackets_1.MMO_DownloadResponsePacket(new MMOPackets_1.MMO_SubscreenSyncPacket(storage.inventoryStorage, storage.equipmentStorage, storage.questStorage, storage.dungeonItemStorage, packet.lobby), new MMOPackets_1.MMO_ServerFlagUpdate(storage.sceneStorage, storage.eventStorage, storage.itemFlagStorage, storage.infStorage, storage.skulltulaStorage, packet.lobby), new MMOPackets_1.MMO_BankSyncPacket(storage.bank, packet.lobby), packet.lobby), packet.player);
            //this.ModLoader.serverSide.sendPacketToSpecificPlayer(new MMO_KeyRebuildPacket(storage.changelog, packet.lobby), packet.player);
        }
        else {
            // Game is not running, give me your data.
            this.ModLoader.serverSide.sendPacketToSpecificPlayer(new MMOPackets_1.MMO_DownloadResponsePacket2(packet.lobby), packet.player);
        }
    }
    onItemSync_server(packet) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
        if (storage === null) {
            return;
        }
        MMOSaveData_1.mergeInventoryData(storage.inventoryStorage, packet.inventory);
        MMOSaveData_1.mergeEquipmentData(storage.equipmentStorage, packet.equipment);
        MMOSaveData_1.mergeQuestSaveData(storage.questStorage, packet.quest);
        MMOSaveData_1.mergeDungeonItemData(storage.dungeonItemStorage, packet.dungeonItems);
        this.ModLoader.serverSide.sendPacket(new MMOPackets_1.MMO_SubscreenSyncPacket(storage.inventoryStorage, storage.equipmentStorage, storage.questStorage, storage.dungeonItemStorage, packet.lobby));
        storage.saveGameSetup = true;
    }
    //------------------------------
    // Flag Syncing
    //------------------------------
    onSceneFlagSync_server(packet) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
        if (storage === null) {
            return;
        }
        for (let i = 0; i < packet.scenes.byteLength; i += 0x1C) {
            let struct = new MMOSaveData_1.MMO_SceneStruct(packet.scenes.slice(i, i + 0x1C));
            let cur = new MMOSaveData_1.MMO_SceneStruct(storage.sceneStorage.slice(i, i + 0x1C));
            for (let j = 0; j < struct.chests.byteLength; j++) {
                if (struct.chests[j] !== cur.chests[i]) {
                    cur.chests[j] |= struct.chests[j];
                }
            }
            for (let j = 0; j < struct.collectible.byteLength; j++) {
                if (struct.collectible[j] !== cur.collectible[i]) {
                    cur.collectible[j] |= struct.collectible[j];
                }
            }
            for (let j = 0; j < struct.room_clear.byteLength; j++) {
                if (struct.room_clear[j] !== cur.room_clear[i]) {
                    cur.room_clear[j] |= struct.room_clear[j];
                }
            }
            for (let j = 0; j < struct.switches.byteLength; j++) {
                if (struct.switches[j] !== cur.switches[i]) {
                    cur.switches[j] |= struct.switches[j];
                }
            }
            for (let j = 0; j < struct.visited_floors.byteLength; j++) {
                if (struct.visited_floors[j] !== cur.visited_floors[i]) {
                    cur.visited_floors[j] |= struct.visited_floors[j];
                }
            }
            for (let j = 0; j < struct.visited_rooms.byteLength; j++) {
                if (struct.visited_rooms[j] !== cur.visited_rooms[i]) {
                    cur.visited_rooms[j] |= struct.visited_rooms[j];
                }
            }
            for (let j = 0; j < struct.unused.byteLength; j++) {
                if (struct.unused[j] !== cur.unused[i]) {
                    cur.unused[j] = struct.unused[j];
                }
            }
        }
        for (let i = 0; i < packet.events.byteLength; i++) {
            let value = packet.events[i];
            if (storage.eventStorage[i] !== value) {
                storage.eventStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.items.byteLength; i++) {
            let value = packet.items[i];
            if (storage.itemFlagStorage[i] !== value) {
                storage.itemFlagStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.inf.byteLength; i++) {
            let value = packet.inf[i];
            if (storage.infStorage[i] !== value) {
                storage.infStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.skulltulas.byteLength; i++) {
            let value = packet.skulltulas[i];
            if (storage.skulltulaStorage[i] !== value) {
                storage.skulltulaStorage[i] |= value;
            }
        }
        this.ModLoader.serverSide.sendPacket(new MMOPackets_1.MMO_ServerFlagUpdate(storage.sceneStorage, storage.eventStorage, storage.itemFlagStorage, storage.infStorage, storage.skulltulaStorage, packet.lobby));
    }
    onSceneContextSync_server(packet) {
        this.sendPacketToPlayersInScene(packet);
    }
    onBankUpdate_server(packet) {
        let storage = this.ModLoader.lobbyManager.getLobbyStorage(packet.lobby, this.parent);
        if (storage === null) {
            return;
        }
        storage.bank = packet.savings;
    }
    onServerReceivedCrashlog(evt) {
        //let cp: CrashParserActorTable = new CrashParserActorTable();
        //let html: string = cp.parse(evt.dump);
        //fs.writeFileSync("./crashlogs/" + evt.name + ".html", html);
    }
}
__decorate([
    ModLoaderAPIInjector_1.ModLoaderAPIInject()
], MMOServer.prototype, "ModLoader", void 0);
__decorate([
    SidedProxy_1.ParentReference()
], MMOServer.prototype, "parent", void 0);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_CREATE)
], MMOServer.prototype, "onLobbyCreated", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_JOIN)
], MMOServer.prototype, "onPlayerJoin_server", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsServer.ON_LOBBY_LEAVE)
], MMOServer.prototype, "onPlayerLeft_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_ScenePacket')
], MMOServer.prototype, "onSceneChange_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_BottleUpdatePacket')
], MMOServer.prototype, "onFIELD_BOTTLEserver", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_DownloadRequestPacket')
], MMOServer.prototype, "onDownloadPacket_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_SubscreenSyncPacket')
], MMOServer.prototype, "onItemSync_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_ClientFlagUpdate')
], MMOServer.prototype, "onSceneFlagSync_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler('MMO_ClientSceneContextUpdate')
], MMOServer.prototype, "onSceneContextSync_server", null);
__decorate([
    NetworkHandler_1.ServerNetworkHandler("MMO_BankSyncPacket")
], MMOServer.prototype, "onBankUpdate_server", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_RECEIVED_CRASH_LOG)
], MMOServer.prototype, "onServerReceivedCrashlog", null);
exports.MMOServer = MMOServer;
//# sourceMappingURL=MMOnlineServer.js.map