import { IPacketHeader, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { bus } from 'modloader64_api/EventHandler';
import { MMOnlineStorageClient as MMOnlineStorageClient } from 'src/MMO/MMOnlineStorageClient';

export enum MMOnlineEvents {
  PLAYER_PUPPET_PRESPAWN = 'MMOnline:onPlayerPuppetPreSpawned',
  PLAYER_PUPPET_SPAWNED = 'MMOnline:onPlayerPuppetSpawned',
  PLAYER_PUPPET_DESPAWNED = 'MMOnline:onPlayerPuppetDespawned',
  SERVER_PLAYER_CHANGED_SCENES = 'MMOnline:onServerPlayerChangedScenes',
  CLIENT_REMOTE_PLAYER_CHANGED_SCENES = 'MMOnline:onRemotePlayerChangedScenes',
  GHOST_MODE = 'MMOnline:EnableGhostMode',
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
  ON_REGISTER_EMOTE = 'MMOnline:OnRegisterEmote'
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
  clientStorage: MMOnlineStorageClient;
}

export function MMOnlineAPI_EnableGhostMode() {
  bus.emit(MMOnlineEvents.GHOST_MODE, {});
}

export interface ICustomEquipment {
  zobj: string;
  txt: string;
}
