import { JSONTemplate } from "modloader64_api/JSONTemplate";
import * as API from '../API/Imports';
import { Inventory } from './Inventory';
import IMemory from "modloader64_api/IMemory";
import { ShieldsEquipment } from './ShieldsEquipment';
import { SwordsEquipment } from './SwordsEquipment';
import { DungeonItemManager } from "./DungeonItemManager";
import { QuestStatus } from "./QuestStatus";
import { KeyManager } from "./KeyManager";
import { IModLoaderAPI, ILogger } from "modloader64_api/IModLoaderAPI";

export class SaveContext extends JSONTemplate implements API.ISaveContext {
    
    private emulator: IMemory;
    offsets: API.MMOffsets = new API.MMOffsets();
    inventory: Inventory;
    questStatus: API.IQuestStatus;
    keyManager: API.IKeyManager;
    dungeonItemManager: API.IDungeonItemManager;
    
    constructor(emu: IMemory, log: ILogger) {
        super();
        this.emulator = emu;
        this.swords = new SwordsEquipment(emu);
        this.shields = new ShieldsEquipment(emu);
        this.inventory = new Inventory(emu, log);
        this.questStatus = new QuestStatus(emu);
        this.keyManager = new KeyManager(emu);
        this.dungeonItemManager = new DungeonItemManager(emu);
    }

    swords: SwordsEquipment;
    shields: ShieldsEquipment;

    entrance_index!: number;
    cutscene_number!: number;
    world_time!: number;
    world_night_flag!: boolean;
    zeldaz_string!: string;
    death_counter!: number;
    player_name!: string;
    dd_flag!: boolean;
    heart_containers!: number;
    health!: number;
    magic_meter_size!: API.Magic;
    magic_current!: number;
    rupee_count!: number;
    navi_timer!: number;
    magic_beans_purchased!: number;
    permSceneData!: Buffer;
    eventFlags!: Buffer;
    itemFlags!: Buffer;
    infTable!: Buffer;
    skulltulaFlags!: Buffer;
    
    get checksum(): number {
        return this.emulator.rdramReadBuffer(this.offsets.checksum, 0x6).readUIntBE(0x0, 0x6);
    }

    get form(): number {
        return this.emulator.rdramRead8(this.offsets.save_context + this.offsets.mask_offset);
    }

    get max_heart(): number {
        return this.emulator.rdramRead16(this.offsets.max_heart_flag);
    }

    set get_heart(flag: number) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    
    get hearts(): number {
        return this.emulator.rdramRead16(this.offsets.hearts);
    }
    
    set hearts(flag: number) {
        this.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }

    get magic(): number {
        return this.emulator.rdramRead8(this.offsets.magic);
    }

    set magic(flag: number) {
        this.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }

    get magic_amt(): number {
        return this.emulator.rdramRead8(this.offsets.magic_amt);
    }

    set magic_amt(flag: number) {
        this.emulator.rdramWrite8(this.offsets.magic_amt, flag);
    }

    get magic_bool1(): number {
        return this.emulator.rdramRead8(this.offsets.magic_bool1);
    }

    set magic_bool1(flag: number) {
        this.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }

    get magic_bool2(): number {
        return this.emulator.rdramRead8(this.offsets.magic_bool2);
    }
    
    set magic_bool2(flag: number) {
        this.emulator.rdramWrite8(this.offsets.magic_bool2, flag);
    }

    get owl_statues(): number {
        return this.emulator.rdramRead16(this.offsets.owl_statues);
    }

    set owl_statues(flag: number) {
        this.emulator.rdramWrite16(this.offsets.owl_statues, flag);
    }

    get tunic_boots(): number {
        return this.emulator.rdramRead8(this.offsets.tunic_boots);
    }

    set tunic_boots(flag: number) {
        this.emulator.rdramWrite8(this.offsets.tunic_boots, flag);
    }

    get sword_sheild(): number {
        return this.emulator.rdramRead8(this.offsets.sword_sheild);
    }

    set sword_sheild(flag: number) {
        this.emulator.rdramWrite8(this.offsets.sword_sheild, flag);
    }

    get item_inventory(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.inventory, 0x18);
    }

    set item_inventory(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.inventory, flag);
    }

    get masks(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.masks, 0x18);
    }

    set masks(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.masks, flag);
    }

    get item_amts(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.item_amts, 0x18);
    }

    set item_amts(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.item_amts, flag);
    }

    get updrades(): number {
        return this.emulator.rdramRead32(this.offsets.upgrades);
    }
    
    set updrades(flag: number) {
        this.emulator.rdramWrite32(this.offsets.upgrades, flag);
    }

    get questflg1(): number {
        return this.emulator.rdramRead8(this.offsets.questflg1);
    }

    set questflg1(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg1, flag);
    }

    get questflg2(): number {
        return this.emulator.rdramRead8(this.offsets.questflg2);
    }

    set questflg2(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg2, flag);
    }

    get questflg3(): number {
        return this.emulator.rdramRead8(this.offsets.questflg3);
    }

    set questflg3(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get questflg4(): number {
        return this.emulator.rdramRead8(this.offsets.questflg4);
    } 

    set questflg4_flag(flag: number) {
        this.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get dungeon_flg(): Buffer {
       return this.emulator.rdramReadBuffer(this.offsets.dungeon_flg, 0xA);
    }

    set dungeon_flg(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.dungeon_flg, flag);
    }
    
    get double_defense(): number {
        return this.emulator.rdramRead8(this.offsets.double_defense);
    }

    set double_defense_flag(flag: number) {
        this.emulator.rdramWrite8(this.offsets.double_defense, flag);
    }

    get scene_flags(): Buffer {
        return this.emulator.rdramReadBuffer(this.offsets.scene_flags, 0xD20);
    }

    set scene_flags(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }

    get event_flags(): Buffer { 
        return this.emulator.rdramReadBuffer(this.offsets.event_flg, 0x64);
    }
    set event_flags(flag: Buffer) {
        this.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }

    get bank_rupees(): number {
        return this.emulator.rdramRead16(this.offsets.bank_rupees);
    }

    set bank_rupees(flag: number) {
        this.emulator.rdramWrite16(this.offsets.bank_rupees, flag);
    }

    get liveSceneData_chests(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.chest_flags_addr,
            0x4
        );
    }
    set liveSceneData_chests(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.chest_flags_addr,
            buf
        );
    }
    get liveSceneData_clear(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.room_clear_flags_addr,
            0x4
        );
    }
    set liveSceneData_clear(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.room_clear_flags_addr,
            buf
        );
    }
    get liveSceneData_switch(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.switch_flags_addr,
            0x4
        );
    }
    set liveSceneData_switch(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.switch_flags_addr,
            buf
        );
    }
    get liveSceneData_temp(): Buffer {
        return this.emulator.rdramReadPtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.temp_switch_flags_addr,
            0x4
        );
    }
    set liveSceneData_temp(buf: Buffer) {
        this.emulator.rdramWritePtrBuffer(
            global.ModLoader.global_context_pointer,
            this.offsets.temp_switch_flags_addr,
            buf
        );
    }
}