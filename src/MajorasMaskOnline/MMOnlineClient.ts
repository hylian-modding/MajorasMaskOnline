import { InjectCore } from 'modloader64_api/CoreInjection';
import { bus, EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { INetworkPlayer, LobbyData, NetworkHandler, IPacketHeader } from 'modloader64_api/NetworkHandler';
import * as API from 'MajorasMask/API/Imports';
import { createEquipmentFromContext, createInventoryFromContext, createQuestSaveFromContext, mergeEquipmentData, mergeInventoryData, mergeQuestSaveData, createDungeonItemDataFromContext, mergeDungeonItemData, InventorySave, applyInventoryToContext, applyBottleToContext, applyEquipmentToContext, applyQuestSaveToContext, applyDungeonItemDataToContext, EquipmentSave, QuestSave, MMODungeonItemContext, IDungeonItemSave, MMO_SceneStruct, createPhotoFromContext, mergePhotoData, PhotoSave, applyPhotoToContext, createBottleFromContext, mergeBottleData, mergeBottleDataTime, applyBottleToContextTime, createTradeFromContext, mergeInventoryTrade, applyTradeToContext, IQuestSave, createStrayFromContext, mergeStrayData, applyStrayToContext, createSkullFromContext, applySkullToContext, mergeSkullData, SkullSave, StraySave } from './data/MMOSaveData';
import { MMO_ClientFlagUpdate, MMO_ClientSceneContextUpdate, MMO_DownloadRequestPacket, MMO_SubscreenSyncPacket, MMO_BottleUpdatePacket, MMO_SceneGUIPacket, MMO_BankSyncPacket, MMO_ScenePacket, MMO_SceneRequestPacket, MMO_DownloadResponsePacket, MMO_DownloadResponsePacket2, MMO_ServerFlagUpdate, MMO_ClientSceneContextUpdateTime, MMO_TimePacket, MMO_PictoboxPacket, MMO_PermFlagsPacket, MMO_SkullPacket, MMO_StrayFairyPacket, MMO_ItemGetMessagePacket } from './data/MMOPackets';
import path from 'path';
import { GUITunnelPacket } from 'modloader64_api/GUITunnel';
import fs from 'fs';
import { MMOnlineStorageClient } from './MMOnlineStorageClient';
import { DiscordStatus } from 'modloader64_api/Discord';
import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
import { Init, Preinit, Postinit, onTick, onViUpdate, onCreateResources } from 'modloader64_api/PluginLifecycle';
import { parseFlagChanges } from './parseFlagChanges';
import { IMMOnlineLobbyConfig, IS_DEV_BUILD, MMOnlineConfigCategory } from './MMOnline';
import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { SidedProxy, ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { MMOnlineStorage } from './MMOnlineStorage';
import { RECORD_TICK_MODULO, get_scaled_time } from './data/MMOPlayerSchedule'
import { ModelManagerClient } from './data/models/ModelManager';
import { SoundManagerClient } from './data/sound/SoundManager';
import { addToKillFeedQueue, changeKillfeedFont } from 'modloader64_api/Announcements';
import { SmartBuffer } from 'smart-buffer';
import { rgba, xy, xywh } from 'modloader64_api/Sylvain/vec';
import { FlipFlags, Font, Texture } from 'modloader64_api/Sylvain/Gfx';
import { number_ref, string_ref } from 'modloader64_api/Sylvain/ImGui';
import { flags } from './data/permflags';
import { Z64OnlineEvents, Z64_PlayerScene } from './Z64OnlineAPI/Z64OnlineAPI';
import { WorldEvents } from './WorldEvents/WorldEvents';
import { BitDepth, BMP_Image } from './Bitmap';

export let TIME_SYNC_TRIGGERED: boolean = false;

function RGBA32ToA5(rgba: Buffer) {
    let i, k, data
    let picto: Buffer = Buffer.alloc(0x2bc0)

    for (i = 0; i < 0x2bc0; i += 5) {
        data = 0
        for (k = 0; k < 8; ++k) {
            // get average color from all channels
            //let color = (((rgba[i] << 24) & 0xFF) + ((rgba[i] << 16) & 0xFF) + ((rgba[i] << 8) & 0xFF) + (rgba[i] & 0xFF)) / 0x3FC
            let color = (rgba[i] << 24) & 0xFF
            color = (color * 31) & 0x1F;

            data |= (color >> (5 * (7 - k)));

            //data >> (5n * (7n - k)) = color;
        }

        picto.writeBigInt64BE(BigInt(data), i)
    }

    return picto
}

export class MMOnlineClient {
    @InjectCore()
    core!: API.IMMCore;

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;

    LobbyConfig: IMMOnlineLobbyConfig = {} as IMMOnlineLobbyConfig;
    clientStorage!: MMOnlineStorageClient;
    config!: MMOnlineConfigCategory;

    @SidedProxy(ProxySide.CLIENT, ModelManagerClient)
    modelManager!: ModelManagerClient;
    @SidedProxy(ProxySide.CLIENT, SoundManagerClient)
    soundManager!: SoundManagerClient;
    teleportDest: string_ref = [""];
    cutsceneDest: string_ref = [""];
    swordSlider: number_ref = [0];
    permFlagBits: Array<number> = [];
    permFlagNames: Map<number, string> = new Map<number, string>();
    resourcesLoaded: boolean = false;
    itemIcons: Map<string, Texture> = new Map<string, Texture>();
    @SidedProxy(ProxySide.CLIENT, WorldEvents)
    worldEvents!: WorldEvents;
    font!: Font;

    sendPacketToPlayersInScene(packet: IPacketHeader) {
        try {
            let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this
            ) as MMOnlineStorage;
            if (storage === null) {
                return;
            }
            Object.keys(storage.players).forEach((key: string) => {
                //if (storage.players[key] === storage.players[packet.player.uuid]) {
                if (storage.networkPlayerInstances[key].uuid !== packet.player.uuid) {
                    this.ModLoader.serverSide.sendPacketToSpecificPlayer(
                        packet,
                        storage.networkPlayerInstances[key]
                    );
                }
                //}
            });
        } catch (err) { }
    }

    @Preinit()
    preinit() {
        this.config = this.ModLoader.config.registerConfigCategory("MMOnline") as MMOnlineConfigCategory;
        this.ModLoader.config.setData("MMOnline", "syncMode", 0); // 0 is default, 1 is time sync, 2 is groundhog's-day sync
        this.ModLoader.config.setData("MMOnline", "notifications", true);
        this.ModLoader.config.setData("MMOnline", "nameplates", true);

    }

    @Init()
    init(): void {
        this.clientStorage.syncMode = this.config.syncMode;
        this.modelManager.clientStorage = this.clientStorage;
    }

    @Postinit()
    postinit() {
        this.clientStorage.scene_keys = JSON.parse(fs.readFileSync(__dirname + '/data/scene_numbers.json').toString());
        this.clientStorage.localization = JSON.parse(fs.readFileSync(__dirname + '/data/en_US.json').toString());
        let status: DiscordStatus = new DiscordStatus('Playing MMOnline', 'On the title screen');
        status.smallImageKey = 'MMO';
        status.partyId = this.ModLoader.clientLobby;
        status.partyMax = 30;
        status.partySize = 1;
        this.ModLoader.gui.setDiscordStatus(status);
        // Flag shit
        for (let name in API.EventFlags) {
            if (typeof (name) === 'string') {
                let value = parseInt(API.EventFlags[name]);
                //if(name.includes()) return; //For blacklisting certain flags if necessary
                if (name.startsWith("PERM")) {
                    this.permFlagBits.push(value);
                    this.permFlagNames.set(this.permFlagBits.indexOf(value), flags.flags[value]);
                }
            }
        }
    }

    updateInventory() {
        this.ModLoader.logger.info('updateInventory()');
        let inventory = createInventoryFromContext(this.core.save);
        let inventoryBottle = createBottleFromContext(this.core.save);
        let inventoryTrade = createTradeFromContext(this.core.save);
        let equipment = createEquipmentFromContext(this.core.save);
        let quest = createQuestSaveFromContext(this.core.save);
        let di!: any;

        if (this.clientStorage.syncMode === 1) di = createDungeonItemDataFromContext(this.core.save.dungeonItemManager);


        mergeInventoryData(this.clientStorage.inventoryStorage, inventory);

        if (this.clientStorage.syncMode === 1) {
            mergeBottleDataTime(this.clientStorage.bottleStorage, inventoryBottle);
            mergeInventoryTrade(this.clientStorage.tradeStorage, inventoryTrade);
        }
        else mergeBottleData(this.clientStorage.bottleStorage, inventoryBottle);

        mergeEquipmentData(this.clientStorage.equipmentStorage, equipment);

        mergeQuestSaveData(this.clientStorage.questStorage, quest);

        if (this.clientStorage.syncMode === 1) mergeDungeonItemData(this.ModLoader, this.clientStorage.dungeonItemStorage, di, ProxySide.CLIENT, this.ModLoader.clientLobby);

        this.ModLoader.clientSide.sendPacket(
            new MMO_SubscreenSyncPacket(this.clientStorage.inventoryStorage,
                this.clientStorage.equipmentStorage,
                this.clientStorage.questStorage,
                this.clientStorage.dungeonItemStorage,
                this.clientStorage.bottleStorage,
                this.clientStorage.tradeStorage,
                this.ModLoader.clientLobby
            ));
        if (this.clientStorage.bank !== this.ModLoader.emulator.rdramRead16(0x801F054E)) {
            this.clientStorage.bank = this.ModLoader.emulator.rdramRead16(0x801F054E);
            this.ModLoader.clientSide.sendPacket(new MMO_BankSyncPacket(this.clientStorage.bank, this.ModLoader.clientLobby));
        }
        if (this.core.save.deku_b_state !== 0x091EF6C8) this.core.save.deku_b_state = 0x091EF6C8;
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
        let minimap_data = this.core.save.minimap_flags;
        let minimap: any = parseFlagChanges(minimap_data, this.clientStorage.minimapStorage);
        this.ModLoader.clientSide.sendPacket(new MMO_ClientFlagUpdate(this.clientStorage.minimapStorage, this.ModLoader.clientLobby));
    }

    autosaveSceneDataTime() {
        if (!this.core.helper.isLinkEnteringLoadingZone() &&
            this.core.global.scene_framecount > 20) {
            if (this.ModLoader.emulator.rdramRead8(0x80600144) === 0x1) {
                return;
            }

            let live_scene_chests: Buffer = this.core.global.liveSceneData_chests;
            let live_scene_switches: Buffer = this.core.global.liveSceneData_switch;
            let live_scene_collect: Buffer = this.core.global.liveSceneData_collectable;
            let live_scene_clear: Buffer = this.core.global.liveSceneData_clear;
            let live_scene_temp: Buffer = this.core.global.liveSceneData_temp;
            let save_scene_data!: Buffer;

            save_scene_data = this.core.global.getSaveDataForCurrentScene();



            let save: Buffer = Buffer.alloc(0x1c);
            live_scene_chests.copy(save, 0x0); // Chests
            live_scene_switches.copy(save, 0x4); // Switches
            live_scene_clear.copy(save, 0x8); // Room Clear
            live_scene_collect.copy(save, 0xc); // Collectables
            live_scene_temp.copy(save, 0x10); // Unused space.

            save_scene_data.copy(save, 0x14, 0x14, 0x18); // Visited Rooms.
            save_scene_data.copy(save, 0x18, 0x18, 0x1c); // Visited Rooms.

            let save_hash_2: string = this.ModLoader.utils.hashBuffer(save);
            if (save_hash_2 !== this.clientStorage.autoSaveHash) {
                this.ModLoader.logger.info('autosaveSceneDataTime()');

                save_scene_data.copy(save, 0x10, 0x10, 0x14);
                for (let i = 0; i < save_scene_data.byteLength; i++) {
                    save_scene_data[i] |= save[i];
                }

                this.clientStorage.autoSaveHash = save_hash_2;
            }
            else {
                return;
            }
            if (this.clientStorage.syncMode === 1) { this.core.global.writeSaveDataForCurrentScene(save_scene_data); }
            this.ModLoader.clientSide.sendPacket(new MMO_ClientSceneContextUpdateTime(live_scene_chests, live_scene_switches, live_scene_clear, live_scene_temp, this.ModLoader.clientLobby, this.core.global.current_scene));
        }
    }

    autosaveSceneData() {
        if (!this.core.helper.isLinkEnteringLoadingZone() &&
            this.core.global.scene_framecount > 20) {
            if (this.ModLoader.emulator.rdramRead8(0x80600144) === 0x1) {
                return;
            }
            let live_scene_collect: Buffer = this.core.global.liveSceneData_collectable;
            let save_scene_data!: Buffer;

            save_scene_data = this.core.global.getSaveDataForCurrentScene();



            let save: Buffer = Buffer.alloc(0x1c);
            live_scene_collect.copy(save, 0x10); // Collectables

            save_scene_data.copy(save, 0x14, 0x14, 0x18); // Visited Rooms.
            save_scene_data.copy(save, 0x18, 0x18, 0x1c); // Visited Rooms.



            let save_hash_2: string = this.ModLoader.utils.hashBuffer(save);
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
            this.ModLoader.clientSide.sendPacket(new MMO_ClientSceneContextUpdate(live_scene_collect, this.ModLoader.clientLobby, this.core.global.current_scene));
        }
    }

    updateBottlesTime(onlyfillCache = false) {
        let bottles: API.InventoryItem[] = [
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
                    this.ModLoader.clientSide.sendPacket(new MMO_BottleUpdatePacket(i, bottles[i], this.ModLoader.clientLobby));
                }
            }
        }
    }

    updateTime() {
        let last_time = this.clientStorage.last_time;
        let current_time = this.core.save.day_time;
        let scaled_time = get_scaled_time(current_time);
        let time_speed = this.core.save.time_speed;
        let last_day = this.clientStorage.last_day;
        let current_day = this.core.save.current_day;

        if ((current_time - last_time) > RECORD_TICK_MODULO) {
            //this.ModLoader.clientSide.sendPacket(new MMO_TimePacket(current_time, time_speed, current_day, this.ModLoader.clientLobby));

            let num = Math.floor(current_time - last_time / RECORD_TICK_MODULO)

            // Did we somehow miss more than 6 ticks? Will make players stand around for SoDT
            if (num > 1) {
                for (let index = get_scaled_time(last_time); index < scaled_time; index++) {
                    this.core.link.rawPos.copy(this.clientStorage.schedule.schedule_data[index].pos);
                    this.core.link.rot.copy(this.clientStorage.schedule.schedule_data[index].rot);
                    this.core.link.anim_data.copy(this.clientStorage.schedule.schedule_data[index].anim);
                    this.clientStorage.schedule.schedule_data[index].scene = this.core.global.current_scene;
                    this.clientStorage.schedule.schedule_data[index].alive = true;
                }
            }

            this.core.link.rawPos.copy(this.clientStorage.schedule.schedule_data[scaled_time].pos);
            this.core.link.rot.copy(this.clientStorage.schedule.schedule_data[scaled_time].rot);
            this.core.link.anim_data.copy(this.clientStorage.schedule.schedule_data[scaled_time].anim);
            this.clientStorage.schedule.schedule_data[scaled_time].scene = this.core.global.current_scene;
            this.clientStorage.schedule.schedule_data[scaled_time].alive = true;

            last_time = current_time;
        }
    }

    @EventHandler(API.MMEvents.ON_SAVE_LOADED)
    onSaveLoaded(evt: any) {
        this.ModLoader.logger.debug("On_Save_Loaded");
        setTimeout(() => {
            if (this.LobbyConfig.data_syncing) {
                this.ModLoader.clientSide.sendPacket(new MMO_DownloadRequestPacket(this.ModLoader.clientLobby));
            }
            let gui_p: MMO_SceneGUIPacket = new MMO_SceneGUIPacket(this.core.global.current_scene, this.core.save.form, this.ModLoader.clientLobby);

            this.ModLoader.gui.tunnel.send('MMOnline:onAgeChange', new GUITunnelPacket('MMOnline', 'MMOnline:onAgeChange', gui_p));
        }, 1000);
    }

    //------------------------------
    // Lobby Setup
    //------------------------------
    @EventHandler(EventsClient.CONFIGURE_LOBBY)
    onLobbySetup(lobby: LobbyData): void {
        lobby.data['MMOnline:data_syncing'] = true;
        lobby.data['MMOnline:actor_syncing'] = true;
    }

    @EventHandler(EventsClient.ON_LOBBY_JOIN)
    onJoinedLobby(lobby: LobbyData): void {
        this.LobbyConfig.actor_syncing = lobby.data['MMOnline:actor_syncing'];
        this.LobbyConfig.data_syncing = lobby.data['MMOnline:data_syncing'];
        this.ModLoader.logger.info('MMOnline settings inherited from lobby.');
    }

    @EventHandler(API.MMEvents.ON_LOADING_ZONE)
    onLoadingZone(evt: any) {
        this.ModLoader.logger.debug("I've touched a loading zone.");
    }

    @EventHandler(EventsClient.ON_PLAYER_LEAVE)
    onPlayerLeft(player: INetworkPlayer) {
        this.ModLoader.gui.tunnel.send('MMOnline:onPlayerLeft', new GUITunnelPacket('MMOnline', 'MMOnline:onPlayerLeft', player));
    }

    //------------------------------
    // Scene handling
    //------------------------------

    @EventHandler(API.MMEvents.ON_SCENE_CHANGE)
    onSceneChange(scene: number) {
        this.ModLoader.clientSide.sendPacket(
            new MMO_ScenePacket(
                this.ModLoader.clientLobby,
                scene,
                this.core.save.form
            )
        );
        this.ModLoader.logger.info('client: I moved to scene ' + this.clientStorage.scene_keys[scene] + '.');
        let gui_p: MMO_SceneGUIPacket = new MMO_SceneGUIPacket(
            scene,
            this.core.save.form,
            this.ModLoader.clientLobby
        );
        /*if (this.modelManager.clientStorage.adultIcon.byteLength > 1) {
            gui_p.setAdultIcon(this.modelManager.clientStorage.adultIcon);
        }
        if (this.modelManager.clientStorage.childIcon.byteLength > 1) {
            gui_p.setChildIcon(this.modelManager.clientStorage.childIcon);
        }*/
        this.ModLoader.gui.tunnel.send(
            'MMOnline:onSceneChanged',
            new GUITunnelPacket('MMOnline', 'MMOnline:onSceneChanged', gui_p)
        );
        if (this.core.helper.isSceneNumberValid()) {
            this.ModLoader.gui.setDiscordStatus(
                new DiscordStatus(
                    'Playing MMOnline',
                    'In ' +
                    this.clientStorage.scene_keys[scene]
                )
            );
        }
        this.ModLoader.emulator.rdramWrite8(0x80600144, 0x0);
    }

    @EventHandler(API.MMEvents.ON_ROOM_CHANGE)
    onRoomChange(room: number) {
        this.ModLoader.gui.tunnel.send(
            'MMOnline:onRoomChanged',
            new GUITunnelPacket('MMOnline', 'MMOnline:onRoomChanged', room)
        );
    }

    @NetworkHandler('MMO_ScenePacket')
    onSceneChange_client(packet: MMO_ScenePacket) {
        this.ModLoader.logger.info(
            'client receive: Player ' +
            packet.player.nickname +
            ' moved to scene ' +
            this.clientStorage.scene_keys[packet.scene] +
            '.'
        );
        bus.emit(
            Z64OnlineEvents.CLIENT_REMOTE_PLAYER_CHANGED_SCENES,
            new Z64_PlayerScene(packet.player, packet.lobby, packet.scene)
        );
        let gui_p: MMO_SceneGUIPacket = new MMO_SceneGUIPacket(
            packet.scene,
            packet.form,
            packet.lobby
        );
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
        this.ModLoader.gui.tunnel.send(
            'MMOnline:onSceneChanged_Network',
            new GUITunnelPacket(
                'MMOnline',
                'MMOnline:onSceneChanged_Network',
                gui_p
            )
        );
    }

    // This packet is basically 'where the hell are you?' if a player has a puppet on file but doesn't know what scene its suppose to be in.
    @NetworkHandler('MMO_SceneRequestPacket')
    onSceneRequest_client(packet: MMO_SceneRequestPacket) {
        if (this.core.save !== undefined) {
            this.ModLoader.clientSide.sendPacketToSpecificPlayer(
                new MMO_ScenePacket(
                    this.ModLoader.clientLobby,
                    this.core.global.current_scene,
                    this.core.save.form
                ),
                packet.player
            );
        }
    }
    @NetworkHandler('MMO_BottleUpdatePacket')
    onBottle_client(packet: MMO_BottleUpdatePacket) {
        if (
            this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()
        ) {
            return;
        }
        this.clientStorage.bottleCache[packet.slot] = packet.contents;
        let inventory: InventorySave = createInventoryFromContext(
            this.core.save
        ) as InventorySave;
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

        mergeInventoryData(this.clientStorage.inventoryStorage, inventory);
        applyInventoryToContext(
            this.clientStorage.inventoryStorage,
            this.core.save,
            true
        );
        bus.emit(Z64OnlineEvents.ON_INVENTORY_UPDATE, this.core.save.inventory);
    }

    // The server is giving me data.
    @NetworkHandler('MMO_DownloadResponsePacket')
    onDownloadPacket_client(packet: MMO_DownloadResponsePacket) {
        this.ModLoader.logger.info('Retrieving savegame from server...');

        let temp = new PhotoSave();
        temp.fromPhoto(packet.photo.photo);
        temp.decompressPhoto();
        mergePhotoData(this.clientStorage.photoStorage, temp);
        applyPhotoToContext(this.clientStorage.photoStorage, this.core.save.photo);

        if (this.clientStorage.isFairySync) applyStrayToContext(packet.stray.stray, this.core.save.stray);
        if (this.clientStorage.isSkulltulaSync) applySkullToContext(packet.skull.skull, this.core.save.skull);

        applyInventoryToContext(packet.subscreen.inventory, this.core.save, true);

        if (this.clientStorage.syncMode === 1) applyBottleToContextTime(packet.subscreen.bottle, this.core.save);
        else applyBottleToContext(packet.subscreen.bottle, this.core.save);

        applyEquipmentToContext(packet.subscreen.equipment, this.core.save);

        applyQuestSaveToContext(packet.subscreen.quest, this.core.save);

        if (this.clientStorage.syncMode === 1) applyDungeonItemDataToContext(packet.subscreen.dungeonItems, this.core.save.dungeonItemManager);

        this.clientStorage.bank = packet.bank.savings;
        this.ModLoader.emulator.rdramWrite16(0x801F054E, this.clientStorage.bank);

        parseFlagChanges(packet.permFlags.flags, this.clientStorage.permFlags);
        this.core.save.permFlags = this.clientStorage.permFlags;

        this.clientStorage.first_time_sync = true;
    }

    // I am giving the server data.
    @NetworkHandler('MMO_DownloadResponsePacket2')
    onDownPacket2_client(packet: MMO_DownloadResponsePacket2) {
        this.clientStorage.first_time_sync = true;
        this.ModLoader.logger.info('The lobby is mine!');

        this.clientStorage.needs_update = true;

        if (this.clientStorage.syncMode === 1) this.updateBottlesTime(true);
        this.core.save.sword_helper.updateSwordonB();
    }

    @NetworkHandler('MMO_SubscreenSyncPacket')
    onItemSync_client(packet: MMO_SubscreenSyncPacket) {
        if (
            this.core.helper.isTitleScreen() ||
            !this.core.helper.isSceneNumberValid()
        ) {
            return;
        }
        let inventory: InventorySave = createInventoryFromContext(
            this.core.save
        ) as InventorySave;
        let inventoryBottle: InventorySave = createBottleFromContext(
            this.core.save
        ) as InventorySave;
        let inventoryTrade: InventorySave = createTradeFromContext(
            this.core.save
        ) as InventorySave;
        let equipment: EquipmentSave = createEquipmentFromContext(
            this.core.save
        ) as EquipmentSave;
        let quest: QuestSave = createQuestSaveFromContext(this.core.save) as IQuestSave;
        let dungeonItems!: MMODungeonItemContext;
        if (this.clientStorage.syncMode === 1) {
            dungeonItems = createDungeonItemDataFromContext(
                this.core.save.dungeonItemManager
            ) as IDungeonItemSave;
        }

        mergeInventoryData(this.clientStorage.inventoryStorage, inventory);
        if (this.clientStorage.syncMode === 1) {
            mergeBottleDataTime(this.clientStorage.bottleStorage, inventoryBottle);
            mergeInventoryTrade(this.clientStorage.tradeStorage, inventoryTrade);
        }
        else mergeBottleData(this.clientStorage.bottleStorage, inventoryBottle);

        mergeEquipmentData(this.clientStorage.equipmentStorage, equipment);

        mergeQuestSaveData(this.clientStorage.questStorage, quest);

        mergeInventoryData(this.clientStorage.inventoryStorage, packet.inventory);
        mergeQuestSaveData(this.clientStorage.questStorage, packet.quest);
        if (this.clientStorage.syncMode === 1) mergeDungeonItemData(this.ModLoader, this.clientStorage.dungeonItemStorage, packet.dungeonItems, ProxySide.CLIENT, this.ModLoader.clientLobby);

        if (this.clientStorage.syncMode === 1) {
            mergeBottleDataTime(this.clientStorage.bottleStorage, packet.bottle);
            mergeInventoryTrade(this.clientStorage.tradeStorage, packet.trade);
        }
        else mergeBottleData(this.clientStorage.bottleStorage, packet.bottle);

        mergeEquipmentData(this.clientStorage.equipmentStorage, packet.equipment);

        applyInventoryToContext(this.clientStorage.inventoryStorage, this.core.save);

        if (this.clientStorage.syncMode === 1) {
            applyBottleToContextTime(this.clientStorage.bottleStorage, this.core.save);
            applyTradeToContext(this.clientStorage.tradeStorage, this.core.save);
        }
        else applyBottleToContext(this.clientStorage.bottleStorage, this.core.save);

        applyEquipmentToContext(this.clientStorage.equipmentStorage, this.core.save);

        applyQuestSaveToContext(this.clientStorage.questStorage, this.core.save);

        if (this.clientStorage.syncMode === 1) applyDungeonItemDataToContext(this.clientStorage.dungeonItemStorage, this.core.save.dungeonItemManager);

        this.ModLoader.gui.tunnel.send('MMOnline:onSubscreenPacket', new GUITunnelPacket('MMOnline', 'MMOnline:onSubscreenPacket', packet));
    }


    @NetworkHandler('MMO_ClientSceneContextUpdate')
    onSceneContextSync_client(packet: MMO_ClientSceneContextUpdate) {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid() || this.core.helper.isLinkEnteringLoadingZone()) return;
        if (this.core.global.current_scene !== packet.scene) return;

        let buf3: Buffer = this.core.global.liveSceneData_collectable;
        if (Object.keys(parseFlagChanges(packet.collect, buf3) > 0)) this.core.global.liveSceneData_collectable = buf3;
    }

    @NetworkHandler('MMO_ClientSceneContextUpdateTime')
    onSceneContextSyncTime_client(packet: MMO_ClientSceneContextUpdateTime) {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid() || this.core.helper.isLinkEnteringLoadingZone()) return;
        if (this.core.global.current_scene !== packet.scene) return;

        let buf: Buffer = this.core.global.liveSceneData_chests;
        if (Object.keys(parseFlagChanges(packet.chests, buf) > 0)) this.core.global.liveSceneData_chests = buf;

        buf = this.core.global.liveSceneData_switch;
        if (Object.keys(parseFlagChanges(packet.switches, buf) > 0)) this.core.global.liveSceneData_switch = buf;

        buf = this.core.global.liveSceneData_collectable;
        /*if (Object.keys(parseFlagChanges(packet.collect, buf) > 0)) this.core.global.liveSceneData_collectable = buf;*/

        buf = this.core.global.liveSceneData_clear;
        if (Object.keys(parseFlagChanges(packet.clear, buf) > 0)) this.core.global.liveSceneData_clear = buf;

        buf = this.core.global.liveSceneData_temp;
        if (Object.keys(parseFlagChanges(packet.temp, buf) > 0)) this.core.global.liveSceneData_temp = buf;
    }

    @NetworkHandler("MMO_BankSyncPacket")
    onBankUpdate(packet: MMO_BankSyncPacket) {
        this.clientStorage.bank = packet.savings;
        this.ModLoader.emulator.rdramWrite16(0x801F054E, this.clientStorage.bank);
    }

    @NetworkHandler("MMO_ItemGetMessagePacket")
    onMessage(packet: MMO_ItemGetMessagePacket) {
        this.clientStorage.notifBuffer.push(packet);
    }

    healPlayer() {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid()) return;
        this.core.save.health_mod = 0x65;
    }

    @EventHandler(Z64OnlineEvents.GAINED_PIECE_OF_HEART)
    onNeedsHeal1(evt: any) {
        this.healPlayer();
    }

    @EventHandler(Z64OnlineEvents.GAINED_HEART_CONTAINER)
    onNeedsHeal2(evt: any) {
        this.healPlayer();
    }

    @EventHandler(Z64OnlineEvents.MAGIC_METER_INCREASED)
    onNeedsMagic(size: API.Magic) {
    }

    @EventHandler(API.MMEvents.ON_AGE_CHANGE)
    onAgeChange(form: API.MMForms) {
        let gui_p: MMO_SceneGUIPacket = new MMO_SceneGUIPacket(this.core.global.current_scene, form, this.ModLoader.clientLobby);

        if (this.core.save.form === API.MMForms.DEKU) this.core.save.deku_b_state = 0x091EF6C8;
        this.ModLoader.gui.tunnel.send('MMOnline:onAgeChange', new GUITunnelPacket('MMOnline', 'MMOnline:onAgeChange', gui_p));
        this.ModLoader.clientSide.sendPacket(new MMO_ScenePacket(this.ModLoader.clientLobby, this.core.global.current_scene, form));
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onReset(evt: any) {
        this.clientStorage.first_time_sync = false;
    }

    updatePictobox() {
        let photo = createPhotoFromContext(this.ModLoader, this.core.save.photo);
        if (photo.hash !== this.clientStorage.photoStorage.hash) {
            console.log("Photo taken");
            mergePhotoData(this.clientStorage.photoStorage, photo);
            this.clientStorage.photoStorage.compressPhoto();
            this.ModLoader.clientSide.sendPacket(new MMO_PictoboxPacket(this.clientStorage.photoStorage, this.ModLoader.clientLobby));
        }
    }

    updateSkulltula() {
        let skull = createSkullFromContext(this.ModLoader, this.core.save.skull);
        mergeSkullData(this.clientStorage.skullStorage, skull);
        applySkullToContext(skull, this.core.save.skull);
        this.ModLoader.clientSide.sendPacket(new MMO_SkullPacket(this.clientStorage.skullStorage, this.ModLoader.clientLobby));
    }

    updateStray() {
        let stray = createStrayFromContext(this.ModLoader, this.core.save.stray);
        mergeStrayData(this.clientStorage.strayStorage, stray);
        applyStrayToContext(stray, this.core.save.stray);
        this.ModLoader.clientSide.sendPacket(new MMO_StrayFairyPacket(this.clientStorage.strayStorage, this.ModLoader.clientLobby));
    }

    @NetworkHandler('MMO_PictoboxPacket')
    onPictobox(packet: MMO_PictoboxPacket) {
        if (packet.player.uuid === this.ModLoader.me.uuid) {
            return;
        }
        let photo = new PhotoSave();
        photo.fromPhoto(packet.photo);
        photo.decompressPhoto();
        mergePhotoData(this.clientStorage.photoStorage, photo);
        applyPhotoToContext(photo, this.core.save.photo);
        let sb = new SmartBuffer();
        let buf = Buffer.alloc(photo.pictograph_photoChunk.byteLength + 0x10);
        photo.pictograph_photoChunk.copy(buf);
        for (let i = 0; i < 0x2bc0; i += 5) {
            let data = buf.readBigUInt64BE(i) >> 24n;

            for (let k = 0n; k < 8n; ++k) {
                let pixel = (data >> (5n * (7n - k))) & 0x1Fn;
                let i8f = Number(pixel) / 31.0 * 255.0;

                sb.writeUInt8(Math.floor(i8f * 1.0));
                sb.writeUInt8(Math.floor(i8f * 0.65));
                sb.writeUInt8(Math.floor(i8f * 0.65));
                sb.writeUInt8(0xFF);
            }
        }
        this.clientStorage.pictoboxAlert.buf = sb.toBuffer();
    }

    @NetworkHandler('MMO_SkullPacket')
    onSkull(packet: MMO_SkullPacket) {
        let skull = createSkullFromContext(this.ModLoader, this.core.save.skull);

        mergeSkullData(this.clientStorage.skullStorage, packet.skull);
        mergeSkullData(this.clientStorage.skullStorage, skull);
        applySkullToContext(this.clientStorage.skullStorage, this.core.save.skull);
    }

    @NetworkHandler('MMO_StrayFairyPacket')
    onStray(packet: MMO_StrayFairyPacket) {
        let stray = createStrayFromContext(this.ModLoader, this.core.save.stray);

        mergeStrayData(this.clientStorage.strayStorage, packet.stray);
        mergeStrayData(this.clientStorage.strayStorage, stray);
        applyStrayToContext(this.clientStorage.strayStorage, this.core.save.stray);
    }

    @NetworkHandler('MMO_ServerFlagUpdate')
    onSceneFlagSync_client(packet: MMO_ServerFlagUpdate) {

        //this.ModLoader.utils.clearBuffer(this.clientStorage.sceneStorage);
        //this.ModLoader.utils.clearBuffer(this.clientStorage.eventStorage);
        //this.ModLoader.utils.clearBuffer(this.clientStorage.itemFlagStorage);
        //this.ModLoader.utils.clearBuffer(this.clientStorage.infStorage);
        //this.ModLoader.utils.clearBuffer(this.clientStorage.skulltulaStorage);
        this.ModLoader.utils.clearBuffer(this.clientStorage.minimapStorage);

        //let scene_data = this.core.save.permSceneData;
        //let event_data = this.core.save.eventFlags;
        //let item_data = this.core.save.itemFlags;
        //let inf_data = this.core.save.infTable;
        //let skulltula_data = this.core.save.skulltulaFlags;
        let minimap_data = this.core.save.minimap_flags;

        /*
        parseFlagChanges(
            scene_data,
            this.clientStorage.sceneStorage
        );
        parseFlagChanges(
            event_data,
            this.clientStorage.eventStorage
        );
        parseFlagChanges(
            item_data,
            this.clientStorage.itemFlagStorage
        );
        parseFlagChanges(
            inf_data,
            this.clientStorage.infStorage
        );
        parseFlagChanges(
            skulltula_data,
            this.clientStorage.skulltulaStorage
        );
        */
        parseFlagChanges(
            minimap_data,
            this.clientStorage.minimapStorage
        );

        /*for (let i = 0; i < packet.scenes.byteLength; i += 0x1C) {
            let struct = new OotO_SceneStruct(packet.scenes.slice(i, i + 0x1C));
            let cur = new OotO_SceneStruct(this.clientStorage.sceneStorage.slice(i, i + 0x1C));
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
        }*/

        for (let i = 0; i < packet.minimaps.byteLength; i++) {
            let value = packet.minimaps[i];
            if (this.clientStorage.minimapStorage[i] !== value) {
                this.clientStorage.minimapStorage[i] |= value;
            }
        }

        //this.core.save.permSceneData = this.clientStorage.sceneStorage;
        //this.core.save.eventFlags = this.clientStorage.eventStorage;
        //this.core.save.itemFlags = this.clientStorage.itemFlagStorage;
        //this.core.save.infTable = this.clientStorage.infStorage;
        //this.core.save.skulltulaFlags = this.clientStorage.skulltulaStorage;
        this.core.save.minimap_flags = this.clientStorage.minimapStorage;
    }

    bitmapFromPictograph() {
        let bitmap = new BMP_Image(160, 112, BitDepth.BPP_8, 32);
        for (let i = 0; i < 32; i++) {
            let colors = Buffer.alloc(4);
            colors[1] = Math.round(i * 250 / 31);
            colors[2] = Math.round(i * 160 / 31);
            colors[3] = Math.round(i * 160 / 31);
            bitmap.colorTable.writeUInt32LE(colors.readUInt32BE(0), i * 4)
        }
        for (let i = 0; i < 160 * 112; i++) {
            let bits = (() => {
                return {
                    byte: Math.floor(i * 5 / 8),
                    bitOffset: (i * 5) % 8
                }
            })();
            let pixel: number;
            let pictograph = this.core.save.photo.pictograph_photoChunk;
            try {
                pixel = ((pictograph.readUInt16BE(bits.byte) & (31 << (16 - bits.bitOffset - 5))) >> (16 - bits.bitOffset - 5));
            } catch {
                pixel = ((pictograph.readUInt8(bits.byte) & (31 << (8 - bits.bitOffset - 5))) >> (8 - bits.bitOffset - 5));
            }
            bitmap.pixelData.writeUInt8(pixel, i);
        }
        let filename = `pictograph_${Date.now().toString()}.bmp`;
        fs.writeFile(path.resolve("./screenshots", filename), bitmap.file, (err) => {
            if (err) this.ModLoader.logger.error(`${err}`);
            this.ModLoader.logger.info(`Saved file to ./screenshots/${filename}`);
        });
    }

    @onViUpdate()
    onVi() {
        if (!this.resourcesLoaded) {
            /*             let base: string = path.resolve(__dirname, "gui", "sprites");
                        fs.readdirSync(base).forEach((file: string) => {
                            let p = path.resolve(base, file);
                            let t: Texture = this.ModLoader.Gfx.createTexture();
                            t.loadFromFile(p);
                            this.itemIcons.set(file, t);
                            //this.ModLoader.logger.debug("Loaded " + file + ".");
                        }); */
            this.font = this.ModLoader.Gfx.createFont();
            this.font.loadFromFile(path.resolve(__dirname, "data", "HyliaSerifBeta-Regular.otf"), 22, 2);
            changeKillfeedFont(this.font);
            this.resourcesLoaded = true;
        }
        if (this.clientStorage.pictoboxAlert.image !== undefined) {
            this.ModLoader.Gfx.addSprite(this.ModLoader.ImGui.getWindowDrawList(), this.clientStorage.pictoboxAlert.image, xywh(0, 0, 160, 112), xywh(this.clientStorage.pictoboxAlert.pos.x, this.clientStorage.pictoboxAlert.pos.y, this.clientStorage.pictoboxAlert.size.x, this.clientStorage.pictoboxAlert.size.y), rgba(255, 255, 255, this.clientStorage.pictoboxAlert.opacity), FlipFlags.None);
            if (this.clientStorage.pictoboxAlert.opacity > 0) {
                this.clientStorage.pictoboxAlert.opacity--;
            }
        }
        if (this.clientStorage.pictoboxAlert.buf !== undefined) {
            this.clientStorage.pictoboxAlert.image = this.ModLoader.Gfx.createTexture();
            this.clientStorage.pictoboxAlert.image.loadFromMemoryRGBA32(160, 112, this.clientStorage.pictoboxAlert.buf);
            this.clientStorage.pictoboxAlert.pos = xy(this.ModLoader.ImGui.getWindowWidth() - this.clientStorage.pictoboxAlert.size.x, this.ModLoader.ImGui.getWindowHeight() - this.clientStorage.pictoboxAlert.size.y);
            this.clientStorage.pictoboxAlert.opacity = 255;
            this.clientStorage.pictoboxAlert.buf = undefined;
        }
        if (this.ModLoader.ImGui.beginMainMenuBar()) {
            if (this.ModLoader.ImGui.beginMenu("Mods")) {
                if (this.ModLoader.ImGui.beginMenu("MMO")) {
                    if (IS_DEV_BUILD) {
                        if (this.ModLoader.ImGui.beginMenu("Teleport")) {
                            this.ModLoader.ImGui.inputText("Destination", this.teleportDest);
                            this.ModLoader.ImGui.inputText("Cutscene", this.cutsceneDest);
                            if (this.ModLoader.ImGui.button("Warp")) {
                                this.core.commandBuffer.runWarp(parseInt(this.teleportDest[0], 16), parseInt(this.cutsceneDest[0], 16), () => { });
                            }
                            this.ModLoader.ImGui.endMenu();
                        }
                    }
                    if (this.ModLoader.ImGui.menuItem("Save Pictograph", undefined, undefined, this.core.save.photo.pictograph_used)) {
                        this.ModLoader.utils.setTimeoutFrames(() => {
                            this.bitmapFromPictograph();
                        }, 0);
                    }
                    this.ModLoader.ImGui.endMenu();
                }
                this.ModLoader.ImGui.endMenu();
            }
            this.ModLoader.ImGui.endMainMenuBar();
        }
    }

    updatePermFlags() {
        let hash = this.ModLoader.utils.hashBuffer(this.core.save.permFlags);
        hash += this.ModLoader.utils.hashBuffer(this.ModLoader.emulator.rdramReadBitsBuffer(0x801F0568, 99));
        if (this.clientStorage.flagHash === hash) {
            return;
        }
        this.clientStorage.flagHash = hash;
        let flags = this.core.save.permFlags;
        let mask = this.ModLoader.emulator.rdramReadBuffer(0x801C5FC0, 0x710);
        let scratch: Buffer = Buffer.alloc(0x4);
        let scratch2: Buffer = Buffer.alloc(0x4);
        // Scenes 0x00 to 0x70 inclusive
        for (let i = 0; i <= 0x70; i++) {
            this.ModLoader.utils.clearBuffer(scratch);
            this.ModLoader.utils.clearBuffer(scratch2);
            const maskIndex = i * 0x10;
            const sceneFlagsIndex = i * 0x14;

            const genericMask1 = mask.readUInt32BE(maskIndex);
            const genericMask2 = mask.readUInt32BE(maskIndex + 0x4);
            const chestMask = mask.readUInt32BE(maskIndex + 0x8);
            const collectibleMask = mask.readUInt32BE(maskIndex + 0xC);

            /* These are in a different order! */
            const genericSceneFlags1Index = sceneFlagsIndex + 0x4;
            const genericSceneFlags2Index = sceneFlagsIndex + 0x8;
            const chestSceneFlagsIndex = sceneFlagsIndex;
            const collectibleSceneFlagsIndex = sceneFlagsIndex + 0x10;

            let genericSceneFlags1 = flags.readUInt32BE(genericSceneFlags1Index);
            let genericSceneFlags2 = flags.readUInt32BE(genericSceneFlags2Index);
            let chestSceneFlags = flags.readUInt32BE(chestSceneFlagsIndex);
            let collectibleSceneFlags = flags.readUInt32BE(collectibleSceneFlagsIndex);

            let flag_array = [genericSceneFlags1, genericSceneFlags2, chestSceneFlags, collectibleSceneFlags];
            let mask_array = [genericMask1, genericMask2, chestMask, collectibleMask];

            for (let j = 0; j < flag_array.length; j++) {
                let f = flag_array[j];
                let m = mask_array[j];
                scratch.writeUInt32BE(f, 0);
                scratch2.writeUInt32BE(m, 0);
                for (let k = 0; k < scratch.byteLength; k++) {
                    scratch[k] &= scratch2[k];
                }
                f = scratch.readUInt32BE(0);
                flag_array[j] = f;
            }

            flags.writeUInt32BE(flag_array[0], genericSceneFlags1Index);
            flags.writeUInt32BE(flag_array[1], genericSceneFlags2Index);
            flags.writeUInt32BE(flag_array[2], chestSceneFlagsIndex);
            flags.writeUInt32BE(flag_array[3], collectibleSceneFlagsIndex);
        }
        parseFlagChanges(flags, this.clientStorage.permFlags);
        let bits = this.ModLoader.emulator.rdramReadBitsBuffer(0x801F0568, 99);
        let buf = Buffer.alloc(this.permFlagBits.length);
        for (let i = 0; i < this.permFlagBits.length; i++) {
            buf.writeUInt8(bits.readUInt8(this.permFlagBits[i]), i);
        }
        let flips = parseFlagChanges(buf, this.clientStorage.permEvents);
        Object.keys(flips).forEach((key: string) => {
            let bit = parseInt(key);
            let value = flips[key];
            if (value > 0) {
                this.ModLoader.logger.info(this.permFlagNames.get(bit)!);
            }
        });
        this.ModLoader.clientSide.sendPacket(new MMO_PermFlagsPacket(this.clientStorage.permFlags, this.clientStorage.permEvents, this.ModLoader.clientLobby));
    }

    mmrSyncCheck() {
        let skullShuffle0: number = this.ModLoader.emulator.rdramRead32(0x8014449C);
        let skullShuffle1: number = this.ModLoader.emulator.rdramRead32(0x801444A4);
        let strayShuffle0: number = this.ModLoader.emulator.rdramRead32(0x8014450C);
        let strayShuffle1: number = this.ModLoader.emulator.rdramRead32(0x80144514);
        let strayShuffle2: number = this.ModLoader.emulator.rdramRead32(0x8014451C);
        let strayShuffle3: number = this.ModLoader.emulator.rdramRead32(0x8014452C);

        if (skullShuffle0 === 0x00000000 && skullShuffle1 === 0x00000000) this.clientStorage.isSkulltulaSync = true;
        if (strayShuffle0 === 0x00000000 && strayShuffle1 === 0x00000000 && strayShuffle2 === 0x00000000 && strayShuffle3 === 0x00000000) this.clientStorage.isFairySync = true;

        this.ModLoader.logger.info("Skulltula Sync: " + this.clientStorage.isFairySync);
        this.ModLoader.logger.info("Fairy Sync: " + this.clientStorage.isSkulltulaSync);
    }

    @NetworkHandler('MMO_PermFlagsPacket')
    onPermFlags(packet: MMO_PermFlagsPacket) {
        parseFlagChanges(packet.flags, this.clientStorage.permFlags);
        let save = this.core.save.permFlags;
        parseFlagChanges(this.clientStorage.permFlags, save);
        this.core.save.permFlags = save;
        parseFlagChanges(packet.eventFlags, this.clientStorage.permEvents);
        let bits = this.ModLoader.emulator.rdramReadBitsBuffer(0x801F0568, 99);
        for (let i = 0; i < this.permFlagBits.length; i++) {
            bits.writeUInt8(this.clientStorage.permEvents.readUInt8(i), this.permFlagBits[i]);
        }
        this.ModLoader.emulator.rdramWriteBitsBuffer(0x801F0568, bits);
    }

    @EventHandler(Z64OnlineEvents.SWORD_NEEDS_UPDATE)
    onSwordChange(evt: any) {
        this.core.save.sword_helper.updateSwordonB();
    }

    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED_POST)
    onRomPost(evt: any) {
        let rom: Buffer = evt.rom;
        let offset: number = rom.indexOf('DPAD_CONFIG');
        if (offset === -1) {
            this.ModLoader.logger.debug("This is not an MMR Rom.");
        } else {
            this.ModLoader.logger.debug("This is an MMR Rom.");
            this.clientStorage.isMMR = true;
        }
    }

    @onTick()
    onTick() {
        if (
            !this.core.helper.isTitleScreen() &&
            this.core.helper.isSceneNumberValid() &&
            this.core.helper.isInterfaceShown()
        ) {
            if (!this.core.helper.isPaused()) {
                if (!this.clientStorage.first_time_sync) {
                    return;
                }

                if (this.LobbyConfig.actor_syncing) {
                    // this.actorHooks.tick();
                }
                if (this.LobbyConfig.data_syncing) {
                    if (this.clientStorage.syncMode === 1) {
                        this.autosaveSceneDataTime();
                        this.updateBottlesTime();
                    }
                    else if (this.clientStorage.syncMode === 2) {
                        //this.updateTime();
                    }

                    if (this.LobbyConfig.key_syncing) {
                        //this.keys.update();
                    }

                    this.updatePictobox();
                    this.updatePermFlags();

                    let state = this.core.link.state;
                    if (state === API.LinkState.STANDING && this.clientStorage.notifBuffer.length > 0) {
                        if (this.clientStorage.notifBuffer.length > 10) {
                            let size = this.clientStorage.notifBuffer.length;
                            this.clientStorage.notifBuffer.length = 0;
                            this.clientStorage.notifBuffer.push(new MMO_ItemGetMessagePacket("You obtained " + size + " items.", this.ModLoader.clientLobby));
                        }
                        while (this.clientStorage.notifBuffer.length > 0) {
                            let packet = this.clientStorage.notifBuffer.shift()!;
                            if (this.config.notifications) {
                                if (packet.icon !== undefined) {
                                    addToKillFeedQueue(packet.text, this.itemIcons.get(packet.icon));
                                } else {
                                    addToKillFeedQueue(packet.text);
                                }
                            }
                        }
                    }
                    if ((this.core.global.scene_framecount % 400) === 0) this.clientStorage.needs_update = true;
                    if (
                        state === API.LinkState.BUSY ||
                        state === API.LinkState.GETTING_ITEM ||
                        state === API.LinkState.TALKING ||
                        state === API.LinkState.CAMERA
                    ) {
                        this.clientStorage.needs_update = true;
                    }
                    else if (state === API.LinkState.STANDING && this.clientStorage.needs_update && this.LobbyConfig.data_syncing) {
                        this.updateInventory();
                        this.updateFlags();
                        if (this.clientStorage.isFairySync) this.updateStray();
                        if (this.clientStorage.isSkulltulaSync) this.updateSkulltula();
                        this.clientStorage.needs_update = false;
                    }
                }
            }
        }
        if (this.core.helper.isTitleScreen() && this.core.global.scene_framecount === 1 && !this.core.save.checksum) this.mmrSyncCheck();
    }
}
