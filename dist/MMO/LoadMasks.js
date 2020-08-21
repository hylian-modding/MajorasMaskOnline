"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadedMasks = void 0;
const EventHandler_1 = require("modloader64_api/EventHandler");
const IModLoaderAPI_1 = require("modloader64_api/IModLoaderAPI");
class obj_entry {
}
class LoadedMasks {
    constructor() {
        this.mask_objects = [
            0x01DE, 0x01FF, 0x025D, 0x01DB,
            0x01DA, 0x01FE, 0x0219, 0x024C,
            0x0221, 0x025E, 0x0200, 0x01FD,
            0x025C, 0x025F, 0x01DC, 0x024E,
            0x0252, 0x01DD, 0x01D9, 0x0214,
            0x01E4, 0x01E1, 0x01E2, 0x01E3
        ];
        this.mask_id = 1;
        this.object_table_u10 = (0x801C2738 + 8); // 801C2740‬
        this.object_vrom_start_in_ram = (this.object_table_u10 + (this.mask_objects[this.mask_id] * 8));
        this.object_vrom_end_in_ram = ((this.object_table_u10 + (this.mask_objects[this.mask_id] * 8)) + 4);
    }
    //object_rom_start = 4 bytes at object_vrom_start_in_ram
    //object_rom_end =  4 bytes at object_vrom_end_in_ram
    //object_size = (object_rom_end - object_rom_start);
    onRomPatched(evt) {
    }
}
__decorate([
    EventHandler_1.EventHandler(IModLoaderAPI_1.ModLoaderEvents.ON_ROM_PATCHED)
], LoadedMasks.prototype, "onRomPatched", null);
exports.LoadedMasks = LoadedMasks;
//# sourceMappingURL=LoadMasks.js.map