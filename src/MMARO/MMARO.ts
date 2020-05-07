import { IPlugin, IModLoaderAPI, IPluginServerConfig, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { EventHandler, bus, EventsServer, EventsClient, EventServerJoined, EventServerLeft } from 'modloader64_api/EventHandler';
import { Link } from './MMAPI/Link';
import { MMHelper } from './MMAPI/MMHelper';
import { MMCore } from './MMAPI/Core';
import { IOotOnlineHelpers, OotOnlineEvents, OotOnline_PlayerScene } from './OotoAPI/OotoAPI';
import { OotOnlineStorageClient } from './OotOnlineStorageClient';
import { IPacketHeader, ServerNetworkHandler, NetworkHandler, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { OotEvents } from 'modloader64_api/OOT/OOTAPI';
import { Ooto_ScenePacket, Ooto_SceneRequestPacket } from './data/OotOPackets';
import { OotOnlineStorage } from './OotOnlineStorage';
import { PuppetOverlord } from './data/linkPuppet/PuppetOverlord';
import path from 'path';
import fs from 'fs';
import { MMForms } from './MMAPI/mmForms';
import { zzstatic } from './Z64Lib/API/zzstatic';
import { Z64RomTools } from './Z64Lib/API/Z64RomTools';
import { DiscordStatus } from 'modloader64_api/Discord';
import { FileSystemCompare } from './Z64Lib/API/FileSystemCompare';
import { Z64LibSupportedGames } from './Z64Lib/API/Z64LibSupportedGames';
import { ManifestMapper } from './data/models/ManifestMapper';
import { ModelManager } from './data/models/ModelManager';

class MMARO implements IPlugin, IOotOnlineHelpers, IPluginServerConfig {

    ModLoader!: IModLoaderAPI;
    core: MMCore;
    puppets: PuppetOverlord;
    // Storage
    clientStorage: OotOnlineStorageClient = new OotOnlineStorageClient;
    models: ModelManager;

    constructor() {
        this.core = new MMCore();
        this.puppets = new PuppetOverlord(this, this.core);
        this.models = new ModelManager();
    }

    // This packet is basically 'where the hell are you?' if a player has a puppet on file but doesn't know what scene its suppose to be in.
    @NetworkHandler('Ooto_SceneRequestPacket')
    onSceneRequest_client(packet: Ooto_SceneRequestPacket) {
        if (this.core.save !== undefined) {
            this.ModLoader.clientSide.sendPacketToSpecificPlayer(
                new Ooto_ScenePacket(
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
        let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            evt.lobby,
            this
        ) as OotOnlineStorage;
        if (storage === null) {
            return;
        }
        storage.players[evt.player.uuid] = -1;
        storage.networkPlayerInstances[evt.player.uuid] = evt.player;
    }

    @EventHandler(EventsServer.ON_LOBBY_LEAVE)
    onPlayerLeft_server(evt: EventServerLeft) {
        let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
            evt.lobby,
            this
        ) as OotOnlineStorage;
        if (storage === null) {
            return;
        }
        delete storage.players[evt.player.uuid];
        delete storage.networkPlayerInstances[evt.player.uuid];
    }

    sendPacketToPlayersInScene(packet: IPacketHeader) {
        try {
            let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this
            ) as OotOnlineStorage;
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
    }

    @EventHandler(EventsServer.ON_LOBBY_CREATE)
    onLobbyCreated(lobby: string) {
        try {
            this.ModLoader.lobbyManager.createLobbyStorage(
                lobby,
                this,
                new OotOnlineStorage()
            );
        } catch (err) {
            this.ModLoader.logger.error(err);
        }
    }

    @EventHandler(OotEvents.ON_SCENE_CHANGE)
    onSceneChange(scene: number) {
        this.ModLoader.logger.debug(scene.toString(16));
        this.ModLoader.clientSide.sendPacket(
            new Ooto_ScenePacket(
                this.ModLoader.clientLobby,
                scene,
                this.core.save.form
            )
        );
    }

    @ServerNetworkHandler('Ooto_ScenePacket')
    onSceneChange_server(packet: Ooto_ScenePacket) {
        try {
            let storage: OotOnlineStorage = this.ModLoader.lobbyManager.getLobbyStorage(
                packet.lobby,
                this
            ) as OotOnlineStorage;
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
            bus.emit(OotOnlineEvents.SERVER_PLAYER_CHANGED_SCENES, new OotOnline_PlayerScene(packet.player, packet.lobby, packet.scene));
        } catch (err) {
            console.log(err);
        }
    }

    @NetworkHandler('Ooto_ScenePacket')
    onSceneChange_client(packet: Ooto_ScenePacket) {
        this.ModLoader.logger.info('client receive: Player ' + packet.player.nickname + ' moved to scene ' + packet.scene + '.');
        bus.emit(
            OotOnlineEvents.CLIENT_REMOTE_PLAYER_CHANGED_SCENES,
            new OotOnline_PlayerScene(packet.player, packet.lobby, packet.scene)
        );
    }

    @EventHandler(OotEvents.ON_LOADING_ZONE)
    onLoadingZone(evt: any) {
        this.ModLoader.logger.debug("I've touched a loading zone.");
    }

    @EventHandler(OotEvents.ON_AGE_CHANGE)
    onAgeChange(age: MMForms) {
        this.ModLoader.clientSide.sendPacket(
            new Ooto_ScenePacket(
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

module.exports = MMARO;