"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwordsEquipment = void 0;
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class SwordsEquipment extends JSONTemplate_1.JSONTemplate {
    constructor(emulator) {
        super();
        this.instance = global.ModLoader.save_context;
        this.equipment_addr = this.instance + 0x009c + 1;
        this.jsonFields = [
            'kokiriSword',
            'razorSword',
            'gildedSword',
        ];
        this.emulator = emulator;
    }
    get kokiriSword() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 7 /* KOKIRI */);
    }
    set kokiriSword(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 7 /* KOKIRI */, bool);
    }
    get razorSword() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 6 /* RAZOR */);
    }
    set razorSword(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 6 /* RAZOR */, bool);
    }
    get gilded() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 5 /* GILDED */);
    }
    set gilded(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 5 /* GILDED */, bool);
    }
}
exports.SwordsEquipment = SwordsEquipment;
//# sourceMappingURL=SwordsEquipment.js.map