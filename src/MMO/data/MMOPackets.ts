import {
  Packet,
  packetHelper,
  UDPPacket,
} from 'modloader64_api/ModLoaderDefaultImpls';
import { PuppetData } from './linkPuppet/PuppetData';
import { HorseData } from './linkPuppet/HorseData';
import { MMForms } from 'src/MMO/MMAPI/mmForms';
import { InventoryItem } from '@MMARO/MMAPI/MMAPI';
import { InventorySave, IEquipmentSave, IQuestSave, IDungeonItemSave } from './MMOSaveData';

export class MMO_PuppetPacket{
  data: PuppetData;
  horse_data!: HorseData;

  constructor(puppetData: PuppetData, lobby: string) {
    this.data = puppetData;
  }

  setHorseData(horse: HorseData){
    this.horse_data = horse;
  }
}

  export class MMO_SubscreenSyncPacket extends Packet {
    inventory: InventorySave;
    equipment: IEquipmentSave;
    quest: IQuestSave;
    dungeonItems: IDungeonItemSave;

    constructor(
      save: InventorySave,
      equipment: IEquipmentSave,
      quest: IQuestSave,
      dungeonItems: IDungeonItemSave,
      lobby: string
    ) {
      super('MMO_SubscreenSyncPacket', 'MMOnline', lobby, false);
      this.inventory = save;
      this.equipment = equipment;
      this.quest = quest;
      this.dungeonItems = dungeonItems;
    }
  }

  export class MMO_DownloadResponsePacket extends Packet {
    subscreen: MMO_SubscreenSyncPacket;
    flags: MMO_ServerFlagUpdate;
    bank: MMO_BankSyncPacket;
  
    constructor(
      subscreen: MMO_SubscreenSyncPacket,
      scenes: MMO_ServerFlagUpdate,
      bank: MMO_BankSyncPacket,
      lobby: string
    ) {
      super('MMO_DownloadResponsePacket', 'MMOnline', lobby, false);
      this.subscreen = subscreen;
      this.flags = scenes;
      this.bank = bank;
      packetHelper.cloneDestination(this, this.subscreen);
      packetHelper.cloneDestination(this, this.flags);
      packetHelper.cloneDestination(this, this.bank);
    }
  }

export class MMO_PuppetWrapperPacket extends UDPPacket{

  data: string;

  constructor(packet: MMO_PuppetPacket, lobby: string) {
    super('MMO_PuppetPacket', 'MMOnline', lobby, false);
    this.data = JSON.stringify(packet);
  }
}

export class MMO_ScenePacket extends Packet {
  scene: number;
  form: MMForms;

  constructor(lobby: string, scene: number, form: MMForms) {
    super('MMO_ScenePacket', 'MMOnline', lobby, true);
    this.scene = scene;
    this.form = form;
  }
}

export class MMO_SceneRequestPacket extends Packet {
  constructor(lobby: string) {
    super('MMO_SceneRequestPacket', 'MMOnline', lobby, true);
  }
}

export class MMO_BankSyncPacket extends Packet{
  savings: number;

  constructor(saving: number, lobby: string){
    super('MMO_BankSyncPacket', 'MMOnline', lobby, true);
    this.savings = saving;
  }
}

export class MMO_DownloadResponsePacket2 extends Packet {
  constructor(lobby: string) {
    super('MMO_DownloadResponsePacket2', 'MMOnline', lobby, false);
  }
}

export class MMO_DownloadRequestPacket extends Packet {
  constructor(lobby: string) {
    super('MMO_DownloadRequestPacket', 'MMOnline', lobby, false);
  }
}

export class MMO_ClientFlagUpdate extends Packet {
  scenes: any;
  events: any;
  items: any;
  inf: any;
  skulltulas: any;

  constructor(
    scenes: any,
    events: any,
    items: any,
    inf: any,
    skulltulas: any,
    lobby: string
  ) {
    super('MMO_ClientFlagUpdate', 'MMOnline', lobby, false);
    this.scenes = scenes;
    this.events = events;
    this.items = items;
    this.inf = inf;
    this.skulltulas = skulltulas;
  }
}

export class MMO_ServerFlagUpdate extends Packet {
  scenes: Buffer;
  events: Buffer;
  items: Buffer;
  inf: Buffer;
  skulltulas: Buffer;

  constructor(
    scenes: Buffer,
    events: Buffer,
    items: Buffer,
    inf: Buffer,
    skulltulas: Buffer,
    lobby: string
  ) {
    super('MMO_ServerFlagUpdate', 'MMOnline', lobby, false);
    this.scenes = scenes;
    this.events = events;
    this.items = items;
    this.inf = inf;
    this.skulltulas = skulltulas;
  }
}

export class MMO_ClientSceneContextUpdate extends Packet {
  chests: Buffer;
  switches: Buffer;
  collect: Buffer;
  clear: Buffer;
  temp: Buffer;

  constructor(
    chests: Buffer,
    switches: Buffer,
    collect: Buffer,
    clear: Buffer,
    temp: Buffer,
    lobby: string
  ) {
    super('MMO_ClientSceneContextUpdate', 'MMOnline', lobby, false);
    this.chests = chests;
    this.switches = switches;
    this.collect = collect;
    this.clear = clear;
    this.temp = temp;
  }
}

export class MMO_ActorDeadPacket extends Packet {
  actorUUID: string;
  scene: number;
  room: number;

  constructor(aid: string, scene: number, room: number, lobby: string) {
    super('MMO_ActorDeadPacket', 'MMOnline', lobby, true);
    this.actorUUID = aid;
    this.scene = scene;
    this.room = room;
  }
}

export class MMO_AllocateModelPacket extends Packet {
  model: Buffer;
  form: MMForms;

  constructor(model: Buffer, form: MMForms, lobby: string) {
    super('MMO_AllocateModelPacket', 'MMOnline', lobby, true);
    this.model = model;
    this.form = form;
  }
}

export class MMO_DownloadAllModelsPacket extends Packet {
  models: any;

  constructor(models: any, lobby: string) {
    super('MMO_DownloadAllModelsPacket', 'MMOnline', lobby, false);
    this.models = models;
  }
}

export class MMO_BottleUpdatePacket extends Packet {
  slot: number;
  contents: InventoryItem;

  constructor(slot: number, contents: InventoryItem, lobby: string) {
    super('MMO_BottleUpdatePacket', 'MMOnline', lobby, true);
    this.slot = slot;
    this.contents = contents;
  }
}

export class MMO_IconAllocatePacket extends Packet {
  icon: Buffer;
  form: MMForms;

  constructor(buf: Buffer, form: MMForms, lobby: string) {
    super('MMO_IconAllocatePacket', 'MMOnline', lobby, true);
    this.icon = buf;
    this.form = form;
  }
}

export class MMO_SceneGUIPacket extends Packet {
  scene: number;
  form: MMForms;
  iconAdult!: string;
  iconChild!: string;

  constructor(
    scene: number,
    form: MMForms,
    lobby: string,
    iconAdult?: Buffer,
    iconChild?: Buffer
  ) {
    super('MMO_SceneGUIPacket', 'MMOnline', lobby, false);
    this.scene = scene;
    this.form = form;
    if (iconAdult !== undefined) {
      this.iconAdult = iconAdult.toString('base64');
    }
    if (iconChild !== undefined) {
      this.iconChild = iconChild.toString('base64');
    }
  }

  setAdultIcon(iconAdult: Buffer) {
    this.iconAdult = iconAdult.toString('base64');
  }

  setChildIcon(iconChild: Buffer) {
    this.iconChild = iconChild.toString('base64');
  }
}