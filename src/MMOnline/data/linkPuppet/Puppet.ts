import { PuppetData } from './PuppetData';
import { INetworkPlayer } from 'modloader64_api/NetworkHandler';
import { Command } from 'modloader64_api/OOT/ICommandBuffer';
import { bus, EventHandler } from 'modloader64_api/EventHandler';
import { MMOnlineEvents, IMMOnlineHelpers } from '../../MMOAPI/MMOAPI';
import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { IPuppet } from '../../MMOAPI/IPuppet';
import Vector3 from 'modloader64_api/math/Vector3';
import { HorseData } from './HorseData';
import fs from 'fs';
import path from 'path';

import { IMMCore , MMForms, MMEvents} from 'MajorasMask/API/MMAPI';
import { Z64RomTools } from '@MMOnline/Z64Lib/API/Z64RomTools';
import MMOnline from '@MMOnline/MMOnline';
import { MMOnlineClient } from '@MMOnline/MMOnlineClient';

const DEADBEEF_OFFSET: number = 0x288;

export class Puppet implements IPuppet {
  player: INetworkPlayer;
  id: string;
  data: PuppetData;
  isSpawned = false;
  isSpawning = false;
  isShoveled = false;
  scene: number;
  form: MMForms;
  core: IMMCore;
  void!: Vector3;
  ModLoader: IModLoaderAPI;
  horse!: HorseData;
  parent: IMMOnlineHelpers;
  tunic_color!: number;
  MMOClient = new MMOnlineClient;

  constructor(
    player: INetworkPlayer,
    core: IMMCore,
    pointer: number,
    ModLoader: IModLoaderAPI,
    parent: IMMOnlineHelpers,

  ) {
    this.player = player;
    this.data = new PuppetData(pointer, ModLoader, core);
    this.scene = 81;
    this.form = 1;
    this.ModLoader = ModLoader;
    this.core = core;
    this.id = this.ModLoader.utils.getUUID();
    this.parent = parent;
  }


  debug_movePuppetToPlayer() {
    let t = JSON.stringify(this.data);
    let copy = JSON.parse(t);
    Object.keys(copy).forEach((key: string) => {
      (this.data as any)[key] = copy[key];
    });
  }

  doNotDespawnMe(p: number) {
    this.ModLoader.emulator.rdramWrite8(p + 0x3, 0xff);
  }

  spawn() {
    if (this.isShoveled) {
      this.isShoveled = false;
      this.ModLoader.logger.debug('Puppet resurrected.');
      return;
    }
    if (!this.isSpawned && !this.isSpawning) {
      bus.emit(MMOnlineEvents.PLAYER_PUPPET_PRESPAWN, this);
      this.isSpawning = true;
      this.data.pointer = 0x0;
      this.ModLoader.emulator.rdramWrite16(0x80000E, this.form);
      (this.parent as any)["writeModel"]();
      fs.writeFileSync(global.ModLoader.startdir + "/ram.bin", this.ModLoader.emulator.rdramReadBuffer(0x0, (16 * 1024 * 1024)));
      this.core.commandBuffer.runCommand(Command.SPAWN_ACTOR, 0x80800000, (success: boolean, result: number) => {
        if (success) {
          this.data.pointer = result & 0x00ffffff;
          //this.applyColor(this.data.pointer);
          this.doNotDespawnMe(this.data.pointer);
          if (this.hasAttachedHorse()) {
            let horse: number = this.getAttachedHorse();
            this.doNotDespawnMe(horse);
            //this.horse = new HorseData(this.core.link, this, this.core);
          }
          this.void = this.ModLoader.math.rdramReadV3(this.data.pointer + 0x24);
          this.isSpawned = true;
          this.isSpawning = false;
          bus.emit(MMOnlineEvents.PLAYER_PUPPET_SPAWNED, this);
        }
      });
    }
  }

  processIncomingPuppetData(data: PuppetData) {
    if (this.isSpawned && !this.isShoveled) {
      Object.keys(data).forEach((key: string) => {
        (this.data as any)[key] = (data as any)[key];
      });
    }
  }

  processIncomingHorseData(data: HorseData) {
    if (this.isSpawned && !this.isShoveled && this.horse !== undefined) {
      Object.keys(data).forEach((key: string) => {
        (this.horse as any)[key] = (data as any)[key];
      });
    }
  }

  shovel() {
    if (this.isSpawned) {
      if (this.data.pointer > 0) {
        if (this.ModLoader.emulator.rdramRead32(this.data.pointer + DEADBEEF_OFFSET) === 0xDEADBEEF) {
          if (this.getAttachedHorse() > 0) {
            let horse: number = this.getAttachedHorse();
            this.ModLoader.math.rdramWriteV3(horse + 0x24, this.void);
          }
          this.ModLoader.math.rdramWriteV3(this.data.pointer + 0x24, this.void);
        }
        this.ModLoader.logger.debug('Puppet ' + this.id + ' shoveled.');
        this.isShoveled = true;
      }
    }
  }

  despawn() {
    if (this.isSpawned) {
      if (this.data.pointer > 0) {
        if (this.getAttachedHorse() > 0) {
          let horse: number = this.getAttachedHorse();
          this.ModLoader.emulator.rdramWrite32(horse + 0x138, 0x0);
          this.ModLoader.emulator.rdramWrite32(horse + 0x13C, 0x0);
        }
        this.ModLoader.emulator.rdramWrite32(this.data.pointer + 0x138, 0x0);
        this.ModLoader.emulator.rdramWrite32(this.data.pointer + 0x13C, 0x0);
        this.data.pointer = 0;
      }
      this.isSpawned = false;
      this.isShoveled = false;
      this.ModLoader.logger.debug('Puppet ' + this.id + ' despawned.');
      bus.emit(MMOnlineEvents.PLAYER_PUPPET_DESPAWNED, this);
    }
  }

  getAttachedHorse(): number {
    //return this.ModLoader.emulator.dereferencePointer(this.data.pointer + 0x011C);
    return 0;
  }

  hasAttachedHorse(): boolean {
    return false;
  }

  applyColor(pointer: number)
  {
      this.ModLoader.logger.debug("Previous puppet tunic color: " + this.ModLoader.emulator.rdramRead32(pointer + 0x530)); 
      this.ModLoader.logger.debug('Setting tunic color for your puppet: ' + this.tunic_color);
      this.ModLoader.emulator.rdramWrite32(pointer + 0x530, this.tunic_color);
      this.ModLoader.logger.debug("Puppet Pointer: " + pointer);
      this.makeRamDump();
  }

  makeRamDump() {
    fs.writeFileSync(global.ModLoader["startdir"] + "/ram_dump.bin", this.ModLoader.emulator.rdramReadBuffer(0x0, (16 * 1024 * 1024)));
}

  //@EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
  /*onRom(rom: any) {
      let tools: Z64RomTools;
      let buf: Buffer;

      // Set tunic color
      tools = new Z64RomTools(this.ModLoader, 0x1A500);
      buf = tools.decompressFileFromRom(rom, 654);
      this.tunic_color = buf.readInt32BE(0xB39C);
      this.ModLoader.logger.debug('Retrieving tunic color for your puppet: ' + this.tunic_color);
  }*/
}
