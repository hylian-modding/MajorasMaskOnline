import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "@MMARO/MMAPI/MMOffsets";
import { MMForms } from "./mmForms";

export class SaveContext{

    ModLoader: IModLoaderAPI;

    constructor(ModLoader: IModLoaderAPI){
        this.ModLoader = ModLoader;
    }

    get checksum(): number{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramReadBuffer(offsets.checksum, 0x6).readUIntBE(0x0, 0x6);
    }

    get form(): MMForms{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead8(offsets.save_context + offsets.mask_offset);
    }

}