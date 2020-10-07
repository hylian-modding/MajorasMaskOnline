import {
    IModLoaderAPI,
    ModLoaderEvents,
  } from 'modloader64_api/IModLoaderAPI';
  import {
    EventHandler,
    EventsClient,
  } from 'modloader64_api/EventHandler';
  import { MMOnlineStorageClient } from '../../MMOnlineStorageClient';
  import zlib from 'zlib';
  import {
    MMO_AllocateModelPacket,
    MMO_IconAllocatePacket,
    MMO_GiveModelPacket,
    MMO_ModifyModelPacket,
  } from '../MMOPackets';
  import { Age, OotEvents, IOOTCore } from 'modloader64_api/OOT/OOTAPI';
  import {
    INetworkPlayer,
    NetworkHandler,
  } from 'modloader64_api/NetworkHandler';
  import { MMOnlineEvents } from '../../MMOAPI/MMOAPI';
  import { ModelPlayer } from './ModelPlayer';
  import { ModelAllocationManager } from './ModelAllocationManager';
  import { Puppet } from '../linkPuppet/Puppet';
  import fs from 'fs';
  import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
  import path from 'path';
  import { ModelObject } from './ModelContainer';
  import { PatchTypes } from 'modloader64_api/Patchers/PatchManager';
  import { Z64RomTools, trimBuffer } from 'Z64Lib/API/Z64RomTools';
  import { InjectCore } from 'modloader64_api/CoreInjection';
  import { MMChildManifest } from 'Z64Lib/API/MM/MMChildManifest';
  import { zzstatic } from 'Z64Lib/API/zzstatic';
  import { Z64LibSupportedGames } from 'Z64Lib/API/Z64LibSupportedGames';
  import { ModelThread } from 'Z64Lib/API/ModelThread';
import { MMForms } from 'MajorasMask/API/MMAPI';
import {MMRomPatches} from 'Z64Lib/API/MM/MMRomPatches';
  
  export class ModelManagerClient {
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    @InjectCore()
    core!: IOOTCore;
    clientStorage!: MMOnlineStorageClient;
    allocationManager: ModelAllocationManager;
    customModelFileAdult = '';
    customModelFileChild = '';
    customModelFileAnims = '';
    customModelRepointsAdult = __dirname + '/zobjs/adult.json';
    customModelRepointsChild = __dirname + '/zobjs/child.json';
    customModelFileAdultIcon = '';
    customModelFileChildIcon = '';
    cacheDir: string = "./cache";
    isThreaded: boolean = false;
  
    constructor() {
      this.allocationManager = new ModelAllocationManager();
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_APPLIED_ADULT)
    onCustomModel(file: string) {
      this.customModelFileAdult = file;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_APPLIED_CHILD)
    onCustomModel2(file: string) {
      this.customModelFileChild = file;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_APPLIED_ANIMATIONS)
    onCustomModel3(file: string) {
      this.customModelFileAnims = file;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_APPLIED_ICON_ADULT)
    onCustomModel4(file: string) {
      this.customModelFileAdultIcon = file;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_APPLIED_ICON_CHILD)
    onCustomModel5(file: string) {
      this.customModelFileChildIcon = file;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_OVERRIDE_ADULT)
    onOverrideAdult(evt: any){
      this.customModelFileAdult = evt.p;
    }
  
    @EventHandler(MMOnlineEvents.CUSTOM_MODEL_OVERRIDE_CHILD)
    onOverrideChild(evt: any){
      this.customModelFileChild = evt.p;
    }
  
    loadAdultModel(evt: any, file: string) {
/*       let tools: Z64RomTools = new Z64RomTools(this.ModLoader, global.ModLoader.isDebugRom ? Z64LibSupportedGames.DEBUG_OF_TIME : Z64LibSupportedGames.MAJORAS_MASK);
      let model: Buffer = fs.readFileSync(file);
      let manifest: OOTAdultManifest = new OOTAdultManifest();
      if (manifest.repoint(this.ModLoader, evt.rom, model)) {
        manifest.inject(this.ModLoader, evt.rom, model);
        let code_file: Buffer = tools.decompressDMAFileFromRom(evt.rom, 27);
        let offset: number = 0xE65A0;
        model.writeUInt32BE(code_file.readUInt32BE(offset), 0x500c);
        this.clientStorage.adultModel = model;
      } */
    }
  
    loadChildModel(evt: any, file: string) {
      let tools: Z64RomTools = new Z64RomTools(this.ModLoader, Z64LibSupportedGames.MAJORAS_MASK);
      let model: Buffer = fs.readFileSync(file);
      let copy: Buffer = Buffer.alloc(model.byteLength);
      model.copy(copy);
      let manifest: MMChildManifest = new MMChildManifest();
      if (manifest.repoint(this.ModLoader, evt.rom, copy)) {
        manifest.inject(this.ModLoader, evt.rom, copy);
        if (model.readUInt8(0x500B) === 0x68) {
          model.writeUInt8(0x4, 0x500B);
        }
        this.clientStorage.childModel = model;
      }
    }
  
    setupPuppetModels(evt: any) {
      /* if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir);
      }
      let child_path: string = path.join(this.cacheDir, "child.zobj");
      let adult_path: string = path.join(this.cacheDir, "adult.zobj");
  
      let puppet_child: Buffer = Buffer.alloc(1);
      let puppet_adult: Buffer = Buffer.alloc(1);
  
      if (fs.existsSync(child_path) && fs.existsSync(adult_path)) {
        puppet_child = fs.readFileSync(child_path);
        puppet_adult = fs.readFileSync(adult_path);
      } else {
        let tools: Z64RomTools = new Z64RomTools(this.ModLoader, global.ModLoader.isDebugRom ? Z64LibSupportedGames.DEBUG_OF_TIME : Z64LibSupportedGames.MAJORAS_MASK);
        this.ModLoader.logger.info("Setting up puppet models...");
        puppet_child = Buffer.alloc(0x37800);
        //tools.decompressObjectFileFromRom(evt.rom, 0x0014).copy(puppet_child);
        tools.decompressDMAFileFromRom(evt.rom, 503).copy(puppet_child);
        puppet_adult = Buffer.alloc(0x37800);
        //tools.decompressObjectFileFromRom(evt.rom, 0x0015).copy(puppet_adult);
        tools.decompressDMAFileFromRom(evt.rom, 502).copy(puppet_adult);
        if (!global.ModLoader.isDebugRom) {
          puppet_child = PatchTypes.get(".bps")!.patch(puppet_child, fs.readFileSync(path.join(__dirname, "zobjs", "ChildLink.bps")));
          puppet_adult = PatchTypes.get(".bps")!.patch(puppet_adult, fs.readFileSync(path.join(__dirname, "zobjs", "AdultLink.bps")));
        } else if (this.core.rom_header!.id === "NZL") {
          puppet_child = PatchTypes.get(".bps")!.patch(puppet_child, fs.readFileSync(path.join(__dirname, "zobjs", "ChildLinkDebug.bps")));
          puppet_adult = PatchTypes.get(".bps")!.patch(puppet_adult, fs.readFileSync(path.join(__dirname, "zobjs", "AdultLinkDebug.bps")));
        }
        fs.writeFileSync(child_path, trimBuffer(puppet_child));
        fs.writeFileSync(adult_path, trimBuffer(puppet_adult));
      }
  
      let a = new ModelPlayer("Adult");
      a.model.adult = new ModelObject(trimBuffer(new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(puppet_adult, 0)));
      let c = new ModelPlayer("Child");
      c.model.child = new ModelObject(trimBuffer(new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(puppet_child, 1)));
      this.allocationManager.models[0] = a;
      this.allocationManager.models[1] = c; */
    }
  
    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED_PRE)
    onRomPatchedPre(evt: any) {
      this.setupPuppetModels(evt);
    }
  
    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
    onRomPatched(evt: any) {
      
      let patch: MMRomPatches = new MMRomPatches();
      patch.patch(evt.rom);
      let tools: Z64RomTools = new Z64RomTools(this.ModLoader, Z64LibSupportedGames.MAJORAS_MASK);

      this.ModLoader.logger.info('Starting custom model setup...');
      let anim = 7;
  
      if (this.customModelFileAdult !== '') {
        this.loadAdultModel(evt, this.customModelFileAdult);
        let def = zlib.deflateSync(this.clientStorage.adultModel);
        this.ModLoader.clientSide.sendPacket(
          new MMO_AllocateModelPacket(
            def,
            MMForms.FD,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          )
        );
      }
  
      if (this.customModelFileChild !== '') {
        this.loadChildModel(evt, this.customModelFileChild);
        let def = zlib.deflateSync(this.clientStorage.childModel);
        this.ModLoader.clientSide.sendPacket(
          new MMO_AllocateModelPacket(
            def,
            MMForms.HUMAN,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          )
        );
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
  
      if (this.customModelFileAdultIcon !== '') {
        this.ModLoader.logger.info('Loading custom map icon (Adult) ...');
        this.clientStorage.childModel = fs.readFileSync(
          this.customModelFileAdultIcon
        );
        let def = zlib.deflateSync(this.clientStorage.childModel);
        this.ModLoader.clientSide.sendPacket(
          new MMO_IconAllocatePacket(
            def,
            MMForms.FD,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          )
        );
      }
  
      if (this.customModelFileChildIcon !== '') {
        this.ModLoader.logger.info('Loading custom map icon (Child) ...');
        this.clientStorage.childIcon = fs.readFileSync(
          this.customModelFileChildIcon
        );
        let def = zlib.deflateSync(this.clientStorage.childIcon);
        this.ModLoader.clientSide.sendPacket(
          new MMO_IconAllocatePacket(
            def,
            MMForms.HUMAN,
            this.ModLoader.clientLobby,
            this.ModLoader.utils.hashBuffer(def)
          )
        );
      }
      this.ModLoader.clientSide.sendPacket(new MMO_GiveModelPacket(this.ModLoader.clientLobby, this.ModLoader.me));
      this.ModLoader.logger.info('Done.');
    }
  
    @NetworkHandler('MMO_AllocateModelPacket')
    onModelAllocate_client(packet: MMO_AllocateModelPacket) {
      if (
        !this.clientStorage.playerModelCache.hasOwnProperty(packet.player.uuid)
      ) {
        this.clientStorage.playerModelCache[packet.player.uuid] = new ModelPlayer(packet.player.uuid);
      }
      if (packet.form === MMForms.HUMAN) {
        (this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer).model.setChild(zlib.inflateSync(packet.model));
        fs.writeFileSync(global.ModLoader.startdir + "/test.zobj", (this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer).model.child.zobj);
        if (this.isThreaded) {
          let thread: ModelThread = new ModelThread(
            (this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer).model.child.zobj,
            this.ModLoader
          );
          thread.startThread(Z64LibSupportedGames.MAJORAS_MASK);
        }
        this.ModLoader.logger.info(
          'client: Saving custom child model for player ' +
          packet.player.nickname +
          '.'
        );
      } else if (packet.form === MMForms.FD) {
        if (this.isThreaded) {
          let thread: ModelThread = new ModelThread(
            (this.clientStorage.playerModelCache[packet.player.uuid] as ModelPlayer).model.adult.zobj,
            this.ModLoader
          );
          thread.startThread(Z64LibSupportedGames.MAJORAS_MASK);
        }
        this.ModLoader.logger.info(
          'client: Saving custom adult model for player ' +
          packet.player.nickname +
          '.'
        );
      }
    }
  
    @NetworkHandler('MMO_ModifyModelPacket')
    onModelMod(packet: MMO_ModifyModelPacket) {
      console.log(packet.mod.byteLength);
      if (!this.allocationManager.isPlayerAllocated(packet.player)) {
        return;
      }
      if (packet.form === MMForms.HUMAN) {
        this.ModLoader.logger.info("Getting model for player " + packet.player.nickname + "...");
        let model: ModelPlayer = this.allocationManager.getPlayerAllocation(
          packet.player
        );
        let index: number = this.allocationManager.getModelIndex(model);
        this.ModLoader.logger.info("This model is assigned to model block " + index + ".");
        let allocation_size = 0x37800;
        let addr: number = 0x900000 + allocation_size * index;
        this.ModLoader.logger.info("Model block " + index + " starts at address 0x" + addr.toString(16) + ".");
        let pos: number = 0;
        while(pos < packet.mod.byteLength){
          let offset: number = packet.mod.readUInt16BE(pos);
          pos+=2;
          let length: number = packet.mod.readUInt16BE(pos);
          pos+=2;
          let data: Buffer = packet.mod.slice(pos, pos + length);
          pos+=data.byteLength;
          this.ModLoader.emulator.rdramWriteBuffer(addr + packet.offset + offset, data);
        }
      }
    }
  
    @NetworkHandler('MMO_IconAllocatePacket')
    onIconAllocateClient(packet: MMO_IconAllocatePacket) {
      if (
        !this.clientStorage.playerModelCache.hasOwnProperty(packet.player.uuid)
      ) {
        this.clientStorage.playerModelCache[packet.player.uuid] = new ModelPlayer(packet.player.uuid);
      }
      if (packet.form === MMForms.FD) {
        (this.clientStorage.playerModelCache[
          packet.player.uuid
        ] as ModelPlayer).customIconAdult = zlib.inflateSync(packet.icon);
        this.ModLoader.logger.info(
          'client: Saving custom icon for (Adult) player ' +
          packet.player.nickname +
          '.'
        );
      }
      if (packet.form === MMForms.HUMAN) {
        (this.clientStorage.playerModelCache[
          packet.player.uuid
        ] as ModelPlayer).customIconChild = zlib.inflateSync(packet.icon);
        this.ModLoader.logger.info(
          'client: Saving custom icon for (Child) player ' +
          packet.player.nickname +
          '.'
        );
      }
    }
  
    @EventHandler(EventsClient.ON_PLAYER_LEAVE)
    onPlayerLeft(player: INetworkPlayer) {
      delete this.clientStorage.playerModelCache[player.uuid];
      if (this.allocationManager.isPlayerAllocated(player)) {
        this.allocationManager.deallocateSlot(
          this.allocationManager.getModelIndex(
            this.allocationManager.getPlayerAllocation(player)
          )
        );
      }
      this.ModLoader.logger.info(this.allocationManager.getAvailableSlots() + " model blocks left!");
    }
  
    @NetworkHandler("MMO_GiveModelPacket")
    onPlayerJoin_client(packet: MMO_GiveModelPacket) {
      if (packet.target.uuid !== this.ModLoader.me.uuid) {
        if (this.clientStorage.adultModel.byteLength > 1) {
          let def = zlib.deflateSync(this.clientStorage.adultModel);
          this.ModLoader.clientSide.sendPacketToSpecificPlayer(
            new MMO_AllocateModelPacket(
              def,
              MMForms.FD,
              this.ModLoader.clientLobby,
              this.ModLoader.utils.hashBuffer(def)
            ), packet.target
          );
        }
  
        if (this.clientStorage.childModel.byteLength > 1) {
          let def = zlib.deflateSync(this.clientStorage.childModel);
          this.ModLoader.clientSide.sendPacketToSpecificPlayer(
            new MMO_AllocateModelPacket(
              def,
              MMForms.HUMAN,
              this.ModLoader.clientLobby,
              this.ModLoader.utils.hashBuffer(def)
            ),
            packet.target
          );
        }
  
        if (this.clientStorage.childModel.byteLength > 1) {
          let def = zlib.deflateSync(this.clientStorage.childModel);
          this.ModLoader.clientSide.sendPacketToSpecificPlayer(
            new MMO_IconAllocatePacket(
              def,
              MMForms.FD,
              this.ModLoader.clientLobby,
              this.ModLoader.utils.hashBuffer(def)
            ),
            packet.target
          );
        }
  
        if (this.clientStorage.childIcon.byteLength > 1) {
          let def = zlib.deflateSync(this.clientStorage.childModel);
          this.ModLoader.clientSide.sendPacketToSpecificPlayer(
            new MMO_IconAllocatePacket(
              def,
              MMForms.HUMAN,
              this.ModLoader.clientLobby,
              this.ModLoader.utils.hashBuffer(def)
            ),
            packet.target
          );
        }
      }
    }
  
    @EventHandler("MMOnline:WriteDefaultPuppetZobjs")
    onWriteRequest(evt: any) {
    }
  
    @EventHandler(MMOnlineEvents.PLAYER_PUPPET_PRESPAWN)
    onPuppetPreSpawn(puppet: Puppet) {
      let puppet_spawn_params: number = 0x80800000;
      let puppet_spawn_variable_offset: number = 0xE;
      this.ModLoader.emulator.rdramWrite16(puppet_spawn_params + puppet_spawn_variable_offset, puppet.form);
      console.log(this.ModLoader.emulator.rdramReadBuffer(puppet_spawn_params, 0x10));
      if (
        !this.clientStorage.playerModelCache.hasOwnProperty(puppet.player.uuid)
      ) {
        return;
      }
      if (!this.allocationManager.isPlayerAllocated(puppet.player)) {
        let slot = this.allocationManager.allocateSlot((this.clientStorage.playerModelCache[puppet.player.uuid] as ModelPlayer));
        this.ModLoader.logger.info("Trying to allocate model block " + slot + ".");
        this.ModLoader.logger.info(this.allocationManager.getAvailableSlots() + " model blocks left!");
      }
      this.ModLoader.logger.info("Getting model for player " + puppet.player.nickname + "...");
      let model: ModelPlayer = this.allocationManager.getPlayerAllocation(
        puppet.player
      );
      let index: number = this.allocationManager.getModelIndex(model);
      this.ModLoader.logger.info("This model is assigned to model block " + index + ".");
      let allocation_size = 0x37800;
      let addr: number = 0x900000 + allocation_size * index;
      this.ModLoader.logger.info("Model block " + index + " starts at address 0x" + addr.toString(16) + ".");
      let zobj_size: number = allocation_size;
      let passed: boolean = false;
      if (puppet.form === MMForms.FD && model.model.adult !== undefined) {
        if (model.model.adult.zobj.byteLength > 1) {
          this.ModLoader.logger.info("Writing adult model into model block " + index + ".");
          this.ModLoader.emulator.rdramWriteBuffer(
            addr,
            new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(this.ModLoader.utils.cloneBuffer(model.model.adult.zobj), index)
          );
          zobj_size = model.model.adult.zobj.byteLength;
          passed = true;
        }
      }
      console.log(puppet.form);
      console.log(model.model.child);
      if (puppet.form === MMForms.HUMAN && model.model.child !== undefined) {
        if (model.model.child.zobj.byteLength > 1) {
          this.ModLoader.logger.info("Writing child model into model block " + index + ".");
          this.ModLoader.emulator.rdramWriteBuffer(
            addr,
            new zzstatic(Z64LibSupportedGames.MAJORAS_MASK).doRepoint(this.ModLoader.utils.cloneBuffer(model.model.child.zobj), index, true, 0x900000)
          );
          zobj_size = model.model.child.zobj.byteLength;
          passed = true;
        }
      }
      if (passed) {
        this.ModLoader.emulator.rdramWrite16(puppet_spawn_params + puppet_spawn_variable_offset, index);
      }
    }
  
    @EventHandler(OotEvents.ON_SCENE_CHANGE)
    onSceneChange(scene: number) {
    }
  
    @EventHandler(EventsClient.ON_INJECT_FINISHED)
    onLoaded(evt: any) {
    }
  }