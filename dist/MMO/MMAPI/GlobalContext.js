"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalContext = void 0;
class GlobalContext {
    constructor(ModLoader) {
        this.ModLoader = ModLoader;
    }
    get current_scene() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead16(offsets.current_scene);
    }
    get scene_frame_count() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead32(offsets.scene_frame_count);
    }
    getSaveDataForCurrentScene() {
        return this.ModLoader.emulator.rdramReadBuffer(global.ModLoader.save_context + 0x00d4 + this.current_scene * 0x1c, 0x1c);
    }
    writeSaveDataForCurrentScene(buf) {
        if (buf.byteLength === 0x1c) {
            this.ModLoader.emulator.rdramWriteBuffer(global.ModLoader.save_context + 0x00d4 + this.current_scene * 0x1c, buf);
        }
    }
}
exports.GlobalContext = GlobalContext;
//# sourceMappingURL=GlobalContext.js.map