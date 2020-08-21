"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverlayPayload = void 0;
const PayloadType_1 = require("modloader64_api/PayloadType");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class find_init {
    constructor() { }
    find(buf, locate) {
        let loc = Buffer.from(locate, 'hex');
        if (buf.indexOf(loc) > -1) {
            return buf.indexOf(loc);
        }
        return -1;
    }
}
class OverlayPayload extends PayloadType_1.PayloadType {
    constructor(ext) {
        super(ext);
    }
    parse(file, buf, dest) {
        console.log('Trying to allocate actor...');
        let overlay_start = 0x1AEFD0;
        let size = 0x02b1;
        let empty_slots = new Array();
        for (let i = 0; i < size; i++) {
            let entry_start = overlay_start + i * 0x20;
            let _i = dest.rdramRead32(entry_start + 0x14);
            let total = 0;
            total += _i;
            if (total === 0) {
                empty_slots.push(i);
            }
        }
        console.log(empty_slots.length + ' empty actor slots found.');
        let finder = new find_init();
        let meta = JSON.parse(fs_1.default.readFileSync(path_1.default.join(path_1.default.parse(file).dir, path_1.default.parse(file).name + '.json')).toString());
        let offset = finder.find(buf, meta.init);
        if (offset === -1) {
            console.log('Failed to find spawn parameters for actor ' +
                path_1.default.parse(file).base +
                '.');
            return -1;
        }
        let addr = parseInt(meta.addr) + offset;
        let slot = empty_slots.shift();
        console.log('Assigning ' + path_1.default.parse(file).base + ' to slot ' + slot + '.');
        dest.rdramWrite32(slot * 0x20 + overlay_start + 0x14, 0x80000000 + addr);
        buf.writeUInt8(slot, offset + 0x1);
        dest.rdramWriteBuffer(parseInt(meta.addr), buf);
        return slot;
    }
}
exports.OverlayPayload = OverlayPayload;
//# sourceMappingURL=ovlinjector.js.map