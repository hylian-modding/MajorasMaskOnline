import { EventHandler, EventsServer, EventServerJoined, EventServerLeft, bus } from 'modloader64_api/EventHandler';
//import { ActorHookingManagerServer } from './data/ActorHookingSystem';
import { MMOnlineStorage } from './MMOnlineStorage';
import { ParentReference, SidedProxy, ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
import MMOnline from './MMOnline';
import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { ServerNetworkHandler, IPacketHeader } from 'modloader64_api/NetworkHandler';
import { MMOnline_PlayerScene, MMOnlineEvents } from './MMOAPI/MMOAPI';
import { MMO_ScenePacket, MMO_BottleUpdatePacket, MMO_DownloadRequestPacket, MMO_DownloadResponsePacket, MMO_SubscreenSyncPacket, MMO_ServerFlagUpdate, MMO_BankSyncPacket, MMO_DownloadResponsePacket2, MMO_ClientFlagUpdate, MMO_ClientSceneContextUpdate } from './data/MMOPackets';
//import { MMO_KeyRebuildPacket, KeyLogManagerServer } from './data/keys/KeyLogManager';
import { mergeInventoryData, mergeEquipmentData, mergeQuestSaveData, mergeDungeonItemData, MMO_SceneStruct } from './data/MMOSaveData';
import { PuppetOverlord } from './data/linkPuppet/PuppetOverlord';
import { InjectCore } from 'modloader64_api/CoreInjection';
import * as API from 'MajorasMask/API/MMAPI';
import { MMOnlineStorageClient } from './MMOnlineStorageClient';

export class MMOnlineServer {
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: API.IMMCore;
    @ParentReference()
    parent!: MMOnline;
    /*@SidedProxy(ProxySide.SERVER, ActorHookingManagerServer)
    actorHooks!: ActorHookingManagerServer;
    @SidedProxy(ProxySide.SERVER, KeyLogManagerServer)
    keys!: KeyLogManagerServer;*/
    clientStorage: MMOnlineStorageClient = new MMOnlineStorageClient();

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
                if (storage.players[key] === storage.players[packet.player.uuid]) {
                    if (storage.networkPlayerInstances[key].uuid !== packet.player.uuid) {
                        this.ModLoader.serverSide.sendPacketToSpecificPlayer(
                            packet,
                            storage.networkPlayerInstances[key]
                        );
                    }
                }
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
            bus.emit(MMOnlineEvents.SERVER_PLAYER_CHANGED_SCENES, new MMOnline_PlayerScene(packet.player, packet.lobby, packet.scene));
        } catch (err) {
        }
    }

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
                        packet.lobby
                    ),
                    new MMO_ServerFlagUpdate(
                        storage.sceneStorage,
                        storage.eventStorage,
                        //storage.itemFlagStorage,
                        //storage.infStorage,
                        //storage.skulltulaStorage,
                        packet.lobby
                    ),
                    new MMO_BankSyncPacket(storage.bank, packet.lobby),
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
        mergeEquipmentData(storage.equipmentStorage, packet.equipment);
        mergeQuestSaveData(storage.questStorage, packet.quest);
        mergeDungeonItemData(storage.dungeonItemStorage, packet.dungeonItems);
        this.ModLoader.serverSide.sendPacket(
            new MMO_SubscreenSyncPacket(
                storage.inventoryStorage,
                storage.equipmentStorage,
                storage.questStorage,
                storage.dungeonItemStorage,
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
        for (let i = 0; i < packet.scenes.byteLength; i += 0x1C) {
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
        }
        /*for (let i = 0; i < packet.items.byteLength; i++) {
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
        }*/
        this.ModLoader.serverSide.sendPacket(
            new MMO_ServerFlagUpdate(
                storage.sceneStorage,
                storage.eventStorage,
                //storage.itemFlagStorage,
                //storage.infStorage,
                //storage.skulltulaStorage,
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