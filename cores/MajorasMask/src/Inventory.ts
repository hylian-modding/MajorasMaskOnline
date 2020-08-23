import IMemory from 'modloader64_api/IMemory';
import * as API from '../API/Imports';
import { FlagManager } from 'modloader64_api/FlagManager';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { ILogger } from 'modloader64_api/IModLoaderAPI';
import { NONAME } from 'dns';

export class Inventory extends JSONTemplate implements API.IInventory {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private inventory_addr: number = this.instance + 0x0074;
  private inventory_ammo_addr: number = this.instance + 0x008c;
  private inventory_upgrades_addr: number = this.instance + 0x00a0;
  private log: ILogger;
  jsonFields: string[] = [
      'dekuSticksCapacity',
      'dekuNutsCapacity',
      'bombBag',
      'quiver',
      'FIELD_OCARINA',
      'FIELD_HEROES_BOW',
      'FIELD_FIRE_ARROW',
      'FIELD_ICE_ARROW',
      'FIELD_LIGHT_ARROW',
      'FIELD_EVENT_ITEM_1',
      'FIELD_BOMB',
      'FIELD_BOMBCHU',
      'FIELD_DEKU_STICKS',
      'FIELD_DEKU_NUT',
      'FIELD_MAGIC_BEAN',
      'FIELD_EVENT_ITEM_2',
      'FIELD_POWDER_KEG',
      'FIELD_PICTOGRAPH_BOX',
      'FIELD_LENS_OF_TRUTH',
      'FIELD_HOOKSHOT',
      'FIELD_GREAT_FAIRYS_SWORD',
      'FIELD_EVENT_ITEM_3',
      'FIELD_BOTTLE1',
      'FIELD_BOTTLE2',
      'FIELD_BOTTLE3',
      'FIELD_BOTTLE4',
      'FIELD_BOTTLE5',
      'FIELD_BOTTLE6'
  ];

  constructor(emu: IMemory, log: ILogger) {
      super();
      this.emulator = emu;
      this.log = log;
  }

    get FIELD_OCARINA(): API.Ocarina {
        let val = this.getItemInSlot(API.InventoryItem.OCARINA_OF_TIME)
        if(val) return API.Ocarina.OCARINA_OF_TIME;
        return API.Ocarina.NONE;
    }
    set FIELD_OCARINA(ocarina: API.Ocarina) {
        let value = ocarina ? API.InventoryItem.OCARINA_OF_TIME : API.InventoryItem.NONE;
        this.setItemInSlot(value,  API.InventorySlots.OCARINA_OF_TIME);
    }

    get FIELD_HEROES_BOW(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.HEROES_BOW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_HEROES_BOW(bow: boolean) {
        let value = bow ? API.InventoryItem.HEROES_BOW : API.InventoryItem.NONE;
        this.setItemInSlot(value,  API.InventorySlots.HEROES_BOW)
    }

    get FIELD_FIRE_ARROW(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_FIRE_ARROW(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_ICE_ARROW(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_ICE_ARROW(bool: boolean) {
        let value = bool ? API.InventoryItem.ICE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.ICE_ARROW)
    }

    get FIELD_LIGHT_ARROW(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_LIGHT_ARROW(lightA: boolean) {
        let value = lightA ? API.InventoryItem.LIGHT_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.LIGHT_ARROW)
    }

    get FIELD_BOMB(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_BOMB(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_BOMBCHU(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_BOMBCHU(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_DEKU_STICKS(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_DEKU_STICKS(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_DEKU_NUT(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_DEKU_NUT(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_MAGIC_BEAN(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_MAGIC_BEAN(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_POWDER_KEG(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_POWDER_KEG(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_PICTOGRAPH_BOX(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_PICTOGRAPH_BOX(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_LENS_OF_TRUTH(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_LENS_OF_TRUTH(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_HOOKSHOT(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_HOOKSHOT(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    get FIELD_GREAT_FAIRYS_SWORD(): boolean {
        let val = this.getItemInSlot(API.InventoryItem.FIRE_ARROW)
        return !(val === API.InventoryItem.NONE);
    }
    set FIELD_GREAT_FAIRYS_SWORD(bool: boolean) {
        let value = bool ? API.InventoryItem.FIRE_ARROW : API.InventoryItem.NONE;
        this.setItemInSlot(value, API.InventoryItem.FIRE_ARROW)
    }

    isChildTradeFinished(): boolean {
        throw new Error("Method not implemented.");
    }
    isAdultTradeFinished(): boolean {
        throw new Error("Method not implemented.");
    }

    set bombBag(bb:  API.AmmoUpgrade) {
        let buf: Buffer = this.emulator.rdramReadBits8(
            this.inventory_upgrades_addr + 0x3
        );
        switch (bb) {
        case  API.AmmoUpgrade.NONE:
            buf[0x3] = 0x00;
            buf[0x4] = 0x00;
            break;
        case  API.AmmoUpgrade.BASE:
            buf[0x3] = 0x00;
            buf[0x4] = 0x01;
            break;
        case  API.AmmoUpgrade.UPGRADED:
            buf[0x3] = 0x01;
            buf[0x4] = 0x00;
            break;
        case  API.AmmoUpgrade.MAX:
            buf[0x3] = 0x01;
            buf[0x4] = 0x01;
            break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
    }
    
    get bombBag():  API.AmmoUpgrade {
        let buf: Buffer = this.emulator.rdramReadBits8(
            this.inventory_upgrades_addr + 0x3
        );
        let str = buf.slice(3, 5).toString('hex');
        switch (str) {
        case '0000':
            return  API.AmmoUpgrade.NONE;
        case '0001':
            return  API.AmmoUpgrade.BASE;
        case '0100':
            return  API.AmmoUpgrade.UPGRADED;
        case '0101':
            return  API.AmmoUpgrade.MAX;
        }
        return  API.AmmoUpgrade.NONE;
    }

  set dekuSticksCapacity(bb:  API.AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      switch (bb) {
      case  API.AmmoUpgrade.NONE:
          buf[0x5] = 0x00;
          buf[0x6] = 0x00;
          break;
      case  API.AmmoUpgrade.BASE:
          buf[0x5] = 0x00;
          buf[0x6] = 0x01;
          break;
      case  API.AmmoUpgrade.UPGRADED:
          buf[0x5] = 0x01;
          buf[0x6] = 0x00;
          break;
      case  API.AmmoUpgrade.MAX:
          buf[0x5] = 0x01;
          buf[0x6] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
  }

  get dekuSticksCapacity():  API.AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      let str = buf.slice(5, 7).toString('hex');
      switch (str) {
      case '0000':
          return  API.AmmoUpgrade.NONE;
      case '0001':
          return  API.AmmoUpgrade.BASE;
      case '0100':
          return  API.AmmoUpgrade.UPGRADED;
      case '0101':
          return  API.AmmoUpgrade.MAX;
      }
      return  API.AmmoUpgrade.NONE;
  }

  set dekuNutsCapacity(bb:  API.AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      switch (bb) {
      case  API.AmmoUpgrade.NONE:
          buf[0x2] = 0x00;
          buf[0x3] = 0x00;
          break;
      case  API.AmmoUpgrade.BASE:
          buf[0x2] = 0x00;
          buf[0x3] = 0x01;
          break;
      case  API.AmmoUpgrade.UPGRADED:
          buf[0x2] = 0x01;
          buf[0x3] = 0x00;
          break;
      case  API.AmmoUpgrade.MAX:
          buf[0x2] = 0x01;
          buf[0x3] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
  }

  get dekuNutsCapacity():  API.AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x1
      );
      let str = buf.slice(2, 4).toString('hex');
      switch (str) {
      case '0000':
          return  API.AmmoUpgrade.NONE;
      case '0001':
          return  API.AmmoUpgrade.BASE;
      case '0100':
          return  API.AmmoUpgrade.UPGRADED;
      case '0101':
          return  API.AmmoUpgrade.MAX;
      }
      return  API.AmmoUpgrade.NONE;
  }

  get bulletBag():  API.AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      let str = buf.slice(0, 2).toString('hex');
      switch (str) {
      case '0000':
          return  API.AmmoUpgrade.NONE;
      case '0001':
          return  API.AmmoUpgrade.BASE;
      case '0100':
          return  API.AmmoUpgrade.UPGRADED;
      case '0101':
          return  API.AmmoUpgrade.MAX;
      }
      return  API.AmmoUpgrade.NONE;
  }

  set bulletBag(bb:  API.AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      switch (bb) {
      case  API.AmmoUpgrade.NONE:
          buf[0x0] = 0x00;
          buf[0x1] = 0x00;
          break;
      case  API.AmmoUpgrade.BASE:
          buf[0x0] = 0x00;
          buf[0x1] = 0x01;
          break;
      case  API.AmmoUpgrade.UPGRADED:
          buf[0x0] = 0x01;
          buf[0x1] = 0x00;
          break;
      case  API.AmmoUpgrade.MAX:
          buf[0x0] = 0x01;
          buf[0x1] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
  }

  get quiver():  API.AmmoUpgrade {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      let str = buf.slice(6, 8).toString('hex');
      switch (str) {
      case '0000':
          return  API.AmmoUpgrade.NONE;
      case '0001':
          return  API.AmmoUpgrade.BASE;
      case '0100':
          return  API.AmmoUpgrade.UPGRADED;
      case '0101':
          return  API.AmmoUpgrade.MAX;
      }
      return  API.AmmoUpgrade.NONE;
  }

  set quiver(q:  API.AmmoUpgrade) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x3
      );
      switch (q) {
      case  API.AmmoUpgrade.NONE:
          buf[0x6] = 0x00;
          buf[0x7] = 0x00;
          break;
      case  API.AmmoUpgrade.BASE:
          buf[0x6] = 0x00;
          buf[0x7] = 0x01;
          break;
      case  API.AmmoUpgrade.UPGRADED:
          buf[0x6] = 0x01;
          buf[0x7] = 0x00;
          break;
      case  API.AmmoUpgrade.MAX:
          buf[0x6] = 0x01;
          buf[0x7] = 0x01;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
  }

  get  wallet():  API.Wallet {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      let str = buf.slice(2, 4).toString('hex');
      switch (str) {
      case '0000':
          return  API.Wallet.CHILD;
      case '0001':
          return  API.Wallet.ADULT;
      case '0100':
          return  API.Wallet.GIANT;
      }
      return  API.Wallet.CHILD;
  }

  set  wallet(w:  API.Wallet) {
      let buf: Buffer = this.emulator.rdramReadBits8(
          this.inventory_upgrades_addr + 0x2
      );
      switch (w) {
      case  API.Wallet.CHILD:
          buf[0x2] = 0x00;
          buf[0x3] = 0x00;
          break;
      case  API.Wallet.ADULT:
          buf[0x2] = 0x00;
          buf[0x3] = 0x01;
          break;
      case  API.Wallet.GIANT:
          buf[0x2] = 0x10;
          buf[0x3] = 0x00;
          break;
      }
      this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
  }

  getMaxRupeeCount(): number{
      let addr: number = 0x800F8CEC;
      let capacities: Array<number> = [];
      for (let i = 0; i < 8; i+=2){
          capacities.push(this.emulator.rdramRead16(addr + i));
      }
      return capacities[this.wallet];
  }

get dekuSticksCount(): number {
    return this.getAmmoForSlot( API.InventorySlots.DEKU_STICKS);
}
set dekuSticksCount(count: number) {
    this.setAmmoInSlot( API.InventorySlots.DEKU_STICKS, count);
}

get bombsCount(): number {
    return this.getAmmoForSlot( API.InventorySlots.BOMBS);
}
set bombsCount(count: number) {
    this.setAmmoInSlot( API.InventorySlots.BOMBS, count);
}

get bombchuCount(): number {
    return this.getAmmoForSlot( API.InventorySlots.BOMBCHUS);
}
set bombchuCount(count: number) {
    this.setAmmoInSlot( API.InventorySlots.BOMBCHUS, count);
}

get magicBeansCount(): number {
    return this.getAmmoForSlot( API.InventorySlots.MAGIC_BEANS);
}
set magicBeansCount(count: number) {
    this.setAmmoInSlot( API.InventorySlots.MAGIC_BEANS, count);
}

get arrows(): number {
    return this.getAmmoForSlot( API.InventorySlots.HEROES_BOW);
}
set arrows(count: number) {
    this.setAmmoInSlot( API.InventorySlots.HEROES_BOW, count);
}

  get dekuNutsCount(): number {
      return this.getAmmoForSlot( API.InventorySlots.DEKU_NUTS);
  }
  set dekuNutsCount(count: number) {
      this.setAmmoInSlot( API.InventorySlots.DEKU_NUTS, count);
  }
  
  get FIELD_BOTTLE1(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE1);
  }
  set FIELD_BOTTLE1(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE1);
  }
  get FIELD_BOTTLE2(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE2);
  }
  set FIELD_BOTTLE2(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE2);
  }
  get FIELD_BOTTLE3(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE3);
  }
  set FIELD_BOTTLE3(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE3);
  }
  get FIELD_BOTTLE4(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE4);
  }
  set FIELD_BOTTLE4(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE4);
  }
  
  get FIELD_BOTTLE5(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE4);
  }
  set FIELD_BOTTLE5(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE4);
  }

  get FIELD_BOTTLE6(): API.InventoryItem {
      return this.getItemInSlot( API.InventorySlots.BOTTLE4);
  }
  set FIELD_BOTTLE6(content: API.InventoryItem) {
      if (
          content < API.InventoryItem.BOTTLE_EMPTY ||
      content > API.InventoryItem.BOTTLE_EMPTY
      ) {
          return;
      }
      this.setItemInSlot(content,  API.InventorySlots.BOTTLE4);
  }

  hasBottle(): boolean {
      for (let i =  API.InventorySlots.BOTTLE1; i <=  API.InventorySlots.BOTTLE4; i++) {
          let item: API.InventoryItem = this.getItemInSlot(i);
          if (
              item >= API.InventoryItem.BOTTLE_EMPTY &&
        item <= API.InventoryItem.BOTTLE_POE_SMALL //TODO: Check if Big or Small Poe in-game
          ) {
              return true;
          }
      }
      return false;
  }
  getBottleCount(): number {
      let bottles = 0;
      for (let i =  API.InventorySlots.BOTTLE1; i <=  API.InventorySlots.BOTTLE4; i++) {
          let item: API.InventoryItem = this.getItemInSlot(i);
          if (
              item >= API.InventoryItem.BOTTLE_EMPTY &&
        item <= API.InventoryItem.BOTTLE_POE_SMALL
          ) {
              bottles++;
          }
      }
      return bottles;
  }
  getBottledItems(): API.InventoryItem[] {
      let bottles: API.InventoryItem[] = new Array();
      for (let i =  API.InventorySlots.BOTTLE1; i <=  API.InventorySlots.BOTTLE4; i++) {
          let item: API.InventoryItem = this.getItemInSlot(i);
          if (
              item >= API.InventoryItem.BOTTLE_EMPTY &&
        item <= API.InventoryItem.BOTTLE_POE_SMALL
          ) {
              bottles.push(item);
          }
      }
      return bottles;
  }

    get FIELD_QUEST_ITEM_1(): API.InventoryItem {
        return this.getItemInSlot( API.InventorySlots.EVENT_ITEM_1);
    }
    set FIELD_QUEST_ITEM_1(item: API.InventoryItem) {
        if (item < API.InventoryItem.QSLOT1_MOONS_TEAR || item > API.InventoryItem.QSLOT1_TITLE_DEED_OCEAN) return;
        this.setItemInSlot(item,  API.InventorySlots.EVENT_ITEM_1);
    }

    get FIELD_QUEST_ITEM_2(): API.InventoryItem {
        return this.getItemInSlot( API.InventorySlots.EVENT_ITEM_2);
    }
    set FIELD_QUEST_ITEM_2(item: API.InventoryItem) {
        if (item < API.InventoryItem.QSLOT2_ROOM_KEY || item > API.InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA) {
            return;
        }
        this.setItemInSlot(item,  API.InventorySlots.EVENT_ITEM_2);
    }

    get FIELD_QUEST_ITEM_3(): API.InventoryItem {
        return this.getItemInSlot( API.InventorySlots.EVENT_ITEM_3);
    }
    set FIELD_QUEST_ITEM_3(item: API.InventoryItem) {
        if (item < API.InventoryItem.QSLOT3_LETTER_TO_KAFEI || item > API.InventoryItem.QSLOT3_PENDANT_OF_MEMORIES) {
            return;
        }
        this.setItemInSlot(item,  API.InventorySlots.EVENT_ITEM_3);
    }

    isEvt1TradeFinished(): boolean {
        // This is going to require more complex flag checks
        return true;
    }
    isEvt2TradeFinished(): boolean {
        // This should be done with flags also
        return true;
    }
    isEvt3TradeFinished(): boolean {
        // This should be done with flags also
        return true;
    }
    
  getItemInSlot(slotId: number): API.InventoryItem {
      if (slotId < 0 || slotId >  API.InventorySlots.BOTTLE6) {
          return API.InventoryItem.NONE;
      }

      let itemId: number = this.emulator.rdramRead8(this.inventory_addr + slotId);
      return itemId as API.InventoryItem;
  }
  getSlotForItem(item: API.InventoryItem): number {
      for (let i = 0; i <=  API.InventorySlots.BOTTLE6; i++) {
          if (this.getItemInSlot(i) == item) {
              return i;
          }
      }
      return -1;
  }
  getSlotsForItem(item: API.InventoryItem): number[] {
      let slots: number[] = new Array();
      for (let i = 0; i <=  API.InventorySlots.BOTTLE6; i++) {
          if (this.getItemInSlot(i) == item) {
              slots.push(i);
          }
      }
      return slots;
  }

  hasItem(item: API.InventoryItem): boolean {
      return this.getSlotForItem(item) != -1;
  }

  getAmmoForItem(item: API.InventoryItem): number {
      if (!this.hasAmmo(item)) return 0;

      let ammo = 0;
      let slots: number[] = this.getSlotsForItem(item);
      for (let i = 0; i < slots.length; i++) {
          ammo += this.getAmmoForSlot(slots[i]);
      }
      return ammo;
  }
  hasAmmo(item: API.InventoryItem): boolean {
      switch (item) {
      case API.InventoryItem.DEKU_STICK:
      case API.InventoryItem.DEKU_NUT:
      case API.InventoryItem.HEROES_BOW:
      case API.InventoryItem.BOMB:
      case API.InventoryItem.BOMBCHU:
      case API.InventoryItem.MAGIC_BEAN:
          return true;
      }
      return false;
  }
  getAmmoForSlot(slotId: number): number {
      if (slotId < 0 || slotId > 0xf) return 0;
      return this.emulator.rdramRead8(this.inventory_ammo_addr + slotId);
  }
  setAmmoInSlot(slot: number, amount: number): void {
      if (slot < 0 || slot >= 0xf) return;
      this.emulator.rdramWrite8(this.inventory_ammo_addr + slot, amount);
  }

  setItemInSlot(item: API.InventoryItem, slot: number): void {
      if (slot < 0 || slot >  API.InventorySlots.BOTTLE6) {
          return;
      }
      this.emulator.rdramWrite8(this.inventory_addr + slot, item.valueOf());
  }
  giveItem(item: API.InventoryItem, desiredSlot:  API.InventorySlots) {
      if (
          this.getItemInSlot(desiredSlot) == API.InventoryItem.NONE ||
      this.getItemInSlot(desiredSlot) == item
      ) {
          this.setItemInSlot(item, desiredSlot);
      }
  }
  removeItem(item: API.InventoryItem): void {
      let slots = this.getSlotsForItem(item);
      for (let i = 0; i < slots.length; i++) {
          this.setItemInSlot(API.InventoryItem.NONE, i);
      }
  }
  getEmptySlots(): number[] {
      let slots: number[] = new Array();
      for (let i = 0; i <=  API.InventorySlots.BOTTLE6; i++) {
          if (this.getItemInSlot(i) == API.InventoryItem.NONE) {
              slots.push(i);
          }
      }
      return slots;
  }
}