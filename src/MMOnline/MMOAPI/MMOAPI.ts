import { IPacketHeader, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { bus } from 'modloader64_api/EventHandler';
import { MMOnlineStorageClient as MMOnlineStorageClient } from '../MMOnlineStorageClient';

export enum MMOnlineEvents {
  PLAYER_PUPPET_PRESPAWN = 'MMOnline:onPlayerPuppetPreSpawned',
  PLAYER_PUPPET_SPAWNED = 'MMOnline:onPlayerPuppetSpawned',
  PLAYER_PUPPET_DESPAWNED = 'MMOnline:onPlayerPuppetDespawned',
  SERVER_PLAYER_CHANGED_SCENES = 'MMOnline:onServerPlayerChangedScenes',
  CLIENT_REMOTE_PLAYER_CHANGED_SCENES = 'MMOnline:onRemotePlayerChangedScenes',
  GAINED_HEART_CONTAINER = 'MMOnline:GainedHeartContainer',
  GAINED_PIECE_OF_HEART = 'MMOnline:GainedPieceOfHeart',
  MAGIC_METER_INCREASED = 'MMOnline:GainedMagicMeter',
  CUSTOM_MODEL_APPLIED_ADULT = 'MMOnline:ApplyCustomModelAdult',
  CUSTOM_MODEL_APPLIED_CHILD = 'MMOnline:ApplyCustomModelChild',
  CUSTOM_MODEL_APPLIED_ANIMATIONS = 'MMOnline:ApplyCustomAnims',
  CUSTOM_MODEL_APPLIED_ICON_ADULT = 'MMOnline:ApplyCustomIconAdult',
  CUSTOM_MODEL_APPLIED_ICON_CHILD = 'MMOnline:ApplyCustomIconChild',
  CUSTOM_MODEL_APPLIED_EQUIPMENT = "MMOnline:ApplyCustomEquipment",
  CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SWORD_BACK = "MMOnline:CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SWORD_BACK",
  CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SHIELD_BACK = "MMOnline:CUSTOM_MODEL_APPLIED_ADULT_MATRIX_MATRIX_SHIELD_BACK",
  CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SWORD_BACK = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SWORD_BACK",
  CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SHIELD_BACK = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SHIELD_BACK",
  CUSTOM_MODEL_APPLIED_CHILD_MATRIX_ITEM_SHIELD = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_ITEM_SHIELD",
  ON_INVENTORY_UPDATE = 'MMOnline:OnInventoryUpdate',
  ON_EXTERNAL_ACTOR_SYNC_LOAD = 'MMOnline:OnExternalActorSyncLoad',
  ON_REGISTER_EMOTE = 'MMOnline:OnRegisterEmote',
  ON_PLAYER_TIME_UPDATE = "MMOnline:OnPlayerTimeUpdate",
  CUSTOM_MODEL_OVERRIDE_ADULT = 'MMOnline:OverrideCustomModelAdult',
  CUSTOM_MODEL_OVERRIDE_CHILD = 'MMOnline:OverrideCustomModelChild',
  ON_LOAD_SOUND_PACK = "OotOnline:OnLoadSoundPack",
  ON_REMOTE_SOUND_PACK = "OotOnline:OnRemoteSoundPack",
  ON_REMOTE_PLAY_SOUND = "OotOnline:OnRemotePlaySound",
}

export class MMOnline_PlayerScene {
  player: INetworkPlayer;
  lobby: string;
  scene: number;

  constructor(player: INetworkPlayer, lobby: string, scene: number) {
    this.player = player;
    this.scene = scene;
    this.lobby = lobby;
  }
}

export interface IMMOnlineHelpers {
  sendPacketToPlayersInScene(packet: IPacketHeader): void;
  getClientStorage(): MMOnlineStorageClient | null;
}

export class MMO_CHILD_MODEL_EVENT{
  file: string;
  isAdultHeight: boolean;

  constructor(file: string, isAdultHeight = false){
      this.file = file;
      this.isAdultHeight = isAdultHeight;
  }
}

export interface ICustomEquipment {
  zobj: string;
  txt: string;
}

export class RemoteSoundPlayRequest{

  player: INetworkPlayer;
  puppet: any;
  sound_id: number;
  isCanceled: boolean = false;

  constructor(player: INetworkPlayer, puppet: any, sound_id: number){
    this.player = player;
    this.puppet = puppet;
    this.sound_id = sound_id;
  }
}