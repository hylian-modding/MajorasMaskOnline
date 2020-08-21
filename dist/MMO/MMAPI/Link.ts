import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "src/MMO/MMAPI/MMOffsets";
import { ActorBase } from "./Actor";
import { LinkState2, LinkState } from "./MMAPI";

export class Link extends ActorBase {

    ModLoader: IModLoaderAPI;

    constructor(ModLoader: IModLoaderAPI) {
        super(ModLoader.emulator, ModLoader.math, (global.ModLoader.MMOffsets as MMOffsets).link_instance);
        this.ModLoader = ModLoader;
    }
    
    get rawStateValue(): number {
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead32(offsets.link_instance + offsets.link_state);
    }

    get state(): LinkState {
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        switch (this.ModLoader.emulator.rdramRead32(offsets.link_state)) {
        case 0:
            return LinkState.STANDING;
        case 0x00000008:
            return LinkState.STANDING;
        case 0x20000000:
            return LinkState.BUSY;
        case 0x30000000:
            return LinkState.OCARINA;
        case 0x20000001:
            return LinkState.LOADING_ZONE;
        case 0x80000000:
            return LinkState.ENTERING_GROTTO;
        case 0x00100000:
            return LinkState.FIRST_PERSON;
        case 0x00040000:
            return LinkState.JUMPING;
        case 0x08000000:
            return LinkState.SWIMMING;
        case 0x00004000:
            return LinkState.CLIMBING_OUT_OF_WATER;
        case 0x00002000:
            return LinkState.HANGING_FROM_LEDGE;
        case 0x00800000:
            return LinkState.RIDING_EPONA;
        case 0x00000080:
            return LinkState.DYING;
        case 0x04000000:
            return LinkState.TAKING_DAMAGE;
        case 0x00080000:
            return LinkState.FALLING;
        case 0x00068000:
            return LinkState.FALLING;
        case 0xa0040000:
            return LinkState.VOIDING_OUT;
        case 0x20000c00:
            return LinkState.GETTING_ITEM;
        case 0x20010040:
            return LinkState.TALKING;
        case 0x00018000:
            return LinkState.Z_TARGETING;
        case 0x00028000:
            return LinkState.Z_TARGETING;
        case 0x00000800:
            return LinkState.HOLDING_ACTOR;
        }
        return LinkState.UNKNOWN;
    }

    get state2(): LinkState2 {
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
    }
    
    get anim_data(): Buffer{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramReadBuffer(offsets.anim, 0x86);
    }

    get rawPos(): Buffer{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0x24, 0xC);
    }
    
}