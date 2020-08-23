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
import { IActor } from 'modloader64_api/OOT/IActor';
import { HorseData } from './HorseData';
import { ParentReference } from 'modloader64_api/SidedProxy/SidedProxy';
import * as API from 'MajorasMask/API/MMAPI';

export class PuppetOverlordServer {

  @ParentReference()
  parent!: IMMOnlineHelpers;

  @ServerNetworkHandler('MMO_PuppetPacket')
  onPuppetData_server(packet: MMO_PuppetWrapperPacket) {
    this.parent.sendPacketToPlayersInScene(packet);
  }
}

export class PuppetOverlordClient {
  private puppets: Map<string, Puppet> = new Map<string, Puppet>();
  private awaiting_spawn: Puppet[] = new Array<Puppet>();
  fakeClientPuppet!: Puppet;
  private amIAlone = true;
  private playersAwaitingPuppets: INetworkPlayer[] = new Array<
    INetworkPlayer
  >();
  @ParentReference()
  parent!: IMMOnlineHelpers;
  private Epona!: HorseData;
  private queuedSpawn: boolean = false;

  @ModLoaderAPIInject()
  private ModLoader!: IModLoaderAPI;
  @InjectCore()
  private core!:  API.IMMCore;

  
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

  localPlayerChangingScenes(entering_scene: number, form: API.MMForms) {
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

  changePuppetScene(player: INetworkPlayer, entering_scene: number, form: API.MMForms) {
    if (this.puppets.has(player.uuid)) {
      let puppet = this.puppets.get(player.uuid)!;
      if (puppet.isSpawned && puppet.form !== form) {
        puppet.despawn();
      }
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
    } else {
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
          this.core = global.ModLoader["MMCore"],
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
      puppet.spawn();
    }
  }

  lookForMissingOrStrandedPuppets() {
    let check = false;
    this.puppets.forEach(
      (value: Puppet, key: string, map: Map<string, Puppet>) => {
        if (value.scene === this.fakeClientPuppet.scene) {
          if (!value.isSpawned && this.awaiting_spawn.indexOf(value) === -1) {
            this.awaiting_spawn.push(value);
          }
          check = true;
        }
        if (
          value.scene !== this.fakeClientPuppet.scene &&
          value.isSpawned &&
          !value.isShoveled
        ) {
          value.shovel();
        }
      }
    );
    if (check) {
      this.amIAlone = false;
    } else {
      this.amIAlone = true;
    }
  }

  sendPuppetPacket() {
    if (!this.amIAlone) {
      let packet = new MMO_PuppetPacket(this.fakeClientPuppet.data, this.ModLoader.clientLobby);
      //if (this.Epona !== undefined) {
       // packet.setHorseData(this.Epona);
      //}
      this.ModLoader.clientSide.sendPacket(new MMO_PuppetWrapperPacket(packet, this.ModLoader.clientLobby));
    }
  }

  processPuppetPacket(packet: MMO_PuppetWrapperPacket) {
    if (this.puppets.has(packet.player.uuid)) {
      let puppet: Puppet = this.puppets.get(packet.player.uuid)!;
      let actualPacket = JSON.parse(packet.data) as MMO_PuppetPacket;
      puppet.processIncomingPuppetData(actualPacket.data);
      //if (actualPacket.horse_data !== undefined) {
        //puppet.processIncomingHorseData(actualPacket.horse_data);
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

  isCurrentlyWarping() {
    return this.core.link.rdramRead32(0x69C) === 0x00030000;
  }

  @onTick()
  onTick() {
    if (
      this.core.helper.isTitleScreen() ||
      !this.core.helper.isSceneNumberValid() ||
      this.core.helper.isPaused()
    ) {
      return;
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
    this.sendPuppetPacket();
  }

  // Actual Handlers
  @EventHandler(EventsClient.ON_PLAYER_JOIN)
  onPlayerJoin(player: INetworkPlayer) {
    this.registerPuppet(player);
  }

  @EventHandler(EventsClient.ON_PLAYER_LEAVE)
  onPlayerLeft(player: INetworkPlayer) {
    this.unregisterPuppet(player);
  }

  @EventHandler(API.MMEvents.ON_LOADING_ZONE)
  onLoadingZone(evt: any) {
    this.localPlayerLoadingZone();
  }

  @EventHandler(API.MMEvents.ON_SCENE_CHANGE)
  onSceneChange(scene: number) {
    this.localPlayerLoadingZone();
    this.localPlayerChangingScenes(scene, this.core.save.form);
  }

  @NetworkHandler('MMO_ScenePacket')
  onSceneChange_client(packet: MMO_ScenePacket) {
    this.changePuppetScene(packet.player, packet.scene, packet.form);
  }



  @NetworkHandler('MMO_PuppetPacket')
  onPuppetData_client(packet: MMO_PuppetWrapperPacket) {
    if (
      this.core.helper.isTitleScreen() ||
      this.core.helper.isPaused() ||
      this.core.helper.isLinkEnteringLoadingZone()
    ) {
      return;
    }
    this.processPuppetPacket(packet);
  }

  @EventHandler(API.MMEvents.ON_AGE_CHANGE)
  onAgeChange(form: API.MMForms) {
    this.localPlayerLoadingZone();
  }

  @EventHandler(ModLoaderEvents.ON_CRASH)
  onEmuCrash(evt: any) {
    this.generateCrashDump();
  }

  @EventHandler(API.MMEvents.ON_ACTOR_SPAWN)
  onEponaSpawned(actor: IActor) {
    if (actor.actorID === 0x0014) {
      // Epona spawned.
      //this.ModLoader.logger.debug("Epona spawned");
      //this.Epona = new HorseData(actor, this.fakeClientPuppet, this.core);
    }
  }

  @EventHandler(API.MMEvents.ON_ACTOR_DESPAWN)
  onEponaDespawned(actor: IActor) {
    if (actor.actorID === 0x0014) {
      // Epona despawned.
      //@ts-ignore
      //this.Epona = undefined;
      //this.ModLoader.logger.debug("Epona despawned");
    }
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
}