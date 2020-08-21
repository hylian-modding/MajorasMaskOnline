"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuppetData = void 0;
const actor = 0x0000;
const anim_data = 0x0144;
class PuppetData {
    constructor(pointer, ModLoader, core) {
        this.copyFields = new Array();
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
        this.copyFields.push('nowAnim');
        this.copyFields.push('lastMask');
        this.copyFields.push('blastMaskTimer');
        this.copyFields.push('maskProps');
    }
    get pos() {
        return this.core.link.rawPos;
    }
    set pos(pos) {
        this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x24, pos);
    }
    get rot() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xBC, 0x6);
    }
    set rot(rot) {
        this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0xBC, rot);
    }
    get maskProps() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadBuffer(offsets.mask_props, 0x12C);
    }
    set maskProps(maskProps) {
        this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x3A4, maskProps);
    }
    get shieldRot() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0xAB2, 0x6);
    }
    set shieldRot(shieldRot) {
        this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x392, shieldRot);
    }
    get anim() {
        return this.core.link.anim_data;
    }
    set anim(anim) {
        this.ModLoader.emulator.rdramWriteBuffer(this.pointer + 0x144, anim);
    }
    get xzSpeed() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead32(offsets.link_instance + 0x70);
    }
    set xzSpeed(xzSpeed) {
        this.ModLoader.emulator.rdramWrite32(this.pointer + 0x70, xzSpeed);
    }
    get nowShield() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x144);
    }
    set nowShield(nowShield) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F4, nowShield);
    }
    get nowMask() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.link_instance + (0x144 + 0xF));
    }
    set nowMask(nowMask) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x1F5, nowMask);
    }
    get lastMask() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.link_instance + (0x144 + 0x11));
    }
    set lastMask(lastMask) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x3A0, lastMask);
    }
    get blastMaskTimer() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead16(offsets.link_instance + 0xB60);
    }
    set blastMaskTimer(blastMaskTimer) {
        this.ModLoader.emulator.rdramWrite16(this.pointer + 0x3A2, blastMaskTimer);
    }
    get actionParam1() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x147);
    }
    set actionParam1(actionParam1) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38C, actionParam1);
    }
    get actionParam2() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.link_instance + 0x14A);
    }
    set actionParam2(actionParam2) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38D, actionParam2);
    }
    get equipSword() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.sword_equip);
    }
    set equipSword(equipSword) {
        this.ModLoader.emulator.rdramWrite8(this.pointer + 0x38E, equipSword);
    }
    get razorDurability() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead16(offsets.razor_hits);
    }
    set razorDurability(razorDurability) {
        this.ModLoader.emulator.rdramWrite16(this.pointer + 0x390, razorDurability);
    }
    get dekuStickLength() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadF32(offsets.link_instance + 0xB0C);
    }
    set dekuStickLength(dekuStickLength) {
        this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x398, dekuStickLength);
    }
    get nowAnim() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadF32(offsets.link_instance + 0x248);
    }
    set nowAnim(nowAnim) {
        this.ModLoader.emulator.rdramWriteF32(this.pointer + 0x39C, nowAnim);
    }
    get form() {
        return this.core.save.form;
    }
    toJSON() {
        const jsonObj = {};
        for (let i = 0; i < this.copyFields.length; i++) {
            jsonObj[this.copyFields[i]] = this[this.copyFields[i]];
        }
        return jsonObj;
    }
}
exports.PuppetData = PuppetData;
//# sourceMappingURL=PuppetData.js.map