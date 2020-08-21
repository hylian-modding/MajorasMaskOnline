"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DungeonItemContainer = exports.DungeonItemManager = void 0;
class DungeonItemManager {
    constructor(emulator) {
        this.emulator = emulator;
        this.WOODFALL_TEMPLE = new DungeonItemContainer(this.emulator, 0 /* WOODFALL_TEMPLE */);
        this.SNOWHEAD_TEMPLE = new DungeonItemContainer(this.emulator, 1 /* SNOWHEAD_TEMPLE */);
        this.GREAT_BAY_TEMPLE = new DungeonItemContainer(this.emulator, 2 /* GREAT_BAY_TEMPLE */);
        this.STONE_TOWER_TEMPLE = new DungeonItemContainer(this.emulator, 3 /* STONE_TOWER_TEMPLE */);
    }
}
exports.DungeonItemManager = DungeonItemManager;
class DungeonItemContainer {
    constructor(emulator, index) {
        this.addr = global.ModLoader.save_context + 0xa8;
        this.emulator = emulator;
        this.index = index;
    }
    get bossKey() {
        return this.emulator.rdramReadBit8(this.addr + this.index, 7);
    }
    set bossKey(bool) {
        this.emulator.rdramWriteBit8(this.addr + this.index, 7, bool);
    }
    get compass() {
        return this.emulator.rdramReadBit8(this.addr + this.index, 6);
    }
    set compass(bool) {
        this.emulator.rdramWriteBit8(this.addr + this.index, 6, bool);
    }
    get map() {
        return this.emulator.rdramReadBit8(this.addr + this.index, 5);
    }
    set map(bool) {
        this.emulator.rdramWriteBit8(this.addr + this.index, 5, bool);
    }
}
exports.DungeonItemContainer = DungeonItemContainer;
//# sourceMappingURL=DungeonItemManager.js.map