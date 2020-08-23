import IMemory from 'modloader64_api/IMemory';
import * as API from '../API/Imports';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export const enum ShieldBitMap {
  HEROES = 2,
  MIRROR = 1,
}

export class ShieldsEquipment extends JSONTemplate implements API.IShields {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;
  jsonFields: string[] = ['heroesShield', 'mirrorShield'];
  constructor(emulator: IMemory) {
      super();
      this.emulator = emulator;
  }
  set heroesShield(bool: boolean) {
      this.emulator.rdramWriteBit8(this.equipment_addr, ShieldBitMap.HEROES, bool);
  }
  get heroesShield(): boolean {
      return this.emulator.rdramReadBit8(this.equipment_addr, ShieldBitMap.HEROES);
  }
  set mirrorShield(bool: boolean) {
      this.emulator.rdramWriteBit8(
          this.equipment_addr,
          ShieldBitMap.MIRROR,
          bool
      );
  }
  get mirrorShield(): boolean {
      return this.emulator.rdramReadBit8(
          this.equipment_addr,
          ShieldBitMap.MIRROR
      );
  }
}
