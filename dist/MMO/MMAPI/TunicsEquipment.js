"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunicsEquipment = void 0;
/MMAPI/MMAPI;
'';
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class TunicsEquipment extends JSONTemplate_1.JSONTemplate {
    constructor(emulator) {
        super();
        this.instance = global.ModLoader.save_context;
        this.equipment_addr = this.instance + 0x009c;
        this.jsonFields = ['kokiriTunic', 'goronTunic', 'zoraTunic'];
        this.emulator = emulator;
    }
    get kokiriTunic() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 7 /* KOKIRI */);
    }
    set kokiriTunic(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 7 /* KOKIRI */, bool);
    }
    get goronTunic() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 6 /* GORON */);
    }
    set goronTunic(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 6 /* GORON */, bool);
    }
    get zoraTunic() {
        return this.emulator.rdramReadBit8(this.equipment_addr, 5 /* ZORA */);
    }
    set zoraTunic(bool) {
        this.emulator.rdramWriteBit8(this.equipment_addr, 5 /* ZORA */, bool);
    }
}
exports.TunicsEquipment = TunicsEquipment;
//# sourceMappingURL=TunicsEquipment.js.map