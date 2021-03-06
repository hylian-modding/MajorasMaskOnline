import { EventHandler, EventsServer, EventServerJoined, EventServerLeft, bus } from 'modloader64_api/EventHandler';
import { MMOnlineStorage } from './MMOnlineStorage';
import { ParentReference, ProxySide, SidedProxy } from 'modloader64_api/SidedProxy/SidedProxy';
import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
import MMOnline from './MMOnline';
import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { ServerNetworkHandler, IPacketHeader } from 'modloader64_api/NetworkHandler';
import { MMO_ScenePacket, MMO_BottleUpdatePacket, MMO_DownloadRequestPacket, MMO_DownloadResponsePacket, MMO_SubscreenSyncPacket, MMO_ServerFlagUpdate, MMO_BankSyncPacket, MMO_DownloadResponsePacket2, MMO_ClientFlagUpdate, MMO_ClientSceneContextUpdate, MMO_TimePacket, MMO_PictoboxPacket, MMO_PermFlagsPacket, MMO_StrayFairyPacket, MMO_SkullPacket } from './data/MMOPackets';
import { mergeInventoryData, mergeEquipmentData, mergeQuestSaveData, mergeDungeonItemData, mergePhotoData, mergeBottleData, mergeBottleDataTime, PhotoSave, mergeStrayData, mergeSkullData } from './data/MMOSaveData';
import { InjectCore } from 'modloader64_api/CoreInjection';
import * as API from 'MajorasMask/API/Imports';
import { MMOnlineStorageClient } from './MMOnlineStorageClient';
import { parseFlagChanges } from './parseFlagChanges';
import { Z64OnlineEvents, Z64_PlayerScene } from './Z64OnlineAPI/Z64OnlineAPI';
import { WorldEvents } from './WorldEvents/WorldEvents';

export class MMOnlineServer {
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: API.IMMCore;
    @ParentReference()
    parent!: MMOnline;
    clientStorage: MMOnlineStorageClient = new MMOnlineStorageClient();
    @SidedProxy(ProxySide.SERVER, WorldEvents)
    worldEvents!: WorldEvents;

    sendPacketToPlayersInScene(packet: IPacketHeader) {
        try {
            let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this.parent
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

    @EventHandler(EventsServer.ON_LOBBY_CREATE)
    onLobbyCreated(lobby: string) {
        try {
            this.ModLoader.lobbyManager.createLobbyStorage(lobby, this.parent, new MMOnlineStorage());
        }
        catch (err) {
            this.ModLoader.logger.error(err);
        }
    }

    @EventHandler(EventsServer.ON_LOBBY_JOIN)
    onPlayerJoin_server(evt: EventServerJoined) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            evt.lobby,
            this.parent
        ) as MMOnlineStorage;

        if (storage === null) {
            return;
        }

        storage.players[evt.player.uuid] = -1;
        storage.networkPlayerInstances[evt.player.uuid] = evt.player;
    }

    @EventHandler(EventsServer.ON_LOBBY_LEAVE)
    onPlayerLeft_server(evt: EventServerLeft) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            evt.lobby,
            this.parent
        ) as MMOnlineStorage;

        if (storage === null) {
            return;
        }

        delete storage.players[evt.player.uuid];
        delete storage.networkPlayerInstances[evt.player.uuid];
    }

    @ServerNetworkHandler('MMO_ScenePacket')
    onSceneChange_server(packet: MMO_ScenePacket) {
        try {
            let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this.parent
            ) as MMOnlineStorage;

            if (storage === null) {
                return;
            }

            storage.players[packet.player.uuid] = packet.scene;

            this.ModLoader.logger.info(
                'Server: Player ' +
                packet.player.nickname +
                ' moved to scene ' +
                packet.scene +
                '.'
            );
            bus.emit(Z64OnlineEvents.SERVER_PLAYER_CHANGED_SCENES, new Z64_PlayerScene(packet.player, packet.lobby, packet.scene));
        } catch (err) {
        }
    }

    // @ServerNetworkHandler('MMO_TimePacket')
    // onTimeUpdateServer(packet: MMO_TimePacket) {
    //     try {
    //         let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
    //             packet.lobby,
    //             this.parent
    //         ) as MMOnlineStorage;

    //         if (storage === null) {
    //             return;
    //         }

    //         let time = get_scaled_time(packet.time);
    //         storage.schedules[packet.player.uuid].current_time = packet.time;
    //         storage.schedules[packet.player.uuid].current_day = packet.day;
    //         storage.schedules[packet.player.uuid].time_speed = packet.time_speed;
    //         storage.schedules[packet.player.uuid].schedule_data[time].pos = puppets[packet.player.uuid].pos
    //         storage.schedules[packet.player.uuid].schedule_data[time].rot = puppets[packet.player.uuid].rot;
    //         storage.schedules[packet.player.uuid].schedule_data[time].anim = puppets[packet.player.uuid].anim;
    //         storage.schedules[packet.player.uuid].schedule_data[time].scene = puppets[packet.player.uuid].current_scene;
    //         storage.schedules[packet.player.uuid].schedule_data[time].alive = true;

    //         //this.puppetOverlord.puppets[packet.player.uuid].pos
    //     }
    //     catch(err) {}
    // }

    // @ServerNetworkHandler('MMO_QueryPlayerScheduleDataPacket')
    // onQueryPlayerScheduleData(packet: any) {
    //     try {
    //         let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
    //             packet.lobby,
    //             this.parent
    //         ) as MMOnlineStorage;

    //         if (storage === null) {
    //             return;
    //         }

    //         let return_data: PlayerScheduleData[] = [];
    //         let schedule: PlayerScheduleData;
    //         let time = storage.schedules[packet.player.uuid].current_time;
    //         let day = storage.schedules[packet.player.uuid].current_day;
    //         let scene = storage.schedules[packet.player.uuid].current_scene;


    //         Object.keys(storage.players).forEach((key: string) => {
    //             if (storage.networkPlayerInstances[key].uuid !== packet.player.uuid) {
    //                 schedule = storage.schedules[storage.networkPlayerInstances[key].uuid].get_schedule_data_at_time(time, day);
    //                 if (schedule.scene == scene && schedule.alive) return_data.push(schedule);
    //             }
    //         })

    //         // send return_data in a packet
    //     }
    //     catch(err) {}
    // }

    //------------------------------
    // Subscreen Syncing
    //------------------------------

    @ServerNetworkHandler('MMO_BottleUpdatePacket')
    onFIELD_BOTTLEserver(packet: MMO_BottleUpdatePacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        switch (packet.slot) {
            case 0:
                //storage.inventoryStorage.FIELD_BOTTLE1 = packet.contents;
                break;
            case 1:
                //storage.inventoryStorage.FIELD_BOTTLE2 = packet.contents;
                break;
            case 2:
                //storage.inventoryStorage.FIELD_BOTTLE3 = packet.contents;
                break;
            case 3:
                // storage.inventoryStorage.FIELD_BOTTLE4 = packet.contents;
                break;
        }
    }

    // Client is logging in and wants to know how to proceed.
    @ServerNetworkHandler('MMO_DownloadRequestPacket')
    onDownloadPacket_server(packet: MMO_DownloadRequestPacket) {
        this.ModLoader.logger.debug("MMO_DownloadRequestPacket Recieved");
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        if (storage.saveGameSetup) {
            // Game is running, get data.
            this.ModLoader.serverSide.sendPacketToSpecificPlayer(
                new MMO_DownloadResponsePacket(
                    new MMO_SubscreenSyncPacket(
                        storage.inventoryStorage,
                        storage.equipmentStorage,
                        storage.questStorage,
                        storage.dungeonItemStorage,
                        storage.bottleStorage,
                        storage.tradeStorage,
                        packet.lobby
                    ),
                    new MMO_ServerFlagUpdate(
                        storage.minimapStorage,
                        packet.lobby
                    ),
                    new MMO_BankSyncPacket(storage.bank, packet.lobby),
                    new MMO_PictoboxPacket(storage.photoStorage, packet.lobby),
                    new MMO_StrayFairyPacket(storage.strayStorage, packet.lobby),
                    new MMO_SkullPacket(storage.skullStorage, packet.lobby),
                    new MMO_PermFlagsPacket(storage.permFlags, storage.permEvents, packet.lobby),
                    packet.lobby
                ),
                packet.player
            );
            //this.ModLoader.serverSide.sendPacketToSpecificPlayer(new MMO_KeyRebuildPacket(storage.changelog, packet.lobby), packet.player);
        } else {
            // Game is not running, give me your data.
            this.ModLoader.serverSide.sendPacketToSpecificPlayer(
                new MMO_DownloadResponsePacket2(packet.lobby),
                packet.player
            );
        }
    }

    @ServerNetworkHandler('MMO_SubscreenSyncPacket')
    onItemSync_server(packet: MMO_SubscreenSyncPacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        mergeInventoryData(storage.inventoryStorage, packet.inventory);
        if (this.clientStorage.syncMode === 1) mergeBottleDataTime(storage.bottleStorage, packet.bottle);
        else mergeBottleData(storage.bottleStorage, packet.bottle);
        mergeEquipmentData(storage.equipmentStorage, packet.equipment);
        mergeQuestSaveData(storage.questStorage, packet.quest);
        if(this.clientStorage.syncMode === 1) mergeDungeonItemData(this.ModLoader, storage.dungeonItemStorage, packet.dungeonItems, ProxySide.SERVER, packet.lobby);
        this.ModLoader.serverSide.sendPacket(
            new MMO_SubscreenSyncPacket(
                storage.inventoryStorage,
                storage.equipmentStorage,
                storage.questStorage,
                storage.dungeonItemStorage,
                storage.bottleStorage,
                storage.tradeStorage,
                packet.lobby
            )
        );
        storage.saveGameSetup = true;
    }

    //------------------------------
    // Flag Syncing
    //------------------------------

    @ServerNetworkHandler('MMO_ClientFlagUpdate')
    onSceneFlagSync_server(packet: MMO_ClientFlagUpdate) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        /*for (let i = 0; i < packet.scenes.byteLength; i += 0x1C) {
            let struct = new MMO_SceneStruct(packet.scenes.slice(i, i + 0x1C));
            let cur = new MMO_SceneStruct(storage.sceneStorage.slice(i, i + 0x1C));
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
        }*/

        for (let i = 0; i < packet.minimaps.byteLength; i++) {
            let value = packet.minimaps[i];
            if (storage.minimapStorage[i] !== value) {
                storage.minimapStorage[i] |= value;
            }
        }
        this.ModLoader.serverSide.sendPacket(
            new MMO_ServerFlagUpdate(
                //storage.sceneStorage,
                storage.minimapStorage,
                packet.lobby
            )
        );
    }

    @ServerNetworkHandler('MMO_ClientSceneContextUpdate')
    onSceneContextSync_server(packet: MMO_ClientSceneContextUpdate) {
        this.sendPacketToPlayersInScene(packet);
    }

    @ServerNetworkHandler("MMO_BankSyncPacket")
    onBankUpdate_server(packet: MMO_BankSyncPacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        storage.bank = packet.savings;
    }

    @ServerNetworkHandler('MMO_PictoboxPacket')
    onPictobox(packet: MMO_PictoboxPacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        let image = new PhotoSave();
        image.fromPhoto(packet.photo);
        if (storage.photoStorage.timestamp < image.timestamp) {
            mergePhotoData(storage.photoStorage, image);
            this.ModLoader.serverSide.sendPacket(packet);
        }
    }

    @ServerNetworkHandler('MMO_StrayFairyPacket')
    onStray(packet: MMO_StrayFairyPacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        mergeStrayData(storage.strayStorage, packet.stray);
        this.ModLoader.serverSide.sendPacket( new MMO_StrayFairyPacket(storage.strayStorage, packet.lobby));
    }

    @ServerNetworkHandler('MMO_SkullPacket')
    onSkull(packet: MMO_SkullPacket) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }

        mergeSkullData(storage.skullStorage, packet.skull);
        this.ModLoader.serverSide.sendPacket(new MMO_SkullPacket(storage.skullStorage, packet.lobby));
    }

    @ServerNetworkHandler('MMO_PermFlagsPacket')
    onPermFlags(packet: MMO_PermFlagsPacket){
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            packet.lobby,
            this.parent
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        parseFlagChanges(packet.flags, storage.permFlags);
        parseFlagChanges(packet.eventFlags, storage.permEvents);
        this.ModLoader.serverSide.sendPacket(new MMO_PermFlagsPacket(storage.permFlags, storage.permEvents, packet.lobby));
    }

    @EventHandler(ModLoaderEvents.ON_RECEIVED_CRASH_LOG)
    onServerReceivedCrashlog(evt: any) {
        //let cp: CrashParserActorTable = new CrashParserActorTable();
        //let html: string = cp.parse(evt.dump);
        //fs.writeFileSync("./crashlogs/" + evt.name + ".html", html);
    }

    /*@ServerNetworkHandler("MMO_isRandoPacket")
    onRandoPacket(packet: MMO_isRandoPacket) {
    }*/

}