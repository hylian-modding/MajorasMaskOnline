import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "@MMARO/MMAPI/MMOffsets";
import { ActorBase } from "./Actor";

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

    get anim_data(): Buffer{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramReadBuffer(offsets.anim, 0x86);
    }

    get rawPos(): Buffer{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramReadBuffer(offsets.link_instance + 0x24, 0xC);
    }
    
}