import { IPlugin, IModLoaderAPI, IPluginServerConfig, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { EventHandler, bus, EventsServer, EventsClient, EventServerJoined, EventServerLeft } from 'modloader64_api/EventHandler';
import { Link } from './MMAPI/Link';
import { MMHelper } from './MMAPI/MMHelper';
import { MMCore } from './MMAPI/Core';
import { IMMOnlineHelpers, MMOnlineEvents, MMOnline_PlayerScene } from './MMOAPI/MMOAPI';

// @Drahsid TODO: Move to Z64lib?
import { OotEvents } from 'modloader64_api/OOT/OOTAPI';
import { MMO_ScenePacket, MMO_SceneRequestPacket } from './data/MMOPackets';
import { MMOnlineStorage } from './MMOnlineStorage';

import { MMOnlineStorageClient } from './MMOnlineStorageClient';
import { IPacketHeader, ServerNetworkHandler, NetworkHandler, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { PuppetOverlord } from './data/linkPuppet/PuppetOverlord';
import { MMForms } from './MMAPI/mmForms';
import { zzstatic } from './Z64Lib/API/zzstatic';
import { Z64RomTools } from './Z64Lib/API/Z64RomTools';
import { DiscordStatus } from 'modloader64_api/Discord';
import { FileSystemCompare } from './Z64Lib/API/FileSystemCompare';
import { Z64LibSupportedGames } from './Z64Lib/API/Z64LibSupportedGames';
import { ManifestMapper } from './data/models/ManifestMapper';
import { ModelManager } from './data/models/ModelManager';

import printf from './printf'
import path from 'path';
import fs from 'fs';

export const SCENE_ARR_SIZE = 0xb0c;
export const EVENT_ARR_SIZE = 0x8;
export const ITEM_FLAG_ARR_SIZE = 0x18;
export const MASK_FLAG_ARR_SIZE = 0x18;
export const WEEK_EVENT_ARR_SIZE = 0x64;



class MMO implements IPlugin, IMMOnlineHelpers, IPluginServerConfig {

    ModLoader!: IModLoaderAPI;
    core: MMCore;
    puppets: PuppetOverlord;
    // Storage
    clientStorage: MMOnlineStorageClient = new MMOnlineStorageClient;
    models: ModelManager;

    constructor() {
        this.core = new MMCore();
        this.puppets = new PuppetOverlord(this, this.core);
        this.models = new ModelManager();
    }

    // This packet is basically 'where the hell are you?' if a player has a puppet on file but doesn't know what scene its suppose to be in.
    @NetworkHandler('MMO_SceneRequestPacket')
    onSceneRequest_client(packet: MMO_SceneRequestPacket) {
        if (this.core.save !== undefined) {
            this.ModLoader.clientSide.sendPacketToSpecificPlayer(
                new MMO_ScenePacket(
                    this.ModLoader.clientLobby,
                    this.core.global.scene_frame_count,
                    this.core.save.form
                ),
                packet.player
            );
        }
    }

    @EventHandler(EventsServer.ON_LOBBY_JOIN)
    onPlayerJoin_server(evt: EventServerJoined) {
        let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            evt.lobby,
            this
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
            this
        ) as MMOnlineStorage;
        if (storage === null) {
            return;
        }
        delete storage.players[evt.player.uuid];
        delete storage.networkPlayerInstances[evt.player.uuid];
    }

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

    preinit(): void {
    }
    init(): void { }
    postinit(): void {
        this.ModLoader.gui.setDiscordStatus(new DiscordStatus("No peeking", "Testing a secret project"));
        this.writeModel();
    }

    writeModel() {
        // These use the OOT adult format.
        let zz: zzstatic = new zzstatic(Z64LibSupportedGames.MAJORAS_MASK);
        this.ModLoader.emulator.rdramWriteBuffer(0x80900000, zz.doRepoint(fs.readFileSync(path.resolve(__dirname, "data", "models", "zobjs", "Deity.zobj")), 0, true, 0x80900000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80910000, zz.doRepoint(fs.readFileSync(path.resolve(__dirname, "data", "models", "zobjs", "Goron.zobj")), 0, true, 0x80910000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80920000, zz.doRepoint(fs.readFileSync(path.resolve(__dirname, "data", "models", "zobjs", "Zora.zobj")), 0, true, 0x80920000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80930000, zz.doRepoint(fs.readFileSync(path.resolve(__dirname, "data", "models", "zobjs", "Deku.zobj")), 0, true, 0x80930000));
        this.ModLoader.emulator.rdramWriteBuffer(0x80940000, zz.doRepoint(fs.readFileSync(path.resolve(__dirname, "data", "models", "zobjs", "Human.zobj")), 0, true, 0x80940000));
    }

    onTick(frame?: number): void {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid()) return;
        printf(this.ModLoader)
    }

    @EventHandler(EventsServer.ON_LOBBY_CREATE)
    onLobbyCreated(lobby: string) {
        try {
            this.ModLoader.lobbyManager.createLobbyStorage(
                lobby,
                this,
                new MMOnlineStorage()
            );
        } catch (err) {
            this.ModLoader.logger.error(err);
        }
    }

    @EventHandler(OotEvents.ON_SCENE_CHANGE)
    onSceneChange(scene: number) {
        this.ModLoader.logger.debug(scene.toString(16));
        this.ModLoader.clientSide.sendPacket(
            new MMO_ScenePacket(
                this.ModLoader.clientLobby,
                scene,
                this.core.save.form
            )
        );
    }

    @ServerNetworkHandler('MMO_ScenePacket')
    onSceneChange_server(packet: MMO_ScenePacket) {
        try {
            let storage: MMOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this
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
            console.log(err);
        }
    }

    @NetworkHandler('MMO_ScenePacket')
    onSceneChange_client(packet: MMO_ScenePacket) {
        this.ModLoader.logger.info('client receive: Player ' + packet.player.nickname + ' moved to scene ' + packet.scene + '.');
        bus.emit(
            MMOnlineEvents.CLIENT_REMOTE_PLAYER_CHANGED_SCENES,
            new MMOnline_PlayerScene(packet.player, packet.lobby, packet.scene)
        );
    }

    @EventHandler(OotEvents.ON_LOADING_ZONE)
    onLoadingZone(evt: any) {
        this.ModLoader.logger.debug("I've touched a loading zone.");
    }

    @EventHandler(OotEvents.ON_AGE_CHANGE)
    onAgeChange(age: MMForms) {
        this.ModLoader.clientSide.sendPacket(
            new MMO_ScenePacket(
                this.ModLoader.clientLobby,
                this.core.global.current_scene,
                age
            )
        );
    }

    @EventHandler(EventsClient.ON_PAYLOAD_INJECTED)
    onPayload(evt: any) {
        let f = path.parse(evt.file);
        if (f.ext === ".ovl") {
            if (f.name === "link") {
                this.ModLoader.logger.info("Puppet assigned.");
                this.ModLoader.emulator.rdramWrite16(0x800000, evt.result);
            }
        }
    }

    getServerURL(): string {
        return "192.99.70.23:8035";
    }
}

module.exports = MMO;

export default MMO;