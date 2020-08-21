"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuffer = exports.CommandBufferSlot = void 0;
const instance = 0x00800000 + 0x100;
const slotSize = 0x8;
const slotCount = 16;
class CommandBufferSlot {
    constructor(addr, emulator) {
        this.callback = () => { };
        this.addr_cmd = addr;
        this.addr_result = addr + 0x4;
        this.emulator = emulator;
    }
    get cmd() {
        return this.emulator.rdramRead32(this.addr_cmd);
    }
    set cmd(command) {
        this.emulator.rdramWrite32(this.addr_cmd, command);
    }
    set param(data) {
        this.emulator.rdramWrite32(this.addr_result, data);
    }
    halfParam(half, data) {
        this.emulator.rdramWrite16(this.addr_result + (half * 2), data);
    }
    get result() {
        return this.emulator.rdramRead32(this.addr_result);
    }
}
exports.CommandBufferSlot = CommandBufferSlot;
class CommandBuffer {
    constructor(emulator) {
        this.slots = new Array(slotCount);
        this.tickingSlots = new Array();
        for (let i = 0; i < slotCount; i++) {
            this.slots[i] = new CommandBufferSlot(instance + i * slotSize, emulator);
        }
    }
    runWarp(entrance, cutscene, callback = () => { }) {
        for (let i = 0; i < slotCount; i++) {
            if (this.slots[i].cmd === 0) {
                // Free slot.
                this.slots[i].halfParam(0, entrance);
                this.slots[i].halfParam(1, cutscene);
                this.slots[i].cmd = 5 /* WARP */;
                this.slots[i].callback = callback;
                this.tickingSlots.push(i);
                break;
            }
        }
    }
    runCommand(command, param, callback = () => { }) {
        let success = false;
        for (let i = 0; i < slotCount; i++) {
            if (this.slots[i].cmd === 0) {
                // Free slot.
                this.slots[i].param = param;
                this.slots[i].cmd = command;
                this.slots[i].callback = callback;
                this.tickingSlots.push(i);
                success = true;
                break;
            }
        }
        return success;
    }
    nukeBuffer() {
        if (this.tickingSlots.length > 0) {
            this.tickingSlots.splice(0, this.tickingSlots.length);
        }
        for (let i = 0; i < this.slots.length; i++) {
            this.slots[i].cmd = 0;
            this.slots[i].param = 0;
        }
    }
    onTick() {
        if (this.tickingSlots.length > 0) {
            this.tickingSlots.forEach((value, index, arr) => {
                if (this.slots[value].cmd === 0) {
                    // command is finished.
                    this.slots[value].callback(this.slots[value].cmd === 0, this.slots[value].result);
                    this.slots[value].param = 0x00000000;
                    this.tickingSlots.splice(index, 1);
                }
            });
        }
    }
}
exports.CommandBuffer = CommandBuffer;
//# sourceMappingURL=CommandBuffer.js.map