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
exports.MMOnlineClient = exports.GHOST_MODE_TRIGGERED = void 0;
const CoreInjection_1 = require("modloader64_api/CoreInjection");
const EventHandler_1 = require("modloader64_api/EventHandler");
const NetworkHandler_1 = require("modloader64_api/NetworkHandler");
const MMAPI_1 = require("./MMAPI/MMAPI");
const MMOAPI_1 = require("./MMOAPI/MMOAPI");
const MMOSaveData_1 = require("./data/MMOSaveData");
const MMOPackets_1 = require("./data/MMOPackets");
const path_1 = __importDefault(require("path"));
const GUITunnel_1 = require("modloader64_api/GUITunnel");
const fs_1 = __importDefault(require("fs"));
const MMOnlineStorageClient_1 = require("./MMOnlineStorageClient");
const Discord_1 = require("modloader64_api/Discord");
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const PluginLifecycle_1 = require("modloader64_api/PluginLifecycle");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
const ParseFlagChanges_1 = require("./data/ParseFlagChanges");
exports.GHOST_MODE_TRIGGERED = false;
class MMOnlineClient {
    constructor() {
        this.LobbyConfig = {};
        this.clientStorage = new MMOnlineStorageClient_1.MMOnlineStorageClient();
    }
    //@SidedProxy(ProxySide.CLIENT, ModelManagerClient)
    //modelManager!: ModelManagerClient;
    onGhostInstruction(evt) {
        this.clientStorage.first_time_sync = true;
        exports.GHOST_MODE_TRIGGERED = true;
    }
    preinit() {
    }
    init() {
    }
    postinit() {
        this.clientStorage.scene_keys = JSON.parse(fs_1.default.readFileSync(__dirname + '/data/scene_numbers.json').toString());
        this.clientStorage.localization = JSON.parse(fs_1.default.readFileSync(__dirname + '/data/en_US.json').toString());
        let status = new Discord_1.DiscordStatus('Playing MMOnline', 'On the title screen');
        status.smallImageKey = 'MMO';
        status.partyId = this.ModLoader.clientLobby;
        status.partyMax = 30;
        status.partySize = 1;
        this.ModLoader.gui.setDiscordStatus(status);
    }
    updateInventory() {
        this.ModLoader.logger.info('updateInventory()');
        let inventory = MMOSaveData_1.createInventoryFromContext(this.core.save);
        let equipment = MMOSaveData_1.createEquipmentFromContext(this.core.save);
        let quest = MMOSaveData_1.createQuestSaveFromContext(this.core.save);
        let di = MMOSaveData_1.createDungeonItemDataFromContext(this.core.save.dungeonItemManager);
        MMOSaveData_1.mergeInventoryData(this.clientStorage.inventoryStorage, inventory);
        MMOSaveData_1.mergeEquipmentData(this.clientStorage.equipmentStorage, equipment);
        MMOSaveData_1.mergeQuestSaveData(this.clientStorage.questStorage, quest);
        MMOSaveData_1.mergeDungeonItemData(this.clientStorage.dungeonItemStorage, di);
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_SubscreenSyncPacket(this.clientStorage.inventoryStorage, this.clientStorage.equipmentStorage, this.clientStorage.questStorage, this.clientStorage.dungeonItemStorage, this.ModLoader.clientLobby));
        this.clientStorage.needs_update = false;
    }
    updateFlags() {
        if (this.ModLoader.emulator.rdramRead8(0x80600144) === 0x1) {
            this.ModLoader.logger.debug("Flag updating temporarily disabled in this scene.");
            return;
        }
        this.ModLoader.utils.clearBuffer(this.clientStorage.sceneStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.eventStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.itemFlagStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.infStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.skulltulaStorage);
        let scene_data = this.core.save.scene_flags;
        let event_data = this.core.save.event_flags;
        let scenes = ParseFlagChanges_1.parseFlagChanges(scene_data, this.clientStorage.sceneStorage);
        let events = ParseFlagChanges_1.parseFlagChanges(event_data, this.clientStorage.eventStorage);
        this.ModLoader.logger.info('updateFlags()');
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ClientFlagUpdate(this.clientStorage.sceneStorage, this.clientStorage.eventStorage, this.clientStorage.itemFlagStorage, this.clientStorage.infStorage, this.clientStorage.skulltulaStorage, this.ModLoader.clientLobby));
    }
    autosaveSceneData() {
        if (!this.core.helper.isLinkEnteringLoadingZone() &&
            this.core.global.scene_frame_count > 20) {
            if (this.ModLoader.emulator.rdramRead8(0x80600144) === 0x1) {
                return;
            }
            let live_scene_chests = this.core.save.liveSceneData_chests;
            let live_scene_switches = this.core.save.liveSceneData_switch;
            let live_scene_clear = this.core.save.liveSceneData_clear;
            let live_scene_temp = this.core.save.liveSceneData_temp;
            let save_scene_data = this.core.global.getSaveDataForCurrentScene();
            let save = Buffer.alloc(0x1c);
            live_scene_chests.copy(save, 0x0); // Chests
            live_scene_switches.copy(save, 0x4); // Switches
            live_scene_clear.copy(save, 0x8); // Room Clear
            live_scene_temp.copy(save, 0x10); // Unused space.
            save_scene_data.copy(save, 0x14, 0x14, 0x18); // Visited Rooms.
            save_scene_data.copy(save, 0x18, 0x18, 0x1c); // Visited Rooms.
            let save_hash_2 = this.ModLoader.utils.hashBuffer(save);
            if (save_hash_2 !== this.clientStorage.autoSaveHash) {
                this.ModLoader.logger.info('autosaveSceneData()');
                save_scene_data.copy(save, 0x10, 0x10, 0x14);
                for (let i = 0; i < save_scene_data.byteLength; i++) {
                    save_scene_data[i] |= save[i];
                }
                this.clientStorage.autoSaveHash = save_hash_2;
            }
            else {
                return;
            }
            this.core.global.writeSaveDataForCurrentScene(save_scene_data);
            this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ClientSceneContextUpdate(live_scene_chests, live_scene_switches, live_scene_clear, live_scene_temp, this.ModLoader.clientLobby, this.core.global.current_scene));
        }
    }
    updateBottles(onlyfillCache = false) {
        let bottles = [
            this.core.save.inventory.FIELD_BOTTLE1,
            this.core.save.inventory.FIELD_BOTTLE2,
            this.core.save.inventory.FIELD_BOTTLE3,
            this.core.save.inventory.FIELD_BOTTLE4,
            this.core.save.inventory.FIELD_BOTTLE5,
            this.core.save.inventory.FIELD_BOTTLE6
        ];
        for (let i = 0; i < bottles.length; i++) {
            if (bottles[i] !== this.clientStorage.bottleCache[i]) {
                this.clientStorage.bottleCache[i] = bottles[i];
                this.ModLoader.logger.info('Bottle update.');
                if (!onlyfillCache) {
                    this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_BottleUpdatePacket(i, bottles[i], this.ModLoader.clientLobby));
                }
            }
        }
    }
    /*updateSkulltulas() {
        if (this.clientStorage.lastKnownSkullCount <
            this.core.save.questStatus.goldSkulltulas) {
            this.clientStorage.needs_update = true;
            this.clientStorage.lastKnownSkullCount = this.core.save.questStatus.goldSkulltulas;
            this.ModLoader.logger.info('Skulltula update.');
            this.updateFlags();
        }
    }*/
    onSaveLoaded(evt) {
        setTimeout(() => {
            if (this.LobbyConfig.data_syncing) {
                this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_DownloadRequestPacket(this.ModLoader.clientLobby));
            }
            let gui_p = new MMOPackets_1.MMO_SceneGUIPacket(this.core.global.current_scene, this.core.save.form, this.ModLoader.clientLobby);
            /*if (this.modelManager.clientStorage.adultIcon.byteLength > 1) {
                gui_p.setAdultIcon(this.modelManager.clientStorage.adultIcon);
            }
            if (this.modelManager.clientStorage.childIcon.byteLength > 1) {
                gui_p.setChildIcon(this.modelManager.clientStorage.childIcon);
            }*/
            this.ModLoader.gui.tunnel.send('MMOnline:onAgeChange', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onAgeChange', gui_p));
        }, 1000);
    }
    //------------------------------
    // Lobby Setup
    //------------------------------
    onLobbySetup(lobby) {
        lobby.data['MMOnline:data_syncing'] = true;
        lobby.data['MMOnline:actor_syncing'] = true;
        lobby.data['MMOnline:key_syncing'] = this.config.keySync;
    }
    onJoinedLobby(lobby) {
        this.LobbyConfig.actor_syncing = lobby.data['MMOnline:actor_syncing'];
        this.LobbyConfig.data_syncing = lobby.data['MMOnline:data_syncing'];
        this.LobbyConfig.key_syncing = lobby.data['MMOnline:key_syncing'];
        this.ModLoader.logger.info('MMOnline settings inherited from lobby.');
        if (exports.GHOST_MODE_TRIGGERED) {
            EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.GHOST_MODE, true);
        }
    }
    onPlayerLeft(player) {
        this.ModLoader.gui.tunnel.send('MMOnline:onPlayerLeft', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onPlayerLeft', player));
    }
    //------------------------------
    // Scene handling
    //------------------------------
    onSceneChange(scene) {
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, scene, this.core.save.form));
        this.ModLoader.logger.info('client: I moved to scene ' + scene + '.');
        let gui_p = new MMOPackets_1.MMO_SceneGUIPacket(scene, this.core.save.form, this.ModLoader.clientLobby);
        /*if (this.modelManager.clientStorage.adultIcon.byteLength > 1) {
            gui_p.setAdultIcon(this.modelManager.clientStorage.adultIcon);
        }
        if (this.modelManager.clientStorage.childIcon.byteLength > 1) {
            gui_p.setChildIcon(this.modelManager.clientStorage.childIcon);
        }*/
        this.ModLoader.gui.tunnel.send('MMOnline:onSceneChanged', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onSceneChanged', gui_p));
        if (this.core.helper.isSceneNumberValid()) {
            this.ModLoader.gui.setDiscordStatus(new Discord_1.DiscordStatus('Playing MMOnline', 'In ' +
                this.clientStorage.localization[this.clientStorage.scene_keys[scene]]));
        }
        this.ModLoader.emulator.rdramWrite8(0x80600144, 0x0);
    }
    onRoomChange(room) {
        this.ModLoader.gui.tunnel.send('MMOnline:onRoomChanged', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onRoomChanged', room));
    }
    onSceneChange_client(packet) {
        this.ModLoader.logger.info('client receive: Player ' +
            packet.player.nickname +
            ' moved to scene ' +
            this.clientStorage.localization[this.clientStorage.scene_keys[packet.scene]] +
            '.');
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.CLIENT_REMOTE_PLAYER_CHANGED_SCENES, new MMOAPI_1.MMOnline_PlayerScene(packet.player, packet.lobby, packet.scene));
        let gui_p = new MMOPackets_1.MMO_SceneGUIPacket(packet.scene, packet.form, packet.lobby);
        gui_p.player = packet.player;
        /*if (
            this.modelManager.clientStorage.playerModelCache.hasOwnProperty(
                packet.player.uuid
            )
        ) {
            if (
                (this.modelManager.clientStorage.playerModelCache[
                    packet.player.uuid
                ] as ModelPlayer).customIconAdult.byteLength > 1
            ) {
                gui_p.setAdultIcon(
                    (this.modelManager.clientStorage.playerModelCache[
                        packet.player.uuid
                    ] as ModelPlayer).customIconAdult
                );
            }
            if (
                (this.modelManager.clientStorage.playerModelCache[
                    packet.player.uuid
                ] as ModelPlayer).customIconChild.byteLength > 1
            ) {
                gui_p.setChildIcon(
                    (this.modelManager.clientStorage.playerModelCache[
                        packet.player.uuid
                    ] as ModelPlayer).customIconChild
                );
            }
        }*/
        this.ModLoader.gui.tunnel.send('MMOnline:onSceneChanged_Network', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onSceneChanged_Network', gui_p));
    }
    // This packet is basically 'where the hell are you?' if a player has a puppet on file but doesn't know what scene its suppose to be in.
    onSceneRequest_client(packet) {
        if (this.core.save !== undefined) {
            this.ModLoader.clientSide.sendPacketToSpecificPlayer(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, this.core.global.current_scene, this.core.save.form), packet.player);
        }
    }
    onBottle_client(packet) {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()) {
            return;
        }
        this.clientStorage.bottleCache[packet.slot] = packet.contents;
        let inventory = MMOSaveData_1.createInventoryFromContext(this.core.save);
        switch (packet.slot) {
            case 0:
                inventory.FIELD_BOTTLE1 = packet.contents;
                break;
            case 1:
                inventory.FIELD_BOTTLE2 = packet.contents;
                break;
            case 2:
                inventory.FIELD_BOTTLE3 = packet.contents;
                break;
            case 3:
                inventory.FIELD_BOTTLE4 = packet.contents;
                break;
            case 4:
                inventory.FIELD_BOTTLE5 = packet.contents;
                break;
            case 5:
                inventory.FIELD_BOTTLE6 = packet.contents;
                break;
        }
        MMOSaveData_1.mergeInventoryData(this.clientStorage.inventoryStorage, inventory);
        MMOSaveData_1.applyInventoryToContext(this.clientStorage.inventoryStorage, this.core.save, true);
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.ON_INVENTORY_UPDATE, this.core.save.inventory);
    }
    // The server is giving me data.
    onDownloadPacket_client(packet) {
        this.ModLoader.logger.info('Retrieving savegame from server...');
        // Clear inventory.
        this.ModLoader.emulator.rdramWriteBuffer(global.ModLoader.save_context + 0x0070, Buffer.alloc(0x18, 0xFF)); //TODO: Fix for MM
        // Clear c-button and b.
        this.ModLoader.emulator.rdramWriteBuffer(global.ModLoader.save_context + 0x0064, Buffer.alloc(0x4, 0xFF));
        //this.core.link.sword = Sword.NONE;
        //this.core.link.shield = Shield.NONE;
        MMOSaveData_1.applyInventoryToContext(packet.subscreen.inventory, this.core.save, true);
        MMOSaveData_1.applyEquipmentToContext(packet.subscreen.equipment, this.core.save);
        MMOSaveData_1.applyQuestSaveToContext(packet.subscreen.quest, this.core.save);
        MMOSaveData_1.applyDungeonItemDataToContext(packet.subscreen.dungeonItems, this.core.save.dungeonItemManager);
        this.core.save.permSceneData = packet.flags.scenes;
        this.core.save.eventFlags = packet.flags.events;
        this.core.save.itemFlags = packet.flags.items;
        this.core.save.infTable = packet.flags.inf;
        this.core.save.skulltulaFlags = packet.flags.skulltulas;
        this.clientStorage.bank = packet.bank.savings;
        this.ModLoader.emulator.rdramWrite16(0x8011B874, this.clientStorage.bank);
        this.clientStorage.first_time_sync = true;
    }
    // I am giving the server data.
    onDownPacket2_client(packet) {
        this.clientStorage.first_time_sync = true;
        this.ModLoader.logger.info('The lobby is mine!');
        this.clientStorage.needs_update = true;
        this.updateBottles(true);
    }
    onItemSync_client(packet) {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()) {
            return;
        }
        let inventory = MMOSaveData_1.createInventoryFromContext(this.core.save);
        let equipment = MMOSaveData_1.createEquipmentFromContext(this.core.save);
        let quest = MMOSaveData_1.createQuestSaveFromContext(this.core.save);
        let dungeonItems = MMOSaveData_1.createDungeonItemDataFromContext(this.core.save.dungeonItemManager);
        MMOSaveData_1.mergeInventoryData(this.clientStorage.inventoryStorage, inventory);
        MMOSaveData_1.mergeEquipmentData(this.clientStorage.equipmentStorage, equipment);
        MMOSaveData_1.mergeQuestSaveData(this.clientStorage.questStorage, quest);
        MMOSaveData_1.mergeDungeonItemData(this.clientStorage.dungeonItemStorage, dungeonItems);
        MMOSaveData_1.mergeInventoryData(this.clientStorage.inventoryStorage, packet.inventory);
        MMOSaveData_1.mergeEquipmentData(this.clientStorage.equipmentStorage, packet.equipment);
        MMOSaveData_1.mergeQuestSaveData(this.clientStorage.questStorage, packet.quest);
        MMOSaveData_1.mergeDungeonItemData(this.clientStorage.dungeonItemStorage, packet.dungeonItems);
        MMOSaveData_1.applyInventoryToContext(this.clientStorage.inventoryStorage, this.core.save);
        MMOSaveData_1.applyEquipmentToContext(this.clientStorage.equipmentStorage, this.core.save);
        MMOSaveData_1.applyQuestSaveToContext(this.clientStorage.questStorage, this.core.save);
        MMOSaveData_1.applyDungeonItemDataToContext(this.clientStorage.dungeonItemStorage, this.core.save.dungeonItemManager);
        this.ModLoader.gui.tunnel.send('MMOnline:onSubscreenPacket', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onSubscreenPacket', packet));
    }
    onSceneFlagSync_client(packet) {
        this.ModLoader.utils.clearBuffer(this.clientStorage.sceneStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.eventStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.itemFlagStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.infStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.skulltulaStorage);
        let scene_data = this.core.save.permSceneData;
        let event_data = this.core.save.eventFlags;
        let item_data = this.core.save.itemFlags;
        let inf_data = this.core.save.infTable;
        let skulltula_data = this.core.save.skulltulaFlags;
        ParseFlagChanges_1.parseFlagChanges(scene_data, this.clientStorage.sceneStorage);
        ParseFlagChanges_1.parseFlagChanges(event_data, this.clientStorage.eventStorage);
        ParseFlagChanges_1.parseFlagChanges(item_data, this.clientStorage.itemFlagStorage);
        ParseFlagChanges_1.parseFlagChanges(inf_data, this.clientStorage.infStorage);
        ParseFlagChanges_1.parseFlagChanges(skulltula_data, this.clientStorage.skulltulaStorage);
        for (let i = 0; i < packet.scenes.byteLength; i += 0x1C) {
            let struct = new MMOSaveData_1.MMO_SceneStruct(packet.scenes.slice(i, i + 0x1C));
            let cur = new MMOSaveData_1.MMO_SceneStruct(this.clientStorage.sceneStorage.slice(i, i + 0x1C));
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
            if (this.clientStorage.eventStorage[i] !== value) {
                this.clientStorage.eventStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.items.byteLength; i++) {
            let value = packet.items[i];
            if (this.clientStorage.itemFlagStorage[i] !== value) {
                this.clientStorage.itemFlagStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.inf.byteLength; i++) {
            let value = packet.inf[i];
            if (this.clientStorage.infStorage[i] !== value) {
                this.clientStorage.infStorage[i] |= value;
            }
        }
        for (let i = 0; i < packet.skulltulas.byteLength; i++) {
            let value = packet.skulltulas[i];
            if (this.clientStorage.skulltulaStorage[i] !== value) {
                this.clientStorage.skulltulaStorage[i] |= value;
            }
        }
        this.core.save.permSceneData = this.clientStorage.sceneStorage;
        this.core.save.eventFlags = this.clientStorage.eventStorage;
        this.core.save.itemFlags = this.clientStorage.itemFlagStorage;
        this.core.save.infTable = this.clientStorage.infStorage;
        this.core.save.skulltulaFlags = this.clientStorage.skulltulaStorage;
    }
    onSceneContextSync_client(packet) {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid() ||
            this.core.helper.isLinkEnteringLoadingZone()) {
            return;
        }
        if (this.core.global.current_scene !== packet.scene) {
            return;
        }
        let buf1 = this.core.save.liveSceneData_chests;
        if (Object.keys(ParseFlagChanges_1.parseFlagChanges(packet.chests, buf1) > 0)) {
            this.core.save.liveSceneData_chests = buf1;
        }
        let buf2 = this.core.save.liveSceneData_switch;
        if (Object.keys(ParseFlagChanges_1.parseFlagChanges(packet.switches, buf2) > 0)) {
            this.core.save.liveSceneData_switch = buf2;
        }
        //TODO: Find the collectable live data
        /*let buf3: Buffer = this.core.save.liveSceneData_collectable;
        if (Object.keys(parseFlagChanges(packet.collect, buf3) > 0)) {
            this.core.save.liveSceneData_collectable = buf3;
        }*/
        let buf4 = this.core.save.liveSceneData_clear;
        if (Object.keys(ParseFlagChanges_1.parseFlagChanges(packet.clear, buf4) > 0)) {
            this.core.save.liveSceneData_clear = buf4;
        }
        let buf5 = this.core.save.liveSceneData_temp;
        if (Object.keys(ParseFlagChanges_1.parseFlagChanges(packet.temp, buf5) > 0)) {
            this.core.save.liveSceneData_temp = buf5;
        }
    }
    onBankUpdate(packet) {
        this.clientStorage.bank = packet.savings;
        this.ModLoader.emulator.rdramWrite16(0x8011B874, this.clientStorage.bank);
    }
    healPlayer() {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()) {
            return;
        }
        this.ModLoader.emulator.rdramWrite16(global.ModLoader.save_context + 0x36, 0x0140);
    }
    onNeedsHeal1(evt) {
        this.healPlayer();
    }
    onNeedsHeal2(evt) {
        this.healPlayer();
    }
    onNeedsMagic(size) {
        switch (size) {
            case 0 /* NONE */:
                this.core.save.magic_current = 0 /* NONE */;
                break;
            case 1 /* NORMAL */:
                this.core.save.magic_current = 48 /* NORMAL */;
                break;
            case 2 /* EXTENDED */:
                this.core.save.magic_current = 96 /* EXTENDED */;
                break;
        }
    }
    onAgeChange(form) {
        let gui_p = new MMOPackets_1.MMO_SceneGUIPacket(this.core.global.current_scene, form, this.ModLoader.clientLobby);
        /*if (this.modelManager.clientStorage.adultIcon.byteLength > 1) {
            gui_p.setAdultIcon(this.modelManager.clientStorage.adultIcon);
        }
        if (this.modelManager.clientStorage.childIcon.byteLength > 1) {
            gui_p.setChildIcon(this.modelManager.clientStorage.childIcon);
        }*/
        this.ModLoader.gui.tunnel.send('MMOnline:onAgeChange', new GUITunnel_1.GUITunnelPacket('MMOnline', 'MMOnline:onAgeChange', gui_p));
        this.ModLoader.clientSide.sendPacket(new MMOPackets_1.MMO_ScenePacket(this.ModLoader.clientLobby, this.core.global.current_scene, form));
    }
    onInventoryUpdate(inventory) {
        if (this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()) {
            return;
        }
        let addr = global.ModLoader.save_context + 0x0064; //C-L, C-D, C-R
        let buf = this.ModLoader.emulator.rdramReadBuffer(addr, 0x3);
        let addr2 = global.ModLoader.save_context + 0x0070; //Inventory Items
        let raw_inventory = this.ModLoader.emulator.rdramReadBuffer(addr2, 0x18);
        //TODO: Uh.. This seems to work differently in MM. This will need updating.
        if (buf[0x4] !== MMAPI_1.InventoryItem.NONE &&
            raw_inventory[buf[0x4]] !== MMAPI_1.InventoryItem.NONE) {
            buf[0x1] = raw_inventory[buf[0x4]];
            this.ModLoader.emulator.rdramWriteBuffer(addr, buf);
            this.core.commandBuffer.runCommand(2 /* UPDATE_C_BUTTON_ICON */, 0x00000001, (success, result) => { });
        }
        if (buf[0x5] !== MMAPI_1.InventoryItem.NONE &&
            raw_inventory[buf[0x5]] !== MMAPI_1.InventoryItem.NONE) {
            buf[0x2] = raw_inventory[buf[0x5]];
            this.ModLoader.emulator.rdramWriteBuffer(addr, buf);
            this.core.commandBuffer.runCommand(2 /* UPDATE_C_BUTTON_ICON */, 0x00000002, (success, result) => { });
        }
        if (buf[0x6] !== MMAPI_1.InventoryItem.NONE &&
            raw_inventory[buf[0x6]] !== MMAPI_1.InventoryItem.NONE) {
            buf[0x3] = raw_inventory[buf[0x6]];
            this.ModLoader.emulator.rdramWriteBuffer(addr, buf);
            this.core.commandBuffer.runCommand(2 /* UPDATE_C_BUTTON_ICON */, 0x00000003, (success, result) => { });
        }
    }
    onPayload(evt) {
        if (path_1.default.parse(evt.file).ext === ".ovl") {
            let result = evt.result;
            this.clientStorage.overlayCache[evt.file] = result;
        }
        if (evt.file === "link_no_pvp.ovl") {
            let result = evt.result;
            this.ModLoader.emulator.rdramWrite32(0x80600140, result.params);
        }
        else if (evt.file === "horse-3.ovl") {
            let result = evt.result;
            this.ModLoader.emulator.rdramWrite32(0x80600150, result.params);
        }
    }
    onStartupFinished(evt) {
        //this.core.toggleMapSelectKeybind();
    }
    onRom(evt) {
        //TODO: DO RANDO CHECK FOR MM
        /*let expected_hash: string = "34c6b74de175cb3d5d08d8428e7ab21d";
        let tools: Z64RomTools = new Z64RomTools(this.ModLoader, 0x7430);
        let file_select_ovl: Buffer = tools.decompressFileFromRom(evt.rom, 32);
        let hash: string = this.ModLoader.utils.hashBuffer(file_select_ovl);
        if (expected_hash !== hash) {
            this.ModLoader.logger.info("File select overlay is modified. Is this rando?");
            this.ModLoader.clientSide.sendPacket(new MMO_isRandoPacket(this.ModLoader.clientLobby));
        }*/
    }
    onReset(evt) {
        this.clientStorage.first_time_sync = false;
    }
    // This spawns the helper actor to fix some flag issues.
    onTick() {
        if (!this.core.helper.isTitleScreen() &&
            this.core.helper.isSceneNumberValid() &&
            this.core.helper.isInterfaceShown()) {
            if (!this.core.helper.isPaused()) {
                if (!this.clientStorage.first_time_sync) {
                    return;
                }
                if (this.LobbyConfig.actor_syncing) {
                    //this.actorHooks.tick();
                }
                if (this.LobbyConfig.data_syncing) {
                    this.autosaveSceneData();
                    this.updateBottles();
                    //this.updateSkulltulas();
                    if (this.LobbyConfig.key_syncing) {
                        //this.keys.update();
                    }
                    let state = this.core.link.state;
                    if (state === 4 /* BUSY */ ||
                        state === 13 /* GETTING_ITEM */ ||
                        state === 20 /* TALKING */) {
                        this.clientStorage.needs_update = true;
                    }
                    else if (state === 1 /* STANDING */ &&
                        this.clientStorage.needs_update &&
                        this.LobbyConfig.data_syncing) {
                        this.updateInventory();
                        this.updateFlags();
                        this.clientStorage.needs_update = false;
                    }
                }
            }
        }
    }
}
__decorate([
    CoreInjection_1.InjectCore()
], MMOnlineClient.prototype, "core", void 0);
__decorate([
    ModLoaderAPIInjector_1.ModLoaderAPIInject()
], MMOnlineClient.prototype, "ModLoader", void 0);
__decorate([
    EventHandler_1.EventHandler(MMOAPI_1.MMOnlineEvents.GHOST_MODE)
], MMOnlineClient.prototype, "onGhostInstruction", null);
__decorate([
    PluginLifecycle_1.Preinit()
], MMOnlineClient.prototype, "preinit", null);
__decorate([
    PluginLifecycle_1.Init()
], MMOnlineClient.prototype, "init", null);
__decorate([
    PluginLifecycle_1.Postinit()
], MMOnlineClient.prototype, "postinit", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_SAVE_LOADED)
], MMOnlineClient.prototype, "onSaveLoaded", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.CONFIGURE_LOBBY)
], MMOnlineClient.prototype, "onLobbySetup", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_LOBBY_JOIN)
], MMOnlineClient.prototype, "onJoinedLobby", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_PLAYER_LEAVE)
], MMOnlineClient.prototype, "onPlayerLeft", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_SCENE_CHANGE)
], MMOnlineClient.prototype, "onSceneChange", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_ROOM_CHANGE)
], MMOnlineClient.prototype, "onRoomChange", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_ScenePacket')
], MMOnlineClient.prototype, "onSceneChange_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_SceneRequestPacket')
], MMOnlineClient.prototype, "onSceneRequest_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_BottleUpdatePacket')
], MMOnlineClient.prototype, "onBottle_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_DownloadResponsePacket')
], MMOnlineClient.prototype, "onDownloadPacket_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_DownloadResponsePacket2')
], MMOnlineClient.prototype, "onDownPacket2_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_SubscreenSyncPacket')
], MMOnlineClient.prototype, "onItemSync_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_ServerFlagUpdate')
], MMOnlineClient.prototype, "onSceneFlagSync_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler('MMO_ClientSceneContextUpdate')
], MMOnlineClient.prototype, "onSceneContextSync_client", null);
__decorate([
    NetworkHandler_1.NetworkHandler("MMO_BankSyncPacket")
], MMOnlineClient.prototype, "onBankUpdate", null);
__decorate([
    EventHandler_1.EventHandler(MMOAPI_1.MMOnlineEvents.GAINED_PIECE_OF_HEART)
], MMOnlineClient.prototype, "onNeedsHeal1", null);
__decorate([
    EventHandler_1.EventHandler(MMOAPI_1.MMOnlineEvents.GAINED_HEART_CONTAINER)
], MMOnlineClient.prototype, "onNeedsHeal2", null);
__decorate([
    EventHandler_1.EventHandler(MMOAPI_1.MMOnlineEvents.MAGIC_METER_INCREASED)
], MMOnlineClient.prototype, "onNeedsMagic", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_AGE_CHANGE)
], MMOnlineClient.prototype, "onAgeChange", null);
__decorate([
    EventHandler_1.EventHandler(MMOAPI_1.MMOnlineEvents.ON_INVENTORY_UPDATE)
], MMOnlineClient.prototype, "onInventoryUpdate", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_CRASH)
    /*onEmuCrash(evt: any) {
        fs.writeFileSync(
            './MMO_storagedump.json',
            JSON.stringify(this.clientStorage, null, 2)
        );
        this.utility.makeRamDump();
    }*/
    ,
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_PAYLOAD_INJECTED)
], MMOnlineClient.prototype, "onPayload", null);
__decorate([
    EventHandler_1.EventHandler(EventHandler_1.EventsClient.ON_INJECT_FINISHED)
], MMOnlineClient.prototype, "onStartupFinished", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_ROM_PATCHED)
], MMOnlineClient.prototype, "onRom", null);
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_SOFT_RESET_PRE)
], MMOnlineClient.prototype, "onReset", null);
__decorate([
    EventHandler_1.EventHandler(MMAPI_1.MMEvents.ON_ACTOR_SPAWN)
    /*onActorSpawned(actor: IActor) {
        // 0x87 = Forest Temple Elevator.
        // 0x102 = Windmill Blades.
        // 0xF8 = Hyrule Castle Gate.
        // 0xCB = Ingo.
        if (actor.actorID === 0x0087 || actor.actorID === 0x102 || actor.actorID === 0xF8 || (actor.actorID === 0xCB && actor.variable === 0x2)) {
            (this.clientStorage.overlayCache["flag_fixer.ovl"] as IOvlPayloadResult).spawn((this.clientStorage.overlayCache["flag_fixer.ovl"] as IOvlPayloadResult), (success: boolean, result: number) => {
                let ff: IActor = this.core.actorManager.createIActorFromPointer(result);
                if (actor.actorID === 0x0087) {
                    ff.rdramWriteBuffer(0x24, Buffer.from("433B788243690000C4BAC599", 'hex'));
                } else if (actor.actorID === 0x102) {
                    ff.rdramWriteBuffer(0x24, Buffer.from("43751CE2432000004436C483", 'hex'));
                } else if (actor.actorID === 0xF8) {
                    ff.rdramWriteBuffer(0x24, Buffer.from("44130FE344CA2000C39B683C", 'hex'));
                } else if (actor.actorID === 0xCB && actor.variable === 0x2) {
                    ff.rdramWriteBuffer(0x24, Buffer.from('C31E000000000000C4C78000', 'hex'));
                }
                this.ModLoader.logger.debug("Summoning the bugfix actor...");
                return {};
            });
        }
    }*/
    ,
    PluginLifecycle_1.onTick()
], MMOnlineClient.prototype, "onTick", null);
exports.MMOnlineClient = MMOnlineClient;
//# sourceMappingURL=MMOnlineClient.js.map