"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorBase = void 0;
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class ActorBase extends JSONTemplate_1.JSONTemplate {
    constructor(emulator, math, pointer) {
        super();
        this.actorUUID = '';
        this.exists = true;
        this.jsonFields = [
            'actorID',
            'actorUUID',
            'health',
            'pos',
            'rot'
        ];
        this.emulator = emulator;
        this.instance = pointer;
        this.math = math;
    }
    rdramReadPtrV3(addr, offset) {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrV3(addr, offset, rhs) {
        throw new Error("Method not implemented.");
    }
    get actorID() {
        return this.rdramRead16(0);
    }
    set actorID(value) {
        this.rdramWrite16(0, value);
    }
    get actorType() {
        return this.rdramRead8(0x2);
    }
    get room() {
        return this.rdramRead8(0x3);
    }
    get flags() {
        return this.rdramRead32(0x4);
    }
    get posInit() {
        return this.math.rdramReadV3(0x8);
    }
    get rotInit() {
        return this.math.rdramReadV3i16(0x14);
    }
    get variable() {
        return this.rdramRead16(0x1C);
    }
    get objectTableIndex() {
        return this.rdramRead8(0x1E);
    }
    get targetDistanceIndex() {
        return this.rdramRead8(0x1F);
    }
    get soundEffect() {
        return this.rdramRead16(0x20);
    }
    get pos() {
        return this.math.rdramReadV3(0x24);
    }
    get dir() {
        return this.math.rdramReadV3i16(0x32);
    }
    get posTatl() {
        return this.math.rdramReadV3(0x3C);
    }
    get rot_1() {
        return this.math.rdramReadV3i16(0x48);
    }
    get scale() {
        return this.math.rdramReadV3(0x58);
    }
    get vel() {
        return this.math.rdramReadV3(0x64);
    }
    get xzSpeed() {
        return this.rdramReadF32(0x70);
    }
    get gravity() {
        return this.rdramReadF32(0x74);
    }
    get minVelY() {
        return this.rdramReadF32(0x78);
    }
    get wallPolyPtr() {
        return this.rdramRead32(0x7C);
    }
    get floorPolyPtr() {
        return this.rdramRead32(0x80);
    }
    get wallRot() {
        return this.rdramRead16(0x84);
    }
    get floorHeight() {
        return this.rdramReadF32(0x88);
    }
    get waterSurfaceDist() {
        return this.rdramReadF32(0x8C);
    }
    get bgcheckFlags() {
        return this.rdramRead16(0x90);
    }
    get rotTowardLinkY() {
        return this.rdramRead16(0x92);
    }
    get distFromLinkXZ() {
        return this.rdramReadF32(0x98);
    }
    get distFromLinkY() {
        return this.rdramReadF32(0x9C);
    }
    get damageTable() {
        return this.rdramRead32(0xA0);
    }
    get vel_2() {
        return this.math.rdramReadV3(0xA4);
    }
    get mass() {
        return this.rdramRead8(0xB6);
    }
    get health() {
        return this.rdramRead8(0xB7);
    }
    get damage() {
        return this.rdramRead8(0xB8);
    }
    get damageEffect() {
        return this.rdramRead8(0xB9);
    }
    get impactEffect() {
        return this.rdramRead8(0xBA);
    }
    get rot() {
        return this.rdramReadV3i16(0xBC);
    }
    get drawDropShadowPtr() {
        return this.rdramRead32(0xC8);
    }
    get shadowRadius() {
        return this.rdramReadF32(0xCC);
    }
    get drawDistance() {
        return this.rdramReadF32(0xFC);
    }
    get cameraClipNear() {
        return this.rdramReadF32(0x100);
    }
    get cameraClipFar() {
        return this.rdramReadF32(0x104);
    }
    get pos_4() {
        return this.rdramReadV3(0x108);
    }
    set actorType(value) {
        this.rdramWrite8(0x2, value);
    }
    set room(value) {
        this.rdramWrite8(0x3, value);
    }
    set flags(value) {
        this.rdramWrite32(0x4, value);
    }
    set posInit(value) {
        this.math.rdramWriteV3(0x8, value);
    }
    set rotInit(value) {
        this.rdramWriteV3i16(0x14, value);
    }
    set variable(value) {
        this.rdramWrite16(0x1C, value);
    }
    set objectTableIndex(value) {
        this.rdramWrite8(0x1E, value);
    }
    set targetDistanceIndex(value) {
        this.rdramWrite8(0x1F, value);
    }
    set soundEffect(value) {
        this.rdramWrite16(0x20, value);
    }
    set pos(value) {
        this.rdramWriteV3(0x24, value);
    }
    set dir(value) {
        this.rdramWriteV3i16(0x32, value);
    }
    set posTatl(value) {
        this.rdramWriteV3(0x3C, value);
    }
    set rot_1(value) {
        this.rdramWriteV3i16(0x48, value);
    }
    set scale(value) {
        this.rdramWriteV3(0x58, value);
    }
    set vel(value) {
        this.rdramWriteV3(0x64, value);
    }
    set xzSpeed(value) {
        this.rdramWriteF32(0x70, value);
    }
    set gravity(value) {
        this.rdramWriteF32(0x74, value);
    }
    set minVelY(value) {
        this.rdramWriteF32(0x78, value);
    }
    set wallPolyPtr(value) {
        this.rdramWrite32(0x7C, value);
    }
    set floorPolyPtr(value) {
        this.rdramWrite32(0x80, value);
    }
    set wallRot(value) {
        this.rdramWrite16(0x84, value);
    }
    set floorHeight(value) {
        this.rdramWriteF32(0x88, value);
    }
    set waterSurfaceDist(value) {
        this.rdramWriteF32(0x8C, value);
    }
    set bgcheckFlags(value) {
        this.rdramWrite16(0x90, value);
    }
    set rotTowardLinkY(value) {
        this.rdramWrite16(0x92, value);
    }
    set distFromLinkXZ(value) {
        this.rdramWriteF32(0x98, value);
    }
    set distFromLinkY(value) {
        this.rdramWriteF32(0x9C, value);
    }
    set damageTable(value) {
        this.rdramWrite32(0xA0, value);
    }
    set vel_2(value) {
        this.rdramWriteV3(0xA4, value);
    }
    set mass(value) {
        this.rdramWrite8(0xB6, value);
    }
    set health(value) {
        this.rdramWrite8(0xB7, value);
    }
    set damage(value) {
        this.rdramWrite8(0xB8, value);
    }
    set damageEffect(value) {
        this.rdramWrite8(0xB9, value);
    }
    set impactEffect(value) {
        this.rdramWrite8(0xBA, value);
    }
    set rot(value) {
        this.rdramWriteV3i16(0xBC, value);
    }
    set drawDropShadowPtr(value) {
        this.rdramWrite32(0xC8, value);
    }
    set shadowRadius(value) {
        this.rdramWriteF32(0xCC, value);
    }
    set drawDistance(value) {
        this.rdramWriteF32(0xFC, value);
    }
    set cameraClipNear(value) {
        this.rdramWriteF32(0x100, value);
    }
    set cameraClipFar(value) {
        this.rdramWriteF32(0x104, value);
    }
    set pos_4(value) {
        this.rdramWriteV3(0x108, value);
    }
    destroy() {
        this.rdramWrite32(0x130, 0x0);
        this.rdramWrite32(0x134, 0x0);
    }
    rdramRead8(addr) {
        return this.emulator.rdramRead8(this.instance + addr);
    }
    rdramWrite8(addr, value) {
        this.emulator.rdramWrite8(this.instance + addr, value);
    }
    rdramRead16(addr) {
        return this.emulator.rdramRead16(this.instance + addr);
    }
    rdramWrite16(addr, value) {
        this.emulator.rdramWrite16(this.instance + addr, value);
    }
    rdramWrite32(addr, value) {
        this.emulator.rdramWrite32(this.instance + addr, value);
    }
    rdramRead32(addr) {
        return this.emulator.rdramRead32(this.instance + addr);
    }
    rdramReadBuffer(addr, size) {
        return this.emulator.rdramReadBuffer(this.instance + addr, size);
    }
    rdramWriteBuffer(addr, buf) {
        this.emulator.rdramWriteBuffer(this.instance + addr, buf);
    }
    dereferencePointer(addr) {
        return this.emulator.dereferencePointer(this.instance + addr);
    }
    rdramReadS8(addr) {
        return this.emulator.rdramReadS8(this.instance + addr);
    }
    rdramReadS16(addr) {
        return this.emulator.rdramReadS16(this.instance + addr);
    }
    rdramReadS32(addr) {
        return this.emulator.rdramReadS32(this.instance + addr);
    }
    rdramReadBitsBuffer(addr, bytes) {
        return this.emulator.rdramReadBitsBuffer(this.instance + addr, bytes);
    }
    rdramReadBits8(addr) {
        return this.emulator.rdramReadBits8(this.instance + addr);
    }
    rdramReadBit8(addr, bitoffset) {
        return this.emulator.rdramReadBit8(this.instance + addr, bitoffset);
    }
    rdramWriteBitsBuffer(addr, buf) {
        this.emulator.rdramWriteBitsBuffer(this.instance + addr, buf);
    }
    rdramWriteBits8(addr, buf) {
        this.emulator.rdramWriteBits8(this.instance + addr, buf);
    }
    rdramWriteBit8(addr, bitoffset, bit) {
        this.emulator.rdramWriteBit8(this.instance + addr, bitoffset, bit);
    }
    rdramReadPtr8(addr, offset) {
        return this.emulator.rdramReadPtr8(this.instance + addr, offset);
    }
    rdramWritePtr8(addr, offset, value) {
        this.emulator.rdramWritePtr8(this.instance + addr, offset, value);
    }
    rdramReadPtr16(addr, offset) {
        return this.emulator.rdramReadPtr16(this.instance + addr, offset);
    }
    rdramWritePtr16(addr, offset, value) {
        this.emulator.rdramWritePtr16(this.instance + addr, offset, value);
    }
    rdramWritePtr32(addr, offset, value) {
        this.emulator.rdramWritePtr32(this.instance + addr, offset, value);
    }
    rdramReadPtr32(addr, offset) {
        return this.emulator.rdramReadPtr32(this.instance + addr, offset);
    }
    rdramReadPtrBuffer(addr, offset, size) {
        return this.emulator.rdramReadPtrBuffer(this.instance + addr, offset, size);
    }
    rdramWritePtrBuffer(addr, offset, buf) {
        this.emulator.rdramWritePtrBuffer(this.instance + addr, offset, buf);
    }
    rdramReadPtrS8(addr, offset) {
        return this.emulator.rdramReadPtrS8(this.instance + addr, offset);
    }
    rdramReadPtrS16(addr, offset) {
        return this.emulator.rdramReadPtrS16(this.instance + addr, offset);
    }
    rdramReadPtrS32(addr, offset) {
        return this.emulator.rdramReadPtrS32(this.instance + addr, offset);
    }
    rdramReadPtrBitsBuffer(addr, offset, bytes) {
        return this.emulator.rdramReadPtrBitsBuffer(this.instance + addr, offset, bytes);
    }
    rdramReadPtrBits8(addr, offset) {
        return this.emulator.rdramReadPtrBits8(this.instance + addr, offset);
    }
    rdramReadPtrBit8(addr, offset, bitoffset) {
        return this.emulator.rdramReadPtrBit8(this.instance + addr, offset, bitoffset);
    }
    rdramWritePtrBitsBuffer(addr, offset, buf) {
        this.emulator.rdramWritePtrBitsBuffer(this.instance + addr, offset, buf);
    }
    rdramWritePtrBits8(addr, offset, buf) {
        this.emulator.rdramWritePtrBits8(this.instance + addr, offset, buf);
    }
    rdramWritePtrBit8(addr, offset, bitoffset, bit) {
        this.emulator.rdramWritePtrBit8(this.instance + addr, offset, bitoffset, bit);
    }
    rdramReadF32(addr) {
        return this.emulator.rdramReadF32(addr);
    }
    rdramReadPtrF32(addr, offset) {
        return this.emulator.rdramReadPtrF32(addr, offset);
    }
    rdramWriteF32(addr, value) {
        this.emulator.rdramWriteF32(this.instance + addr, value);
    }
    rdramWritePtrF32(addr, offset, value) {
        this.emulator.rdramWritePtrF32(this.instance + addr, offset, value);
    }
    rdramReadV3(addr) {
        return this.math.rdramReadV3(this.instance + addr);
    }
    rdramWriteV3(addr, rhs) {
        return this.math.rdramWriteV3(this.instance + addr, rhs);
    }
    rdramReadV3i(addr) {
        return this.math.rdramReadV3i(this.instance + addr);
    }
    rdramWriteV3i(addr, rhs) {
        return this.math.rdramWriteV3i(this.instance + addr, rhs);
    }
    rdramReadV3i16(addr) {
        return this.math.rdramReadV3i16(this.instance + addr);
    }
    rdramWriteV3i16(addr, rhs) {
        return this.math.rdramWriteV3i(this.instance + addr, rhs);
    }
    rdramReadV3i8(addr) {
        return this.math.rdramReadV3i8(this.instance + addr);
    }
    rdramWriteV3i8(addr, rhs) {
        return this.math.rdramWriteV3i8(this.instance + addr, rhs);
    }
    memoryDebugLogger(bool) { }
}
exports.ActorBase = ActorBase;
//# sourceMappingURL=Actor.js.map