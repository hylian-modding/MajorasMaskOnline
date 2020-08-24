import { IPlugin, IModLoaderAPI, IPluginServerConfig, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { EventHandler, bus, EventsServer, EventsClient, EventServerJoined, EventServerLeft } from 'modloader64_api/EventHandler';
import { IMMOnlineHelpers, MMOnlineEvents, MMOnline_PlayerScene } from './MMOAPI/MMOAPI';

// @Drahsid TODO: Move to Z64lib?
import { MMO_ScenePacket, MMO_SceneRequestPacket } from './data/MMOPackets';
import { MMOnlineStorage } from './MMOnlineStorage';

import { MMOnlineStorageClient } from './MMOnlineStorageClient';
import { IPacketHeader, ServerNetworkHandler, NetworkHandler, INetworkPlayer } from 'modloader64_api/NetworkHandler';
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
import { SidedProxy, ProxySide } from 'modloader64_api/SidedProxy/SidedProxy';
import { MMOnlineClient } from './MMOnlineClient';
import { MMOnlineServer } from './MMOnlineServer';
import { InjectCore } from 'modloader64_api/CoreInjection';
import * as API from 'MajorasMask/API/MMAPI';


export const SCENE_ARR_SIZE = 0xD20;
export const EVENT_ARR_SIZE = 0x8;
export const ITEM_FLAG_ARR_SIZE = 0x18;
export const MASK_FLAG_ARR_SIZE = 0x18;
export const WEEK_EVENT_ARR_SIZE = 0x64;

export interface IMMOnlineLobbyConfig {
    data_syncing: boolean;
    actor_syncing: boolean;
    key_syncing: boolean;
}

export class MMOnlineConfigCategory {
    mapTracker: boolean = false;
    keySync: boolean = true;
}

export class MMOnline implements IPlugin, IMMOnlineHelpers, IPluginServerConfig {
    
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: API.IMMCore;
    @SidedProxy(ProxySide.CLIENT, MMOnlineClient)
    client!: MMOnlineClient;
    @SidedProxy(ProxySide.SERVER, MMOnlineServer)
    server!: MMOnlineServer;

    // Storage
    LobbyConfig: IMMOnlineLobbyConfig = {} as IMMOnlineLobbyConfig;
    clientStorage: MMOnlineStorageClient = new MMOnlineStorageClient();

    sendPacketToPlayersInScene(packet: IPacketHeader): void {
        if (this.server !== undefined) {
          this.server.sendPacketToPlayersInScene(packet);
        }
      }  

    getClientStorage(): MMOnlineStorageClient | null {
        return this.client !== undefined ? this.client.clientStorage : null;
    }

    preinit(): void { }

    init(): void { }

    postinit(): void {
        this.writeModel();
    }

    writeModel() {
        // These use the MM adult format.
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


    /*@EventHandler(EventsClient.ON_PAYLOAD_INJECTED)
    onPayload(evt: any) {
        let f = path.parse(evt.file);
        if (f.ext === ".ovl") {
            if (f.name === "link") {
                this.ModLoader.logger.info("Puppet assigned.");
                this.ModLoader.emulator.rdramWrite16(0x800000, evt.result);
            }
        }
    }*/

    getServerURL(): string {
        return "192.99.70.23:8035";
    }
}

module.exports = MMOnline;

export default MMOnline;