import IMemory from 'modloader64_api/IMemory';
import * as MMAPI from './MMAPI';

export class KeyManager implements MMAPI.IKeyManager {
  private readonly KEY_ARRAY_ADDR: number =
    global.ModLoader['save_context'] + 0xbc;
  private readonly KEY_ARRAY_SIZE: number = 0x14;
  private readonly emulator: IMemory;

  constructor(emulator: IMemory) {
      this.emulator = emulator;
  }

  getKeyCountForIndex(index: number): number {
      if (index > this.KEY_ARRAY_ADDR) {
          return MMAPI.NO_KEYS;
      }
      return this.emulator.rdramRead8(this.KEY_ARRAY_ADDR + index);
  }

  setKeyCountByIndex(index: number, count: number): void {
      if (index > this.KEY_ARRAY_ADDR) {
          return;
      }
      this.emulator.rdramWrite8(this.KEY_ARRAY_ADDR + index, count);
  }

  getRawKeyBuffer(): Buffer {
      return this.emulator.rdramReadBuffer(
          this.KEY_ARRAY_ADDR,
          this.KEY_ARRAY_SIZE
      );
  }
}
