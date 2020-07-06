import { IPacketHeader, INetworkPlayer } from 'modloader64_api/NetworkHandler';

export const enum MMO_EVENTS{
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
  CUSTOM_ICONS_APPLIED = "MMOnline:CUSTOM_ICONS_APPLIED",
  ON_INVENTORY_UPDATE = 'MMOnline:OnInventoryUpdate',
  ON_EXTERNAL_ACTOR_SYNC_LOAD = 'MMOnline:OnExternalActorSyncLoad',
  ON_REGISTER_EMOTE = 'MMOnline:OnRegisterEmote'
}

export class MMO_PlayerScene {
    player: INetworkPlayer;
    lobby: string;
    scene: number;
  
    constructor(player: INetworkPlayer, lobby: string, scene: number) {
      this.player = player;
      this.scene = scene;
      this.lobby = lobby;
    }
  }

export class MMO_CHILD_MODEL_EVENT{
    file: string;
    isAdultHeight: boolean;

    constructor(file: string, isAdultHeight = false){
        this.file = file;
        this.isAdultHeight = isAdultHeight;
    }
}