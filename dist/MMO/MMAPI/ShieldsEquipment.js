"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShieldsEquipment = void 0;
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class ShieldsEquipment extends JSONTemplate_1.JSONTemplate {
    constructor(emulator) {
        super();
        this.instance = global.ModLoader.save_context;
        this.equipment_addr = this.instance + 0x009c + 1;
        this.jsonFields = ['heroesShield', 'mirrorShield'];
        this.emulator = emulator;
    }
    set heroesShield(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 2 /* HEROES */, bool);
    }
    get heroesShield() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 2 /* HEROES */);
    }
    set mirrorShield(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 1 /* MIRROR */, bool);
    }
    get mirrorShield() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 1 /* MIRROR */);
    }
}
exports.ShieldsEquipment = ShieldsEquipment;
//# sourceMappingURL=ShieldsEquipment.js.map