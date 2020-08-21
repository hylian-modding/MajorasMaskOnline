import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "../MMAPI/MMOffsets";

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

    getSaveDataForCurrentScene(): Buffer {
        return this.ModLoader.emulator.rdramReadBuffer(
            global.ModLoader.save_context + 0x00F8 + this.current_scene * 0xD20,
            0x1c
        );
    }
    writeSaveDataForCurrentScene(buf: Buffer): void {
        if (buf.byteLength === 0xD20) {
            this.ModLoader.emulator.rdramWriteBuffer(
                global.ModLoader.save_context + 0x00F8 + this.current_scene * 0xD20,
                buf
            );
        }
    }
}