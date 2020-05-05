import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "@MMARO/MMAPI/MMOffsets";

export class GlobalContext{

    ModLoader: IModLoaderAPI;

    constructor(ModLoader: IModLoaderAPI){
        this.ModLoader = ModLoader;
    }

    get current_scene(): number{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead16(offsets.current_scene);
    }

    get scene_frame_count(): number{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead32(offsets.scene_frame_count);
    }

}