import {
  IModLoaderAPI,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import {
  bus,
  EventHandler,
  EventsClient,
} from 'modloader64_api/EventHandler';
import zlib from 'zlib';
import { Age, OotEvents, IOOTCore } from 'modloader64_api/OOT/OOTAPI';
import {
  INetworkPlayer,
  NetworkHandler,
} from 'modloader64_api/NetworkHandler';
import { ModelPlayer } from './ModelPlayer';
import { ModelAllocationManager } from './ModelAllocationManager';
import { Puppet } from '../linkPuppet/Puppet';
import fs from 'fs';
import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
import path from 'path';
import { ModelObject } from './ModelContainer';
import { Z64RomTools, trimBuffer } from 'Z64Lib/API/Z64RomTools';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { zzstatic } from 'Z64Lib/API/zzstatic';
import { Z64LibSupportedGames } from 'Z64Lib/API/Z64LibSupportedGames';
import { Postinit, Preinit } from 'modloader64_api/PluginLifecycle';
import { Heap } from 'modloader64_api/heap';
import { MMOnlineStorageClient } from '@MajorasMaskOnline/MMOnlineStorageClient';
import { Z64_EventConfig } from '@MajorasMaskOnline/WorldEvents/Z64_EventConfig';
import { Z64OnlineEvents, Z64Online_EquipmentPak, Z64Online_ModelAllocation, Z64_AllocateModelPacket, Z64_EquipmentPakPacket, Z64_GiveModelPacket, Z64_IconAllocatePacket, Z64_ModifyModelPacket } from '@MajorasMaskOnline/Z64OnlineAPI/Z64OnlineAPI';
import { IMMCore, MMEvents, MMForms } from 'MajorasMask/API/MMAPI';
import { MMChildManifest } from 'Z64Lib/API/MM/MMChildManifest';
import { Console } from 'console';

export class ModelManagerClient {
  @ModLoaderAPIInject()
  ModLoader!: IModLoaderAPI;
  @InjectCore()
  core!: IMMCore;
  clientStorage!: MMOnlineStorageClient;
  allocationManager: ModelAllocationManager;
  customModelFileAnims = '';
  customModelRepointsAdult = __dirname + '/zobjs/adult.json';
  customModelRepointsChild = __dirname + '/zobjs/child.json';
  customModelFileAdultIcon = '';
  customModelFileChildIcon = '';
  cacheDir: string = "./cache";
  isThreaded: boolean = false;
  //
  customModelBufferAdult: Buffer | undefined;
  customModelBufferChild: Buffer | undefined;
  proxySyncTick!: string;
  proxyNeedsSync: boolean = false;
  customModelFilesChild: Map<string, Buffer> = new Map<string, Buffer>();
  customModelFilesEquipment: Map<string, Buffer> = new Map<string, Buffer>();
  config!: Z64_EventConfig;
  equipmentMap: Map<string, Buffer> = new Map<string, Buffer>();
  equipmentHeap!: Heap;
  proxyProcessFlags: Buffer = Buffer.alloc(2);
  equipmentMapping!: Z64Online_ModelAllocation;
  heightModAddr!: number;

  constructor() {
    this.allocationManager = new ModelAllocationManager();
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_APPLIED_ADULT)
  onCustomModel(file: string) {
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_LOAD_BUFFER_ADULT)
  onCustomModelBufferAdult(buf: Buffer) {
    this.customModelBufferAdult = buf;
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_APPLIED_CHILD)
  onCustomModel2(file: string) {
    let figureOutName: string = path.parse(path.parse(file).dir).name;
    this.customModelFilesChild.set(figureOutName, fs.readFileSync(file));
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_LOAD_BUFFER_CHILD)
  onCustomModelBufferChild(buf: Buffer) {
    this.customModelBufferChild = buf;
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_APPLIED_ANIMATIONS)
  onCustomModel3(file: string) {
    this.customModelFileAnims = file;
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_APPLIED_ICON_ADULT)
  onCustomModel4(file: string) {
    this.customModelFileAdultIcon = file;
  }

  @EventHandler(Z64OnlineEvents.CUSTOM_MODEL_APPLIED_ICON_CHILD)
  onCustomModel5(file: string) {
    this.customModelFileChildIcon = file;
  }

  @EventHandler(Z64OnlineEvents.LOAD_EQUIPMENT_BUFFER)
  onLoadEq(eq: Z64Online_EquipmentPak) {
    this.equipmentMap.set(eq.name, eq.data);
  }

  @EventHandler(Z64OnlineEvents.LOAD_EQUIPMENT_PAK)
  onLoadEQExternal(eq: Z64Online_EquipmentPak) {
    this.customModelFilesEquipment.set(eq.name, eq.data);
    bus.emit(Z64OnlineEvents.LOAD_EQUIPMENT_BUFFER, eq);
  }

  @EventHandler(Z64OnlineEvents.CLEAR_EQUIPMENT)
  onClearEq(evt: any) {
    this.equipmentMap.clear();
  }

  private getAllocAddr(slot: number, size = 0x37800) {
    let addr: number = 0x80900000 + size * slot;
    return addr;
  }

  @EventHandler(Z64OnlineEvents.ALLOCATE_MODEL_BLOCK)
  onAlloc(alloc: Z64Online_ModelAllocation) {
    let uuid = this.ModLoader.utils.getUUID();
    let mp = new ModelPlayer(uuid);
    switch (alloc.age) {
      case MMForms.HUMAN:
        mp.model.human.zobj = alloc.model;
        break;
    }
    alloc.slot = this.allocationManager.allocateSlot(mp);
    alloc.pointer = this.getAllocAddr(alloc.slot);
  }

  private createEquipmentHeap() {
    let uuid = this.ModLoader.utils.getUUID();
    let mp = new ModelPlayer(uuid);
    let alloc = new Z64Online_ModelAllocation(Buffer.alloc(0x37800), 0x69);
    alloc.slot = this.allocationManager.allocateSlot(mp);
    alloc.pointer = this.getAllocAddr(alloc.slot, alloc.model.byteLength);
    this.equipmentMapping = alloc;
    this.equipmentHeap = new Heap(this.ModLoader.emulator, alloc.pointer, alloc.model.byteLength);
  }

  private clearEquipmentHeap() {
    let b = this.ModLoader.emulator.rdramReadBuffer(this.equipmentMapping.pointer, this.equipmentMapping.model.byteLength);
    b = this.ModLoader.utils.clearBuffer(b);
    this.ModLoader.emulator.rdramWriteBuffer(this.equipmentMapping.pointer, b);
    this.equipmentHeap = new Heap(this.ModLoader.emulator, this.equipmentMapping.pointer, this.equipmentMapping.model.byteLength);
  }

  @EventHandler(Z64OnlineEvents.FORCE_LOAD_MODEL_BLOCK)
  onForceLoad(slot: number) {
    let addr: number = this.getAllocAddr(slot);
    let model = this.allocationManager.getModelInSlot(slot);
    if (model.model.human.zobj.byteLength > 1) {
      let m = this.ModLoader.utils.cloneBuffer(model.model.human.zobj);
      if (m.readUInt8(0x500B) === 0x68) {
        m.writeUInt8(0x4, 0x500B);
      }
      this.ModLoader.emulator.rdramWriteBuffer(addr, new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(m, slot, true, 0x80900000));
    }
  }

  loadHumanModel(evt: any, file: Buffer, proxy?: boolean, buf?: Buffer) {
    let tools: Z64RomTools = new Z64RomTools(this.ModLoader, Z64LibSupportedGames.MAJORAS_MASK);
    let model: Buffer;
    if (file !== undefined) {
      model = file;
    } else {
      model = buf!;
    }
    if (model === undefined) {
      let child_path: string = path.join(__dirname, "zobjs", "Human.zobj");
      model = fs.readFileSync(child_path);
    }
    let manifest: MMChildManifest = new MMChildManifest();
    if (manifest.repoint(this.ModLoader, evt.rom, model)) {
      if (proxy) {
        this.ModLoader.logger.info("(Human) Setting up zobj proxy.");
        let proxy = fs.readFileSync(path.resolve(__dirname, "zobjs", "zz_human_proxy.zobj"));
        proxy = trimBuffer(proxy);
        let alloc = new Z64Online_ModelAllocation(model, MMForms.HUMAN);
        alloc.rom = manifest.inject(this.ModLoader, evt.rom, proxy, true);
        bus.emit(Z64OnlineEvents.ALLOCATE_MODEL_BLOCK, alloc);
        this.clientStorage.humanProxy = alloc;
        this.clientStorage.humanModel = model;
        new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(this.ModLoader.utils.cloneBuffer(this.clientStorage.humanModel), this.clientStorage.humanProxy.slot, true, 0x80900000);
      } else {
        manifest.inject(this.ModLoader, evt.rom, model);
        this.clientStorage.humanModel = model;
      }
    }
  }

  setupPuppetModels(evt: any) {
  }

  @EventHandler(ModLoaderEvents.ON_ROM_PATCHED_PRE)
  onRomPatchedPre(evt: any) {
    try {
      this.setupPuppetModels(evt);
    } catch (err) {
      // Maybe don't shallow this error?
      console.log(err);
      throw err;
    }
  }

  // This function fires every 100 frames if we're using a zobj proxy.
  syncProxiedObject() {
    if (this.proxyNeedsSync) {
      let def2 = zlib.deflateSync(this.clientStorage.humanModel);
      this.ModLoader.clientSide.sendPacket(new Z64_AllocateModelPacket(def2, MMForms.HUMAN, this.ModLoader.clientLobby, this.ModLoader.utils.hashBuffer(def2)));
      let p = new Z64_EquipmentPakPacket(this.core.save.form, this.ModLoader.clientLobby);
      this.equipmentMap.forEach((value: Buffer, key: string) => {
        p.zobjs.push(zlib.deflateSync(value));
      });
      this.ModLoader.clientSide.sendPacket(p);
      this.proxyNeedsSync = false;
    }
  }

  @Preinit()
  preinit() {
    this.config = this.ModLoader.config.registerConfigCategory("MMO_WorldEvents") as Z64_EventConfig;
    this.ModLoader.config.setData("MMO_WorldEvents", "childCostume", "");
  }

  @EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
  onRomPatched(evt: any) {
    bus.emit(Z64OnlineEvents.POST_LOADED_MODELS_LIST, { adult: undefined, child: this.customModelFilesChild, equipment: this.customModelFilesEquipment });
    let tools: Z64RomTools = new Z64RomTools(this.ModLoader, Z64LibSupportedGames.MAJORAS_MASK);
    this.ModLoader.logger.info('Starting custom model setup...');
    let anim = 7;

    let titleScreenFix = this.ModLoader.utils.setIntervalFrames(() => {
      if (this.doesLinkObjExist(MMForms.HUMAN).exists) {
        this.onSceneChange(-1);
        this.ModLoader.utils.clearIntervalFrames(titleScreenFix);
      }
    }, 1);

    try {
      if (this.customModelFilesChild.size > 0 || this.customModelBufferChild !== undefined) {
        this.loadHumanModel(evt, this.customModelFilesChild.get(this.config.childCostume)!, true, this.customModelBufferChild);
        let def = zlib.deflateSync(this.clientStorage.humanModel);
        this.ModLoader.clientSide.sendPacket(
          new Z64_AllocateModelPacket(
            def,
            MMForms.HUMAN,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          )
        );
        if (this.proxySyncTick === undefined) {
          this.proxySyncTick = this.ModLoader.utils.setIntervalFrames(this.syncProxiedObject.bind(this), 100);
        }
      }
    } catch (err) {
      this.ModLoader.logger.error(err.stack);
      throw err;
    }

    if (this.customModelFileAnims !== '') {
      this.ModLoader.logger.info('Loading new animations...');
      let anim_file: Buffer = fs.readFileSync(this.customModelFileAnims);
      let anim_zobj: Buffer = tools.decompressDMAFileFromRom(evt.rom, anim);
      if (anim_zobj.byteLength === anim_file.byteLength) {
        this.ModLoader.utils.clearBuffer(anim_zobj);
        anim_file.copy(anim_zobj);
      }
      tools.recompressDMAFileIntoRom(evt.rom, anim, anim_zobj);
    }

    try {
      if (this.equipmentMap.size > 0) {
        let p = new Z64_EquipmentPakPacket(0x69, this.ModLoader.clientLobby);
        this.equipmentMap.forEach((value: Buffer, key: string) => {
          p.zobjs.push(zlib.deflateSync(value));
        });
        this.ModLoader.clientSide.sendPacket(p);
      }
    } catch (err) {
      console.log(err.stack);
    }

    this.ModLoader.logger.info('Done.');
    this.ModLoader.clientSide.sendPacket(new Z64_GiveModelPacket(this.ModLoader.clientLobby, this.ModLoader.me));
  }

  @NetworkHandler('Z64OnlineLib_AllocateModelPacket')
  onModelAllocate_client(packet: Z64_AllocateModelPacket) {
    if (
      !this.clientStorage.playerModelCache.hasOwnProperty(packet.player.uuid)
    ) {
      this.clientStorage.playerModelCache[packet.player.uuid] = new ModelPlayer(packet.player.uuid);
    }
    if (packet.age === MMForms.HUMAN) {
      (this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer).model.setHuman(zlib.inflateSync(packet.model));
      this.ModLoader.logger.info('client: Saving custom human model for player ' + packet.player.nickname + '.');
    }
    if (!this.core.helper.isTitleScreen() && this.core.helper.isInterfaceShown()) {
      bus.emit(Z64OnlineEvents.FORCE_PUPPET_RESPAWN_IMMEDIATE, { player: packet.player, age: packet.age });
    }
  }

  @NetworkHandler('Z64OnlineLib_EquipmentPakPacket')
  onModelAllocate_Equipment(packet: Z64_EquipmentPakPacket) {
    if (
      !this.clientStorage.playerModelCache.hasOwnProperty(packet.player.uuid)
    ) {
      this.clientStorage.playerModelCache[packet.player.uuid] = new ModelPlayer(packet.player.uuid);
    }
    let mp = this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer;
    mp.model.equipment = [];
    packet.zobjs.forEach((value: Buffer, index: number) => {
      let def = zlib.inflateSync(value);
      mp.model.equipment.push(new ModelObject(def));
    });
    if (!this.core.helper.isTitleScreen() && this.core.helper.isInterfaceShown()) {
      bus.emit(Z64OnlineEvents.FORCE_PUPPET_RESPAWN_IMMEDIATE, { player: packet.player, age: packet.age });
    }
  }

  @NetworkHandler('Z64OnlineLib_ModifyModelPacket')
  onModelMod(packet: Z64_ModifyModelPacket) {
    if (!this.allocationManager.isPlayerAllocated(packet.player)) {
      return;
    }
    if (packet.age === MMForms.HUMAN) {
      this.ModLoader.logger.info("Getting model for player " + packet.player.nickname + "...");
      let model: ModelPlayer = this.allocationManager.getPlayerAllocation(
        packet.player
      );
      let index: number = this.allocationManager.getModelIndex(model);
      this.ModLoader.logger.info("This model is assigned to model block " + index + ".");
      let allocation_size = 0x37800;
      let addr: number = 0x800000 + allocation_size * index;
      this.ModLoader.logger.info("Model block " + index + " starts at address 0x" + addr.toString(16) + ".");
      let pos: number = 0;
      while (pos < packet.mod.byteLength) {
        let offset: number = packet.mod.readUInt16BE(pos);
        pos += 2;
        let length: number = packet.mod.readUInt16BE(pos);
        pos += 2;
        let data: Buffer = packet.mod.slice(pos, pos + length);
        pos += data.byteLength;
        this.ModLoader.emulator.rdramWriteBuffer(addr + packet.offset + offset, data);
      }
    }
  }

  @EventHandler(EventsClient.ON_PLAYER_LEAVE)
  onPlayerLeft(player: INetworkPlayer) {
    delete this.clientStorage.playerModelCache[player.uuid];
    if (this.allocationManager.isPlayerAllocated(player)) {
      this.allocationManager.deallocateSlot(this.allocationManager.getModelIndex(this.allocationManager.getPlayerAllocation(player)));
      this.allocationManager.deallocateSlot(this.allocationManager.getModelIndex(this.allocationManager.getAllocationByUUID(player.uuid + "_Equipment")!));
    }
    this.ModLoader.logger.info(this.allocationManager.getAvailableSlots() + " model blocks left!");
  }

  @NetworkHandler("Z64OnlineLib_GiveModelPacket")
  onPlayerJoin_client(packet: Z64_GiveModelPacket) {
    if (packet.target.uuid !== this.ModLoader.me.uuid) {
      if (this.clientStorage.humanModel.byteLength > 1) {
        let def = zlib.deflateSync(this.clientStorage.humanModel);
        this.ModLoader.clientSide.sendPacketToSpecificPlayer(
          new Z64_AllocateModelPacket(
            def,
            MMForms.HUMAN,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          ),
          packet.target
        );
      }
    }
    try {
      if (this.equipmentMap.size > 0) {
        let p = new Z64_EquipmentPakPacket(0x69, this.ModLoader.clientLobby);
        this.equipmentMap.forEach((value: Buffer, key: string) => {
          p.zobjs.push(zlib.deflateSync(value));
        });
        this.ModLoader.clientSide.sendPacket(p);
      }
    } catch (err) {
      console.log(err.stack);
    }
  }

  @EventHandler(Z64OnlineEvents.PLAYER_PUPPET_PRESPAWN)
  onPuppetPreSpawn(puppet: Puppet) {
    let puppet_spawn_params_ptr: number = 0x80800000;
    let puppet_spawn_variable_offset: number = 0xE;
    this.ModLoader.emulator.rdramWrite16(puppet_spawn_params_ptr + puppet_spawn_variable_offset, puppet.form);

    if (!this.clientStorage.playerModelCache.hasOwnProperty(puppet.player.uuid)) return;

    if (!this.allocationManager.isPlayerAllocated(puppet.player)) {
      let mp = (this.clientStorage.playerModelCache[puppet.player.uuid] as ModelPlayer);
      let slot = this.allocationManager.allocateSlot(mp);
      this.ModLoader.logger.info("Trying to allocate model block " + slot + ".");
      let eq_mp = new ModelPlayer(puppet.player.uuid + "_Equipment");
      eq_mp.model.equipment = mp.model.equipment;
      this.allocationManager.allocateSlot(eq_mp);
    }
    this.ModLoader.logger.info("Getting model for player " + puppet.player.nickname + "...");
    let model: ModelPlayer = this.allocationManager.getPlayerAllocation(puppet.player);
    let eqList: ModelPlayer = this.allocationManager.getAllocationByUUID(puppet.player.uuid + "_Equipment")!;
    eqList.model.equipment = model.model.equipment;
    let index: number = this.allocationManager.getModelIndex(model);
    let eqIndex: number = this.allocationManager.getModelIndex(eqList);
    this.ModLoader.logger.info("This model is assigned to model block " + index + ".");
    let addr: number = this.getAllocAddr(index);
    this.ModLoader.logger.info("Model block " + index + " starts at address 0x" + addr.toString(16) + ".");
    let Model: Buffer;
    if (puppet.form === MMForms.HUMAN) {
      Model = this.ModLoader.utils.cloneBuffer(model.model.human.zobj)
    }
    let passed: boolean = false;
    if (eqList.model.equipment.length > 0) {
      this.ModLoader.logger.debug("Loading equipment overrides...");
      let temp = new Heap(this.ModLoader.emulator, this.getAllocAddr(eqIndex), 0x37800);
      for (let i = 0; i < eqList.model.equipment.length; i++) {
        let cp = this.ModLoader.utils.cloneBuffer(eqList.model.equipment[i].zobj);
        let cp_p = temp.malloc(cp.byteLength);
        this.ModLoader.emulator.rdramWriteBuffer(cp_p, new zzstatic(Z64LibSupportedGames.OCARINA_OF_TIME).doRepoint(cp, 0, true, cp_p));
        cp = this.ModLoader.emulator.rdramReadBuffer(cp_p, cp.byteLength);
        let eq = Buffer.from('45515549504D414E4946455354000000', 'hex');
        let index = cp.indexOf(eq);
        let str = "";
        let curByte: number = 0;
        let curIndex: number = index + 0x10;
        while (curByte !== 0xFF) {
          str += cp.slice(curIndex, curIndex + 1).toString();
          curByte = cp.slice(curIndex, curIndex + 1).readUInt8(0);
          curIndex++;
        }
        str = str.substr(0, str.length - 1);
        let data = JSON.parse(str);
        let header = cp.indexOf(Buffer.from('4D4F444C4F414445523634', 'hex'));
        header += 0x10;
        if (puppet.form === MMForms.HUMAN) {
          Object.keys(data.MM.human).forEach((key: string) => {
            let i = header + (parseInt(key) * 0x8) + 0x4;
            let offset = parseInt(data.MM.human[key]) + 0x4;
            Model.writeUInt32BE(cp.readUInt32BE(i), offset);
          });
        }
      }
    }
    if (puppet.form === MMForms.HUMAN && model.model.human !== undefined) {
      if (model.model.human.zobj.byteLength > 1) {
        this.ModLoader.logger.info("Writing human model into model block " + index + ".");
        let m = new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(Model!, index, true, 0x80900000);
        this.ModLoader.emulator.rdramWriteBuffer(addr, m);
        passed = true;
      }
    }
    if (passed) {
      this.ModLoader.emulator.rdramWrite16(puppet_spawn_params_ptr + puppet_spawn_variable_offset, index);
    }
  }

  private dealWithEquipmentPaks(age: MMForms) {
    let allocation_size = 0x37800;
    if (this.equipmentMap.size > 0) {
      let model: Buffer;
      if (age === MMForms.HUMAN) {
        model = this.ModLoader.emulator.rdramReadBuffer(this.clientStorage.humanProxy.pointer, allocation_size);
      }
      this.clearEquipmentHeap();
      this.equipmentMap.forEach((value: Buffer, key: string) => {
        let p = this.equipmentHeap.malloc(value.byteLength);
        this.ModLoader.emulator.rdramWriteBuffer(p, new zzstatic(Z64LibSupportedGames.OCARINA_OF_TIME).doRepoint(this.ModLoader.utils.cloneBuffer(value), 0, true, p));
        let rp = this.ModLoader.emulator.rdramReadBuffer(p, value.byteLength);
        let eq = Buffer.from('45515549504D414E4946455354000000', 'hex');
        let index = rp.indexOf(eq);
        let str = "";
        let curByte: number = 0;
        let curIndex: number = index + 0x10;
        while (curByte !== 0xFF) {
          str += rp.slice(curIndex, curIndex + 1).toString();
          curByte = rp.slice(curIndex, curIndex + 1).readUInt8(0);
          curIndex++;
        }
        str = str.substr(0, str.length - 1);
        let data = JSON.parse(str);
        let header = rp.indexOf(Buffer.from('4D4F444C4F414445523634', 'hex'));
        header += 0x10;
        if (age === MMForms.HUMAN) {
          Object.keys(data.MM.human).forEach((key: string) => {
            let i = header + (parseInt(key) * 0x8) + 0x4;
            let offset = parseInt(data.MM.human[key]) + 0x4;
            model.writeUInt32BE(rp.readUInt32BE(i), offset);
          });
          this.ModLoader.emulator.rdramWriteBuffer(this.clientStorage.humanProxy.pointer, model);
        }
      });
    }
  }

  private heightFix(model: Buffer) {
    try {
      console.log("Height Fix");
      
      let childHeightAddr: number = 0x80779238; //Length = 0xDC

      //0x0 - 0x92
      let defaultAdultHeight1 = "4260000042B400003F80000042DE0000428C0000429ECCCD426C0000422400004198000042100000423333334260000042880000428C00004190000041700000428C00000009123F016700081256017C000917EA016700081256017C000917EA0167000917EA016700091E0D017C000917EA016700091E0D017C00081256017C000917EA0167F9C81256017CF9C917EA0167";
      //0x98 - 0xA0
      let defaultAdultHeight2 = "4204000041EB79720400D5400400D5480400D6600400DB900400DB980400DBA00400DBA80400DAB00400DAB80400DA900400DA980400DB700400DB780400DB880400DB80";
      
      //0x0 - 0xDC
      let defaultChildHeight = "42200000427000003F25A5A6428E00004248000042440000421C000041D800004198000041B000004201999A420000004240000042352D2E4160000041400000425C0000FFE80DED036CFFE80D92035EFFE8137103A900081256017C000917EA0167FFE8137103A9FFE8195F03A9000917EA016700091E0D017C00081256017C000917EA0167F9C81256017CF9C917EA016700200000000041B0000041EB79720400D1280400D1700400D1B80400D1F80400D2000400D2080400D2100400DAB00400DAB80400DA900400DA980400D1D80400D1E00400D1F00400D1E8";
      
      if (this.heightModAddr === undefined) {
        let ram = this.ModLoader.emulator.rdramReadBuffer(0x0, 8 * 1024 * 1024);
        this.heightModAddr = ram.indexOf(Buffer.from('42200000427000003F25A5A6428E00004248000042440000', 'hex'));
      }
      if (model.readUInt8(0x500B) === 0x04) {
        console.log("Height Fix Child");
        this.clientStorage.isAdultSizedHuman = false;
        this.ModLoader.emulator.rdramWriteBuffer(this.heightModAddr, Buffer.from(defaultChildHeight, 'hex'));
      } else if (model.readUInt8(0x500B) === 0x68) {
        console.log("Height Fix Adult");
        this.clientStorage.isAdultSizedHuman = true;
        this.ModLoader.emulator.rdramWriteBuffer(this.heightModAddr, Buffer.from(defaultAdultHeight1, 'hex'));
        this.ModLoader.emulator.rdramWriteBuffer(this.heightModAddr + 0x98, Buffer.from(defaultAdultHeight2, 'hex'));
      }
    } catch (err) {
    }
  }

  @EventHandler(OotEvents.ON_SCENE_CHANGE)
  onSceneChange(scene: number) {
    if (this.equipmentHeap === undefined) {
      this.createEquipmentHeap();
    }
    this.heightFix(this.clientStorage.humanModel);
    if (this.core.save.form === MMForms.HUMAN) {
      if (this.proxyProcessFlags[0] > 0 && scene > -1) {
        return;
      }
      let link = this.doesLinkObjExist(MMForms.HUMAN);
      if (link.exists) {
        if (this.clientStorage.humanProxy !== undefined) {
          this.ModLoader.logger.debug("Human proxy scene change!");
          bus.emit(Z64OnlineEvents.FORCE_LOAD_MODEL_BLOCK, this.clientStorage.humanProxy.slot);
          this.dealWithEquipmentPaks(this.core.save.form);
          this.ModLoader.emulator.rdramWriteBuffer(link.pointer, this.ModLoader.emulator.rdramReadBuffer(this.clientStorage.humanProxy.pointer, 0x541F));
          let p = this.ModLoader.emulator.rdramRead32(this.clientStorage.humanProxy.pointer + 0x5420) - 0x150;
          let buf = this.ModLoader.emulator.rdramReadBuffer(p, 0x1B0);
          this.ModLoader.emulator.rdramWriteBuffer(link.pointer + 0xC770 - 0x150, buf);
          this.ModLoader.rom.romWriteBuffer(this.clientStorage.humanProxy.rom, this.ModLoader.emulator.rdramReadBuffer(link.pointer, 0xC7D0));
          this.proxyProcessFlags[0] = 1;
        }
      }
    }
  }

  @EventHandler(Z64OnlineEvents.CHANGE_CUSTOM_MODEL_ADULT_GAMEPLAY)
  onChangeModel(evt: Z64Online_ModelAllocation) {
  }

  @EventHandler(Z64OnlineEvents.CHANGE_CUSTOM_MODEL_CHILD_GAMEPLAY)
  onChangeModelChild(evt: Z64Online_ModelAllocation) {
    if (this.clientStorage.humanProxy === undefined) {
      return;
    }
    let child_path: string = path.join(__dirname, "zobjs", "Human.zobj");
    if (evt.model.byteLength === 1) {
      evt.model = fs.readFileSync(child_path);
    }
    let modelObj = this.allocationManager.getModelInSlot(this.clientStorage.humanProxy.slot);
    modelObj.model.human.zobj = evt.model;
    this.clientStorage.humanModel = evt.model;
    let link = this.doesLinkObjExist(MMForms.HUMAN);
    if (link.exists) {
      if (this.clientStorage.humanProxy !== undefined) {
        this.ModLoader.logger.debug("Found Link proxy...");
        let proxy = trimBuffer(fs.readFileSync(path.resolve(__dirname, "zobjs", "zz_human_proxy.zobj")));
        this.ModLoader.emulator.rdramWriteBuffer(link.pointer, proxy);
        this.ModLoader.utils.setTimeoutFrames(() => {
          this.heightFix(this.clientStorage.humanModel);
          this.ModLoader.logger.debug("Loading new model...");
          bus.emit(Z64OnlineEvents.FORCE_LOAD_MODEL_BLOCK, this.clientStorage.humanProxy.slot);
          this.dealWithEquipmentPaks(MMForms.HUMAN);
          this.ModLoader.logger.debug("Loading alias table into proxy...");
          this.ModLoader.emulator.rdramWriteBuffer(link.pointer, this.ModLoader.emulator.rdramReadBuffer(this.clientStorage.humanProxy.pointer, 0x541F));
          this.ModLoader.logger.debug("Loading hierarchy into proxy...");
          let p = this.ModLoader.emulator.rdramRead32(this.clientStorage.humanProxy.pointer + 0x5420) - 0x150;
          let buf = this.ModLoader.emulator.rdramReadBuffer(p, 0x1B0);
          this.ModLoader.emulator.rdramWriteBuffer(link.pointer + 0xC770 - 0x150, buf);
          this.ModLoader.rom.romWriteBuffer(this.clientStorage.humanProxy.rom, this.ModLoader.emulator.rdramReadBuffer(link.pointer, 0xC7D0));
          this.proxyNeedsSync = true;
        }, 1);
      }
    }
  }

  @EventHandler(MMEvents.ON_UNPAUSE)
  onUnpause() {
    this.ModLoader.utils.setTimeoutFrames(() => {
    this.heightFix(this.clientStorage.humanModel);
    },1);
  }

  @EventHandler(Z64OnlineEvents.REFRESH_EQUIPMENT)
  onRefresh() {
    this.ModLoader.utils.setTimeoutFrames(() => {
      this.onSceneChange(-1);
    }, 1);
  }

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onLoaded(evt: any) {
  }

  doesLinkObjExist(age: MMForms) {
    let link_object_pointer: number = 0;
    let obj_list: number = 0x803FE8B4;
    let obj_id = 0x00110000;
    for (let i = 4; i < 0x514; i += 4) {
      let value = this.ModLoader.emulator.rdramRead32(obj_list + i);
      if (value === obj_id) {
        link_object_pointer = obj_list + i + 4;
        break;
      }
    }
    if (link_object_pointer === 0) return { exists: false, pointer: 0 };
    link_object_pointer = this.ModLoader.emulator.rdramRead32(link_object_pointer);
    return { exists: this.ModLoader.emulator.rdramReadBuffer(link_object_pointer + 0x5000, 0xB).toString() === "MODLOADER64", pointer: link_object_pointer };
  }
}