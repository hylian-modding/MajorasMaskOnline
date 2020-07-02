import { MMOnlineStorageBase } from './MMOnlineStorageBase';

export class MMOnlineStorage extends MMOnlineStorageBase {
  networkPlayerInstances: any = {};
  players: any = {};
  saveGameSetup = false;
}
