import Vector3 from 'modloader64_api/math/Vector3';
import IMemory from 'modloader64_api/IMemory';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';
import { IMath } from 'modloader64_api/math/IMath';
import { IActor } from './IActor';
import { ActorCategory } from '../MMAPI/ActorCategory';

export class ActorBase extends JSONTemplate implements IActor, IMath {
    actorUUID = '';
    private readonly emulator: IMemory;
    private readonly math: IMath;
    instance: number;
    exists = true;

    jsonFields: string[] = [
        'actorID',
        'actorUUID',
        'health',
        'pos',
        'rot'
    ];

    constructor(emulator: IMemory, math: IMath, pointer: number) {
        super();
        this.emulator = emulator;
        this.instance = pointer;
        this.math = math;
    }
    rdramReadPtrV3(addr: number, offset: number): Vector3 {
        throw new Error("Method not implemented.");
    }
    rdramWritePtrV3(addr: number, offset: number, rhs: Vector3): void {
        throw new Error("Method not implemented.");
    }

    get actorID(): number {
        return this.rdramRead16(0)
    }

    set actorID(value: number) {
        this.rdramWrite16(0, value);
    }

    get actorType(): ActorCategory {
        return this.rdramRead8(0x2);
    }

    get room(): number {
        return this.rdramRead8(0x3);
    }

    get flags(): number {
        return this.rdramRead32(0x4);
    }

    get posInit(): Vector3 {
        return this.math.rdramReadV3(0x8)
    }

    get rotInit(): Vector3 {
        return this.math.rdramReadV3i16(0x14);
    }

    get variable(): number {
        return this.rdramRead16(0x1C);
    }

    get objectTableIndex(): number {
        return this.rdramRead8(0x1E);
    }

    get targetDistanceIndex(): number {
        return this.rdramRead8(0x1F);
    }

    get soundEffect(): number {
        return this.rdramRead16(0x20);
    }

    get pos(): Vector3 {
        return this.math.rdramReadV3(0x24);
    }

    get dir(): Vector3 {
        return this.math.rdramReadV3i16(0x32);
    }

    get posTatl(): Vector3 {
        return this.math.rdramReadV3(0x3C);
    }

    get rot_1(): Vector3 {
        return this.math.rdramReadV3i16(0x48);
    }

    get scale(): Vector3 {
        return this.math.rdramReadV3(0x58);
    }

    get vel(): Vector3 {
        return this.math.rdramReadV3(0x64);
    }

    get xzSpeed(): number {
        return this.rdramReadF32(0x70);
    }

    get gravity(): number {
        return this.rdramReadF32(0x74);
    }

    get minVelY(): number {
        return this.rdramReadF32(0x78);
    }

    get wallPolyPtr(): number {
        return this.rdramRead32(0x7C);
    }

    get floorPolyPtr(): number {
        return this.rdramRead32(0x80);
    }

    get wallRot(): number {
        return this.rdramRead16(0x84);
    }

    get floorHeight(): number {
        return this.rdramReadF32(0x88);
    }

    get waterSurfaceDist(): number {
        return this.rdramReadF32(0x8C);
    }

    get bgcheckFlags(): number {
        return this.rdramRead16(0x90);
    }

    get rotTowardLinkY(): number {
        return this.rdramRead16(0x92);
    }

    get distFromLinkXZ(): number {
        return this.rdramReadF32(0x98);
    }

    get distFromLinkY(): number {
        return this.rdramReadF32(0x9C);
    }

    get damageTable(): number {
        return this.rdramRead32(0xA0);
    }

    get vel_2(): Vector3 {
        return this.math.rdramReadV3(0xA4);
    }

    get mass(): number {
        return this.rdramRead8(0xB6);
    }

    get health(): number {
        return this.rdramRead8(0xB7);
    }

    get damage(): number {
        return this.rdramRead8(0xB8);
    }

    get damageEffect(): number {
        return this.rdramRead8(0xB9);
    }

    get impactEffect(): number {
        return this.rdramRead8(0xBA);
    }

    get rot(): Vector3 {
        return this.rdramReadV3i16(0xBC);
    }

    get drawDropShadowPtr(): number {
        return this.rdramRead32(0xC8);
    }

    get shadowRadius(): number {
        return this.rdramReadF32(0xCC);
    }

    get drawDistance(): number {
        return this.rdramReadF32(0xFC);
    }

    get cameraClipNear(): number {
        return this.rdramReadF32(0x100);
    }

    get cameraClipFar(): number {
        return this.rdramReadF32(0x104);
    }

    get pos_4(): Vector3 {
        return this.rdramReadV3(0x108);
    }


    set actorType(value: ActorCategory) {
        this.rdramWrite8(0x2, value);
    }

    set room(value: number) {
        this.rdramWrite8(0x3, value);
    }

    set flags(value: number) {
        this.rdramWrite32(0x4, value);
    }

    set posInit(value: Vector3) {
        this.math.rdramWriteV3(0x8, value);
    }

    set rotInit(value: Vector3) {
        this.rdramWriteV3i16(0x14, value);
    }

    set variable(value: number) {
        this.rdramWrite16(0x1C, value);
    }

    set objectTableIndex(value: number) {
        this.rdramWrite8(0x1E, value);
    }

    set targetDistanceIndex(value: number) {
        this.rdramWrite8(0x1F, value);
    }

    set soundEffect(value: number) {
        this.rdramWrite16(0x20, value);
    }

    set pos(value: Vector3) {
        this.rdramWriteV3(0x24, value);
    }

    set dir(value: Vector3) {
        this.rdramWriteV3i16(0x32, value);
    }

    set posTatl(value: Vector3) {
        this.rdramWriteV3(0x3C, value);
    }

    set rot_1(value: Vector3) {
        this.rdramWriteV3i16(0x48, value);
    }

    set scale(value: Vector3) {
        this.rdramWriteV3(0x58, value);
    }

    set vel(value: Vector3) {
        this.rdramWriteV3(0x64, value);
    }

    set xzSpeed(value: number) {
        this.rdramWriteF32(0x70, value);
    }

    set gravity(value: number) {
        this.rdramWriteF32(0x74, value);
    }

    set minVelY(value: number) {
        this.rdramWriteF32(0x78, value);
    }

    set wallPolyPtr(value: number) {
        this.rdramWrite32(0x7C, value);
    }

    set floorPolyPtr(value: number) {
        this.rdramWrite32(0x80, value);
    }

    set wallRot(value: number) {
        this.rdramWrite16(0x84, value);
    }

    set floorHeight(value: number) {
        this.rdramWriteF32(0x88, value);
    }

    set waterSurfaceDist(value: number) {
        this.rdramWriteF32(0x8C, value);
    }

    set bgcheckFlags(value: number) {
        this.rdramWrite16(0x90, value);
    }

    set rotTowardLinkY(value: number) {
        this.rdramWrite16(0x92, value);
    }

    set distFromLinkXZ(value: number) {
        this.rdramWriteF32(0x98, value);
    }

    set distFromLinkY(value: number) {
        this.rdramWriteF32(0x9C, value);
    }

    set damageTable(value: number) {
        this.rdramWrite32(0xA0, value);
    }

    set vel_2(value: Vector3) {
        this.rdramWriteV3(0xA4, value);
    }

    set mass(value: number) {
        this.rdramWrite8(0xB6, value);
    }

    set health(value: number) {
        this.rdramWrite8(0xB7, value);
    }

    set damage(value: number) {
        this.rdramWrite8(0xB8, value);
    }

    set damageEffect(value: number) {
        this.rdramWrite8(0xB9, value);
    }

    set impactEffect(value: number) {
        this.rdramWrite8(0xBA, value);
    }

    set rot(value: Vector3) {
        this.rdramWriteV3i16(0xBC, value);
    }

    set drawDropShadowPtr(value: number) {
        this.rdramWrite32(0xC8, value);
    }

    set shadowRadius(value: number) {
        this.rdramWriteF32(0xCC, value);
    }

    set drawDistance(value: number) {
        this.rdramWriteF32(0xFC, value);
    }

    set cameraClipNear(value: number) {
        this.rdramWriteF32(0x100, value);
    }

    set cameraClipFar(value: number) {
        this.rdramWriteF32(0x104, value);
    }

    set pos_4(value: Vector3) {
        this.rdramWriteV3(0x108, value);
    }

    destroy(): void {
        this.rdramWrite32(0x130, 0x0);
        this.rdramWrite32(0x134, 0x0);
    }

    rdramRead8(addr: number): number {
        return this.emulator.rdramRead8(this.instance + addr);
    }
    rdramWrite8(addr: number, value: number): void {
        this.emulator.rdramWrite8(this.instance + addr, value);
    }
    rdramRead16(addr: number): number {
        return this.emulator.rdramRead16(this.instance + addr);
    }
    rdramWrite16(addr: number, value: number): void {
        this.emulator.rdramWrite16(this.instance + addr, value);
    }
    rdramWrite32(addr: number, value: number): void {
        this.emulator.rdramWrite32(this.instance + addr, value);
    }
    rdramRead32(addr: number): number {
        return this.emulator.rdramRead32(this.instance + addr);
    }
    rdramReadBuffer(addr: number, size: number): Buffer {
        return this.emulator.rdramReadBuffer(this.instance + addr, size);
    }
    rdramWriteBuffer(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBuffer(this.instance + addr, buf);
    }
    dereferencePointer(addr: number): number {
        return this.emulator.dereferencePointer(this.instance + addr);
    }
    rdramReadS8(addr: number): number {
        return this.emulator.rdramReadS8(this.instance + addr);
    }
    rdramReadS16(addr: number): number {
        return this.emulator.rdramReadS16(this.instance + addr);
    }
    rdramReadS32(addr: number): number {
        return this.emulator.rdramReadS32(this.instance + addr);
    }
    rdramReadBitsBuffer(addr: number, bytes: number): Buffer {
        return this.emulator.rdramReadBitsBuffer(this.instance + addr, bytes);
    }
    rdramReadBits8(addr: number): Buffer {
        return this.emulator.rdramReadBits8(this.instance + addr);
    }
    rdramReadBit8(addr: number, bitoffset: number): boolean {
        return this.emulator.rdramReadBit8(this.instance + addr, bitoffset);
    }
    rdramWriteBitsBuffer(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBitsBuffer(this.instance + addr, buf);
    }
    rdramWriteBits8(addr: number, buf: Buffer): void {
        this.emulator.rdramWriteBits8(this.instance + addr, buf);
    }
    rdramWriteBit8(addr: number, bitoffset: number, bit: boolean): void {
        this.emulator.rdramWriteBit8(this.instance + addr, bitoffset, bit);
    }
    rdramReadPtr8(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr8(this.instance + addr, offset);
    }
    rdramWritePtr8(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr8(this.instance + addr, offset, value);
    }
    rdramReadPtr16(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr16(this.instance + addr, offset);
    }
    rdramWritePtr16(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr16(this.instance + addr, offset, value);
    }
    rdramWritePtr32(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtr32(this.instance + addr, offset, value);
    }
    rdramReadPtr32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtr32(this.instance + addr, offset);
    }
    rdramReadPtrBuffer(addr: number, offset: number, size: number): Buffer {
        return this.emulator.rdramReadPtrBuffer(this.instance + addr, offset, size);
    }
    rdramWritePtrBuffer(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBuffer(this.instance + addr, offset, buf);
    }
    rdramReadPtrS8(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS8(this.instance + addr, offset);
    }
    rdramReadPtrS16(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS16(this.instance + addr, offset);
    }
    rdramReadPtrS32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrS32(this.instance + addr, offset);
    }
    rdramReadPtrBitsBuffer(addr: number, offset: number, bytes: number): Buffer {
        return this.emulator.rdramReadPtrBitsBuffer(
            this.instance + addr,
            offset,
            bytes
        );
    }
    rdramReadPtrBits8(addr: number, offset: number): Buffer {
        return this.emulator.rdramReadPtrBits8(this.instance + addr, offset);
    }
    rdramReadPtrBit8(addr: number, offset: number, bitoffset: number): boolean {
        return this.emulator.rdramReadPtrBit8(
            this.instance + addr,
            offset,
            bitoffset
        );
    }
    rdramWritePtrBitsBuffer(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBitsBuffer(this.instance + addr, offset, buf);
    }
    rdramWritePtrBits8(addr: number, offset: number, buf: Buffer): void {
        this.emulator.rdramWritePtrBits8(this.instance + addr, offset, buf);
    }
    rdramWritePtrBit8(
        addr: number,
        offset: number,
        bitoffset: number,
        bit: boolean
    ): void {
        this.emulator.rdramWritePtrBit8(
            this.instance + addr,
            offset,
            bitoffset,
            bit
        );
    }
    rdramReadF32(addr: number): number {
        return this.emulator.rdramReadF32(addr);
    }
    rdramReadPtrF32(addr: number, offset: number): number {
        return this.emulator.rdramReadPtrF32(addr, offset);
    }
    rdramWriteF32(addr: number, value: number): void {
        this.emulator.rdramWriteF32(this.instance + addr, value);
    }
    rdramWritePtrF32(addr: number, offset: number, value: number): void {
        this.emulator.rdramWritePtrF32(this.instance + addr, offset, value);
    }
    rdramReadV3(addr: number): Vector3 {
        return this.math.rdramReadV3(this.instance + addr)
    }
    rdramWriteV3(addr: number, rhs: Vector3): void {
        return this.math.rdramWriteV3(this.instance + addr, rhs)
    }
    rdramReadV3i(addr: number): Vector3 {
        return this.math.rdramReadV3i(this.instance + addr)
    }
    rdramWriteV3i(addr: number, rhs: Vector3): void {
        return this.math.rdramWriteV3i(this.instance + addr, rhs)
    }
    rdramReadV3i16(addr: number): Vector3 {
        return this.math.rdramReadV3i16(this.instance + addr)
    }
    rdramWriteV3i16(addr: number, rhs: Vector3): void {
        return this.math.rdramWriteV3i(this.instance + addr, rhs)
    }
    rdramReadV3i8(addr: number): Vector3 {
        return this.math.rdramReadV3i8(this.instance + addr)
    }
    rdramWriteV3i8(addr: number, rhs: Vector3): void {
        return this.math.rdramWriteV3i8(this.instance + addr, rhs)
    }



    memoryDebugLogger(bool: boolean): void { }
}