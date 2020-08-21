"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puppet = void 0;
const PuppetData_1 = require("./PuppetData");
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMOAPI_1 = require("../../MMOAPI/MMOAPI");
const fs_1 = __importDefault(require("fs"));
const DEADBEEF_OFFSET = 0x288;
class Puppet {
    constructor(player, core, pointer, ModLoader, parent) {
        this.isSpawned = false;
        this.isSpawning = false;
        this.isShoveled = false;
        this.player = player;
        this.data = new PuppetData_1.PuppetData(pointer, ModLoader, core);
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
        Object.keys(copy).forEach((key) => {
            this.data[key] = copy[key];
        });
    }
    doNotDespawnMe(p) {
        this.ModLoader.emulator.rdramWrite8(p + 0x3, 0xff);
    }
    spawn() {
        if (this.isShoveled) {
            this.isShoveled = false;
            this.ModLoader.logger.debug('Puppet resurrected.');
            return;
        }
        if (!this.isSpawned && !this.isSpawning) {
            EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.PLAYER_PUPPET_PRESPAWN, this);
            this.isSpawning = true;
            this.data.pointer = 0x0;
            this.ModLoader.emulator.rdramWrite16(0x80000E, this.form);
            this.parent["writeModel"]();
            fs_1.default.writeFileSync(global.ModLoader.startdir + "/ram.bin", this.ModLoader.emulator.rdramReadBuffer(0x0, (16 * 1024 * 1024)));
            this.core.commandBuffer.runCommand(1 /* SPAWN_ACTOR */, 0x80800000, (success, result) => {
                if (success) {
                    this.data.pointer = result & 0x00ffffff;
                    this.doNotDespawnMe(this.data.pointer);
                    if (this.hasAttachedHorse()) {
                        let horse = this.getAttachedHorse();
                        this.doNotDespawnMe(horse);
                        //this.horse = new HorseData(this.core.link, this, this.core);
                    }
                    this.void = this.ModLoader.math.rdramReadV3(this.data.pointer + 0x24);
                    this.isSpawned = true;
                    this.isSpawning = false;
                    EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.PLAYER_PUPPET_SPAWNED, this);
                }
            });
        }
    }
    processIncomingPuppetData(data) {
        if (this.isSpawned && !this.isShoveled) {
            Object.keys(data).forEach((key) => {
                this.data[key] = data[key];
            });
        }
    }
    /*processIncomingHorseData(data: HorseData) {
      if (this.isSpawned && !this.isShoveled && this.horse !== undefined) {
        Object.keys(data).forEach((key: string) => {
          (this.horse as any)[key] = (data as any)[key];
        });
      }
    }*/
    shovel() {
        if (this.isSpawned) {
            if (this.data.pointer > 0) {
                if (this.ModLoader.emulator.rdramRead32(this.data.pointer + DEADBEEF_OFFSET) === 0xDEADBEEF) {
                    if (this.getAttachedHorse() > 0) {
                        let horse = this.getAttachedHorse();
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
                    let horse = this.getAttachedHorse();
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
            EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.PLAYER_PUPPET_DESPAWNED, this);
        }
    }
    getAttachedHorse() {
        //return this.ModLoader.emulator.dereferencePointer(this.data.pointer + 0x011C);
        return 0;
    }
    hasAttachedHorse() {
        return false;
    }
}
exports.Puppet = Puppet;
//# sourceMappingURL=Puppet.js.map