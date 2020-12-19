import { MMOnlineStorageBase } from './MMOnlineStorageBase';
import PlayerSchedule from './data/MMOPlayerSchedule';
import { Texture } from 'modloader64_api/Sylvain/Gfx';
import { vec2, xy } from 'modloader64_api/Sylvain/vec';
import { MMO_ItemGetMessagePacket } from './data/MMOPackets';
import { Z64Online_ModelAllocation } from './Z64OnlineAPI/Z64OnlineAPI';
import * as API from 'MajorasMask/API/Imports';

export class MMOnlineStorageClient extends MMOnlineStorageBase {
  autoSaveHash = '!';
  needs_update = false;
  lastKnownSkullCount = -1;
  bottleCache: API.InventoryItem[] = [
    API.InventoryItem.NONE,
    API.InventoryItem.NONE,
    API.InventoryItem.NONE,
    API.InventoryItem.NONE,
    API.InventoryItem.NONE,
    API.InventoryItem.NONE,
  ];
  adultIcon: Buffer = Buffer.alloc(1);
  childIcon: Buffer = Buffer.alloc(1);
  overlayCache: any = {};
  localization: any = {};
  scene_keys: any = {};
  schedules: any = {};
  schedule: PlayerSchedule = new PlayerSchedule();
  first_time_sync = false;
  syncMode = 0;
  last_time = 0;
  last_day = 0;
  pictoboxAlert: PictoboxPreview = new PictoboxPreview(xy(0, 0));
  flagHash: string = "";
  isMMR: boolean = false;
  isSkulltulaSync = false;
  isFairySync = false;
  isAdultSizedHuman: boolean = false;
  notifBuffer: Array<MMO_ItemGetMessagePacket> = [];
  // Custom model shit do not touch.
  humanModel: Buffer = Buffer.alloc(1);
  humanProxy!: Z64Online_ModelAllocation;
}

export class PictoboxPreview {
  buf: Buffer | undefined;
  image: Texture | undefined;
  pos: vec2;
  size: vec2 = xy(160, 112);
  opacity: number = 255;

  constructor(pos: vec2) {
    this.pos = pos;
  }
}