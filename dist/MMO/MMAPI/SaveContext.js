"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveContext = void 0;
const MMOffsets_1 = require("src/MMO/MMAPI/MMOffsets");
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
const Inventory_1 = require("./Inventory");
const ShieldsEquipment_1 = require("./ShieldsEquipment");
const SwordsEquipment_1 = require("./SwordsEquipment");
const DungeonItemManager_1 = require("./DungeonItemManager");
const QuestStatus_1 = require("./QuestStatus");
const KeyManager_1 = require("./KeyManager");
class SaveContext extends JSONTemplate_1.JSONTemplate {
    constructor(emu, log) {
        super();
        this.offsets = new MMOffsets_1.MMOffsets;
        this.emulator = emu;
        this.swords = new SwordsEquipment_1.SwordsEquipment(emu);
        this.shields = new ShieldsEquipment_1.ShieldsEquipment(emu);
        this.inventory = new Inventory_1.Inventory(emu, log);
        this.questStatus = new QuestStatus_1.QuestStatus(emu);
        this.keyManager = new KeyManager_1.KeyManager(emu);
        this.dungeonItemManager = new DungeonItemManager_1.DungeonItemManager(emu);
    }
    get checksum() {
        return this.emulator.rdramReadBuffer(this.offsets.checksum, 0x6).readUIntBE(0x0, 0x6);
    }
    get form() {
        return this.emulator.rdramRead8(this.offsets.save_context + this.offsets.mask_offset);
    }
    get max_heart() {
        return this.emulator.rdramRead16(this.offsets.max_heart_flag);
    }
    set get_heart(flag) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    get hearts() {
        return this.emulator.rdramRead16(this.offsets.hearts);
    }
    set hearts(flag) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    get magic() {
        return this.emulator.rdramRead8(this.offsets.magic);
    }
    set magic(flag) {
        this.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }
    get magic_amt() {
        return this.emulator.rdramRead8(this.offsets.magic_amt);
    }
    set magic_amt(flag) {
        this.emulator.rdramWrite8(this.offsets.magic_amt, flag);
    }
    get magic_bool1() {
        return this.emulator.rdramRead8(this.offsets.magic_bool1);
    }
    set magic_bool1(flag) {
        this.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }
    get magic_bool2() {
        return this.emulator.rdramRead8(this.offsets.magic_bool2);
    }
    set magic_bool2(flag) {
        this.emulator.rdramWrite8(this.offsets.magic_bool2, flag);
    }
    get owl_statues() {
        return this.emulator.rdramRead16(this.offsets.owl_statues);
    }
    set owl_statues(flag) {
        this.emulator.rdramWrite16(this.offsets.owl_statues, flag);
    }
    get tunic_boots() {
        return this.emulator.rdramRead8(this.offsets.tunic_boots);
    }
    set tunic_boots(flag) {
        this.emulator.rdramWrite8(this.offsets.tunic_boots, flag);
    }
    get sword_sheild() {
        return this.emulator.rdramRead8(this.offsets.sword_sheild);
    }
    set sword_sheild(flag) {
        this.emulator.rdramWrite8(this.offsets.sword_sheild, flag);
    }
    get item_inventory() {
        return this.emulator.rdramReadBuffer(this.offsets.inventory, 0x18);
    }
    set item_inventory(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.inventory, flag);
    }
    get masks() {
        return this.emulator.rdramReadBuffer(this.offsets.masks, 0x18);
    }
    set masks(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.masks, flag);
    }
    get item_amts() {
        return this.emulator.rdramReadBuffer(this.offsets.item_amts, 0x18);
    }
    set item_amts(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.item_amts, flag);
    }
    get updrades() {
        return this.emulator.rdramRead32(this.offsets.upgrades);
    }
    set updrades(flag) {
        this.emulator.rdramWrite32(this.offsets.upgrades, flag);
    }
    get questflg1() {
        return this.emulator.rdramRead8(this.offsets.questflg1);
    }
    set questflg1(flag) {
        this.emulator.rdramWrite8(this.offsets.questflg1, flag);
    }
    get questflg2() {
        return this.emulator.rdramRead8(this.offsets.questflg2);
    }
    set questflg2(flag) {
        this.emulator.rdramWrite8(this.offsets.questflg2, flag);
    }
    get questflg3() {
        return this.emulator.rdramRead8(this.offsets.questflg3);
    }
    set questflg3(flag) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }
    get questflg4() {
        return this.emulator.rdramRead8(this.offsets.questflg4);
    }
    set questflg4_flag(flag) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }
    get dungeon_flg() {
        return this.emulator.rdramReadBuffer(this.offsets.dungeon_flg, 0xA);
    }
    set dungeon_flg(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.dungeon_flg, flag);
    }
    get double_defense() {
        return this.emulator.rdramRead8(this.offsets.double_defense);
    }
    set double_defense_flag(flag) {
        this.emulator.rdramWrite8(this.offsets.double_defense, flag);
    }
    get scene_flags() {
        return this.emulator.rdramReadBuffer(this.offsets.scene_flags, 0xD20);
    }
    set scene_flags(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }
    get event_flags() {
        return this.emulator.rdramReadBuffer(this.offsets.event_flg, 0x64);
    }
    set event_flags(flag) {
        this.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }
    get bank_rupees() {
        return this.emulator.rdramRead16(this.offsets.bank_rupees);
    }
    set bank_rupees(flag) {
        this.emulator.rdramWrite16(this.offsets.bank_rupees, flag);
    }
    get liveSceneData_chests() {
        return this.emulator.rdramReadPtrBuffer(global.ModLoader.global_context_pointer, this.offsets.chest_flags_addr, 0x4);
    }
    set liveSceneData_chests(buf) {
        this.emulator.rdramWritePtrBuffer(global.ModLoader.global_context_pointer, this.offsets.chest_flags_addr, buf);
    }
    get liveSceneData_clear() {
        return this.emulator.rdramReadPtrBuffer(global.ModLoader.global_context_pointer, this.offsets.room_clear_flags_addr, 0x4);
    }
    set liveSceneData_clear(buf) {
        this.emulator.rdramWritePtrBuffer(global.ModLoader.global_context_pointer, this.offsets.room_clear_flags_addr, buf);
    }
    get liveSceneData_switch() {
        return this.emulator.rdramReadPtrBuffer(global.ModLoader.global_context_pointer, this.offsets.switch_flags_addr, 0x4);
    }
    set liveSceneData_switch(buf) {
        this.emulator.rdramWritePtrBuffer(global.ModLoader.global_context_pointer, this.offsets.switch_flags_addr, buf);
    }
    get liveSceneData_temp() {
        return this.emulator.rdramReadPtrBuffer(global.ModLoader.global_context_pointer, this.offsets.temp_switch_flags_addr, 0x4);
    }
    set liveSceneData_temp(buf) {
        this.emulator.rdramWritePtrBuffer(global.ModLoader.global_context_pointer, this.offsets.temp_switch_flags_addr, buf);
    }
    getSaveDataForCurrentScene() {
        return this.emulator.rdramReadBuffer(global.ModLoader.save_context + 0x00d4 + this.offsets.current_scene * 0x1c, 0x1c);
    }
    writeSaveDataForCurrentScene(buf) {
        if (buf.byteLength === 0x1c) {
            this.emulator.rdramWriteBuffer(global.ModLoader.save_context + 0x00d4 + this.offsets.current_scene * 0x1c, buf);
        }
    }
}
exports.SaveContext = SaveContext;
//# sourceMappingURL=SaveContext.js.map