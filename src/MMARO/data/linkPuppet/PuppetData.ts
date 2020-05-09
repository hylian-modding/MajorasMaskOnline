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

const actor =         0x0000
const anim_data =     0x0144

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
    this.copyFields.push('xzSpeed');
    this.copyFields.push('nowShield');
    this.copyFields.push('nowMask');
    this.copyFields.push('actionParam1');
    this.copyFields.push('actionParam2');
    this.copyFields.push('equipSword');
    this.copyFields.push('razorDurability');
    this.copyFields.push('shieldRot');
    this.copyFields.push('dekuStickLength');
    //this.copyFields.push('maskOBJ');
  }

  get pos(): Buffer {
    return this.core.link.rawPos;
  }

  set pos(pos: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x24, pos);
  }

  get rot(): Buffer {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xBC, 0x6);
  }

  set rot(rot: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0xBC, rot);
  }

  get shieldRot(): Buffer {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xAB2, 0x6);
  }

  set shieldRot(shieldRot: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x392, shieldRot);
  }

  get anim(): Buffer {
    return this.core.link.anim_data;
  }

  set anim(anim: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x144, anim);
  }

  get xzSpeed(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead32(offsets.link_instance + 0x70);
  }

  set xzSpeed(xzSpeed: number) {
    this.ModLoader.emulator.rdramWrite32(this.pointer + 0x70, xzSpeed);
  }

  get maskOBJ(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead32(offsets.link_instance + 0x23C);
  }

  set maskOBJ(maskOBJ: number) {
    this.ModLoader.emulator.rdramWrite32(this.pointer + 0x390, maskOBJ);
  }

  get nowShield(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x144);
  }

  set nowShield(nowShield: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F4, nowShield);
  }

  get nowMask(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x153);
  }

  set nowMask(nowMask: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F5, nowMask);
  }

  get actionParam1(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x147);
  }

  set actionParam1(actionParam1: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38C, actionParam1);
  }

  get actionParam2(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x14A);
  }

  set actionParam2(actionParam2: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38D, actionParam2);
  }

  get equipSword(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead8(offsets.sword_equip);
  }

  set equipSword(equipSword: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38E, equipSword);
  }

  get razorDurability(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramRead16(offsets.razor_hits);
  }

  set razorDurability(razorDurability: number) {
    this.ModLoader.emulator.rdramWrite16(this.pointer + 0x390, razorDurability);
  }

  get dekuStickLength(): number {
    let offsets = (global.ModLoader.MMOffsets as MMOffsets);
    return this.ModLoader.emulator.rdramReadF32(offsets.link_instance + 0xB0C);
  }

  set dekuStickLength(dekuStickLength: number) {
    this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x398, dekuStickLength);
  }

  get form(): MMForms {
    return this.core.save.form;
  }

  toJSON() {
    const jsonObj: any = {};

    for (let i = 0; i < this.copyFields.length; i++) {
      jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
    }
    return jsonObj;
  }
}
