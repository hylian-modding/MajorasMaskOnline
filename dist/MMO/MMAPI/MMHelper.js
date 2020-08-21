"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMHelper = void 0;
class MMHelper {
    constructor(ModLoader, link, global, save) {
        this.link = link;
        this.ModLoader = ModLoader;
        this.global = global;
        this.save = save;
    }
    isLinkEnteringLoadingZone() {
        let r = this.link.rawStateValue;
        return (r & 0x000000ff) === 1;
    }
    isTitleScreen() {
        return this.save.checksum === 0 || !this.isSceneNumberValid();
    }
    isSceneNumberValid() {
        return this.global.current_scene <= 112;
    }
    isPaused() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead32(offsets.paused) !== 0x3;
    }
    isInterfaceShown() {
        let offsets = global.ModLoader.MMOffsets;
        return this.ModLoader.emulator.rdramRead8(offsets.interface_shown) === 0xFF;
    }
}
exports.MMHelper = MMHelper;
//# sourceMappingURL=MMHelper.js.map