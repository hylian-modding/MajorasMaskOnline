import { MMOnlineStorageBase } from './MMOnlineStorageBase';
import { NUM_SCHEDULE_TICKS, NUM_SCHEDULE_RECORD_TICKS, PlayerScheduleData, PlayerSchedule } from './data/MMOPlayerSchedule'

export class MMOnlineStorage extends MMOnlineStorageBase {
  networkPlayerInstances: any = {};
  players: any = {};
  saveGameSetup = false;
}