import {
  Age,
  Shield,
  Sword,
  Strength,
  IOOTCore,
} from 'modloader64_api/OOT/OOTAPI';
import { IModLoaderAPI } from 'modloader64_api/IModLoaderAPI';
import { IPuppetData } from '../../OotoAPI/IPuppetData';
import { bus } from 'modloader64_api/EventHandler';
import { MMCore } from '@MMARO/MMAPI/Core';
import Vector3 from 'modloader64_api/math/Vector3';
import { MMForms } from '@MMARO/MMAPI/mmForms';
import { MMOffsets } from '@MMARO/MMAPI/MMOffsets';

export class PuppetData implements IPuppetData {
  pointer: number;
  ModLoader: IModLoaderAPI;
  core: MMCore;

  private readonly copyFields: string[] = new Array<string>();

  constructor(
    pointer: number,
    ModLoader: IModLoaderAPI,
    core: MMCore
  ) {
    this.pointer = pointer;
    this.ModLoader = ModLoader;
    this.core = core;
    this.copyFields.push('pos');
    this.copyFields.push('rot');
    this.copyFields.push('anim');
  }

  get pos(): Buffer {
    return this.core.link.rawPos;
  }

  set pos(pos: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x24, pos);
  }

  get anim(): Buffer {
    return this.core.link.anim_data;
  }

  set anim(anim: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x144, anim);
  }

  get rot(): Buffer {
    //return this.core.link.rot;

    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xBC, 0x6);
  }

  set rot(rot: Buffer) {
    //this.ModLoader.math.rdramWriteV3i16(this.pointer + 0xBC, rot);
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0xBC, rot);
  }

  get form(): MMForms {
    return this.core.save.form;
  }

/*   get left_hand(): number {
    let num: number = this.core.link.rdramRead8(0x144);
    let num2: number = this.core.link.rdramRead8(0x148);
    let id = 0;
    if (this.form === 0) {
      switch (num) {
        case 0:
          id = 0; // Nothing
          break;
        case 3:
          id = 1; // Master Sword
          break;
        case 5:
          id = this.core.save.swords.biggoronSword ? 2 : 3; // Biggoron.
          break;
        case 7:
          id = 7; // Megaton Hammer.
          break;
        case 0x1e:
          id = 5; // Bottle.
          break;
        case 0xff:
          if (num2 === 0x02) {
            id = 1;
          } else if (num2 === 0x0b) {
            id = 7;
          }
          break;
        default:
          break;
      }
    } else {
      switch (num) {
        case 0:
          break;
        case 4:
          id = 4;
          break;
        case 0x1e:
          id = 5;
          break;
        case 6:
          id = 6;
          break;
        case 0xff:
          if (num2 === 0x02) {
            id = 4;
          } else if (num2 === 0x0a) {
            id = 0;
          }
          break;
        default:
          break;
      }
    }
    return id;
  }

  set left_hand(num: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + (0x250 + 0x2A), num);
  }

  set right_hand(num: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + (0x250 + 0x2B), num);
  }

  get right_hand(): number {
    let id = 0;
    let shield: Shield = this.core.link.shield;
    let num: number = this.core.link.rdramRead8(0x144);
    let left_hand: number = this.left_hand;
    if (this.form === 0) {
      switch (num) {
        case 0:
          break;
        case 0x1d:
          id = 5;
          break;
        case 0x11:
          id = 7;
          break;
        case 0x10:
          id = 7;
          break;
        case 0x08:
          id = 8;
          break;
        default:
          break;
      }
      if (id === 0) {
        if (
          left_hand === 3 ||
          left_hand === 2 ||
          left_hand === 1 ||
          num === 0xff
        ) {
          switch (shield) {
            case 0:
              break;
            case Shield.HYLIAN:
              id = 1;
              break;
            case Shield.MIRROR:
              id = 2;
              break;
            default:
              break;
          }
        }
      }
      if (left_hand === 2) {
        id = 0;
      }
    } else {
      switch (num) {
        case 0:
          break;
        case 0x1c:
          id = 4;
          break;
        case 0x1d:
          id = 5;
          break;
        case 0x0f:
          id = 9;
          break;
        default:
          break;
      }
      if (id === 0) {
        if (left_hand === 4 || num === 0xff) {
          switch (shield) {
            case 0:
              break;
            case Shield.DEKU:
              id = 3;
              break;
            default:
              break;
          }
        }
      }
    }
    return id;
  }

  get back_item(): number {
    let id = 0;
    let sword: boolean = this.core.link.sword !== Sword.NONE;
    let _sword: Sword = this.core.link.sword;
    let shield: Shield = this.core.link.shield;
    let left_hand: number = this.left_hand;
    let right_hand: number = this.right_hand;
    if (this.form === 0) {
      if (!sword && shield === Shield.NONE) {
        id = 7;
      } else if (sword && shield === Shield.HYLIAN) {
        if (left_hand === 1) {
          id = 9;
        } else {
          if (right_hand === 1) {
            id = 7;
          } else {
            id = 1;
          }
        }
      } else if (sword && shield === Shield.MIRROR) {
        if (left_hand === 1) {
          id = 9;
        } else {
          if (right_hand === 2) {
            id = 7;
          } else {
            id = 2;
          }
        }
      }
    } else {
      if (!sword && shield === Shield.NONE) {
        id = 0;
      } else if (shield !== Shield.NONE && sword && _sword === 0x11) {
        if (left_hand === 4) {
          id = 10;
        } else {
          if (right_hand === 3) {
            id = 4;
          } else {
            id = 3;
          }
        }
      } else {
        if (left_hand === 4) {
          id = 10;
        } else {
          id = 4;
        }
      }
    }
    return id;
  } */

  set back_item(num: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + (0x250 + 0x2C), num);
  }

  toJSON() {
    const jsonObj: any = {};

    for (let i = 0; i < this.copyFields.length; i++) {
      jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
    }
    //console.log(JSON.stringify(jsonObj, null, 2));
    return jsonObj;
  }
}
