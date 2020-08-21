"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const Actor_1 = require("./Actor");
class Link extends Actor_1.ActorBase {
    constructor(ModLoader) {
        super(ModLoader.emulator, ModLoader.math, global.ModLoader.MMOffsets.link_instance);
        this.ModLoader = ModLoader;
    }
    get rawStateValue() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead32(offsets.link_state);
    }
    get state() {
        let offsets = global.ModLoader.MMOffsets;
        switch (this.ModLoader.emulator.rdramRead32(offsets.link_state)) {
            case 0:
                return 1 /* STANDING */;
            case 0x00000008:
                return 1 /* STANDING */;
            case 0x20000000:
                return 4 /* BUSY */;
            case 0x30000000:
                return 3 /* OCARINA */;
            case 0x20000001:
                return 5 /* LOADING_ZONE */;
            case 0x80000000:
                return 6 /* ENTERING_GROTTO */;
            case 0x00100000:
                return 7 /* FIRST_PERSON */;
            case 0x00040000:
                return 8 /* JUMPING */;
            case 0x08000000:
                return 2 /* SWIMMING */;
            case 0x00004000:
                return 9 /* CLIMBING_OUT_OF_WATER */;
            case 0x00002000:
                return 10 /* HANGING_FROM_LEDGE */;
            case 0x00800000:
                return 15 /* RIDING_EPONA */;
            case 0x00000080:
                return 16 /* DYING */;
            case 0x04000000:
                return 17 /* TAKING_DAMAGE */;
            case 0x00080000:
                return 18 /* FALLING */;
            case 0x00068000:
                return 18 /* FALLING */;
            case 0xa0040000:
                return 19 /* VOIDING_OUT */;
            case 0x20000c00:
                return 13 /* GETTING_ITEM */;
            case 0x20010040:
                return 20 /* TALKING */;
            case 0x00018000:
                return 22 /* Z_TARGETING */;
            case 0x00028000:
                return 22 /* Z_TARGETING */;
            case 0x00000800:
                return 12 /* HOLDING_ACTOR */;
        }
        return 0 /* UNKNOWN */;
    }
    /*get state2(): LinkState2 {
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        let s2: number = this.ModLoader.emulator.rdramRead32(offsets.link_state);
        let digits = s2.toString().split('');
        let realDigits = digits.map(Number);
        let idle: number = realDigits[0];
        let crawlspace: number = realDigits[3];
        let moving: number = realDigits[6];
        if (idle === 0x1) {
            return LinkState2.IDLE;
        }
        if (crawlspace === 0x4) {
            return LinkState2.CRAWLSPACE;
        }
        if (moving === 0x2) {
            return LinkState2.MOVING_FORWARD;
        }
        return LinkState2.UNKNOWN;
    }*/
    get anim_data() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadBuffer(offsets.anim, 0x86);
    }
    get rawPos() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0x24, 0xC);
    }
}
exports.Link = Link;
//# sourceMappingURL=Link.js.map