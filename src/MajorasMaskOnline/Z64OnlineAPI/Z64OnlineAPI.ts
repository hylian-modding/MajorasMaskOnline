import { IPacketHeader, INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { bus } from 'modloader64_api/EventHandler';
import { Age } from 'modloader64_api/OOT/OOTAPI';
import { Packet } from 'modloader64_api/ModLoaderDefaultImpls';
import { MMOnlineStorageClient } from '@MajorasMaskOnline/MMOnlineStorageClient';
import { Puppet } from '@MajorasMaskOnline/data/linkPuppet/Puppet';
import { MMForms } from 'MajorasMask/API/MMAPI';

export enum Z64OnlineEvents {
  PLAYER_PUPPET_PRESPAWN = 'MMOnline:onPlayerPuppetPreSpawned',
  PLAYER_PUPPET_SPAWNED = 'MMOnline:onPlayerPuppetSpawned',
  PLAYER_PUPPET_DESPAWNED = 'MMOnline:onPlayerPuppetDespawned',
  PLAYER_PUPPET_QUERY = "MMOnline:PlayerPuppetQuery",
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
  ON_INVENTORY_UPDATE = 'MMOnline:OnInventoryUpdate',
  ON_EXTERNAL_ACTOR_SYNC_LOAD = 'MMOnline:OnExternalActorSyncLoad',
  ON_REGISTER_EMOTE = 'MMOnline:OnRegisterEmote',
  ON_LOAD_SOUND_PACK = "MMOnline:OnLoadSoundPack",
  ON_REMOTE_SOUND_PACK = "MMOnline:OnRemoteSoundPack",
  ON_REMOTE_PLAY_SOUND = "MMOnline:OnRemotePlaySound",
  CUSTOM_MODEL_LOAD_BUFFER_ADULT = "MMOnline:ApplyCustomModelAdultBuffer",
  CUSTOM_MODEL_LOAD_BUFFER_CHILD = "MMOnline:ApplyCustomModelChildBuffer",
  ALLOCATE_MODEL_BLOCK = "MMOnline:AllocateModelBlock",
  FORCE_LOAD_MODEL_BLOCK = "MMOnline:ForceLoadModelBlock",
  CHANGE_CUSTOM_MODEL_ADULT_GAMEPLAY = "MMOnline:ChangeCustomModelAdultGamePlay",
  CHANGE_CUSTOM_MODEL_CHILD_GAMEPLAY = "MMOnline:ChangeCustomModelChildGamePlay",
  FORCE_PUPPET_RESPAWN_IMMEDIATE = "MMOnline:ForcePuppetRespawnImmediate",
  POST_LOADED_MODELS_LIST = "MMOnline:PostLoadedModelsList",
  LOAD_EQUIPMENT_BUFFER = "MMOnline:LoadEquipmentBuffer",
  LOAD_EQUIPMENT_PAK = "MMOnline:LoadEquipmentPak",
  REFRESH_EQUIPMENT = "MMOnline:RefreshEquipment",
  CLEAR_EQUIPMENT = "MMOnline:ClearEquipment",
  SWORD_NEEDS_UPDATE = "MmOnline:UpdateSwordB"
}

export class RemoteSoundPlayRequest {

  player: INetworkPlayer;
  puppet: any;
  sound_id: number;
  isCanceled: boolean = false;

  constructor(player: INetworkPlayer, puppet: any, sound_id: number) {
    this.player = player;
    this.puppet = puppet;
    this.sound_id = sound_id;
  }
}

export interface Z64Emote_Emote {
  name: string;
  buf: Buffer;
  sound?: Buffer;
  builtIn?: boolean;
}

export class Z64_PlayerScene {
  player: INetworkPlayer;
  lobby: string;
  scene: number;

  constructor(player: INetworkPlayer, lobby: string, scene: number) {
    this.player = player;
    this.scene = scene;
    this.lobby = lobby;
  }
}

export interface IZ64OnlineHelpers {
  sendPacketToPlayersInScene(packet: IPacketHeader): void;
  getClientStorage(): MMOnlineStorageClient | null;
}

export function Z64OnlineAPI_EnableGhostMode() {
  bus.emit(Z64OnlineEvents.GHOST_MODE, {});
}

export interface PuppetQuery {
  puppet: Puppet | undefined;
  player: INetworkPlayer;
}

export function Z64OnlineAPI_QueryPuppet(player: INetworkPlayer): PuppetQuery {
  let evt: PuppetQuery = { puppet: undefined, player } as PuppetQuery;
  bus.emit(Z64OnlineEvents.PLAYER_PUPPET_QUERY, evt);
  return evt;
}

export class Z64Online_ModelAllocation {
  model: Buffer;
  age: MMForms;
  slot!: number;
  pointer!: number;
  rom!: number;

  constructor(model: Buffer, age: MMForms) {
    this.model = model;
    this.age = age;
  }
}

export class Z64Online_EquipmentPak {
  name: string;
  data: Buffer;

  constructor(name: string, data: Buffer) {
    this.name = name;
    this.data = data;
  }
}

export class Z64_AllocateModelPacket extends Packet {
  model: Buffer;
  age: MMForms;
  hash: string;

  constructor(model: Buffer, age: MMForms, lobby: string, hash: string) {
    super('Z64OnlineLib_AllocateModelPacket', 'Z64OnlineLib', lobby, true);
    this.model = model;
    this.age = age;
    this.hash = hash;
  }
}

export class Z64_ModifyModelPacket extends Packet {
  mod: Buffer;
  offset: number;
  age: MMForms;

  constructor(lobby: string, mod: Buffer, offset: number, age: MMForms) {
    super('Z64OnlineLib_ModifyModelPacket', 'Z64OnlineLib', lobby, false);
    this.mod = mod;
    this.offset = offset;
    this.age = age;
  }
}

export class Z64_GiveModelPacket extends Packet {

  target: INetworkPlayer;

  constructor(lobby: string, player: INetworkPlayer) {
    super('Z64OnlineLib_GiveModelPacket', 'Z64OnlineLib', lobby, true);
    this.target = player;
  }
}

export class Z64_IconAllocatePacket extends Packet {
  icon: Buffer;
  age: MMForms;
  hash: string;

  constructor(buf: Buffer, age: MMForms, lobby: string, hash: string) {
    super('Z64OnlineLib_IconAllocatePacket', 'Z64OnlineLib', lobby, true);
    this.icon = buf;
    this.age = age;
    this.hash = hash;
  }
}

export class Z64_EquipmentPakPacket extends Packet {
  zobjs: Array<Buffer> = [];
  age: MMForms;

  constructor(age: MMForms, lobby: string) {
    super('Z64OnlineLib_EquipmentPakPacket', 'Z64OnlineLib', lobby, true);
    this.age = age;
  }
}