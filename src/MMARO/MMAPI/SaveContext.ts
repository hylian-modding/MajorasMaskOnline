import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MMOffsets } from "@MMARO/MMAPI/MMOffsets";
import { MMForms } from "./mmForms";

export class SaveContext{

    ModLoader: IModLoaderAPI;
    offsets: MMOffsets;

    constructor(ModLoader: IModLoaderAPI){
        this.ModLoader = ModLoader;
        this.offsets = (global.ModLoader.MMOffsets as MMOffsets);
    }

    get checksum(): number{
        return this.ModLoader.emulator.rdramReadBuffer(this.offsets.checksum, 0x6).readUIntBE(0x0, 0x6);
    }

    get form(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.save_context + this.offsets.mask_offset);
    }

    get max_heart(): number{
        return this.ModLoader.emulator.rdramRead16(this.offsets.max_heart_flag);
    }

    set get_heart(flag: number){
        this.ModLoader.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }
    
    get hearts(): number{
        return this.ModLoader.emulator.rdramRead16(this.offsets.hearts);
    }
    
    set hearts(flag: number){
        this.ModLoader.emulator.rdramWrite16(this.offsets.max_heart_flag, flag);
    }

    get magic(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.magic);
    }

    set magic(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }

    get magic_amt(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.magic_amt);
    }

    set magic_amt(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.magic_amt, flag);
    }

    get magic_bool1(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.magic_bool1);
    }

    set magic_bool1(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.magic_bool1, flag);
    }

    get magic_bool2(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.magic_bool2);
    }
    
    set magic_bool2(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.magic_bool2, flag);
    }

    get owl_statues(): number{
        return this.ModLoader.emulator.rdramRead16(this.offsets.owl_statues);
    }

    set owl_statues(flag: number){
        this.ModLoader.emulator.rdramWrite16(this.offsets.owl_statues, flag);
    }

    get tunic_boots(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.tunic_boots);
    }

    set tunic_boots(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.tunic_boots, flag);
    }

    get sword_sheild(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.sword_sheild);
    }

    set sword_sheild(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.sword_sheild, flag);
    }

    get inventory(): Buffer{
        return this.ModLoader.emulator.rdramReadBuffer(this.offsets.inventory, 0x18);
    }

    set inventory(flag: Buffer){
        this.ModLoader.emulator.rdramWriteBuffer(this.offsets.inventory, flag);
    }

    get masks(): Buffer{
        return this.ModLoader.emulator.rdramReadBuffer(this.offsets.masks, 0x18);
    }

    set masks(flag: Buffer){
        this.ModLoader.emulator.rdramWriteBuffer(this.offsets.masks, flag);
    }

    get item_amts(): Buffer{
        return this.ModLoader.emulator.rdramReadBuffer(this.offsets.item_amts, 0x18);
    }

    set item_amts(flag: Buffer){
        this.ModLoader.emulator.rdramWriteBuffer(this.offsets.item_amts, flag);
    }

    get updrades(): number{
        return this.ModLoader.emulator.rdramRead32(this.offsets.upgrades);
    }
    
    set updrades(flag: number){
        this.ModLoader.emulator.rdramWrite32(this.offsets.upgrades, flag);
    }

    get questflg1(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.questflg1);
    }

    set questflg1(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.questflg1, flag);
    }

    get questflg2(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.questflg2);
    }

    set questflg2(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.questflg2, flag);
    }

    get questflg3(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.questflg3);
    }

    set questflg3(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get questflg4(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.questflg4);
    } 

    set questflg4_flag(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.questflg4, flag);
    }

    get dungeon_flg(): Buffer{
       return this.ModLoader.emulator.rdramReadBuffer(this.offsets.dungeon_flg, 0xA);
    }

    set dungeon_flg(flag: Buffer){
        this.ModLoader.emulator.rdramWriteBuffer(this.offsets.dungeon_flg, flag);
    }
    
    get double_defense(): number{
        return this.ModLoader.emulator.rdramRead8(this.offsets.double_defense);
    }

    set double_defense_flag(flag: number){
        this.ModLoader.emulator.rdramWrite8(this.offsets.double_defense, flag);
    }

    get scene_flags(): Buffer{
        return this.ModLoader.emulator.rdramReadBuffer(this.offsets.scene_flags, 0xD20);
    }

    set scene_flags(flag: Buffer){
        this.ModLoader.emulator.rdramWriteBuffer(this.offsets.scene_flags, flag);
    }

    get bank_rupees(): number{
        return this.ModLoader.emulator.rdramRead16(this.offsets.bank_rupees);
    }

    set bank_rupees(flag: number){
        this.ModLoader.emulator.rdramWrite16(this.offsets.bank_rupees, flag);
    }

}