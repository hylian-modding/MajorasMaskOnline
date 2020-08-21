"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorManager = void 0;
const Actor_1 = require("./Actor");
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMAPI_1 = require("../MMAPI/MMAPI");
class ActorManager {
    constructor(emulator, logger, helper, global, utils, math) {
        this.actor_array_addr = 0x001c30;
        this.ringbuffer_start_addr = 0x600000 + 0x1e0;
        this.ringbuffer_index_addr = 0x600000 + 0x11e0;
        this.ringbuffer_entry_size = 0x10;
        this.ringbuffer_max = 0x100;
        this.actor_next_offset = 0x124;
        this.actors_pointers_this_frame = new Array();
        this.actors_this_frame = new Map();
        this.emulator = emulator;
        this.logger = logger;
        this.helper = helper;
        this.global = global;
        this.utils = utils;
        this.math = math;
        for (let i = 0; i < 12; i++) {
            this.actors_this_frame.set(i, new Array());
        }
    }
    createIActorFromPointer(pointer) {
        return new Actor_1.ActorBase(this.emulator, this.math, pointer);
    }
    onTick() {
        this.actors_pointers_this_frame.length = 0;
        if (!this.helper.isLinkEnteringLoadingZone()) {
            for (let i = 0; i < 12 * 8; i += 8) {
                let count = this.emulator.rdramReadPtr32(global.ModLoader.global_context_pointer, this.actor_array_addr + i);
                let ptr = this.emulator.dereferencePointer(global.ModLoader.global_context_pointer);
                if (count > 0) {
                    let pointer = this.emulator.dereferencePointer(ptr + this.actor_array_addr + (i + 4));
                    this.actors_pointers_this_frame.push(pointer);
                    let next = this.emulator.dereferencePointer(pointer + this.actor_next_offset);
                    while (next > 0) {
                        this.actors_pointers_this_frame.push(next);
                        next = this.emulator.dereferencePointer(next + this.actor_next_offset);
                    }
                }
            }
        }
        for (let i = 0; i < this.ringbuffer_max * this.ringbuffer_entry_size; i += this.ringbuffer_entry_size) {
            // Get all the entry data.
            let category = this.emulator.rdramRead32(this.ringbuffer_start_addr + i);
            // Break asap if we hit a zero. This means there is no further data that needs our attention this frame.
            if (category === 0) {
                break;
            }
            let addr = this.emulator.dereferencePointer(this.ringbuffer_start_addr + i + 4);
            if (addr > 0) {
                if (this.actors_pointers_this_frame.indexOf(addr) > -1) {
                    let actor = new Actor_1.ActorBase(this.emulator, this.math, addr);
                    let uuid = actor.actorID.toString(16) +
                        '-' +
                        actor.variable.toString(16) +
                        '-' +
                        this.global.scene +
                        '-' +
                        this.utils.hashBuffer(actor.rdramReadBuffer(0x8, 0x12));
                    actor.actorUUID = uuid;
                    this.actors_this_frame.get(actor.actorType).push(actor);
                    EventHandler_1.bus.emit(MMAPI_1.MMEvents.ON_ACTOR_SPAWN, actor);
                }
            }
            // Clear the entry when we're done with it.
            this.emulator.rdramWrite32(this.ringbuffer_start_addr + i, 0);
            this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 4, 0);
            this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 8, 0);
            this.emulator.rdramWrite32(this.ringbuffer_start_addr + i + 12, 0);
        }
        this.actors_this_frame.forEach((value, key) => {
            for (let i = 0; i < value.length; i++) {
                if (this.actors_pointers_this_frame.indexOf(value[i].instance) === -1) {
                    value[i].exists = false;
                    let removed = value.splice(i, 1)[0];
                    EventHandler_1.bus.emit(MMAPI_1.MMEvents.ON_ACTOR_DESPAWN, removed);
                }
            }
        });
        // Clear the ring buffer index so it snaps back to the top.
        this.emulator.rdramWrite32(this.ringbuffer_index_addr, 0);
    }
}
exports.ActorManager = ActorManager;
//# sourceMappingURL=ActorManager.js.map