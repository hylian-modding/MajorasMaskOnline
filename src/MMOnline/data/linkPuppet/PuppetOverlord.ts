import { Puppet } from './Puppet';
import { INetworkPlayer, NetworkHandler, ServerNetworkHandler } from 'modloader64_api/NetworkHandler';
import { IModLoaderAPI, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import { MMO_PuppetPacket, MMO_SceneRequestPacket, MMO_ScenePacket, MMO_PuppetWrapperPacket } from '../MMOPackets';
import fs from 'fs';
import { ModLoaderAPIInject } from 'modloader64_api/ModLoaderAPIInjector';
import { InjectCore } from 'modloader64_api/CoreInjection';
import { IPuppetOverlord } from '../../MMOAPI/IPuppetOverlord';
import { Postinit, onTick } from 'modloader64_api/PluginLifecycle';
import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import { IMMOnlineHelpers, MMOnlineEvents } from '../../MMOAPI/MMOAPI';
import { HorseData } from './HorseData';
import { IMMCore, MMForms, MMEvents } from 'MajorasMask/API/MMAPI';
import { IActor } from 'MajorasMask/API/IActor';
import { Z64RomTools } from '@MMOnline/Z64Lib/API/Z64RomTools';
import { MMOnlineClient } from '@MMOnline/MMOnlineClient';
import { PlayerSchedule, get_scaled_time, PlayerScheduleData, RECORD_TICK_MODULO, get_scaled_time_floor, get_schedule_data_index_at_time, get_linear_time } from '../MMOPlayerSchedule';
import { MMOnlineStorageClient } from '@MMOnline/MMOnlineStorageClient';
import MMOnline from '@MMOnline/MMOnline';

export class PuppetOverlord implements IPuppetOverlord {
  private puppets: Map<string, Puppet> = new Map<string, Puppet>();
  private awaiting_spawn: Puppet[] = new Array<Puppet>();
  fakeClientPuppet!: Puppet;
  private amIAlone = true;
  private playersAwaitingPuppets: INetworkPlayer[] = new Array<
    INetworkPlayer
  >();
  private parent: IMMOnlineHelpers;
  private Epona!: HorseData;
  private queuedSpawn: boolean = false;

  rom!: Buffer;

  @ModLoaderAPIInject()
  private ModLoader!: IModLoaderAPI;
  @InjectCore()
  private core!: IMMCore;
  clientStorage!: MMOnlineStorageClient;
  
  constructor(parent: IMMOnlineHelpers, core: IMMCore, clientStorage: MMOnlineStorageClient) {
    this.parent = parent;
    this.core = core;
    this.clientStorage = clientStorage;
  }

  @Postinit()
  postinit(
  ) {
    this.fakeClientPuppet = new Puppet(
      this.ModLoader.me,
      this.core,
      // The pointer here points to blank space, so should be fine.
      0x6011e8,
      this.ModLoader,
      this.parent
    );
  }

  get current_scene() {
    return this.fakeClientPuppet.scene;
  }

  localPlayerLoadingZone() {
    this.puppets.forEach(
      (value: Puppet, key: string, map: Map<string, Puppet>) => {
        value.despawn();
      }
    );
    this.awaiting_spawn.splice(0, this.awaiting_spawn.length);
  }

  localPlayerChangingScenes(entering_scene: number, form: MMForms) {
    this.awaiting_spawn.splice(0, this.awaiting_spawn.length);
    this.fakeClientPuppet.scene = entering_scene;
    this.fakeClientPuppet.form = form;
  }

  registerPuppet(player: INetworkPlayer) {
    this.ModLoader.logger.info(
      'Player ' + player.nickname + ' awaiting puppet assignment.'
    );
    this.playersAwaitingPuppets.push(player);
  }  

  unregisterPuppet(player: INetworkPlayer) {
    if (this.puppets.has(player.uuid)) {
      let puppet: Puppet = this.puppets.get(player.uuid)!;
      puppet.despawn();
      this.puppets.delete(player.uuid);
    }
    if (this.playersAwaitingPuppets.length > 0) {
      let index = -1;
      for (let i = 0; i < this.playersAwaitingPuppets.length; i++) {
        if (this.playersAwaitingPuppets[i].uuid === player.uuid) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        this.playersAwaitingPuppets.splice(index, 1);
      }
    }
  }

  changePuppetScene(player: INetworkPlayer, entering_scene: number, form: MMForms) {
    if (this.puppets.has(player.uuid)) {
      let puppet = this.puppets.get(player.uuid)!;
      if (puppet.isSpawned && puppet.form !== form) {
        puppet.despawn();
      }

      if (this.clientStorage.syncMode !== 2) {
        puppet.scene = entering_scene;
        puppet.form = form;
        this.ModLoader.logger.info(
          'Puppet ' + puppet.id + ' moved to scene ' + puppet.scene
        );

        if (this.fakeClientPuppet.scene === puppet.scene) {
          this.ModLoader.logger.info(
            'Queueing puppet ' + puppet.id + ' for immediate spawning.'
          );
          this.awaiting_spawn.push(puppet);
        }
      }
      else {
        let index = get_scaled_time(puppet.data.time);

        if (Math.abs(puppet.data.time - get_linear_time(this.core.save.day_time, this.core.save.current_day)) <= 135
          || this.clientStorage.schedules[puppet.player.uuid].schedule_data[index] === undefined) {
          puppet.scene = entering_scene;
          puppet.form = form;
          this.ModLoader.logger.info('Puppet ' + puppet.id + ' moved to scene ' + puppet.scene);
        }
        else {
          let scene = this.clientStorage.schedules[puppet.player.uuid].schedule_data[index].scene;
          puppet.scene = scene;
          puppet.form = form;
          this.ModLoader.logger.info('Puppet ' + puppet.id + ' moved to scene ' + puppet.scene);
        }
      }

      if (this.fakeClientPuppet.scene === puppet.scene) {
        this.ModLoader.logger.info(
          'Queueing puppet ' + puppet.id + ' for immediate spawning.'
        );
        this.awaiting_spawn.push(puppet);
      }
    }
    else {
      this.ModLoader.logger.info('No puppet found for player ' + player.nickname + '.');
    }
  }

  processNewPlayers() {
    if (this.playersAwaitingPuppets.length > 0) {
      let player: INetworkPlayer = this.playersAwaitingPuppets.splice(0, 1)[0];
      this.puppets.set(
        player.uuid,
        new Puppet(
          player,
          this.core,
          0x0,
          this.ModLoader,
          this.parent
        )
      );
      this.ModLoader.logger.info(
        'Player ' +
        player.nickname +
        ' assigned new puppet ' +
        this.puppets.get(player.uuid)!.id +
        '.'
      );
      this.ModLoader.clientSide.sendPacket(
        new MMO_SceneRequestPacket(this.ModLoader.clientLobby)
      );
    }
  }

  processAwaitingSpawns() {
    if (this.awaiting_spawn.length > 0 && !this.queuedSpawn) {
      let puppet: Puppet = this.awaiting_spawn.shift() as Puppet;
      //puppet.onRom(this.rom);
      puppet.spawn();
    }
  }

  lookForMissingOrStrandedPuppets() {
    let check = false;

    this.puppets.forEach((puppet: Puppet, key: string, map: Map<string, Puppet>) => {
      let scene = 111
      let index = get_scaled_time(puppet.data.time);

      if (this.clientStorage.syncMode !== 2) scene = puppet.scene
      else {
        if (Math.abs(puppet.data.time - get_linear_time(this.core.save.day_time, this.core.save.current_day)) <= 135 
          || this.clientStorage.schedules[puppet.player.uuid].schedule_data[index] === undefined) scene = puppet.scene;
        else scene = this.clientStorage.schedules[puppet.player.uuid].schedule_data[index].scene;
      }
    
      if (scene === this.fakeClientPuppet.scene) {
        if (!puppet.isSpawned && this.awaiting_spawn.indexOf(puppet) === -1) {
          this.awaiting_spawn.push(puppet);
        }
        check = true;
      }
  
      if (scene !== this.fakeClientPuppet.scene && puppet.isSpawned && !puppet.isShoveled) {
        puppet.shovel();
      }

    });

    if (check) this.amIAlone = false;
    else this.amIAlone = true;
  }

  /*
    it's reggie fils anime
  */

  sendPuppetPacket() {
    if (!this.amIAlone) {
      let packet = new MMO_PuppetPacket(this.fakeClientPuppet.data, this.ModLoader.clientLobby);
      //packet.data.time = get_linear_time(this.core.save.day_time, this.core.save.current_day);
      //this.ModLoader.logger.debug("Sending packet, in time should be " + packet.data.time.toString());
      this.ModLoader.clientSide.sendPacket(new MMO_PuppetWrapperPacket(packet, this.ModLoader.clientLobby));
    }
  }

  processPuppetPacket(packet: MMO_PuppetWrapperPacket) {
    if (this.puppets.has(packet.player.uuid)) {
      let puppet: Puppet = this.puppets.get(packet.player.uuid)!;
      let actualPacket = JSON.parse(packet.data) as MMO_PuppetPacket;
      //let scaled_time = get_scaled_time(actualPacket.data.time);
      //let linear_time = get_linear_time(this.core.save.day_time, this.core.save.current_day);

      //if (this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time] === undefined) this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time] = new PlayerScheduleData()

      //this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time].pos = actualPacket.data.pos;
      //this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time].rot = actualPacket.data.rot;
      //this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time].anim = actualPacket.data.anim;
      //this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time].scene = puppet.scene;
      //this.clientStorage.schedules[packet.player.uuid].schedule_data[scaled_time].alive = true;

      //this.ModLoader.logger.debug("Updated schedule for " + packet.player.uuid + " at index " + scaled_time.toString())

      //if ((this.clientStorage.syncMode === 2 && Math.abs(scaled_time - linear_time) > 135) || this.clientStorage.syncMode !== 2) puppet.processIncomingPuppetData(actualPacket.data);
      puppet.processIncomingPuppetData(actualPacket.data);
      //if (actualPacket.horse_data !== undefined) {
        /*         puppet.processIncomingHorseData(actualPacket.horse_data); */
      //}
    }
  }

  generateCrashDump() {
    let _puppets: any = {};
    this.puppets.forEach(
      (value: Puppet, key: string, map: Map<string, Puppet>) => {
        _puppets[key] = {
          isSpawned: value.isSpawned,
          isSpawning: value.isSpawning,
          isShoveled: value.isShoveled,
          pointer: value.data.pointer,
          player: value.player,
        };
      }
    );
    fs.writeFileSync(
      './PuppetOverlord_crashdump.json',
      JSON.stringify(_puppets, null, 2)
    );
  }

  // TODO
  isCurrentlyWarping() {
    return false;
  }

  @onTick()
  onTick() {
    if (this.clientStorage.syncMode !== 2) {
      if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid() || this.core.helper.isPaused()) {
        return;
      }
    }
    else {
      if (this.core.helper.isTitleScreen() || !this.core.helper.isSceneNumberValid()) {
        return;
      }
    }

    if (
      !this.core.helper.isLinkEnteringLoadingZone() &&
      this.core.helper.isInterfaceShown() &&
      !this.isCurrentlyWarping()
    ) {
      this.processNewPlayers();
      this.processAwaitingSpawns();
      this.lookForMissingOrStrandedPuppets();
    }

    if (this.clientStorage.syncMode === 2) {
      let linear_time = get_linear_time(this.core.save.day_time, this.core.save.current_day);
      let scaled_time = 0;

      this.puppets.forEach((puppet: Puppet, key: string, map: Map<string, Puppet>) => {
        this.ModLoader.logger.info("Time difference is " + Math.abs(puppet.data.time - linear_time).toString() + " (" + get_scaled_time(Math.abs(puppet.data.time - linear_time)) + " schedule ticks)!");
        if (this.clientStorage.schedules[puppet.player.uuid] !== undefined && Math.abs(puppet.data.time - linear_time) > 135) {
          let schedule_data0: PlayerScheduleData = this.clientStorage.schedules[puppet.player.uuid].schedule_data[get_scaled_time(linear_time)]
          scaled_time = get_scaled_time(puppet.data.time);

          if (schedule_data0 !== undefined && schedule_data0.alive) {
            puppet.data.pos = schedule_data0.pos
            puppet.data.rot = schedule_data0.rot
            puppet.data.anim = schedule_data0.anim
            //puppet.scene = schedule_data0.scene;

            this.ModLoader.logger.debug("schedule_data0 for " + puppet.player.uuid + " at time " + puppet.data.time.toString() + " (" + scaled_time.toString() + " scaled) is alive on scene " + schedule_data0.scene.toString() + "!")
          }
          else return;
        }
      });
    }

    this.sendPuppetPacket();
  }

  

  
  @EventHandler(EventsClient.ON_PLAYER_JOIN)
  onPlayerJoin(player: INetworkPlayer) {
    this.registerPuppet(player);
    if (this.clientStorage.syncMode == 2) this.clientStorage.schedules[player.uuid] = new PlayerSchedule();
  }

  @EventHandler(EventsClient.ON_PLAYER_LEAVE)
  onPlayerLeft(player: INetworkPlayer) {
    this.unregisterPuppet(player);
    if (this.clientStorage.syncMode == 2) delete this.clientStorage.schedules[player.uuid];
  }

  @EventHandler(MMEvents.ON_LOADING_ZONE)
  onLoadingZone(evt: any) {
    this.localPlayerLoadingZone();
  }

  @EventHandler(MMEvents.ON_SCENE_CHANGE)
  onSceneChange(scene: number) {
    this.localPlayerLoadingZone();
    this.localPlayerChangingScenes(scene, this.core.save.form);
  }

  @NetworkHandler('MMO_ScenePacket')
  onSceneChange_client(packet: MMO_ScenePacket) {
    this.changePuppetScene(packet.player, packet.scene, packet.form);
  }

  @ServerNetworkHandler('MMO_PuppetPacket')
  onPuppetData_server(packet: MMO_PuppetWrapperPacket) {
    this.parent.sendPacketToPlayersInScene(packet);
  }

  @NetworkHandler('MMO_PuppetPacket')
  onPuppetData_client(packet: MMO_PuppetWrapperPacket) {
    if (this.clientStorage.syncMode !== 2) {
      if (this.core.helper.isTitleScreen() ||
        this.core.helper.isPaused() ||
        this.core.helper.isLinkEnteringLoadingZone()
      ) {
        return;
      }
    }
    else if (this.core.helper.isTitleScreen() || this.core.helper.isLinkEnteringLoadingZone()) return;

    this.processPuppetPacket(packet);
  }

  @EventHandler(MMEvents.ON_AGE_CHANGE)
  onformChange(form: MMForms) {
    //this.localPlayerLoadingZone();
  }

  @EventHandler(ModLoaderEvents.ON_CRASH)
  onEmuCrash(evt: any) {
    this.generateCrashDump();
  }

  @EventHandler(MMEvents.ON_ACTOR_SPAWN)
  onEponaSpawned(actor: IActor) {
    /*     if (actor.actorID === 0x0014) {
          // Epona spawned.
          this.ModLoader.logger.debug("Epona spawned");
          this.Epona = new HorseData(actor, this.fakeClientPuppet, this.core);
        } */
  }

  @EventHandler(MMEvents.ON_ACTOR_DESPAWN)
  onEponaDespawned(actor: IActor) {
    /*     if (actor.actorID === 0x0014) {
          // Epona despawned.
          //@ts-ignore
          this.Epona = undefined;
          this.ModLoader.logger.debug("Epona despawned");
        } */
  }

  @EventHandler("MMOnline:RoguePuppet")
  onRoguePuppet(puppet: Puppet) {
    if (this.puppets.has(puppet.player.uuid)) {
      this.puppets.delete(puppet.player.uuid);
    }
  }

  @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
  onReset(evt: any) {
    this.localPlayerLoadingZone();
  }

  @EventHandler(MMOnlineEvents.PLAYER_PUPPET_SPAWNED)
  onSpawn(puppet: Puppet) {
    this.ModLoader.logger.debug("Unlocking puppet spawner.")
    this.queuedSpawn = false;
  }

  @EventHandler(MMOnlineEvents.PLAYER_PUPPET_PRESPAWN)
  onPreSpawn(puppet: Puppet) {
    this.ModLoader.logger.debug("Locking puppet spawner.")
    this.queuedSpawn = true;
  }

  @EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
    onRom(evt: any) {
      this.rom = evt.rom;
    }

}