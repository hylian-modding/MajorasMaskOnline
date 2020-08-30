import { MMOnlineStorageBase } from './MMOnlineStorageBase';
import * as API from 'MajorasMask/API/MMAPI';

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
  childModel: Buffer = Buffer.alloc(1);
  adultModel: Buffer = Buffer.alloc(1);
  equipmentModel: Buffer = Buffer.alloc(1);
  adultIcon: Buffer = Buffer.alloc(1);
  childIcon: Buffer = Buffer.alloc(1);
  overlayCache: any = {};
  localization: any = {};
  scene_keys: any = {};
  first_time_sync = false;
  timeSync = false;
}
