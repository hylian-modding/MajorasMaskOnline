import { IPlugin, IModLoaderAPI, IPluginServerConfig, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { EventHandler, bus, EventsServer, EventsClient, EventServerJoined, EventServerLeft } from 'modloader64_api/EventHandler';
import { IMMOnlineHelpers, MMOnlineEvents, MMOnline_PlayerScene } from './MMOAPI/MMOAPI';


// @Drahsid TODO: Move to Z64lib?
import { MMO_ScenePacket, MMO_SceneRequestPacket } from './data/MMOPackets';
import { MMOnlineStorage } from './MMOnlineStorage';

import { MMOnlineStorageClient } from './MMOnlineStorageClient';
import { IPacketHeader, ServerNetworkHandler, NetworkHandler, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { zzstatic } from './Z64Lib/API/zzstatic';
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
import { IOvlPayloadResult } from 'MajorasMask/API/MMAPI';

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

class MMOnline implements IPlugin, IMMOnlineHelpers, IPluginServerConfig {
    
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

    }



    onTick(frame?: number): void {
        if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid()) return;
        printf(this.ModLoader)
    }

    @EventHandler(EventsClient.ON_PAYLOAD_INJECTED)
    onPayload(evt: any) {
        if (path.parse(evt.file).ext === ".ovl") {
            let result: IOvlPayloadResult = evt.result;
            this.clientStorage.overlayCache[evt.file] = result;
        }
        if (evt.file === "link.ovl") {
            let result: IOvlPayloadResult = evt.result;
            this.ModLoader.emulator.rdramWrite32(0x80800000, result.params);
        }
    }

    getServerURL(): string {
        return "192.99.70.23:8035";
    }
}

module.exports = MMOnline;

export default MMOnline;