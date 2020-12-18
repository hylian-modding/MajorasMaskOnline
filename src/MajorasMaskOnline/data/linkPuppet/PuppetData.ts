import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { IPuppetData } from "../../MMOAPI/IPuppetData";
import { bus, EventHandler } from 'modloader64_api/EventHandler';
import { MMOffsets } from 'MajorasMask/API/MMOffsets';
import { IMMCore, MMForms } from 'MajorasMask/API/MMAPI';
import * as API from 'MajorasMask/API/MMAPI';
import { Z64RomTools } from 'Z64Lib/API/Z64RomTools';
import MMOnline from '../../MMOnline';
import { MMOnlineEvents } from '../../MMOAPI/MMOAPI';
import { runInThisContext } from 'vm';
import { MMOnlineStorageClient } from '@MajorasMaskOnline/MMOnlineStorageClient';

const actor = 0x0000
const anim_data = 0x0144

export class PuppetData implements IPuppetData {
  pointer: number;
  ModLoader: IModLoaderAPI;
  core: API.IMMCore;
  time: number = 0;
  private readonly copyFields: string[] = new Array<string>();
  private storage: MMOnlineStorageClient;

  constructor(
    pointer: number,
    ModLoader: IModLoaderAPI,
    core: API.IMMCore,
    storage: MMOnlineStorageClient
  ) {
    this.storage = storage;
    this.pointer = pointer;
    this.ModLoader = ModLoader;
    this.core = core;
    this.copyFields.push('pos');
    this.copyFields.push('rot');
    this.copyFields.push('anim');
    this.copyFields.push('xzSpeed');
    this.copyFields.push('nowShield');
    //this.copyFields.push('nowMask');
    this.copyFields.push('actionParam1');
    this.copyFields.push('actionParam2');
    this.copyFields.push('equipSword');
    this.copyFields.push('razorDurability');
    this.copyFields.push('shieldRot');
    this.copyFields.push('dekuStickLength');
    this.copyFields.push('nowAnim');
    //this.copyFields.push('lastMask');
    //this.copyFields.push('blastMaskTimer');
    //this.copyFields.push('maskProps');
    this.copyFields.push('time');
    this.copyFields.push("isAdultSizedHuman");
    this.copyFields.push("sound");
  }

  get pos(): Buffer {
    return this.core.link.rawPos;
  }

  set pos(pos: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x24, pos);
  }

  get rot(): Buffer {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xBC, 0x6);
  }

  set rot(rot: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0xBC, rot);
  }

  get sound(): number {
    return this.core.link.current_sound_id;
  }

  set sound(s: number) {
    this.ModLoader.emulator.rdramWrite16(this.pointer + 0x4AC, s);
  }

  get maskProps(): Buffer {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramReadBuffer(offsets.mask_props, 0x12C);
  }

  set maskProps(maskProps: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x1D0 + 28, maskProps);
  }

  get shieldRot(): Buffer {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0x434, 0x6);
  }

  set shieldRot(shieldRot: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x43C, shieldRot);
  }

  get anim(): Buffer {
    return this.core.link.anim_data;
  }

  set anim(anim: Buffer) {
    this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x4B8, anim);
  }

  get xzSpeed(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead32(offsets.link_instance + 0x70);
  }

  set xzSpeed(xzSpeed: number) {
    this.ModLoader.emulator.rdramWrite32(this.pointer + 0x70, xzSpeed);
  }

  get nowShield(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x144);
  }

  set nowShield(nowShield: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F4, nowShield);
  }

  get nowMask(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + (0x144 + 0xF));
  }

  set nowMask(nowMask: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F5, nowMask);
  }

  get lastMask(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + (0x144 + 0x11));
  }

  set lastMask(lastMask: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x4B7, lastMask);
  }

  get blastMaskTimer(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead16(offsets.link_instance + 0xB60);
  }

  set blastMaskTimer(blastMaskTimer: number) {
    this.ModLoader.emulator.rdramWrite16(this.pointer + 0x4B0, blastMaskTimer);
  }

  get actionParam1(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x147);
  }

  set actionParam1(actionParam1: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x4B4, actionParam1);
  }

  get actionParam2(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x14A);
  }

  set actionParam2(actionParam2: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x4B5, actionParam2);
  }

  get equipSword(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead8(offsets.sword_equip);
  }

  set equipSword(equipSword: number) {
    this.ModLoader.emulator.rdramWrite8(this.pointer + 0x4B6, equipSword);
  }

  get razorDurability(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramRead16(offsets.razor_hits);
  }

  set razorDurability(razorDurability: number) {
    this.ModLoader.emulator.rdramWrite16(this.pointer + 0x4AE, razorDurability);
  }

  get dekuStickLength(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramReadF32(offsets.link_instance + 0xB0C);
  }

  set dekuStickLength(dekuStickLength: number) {
    this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x444, dekuStickLength);
  }

  get nowAnim(): number {
    let offsets = new MMOffsets;
    return this.ModLoader.emulator.rdramReadF32(offsets.link_instance + 0x248);
  }

  set nowAnim(nowAnim: number) {
    this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x448, nowAnim);
  }

  get form(): MMForms {
    return this.core.save.form;
  }

  get isAdultSizedHuman(): boolean {
    return this.storage.isAdultSizedHuman && this.core.save.form === 0x4;
  }

  set isAdultSizedHuman(bool: boolean) {
    if (bool) {
      this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x1E4, 1.0);
    }
  }

  toJSON() {
    const jsonObj: any = {};

    for (let i = 0; i < this.copyFields.length; i++) {
      jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
    }
    return jsonObj;
  }
}