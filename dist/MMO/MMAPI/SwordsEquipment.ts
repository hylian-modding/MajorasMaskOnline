import IMemory from 'modloader64_api/IMemory';
import { ISwords } from './MMAPI';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export const enum SwordBitMap {
  KOKIRI = 7,
  RAZOR = 6,
  GILDED = 5
}

export class SwordsEquipment extends JSONTemplate implements ISwords {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private equipment_addr: number = this.instance + 0x009c + 1;
  jsonFields: string[] = [
      'kokiriSword',
      'razorSword',
      'gildedSword',
  ];
  constructor(emulator: IMemory) {
      super();
      this.emulator = emulator;
  }
  get kokiriSword() {
      return this.emulator.rdramReadBit8(this.equipment_addr, SwordBitMap.KOKIRI);
  }
  set kokiriSword(bool: boolean) {
      this.emulator.rdramWriteBit8(this.equipment_addr, SwordBitMap.KOKIRI, bool);
  }
  get razorSword() {
      return this.emulator.rdramReadBit8(this.equipment_addr, SwordBitMap.RAZOR);
  }
  set razorSword(bool: boolean) {
      this.emulator.rdramWriteBit8(this.equipment_addr, SwordBitMap.RAZOR, bool);
  }
  get gilded() {
      return this.emulator.rdramReadBit8(
          this.equipment_addr,
          SwordBitMap.GILDED
      );
  }
  set gilded(bool: boolean) {
      this.emulator.rdramWriteBit8(
          this.equipment_addr,
          SwordBitMap.GILDED,
          bool
      );
  }
}
