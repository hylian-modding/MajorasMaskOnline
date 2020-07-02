import { PayloadType } from "modloader64_api/PayloadType";
import IMemory from "modloader64_api/IMemory";
import fs from 'fs';
import path from 'path';

class find_init {
    constructor() { }

    find(buf: Buffer, locate: string): number {
        let loc: Buffer = Buffer.from(locate, 'hex');
        if (buf.indexOf(loc) > -1) {
            return buf.indexOf(loc);
        }
        return -1;
    }
}

interface ovl_meta {
    addr: string;
    init: string;
}

export class OverlayPayload extends PayloadType {
    constructor(ext: string) {
        super(ext);
    }

    parse(file: string, buf: Buffer, dest: IMemory) {
        console.log('Trying to allocate actor...');
        let overlay_start: number = 0x1AEFD0;
        let size = 0x02b1;
        let empty_slots: number[] = new Array<number>();
        for (let i = 0; i < size; i++) {
            let entry_start: number = overlay_start + i * 0x20;
            let _i: number = dest.rdramRead32(entry_start + 0x14);
            let total = 0;
            total += _i;
            if (total === 0) {
                empty_slots.push(i);
            }
        }
        console.log(empty_slots.length + ' empty actor slots found.');
        let finder: find_init = new find_init();
        let meta: ovl_meta = JSON.parse(
            fs.readFileSync(path.join(path.parse(file).dir, path.parse(file).name + '.json')).toString()
        );
        let offset: number = finder.find(buf, meta.init);
        if (offset === -1) {
            console.log(
                'Failed to find spawn parameters for actor ' +
                path.parse(file).base +
                '.'
            );
            return -1;
        }
        let addr: number = parseInt(meta.addr) + offset;
        let slot: number = empty_slots.shift() as number;
        console.log('Assigning ' + path.parse(file).base + ' to slot ' + slot + '.');
        dest.rdramWrite32(slot * 0x20 + overlay_start + 0x14, 0x80000000 + addr);
        buf.writeUInt8(slot, offset + 0x1);
        dest.rdramWriteBuffer(parseInt(meta.addr), buf);
        return slot;
    }
}