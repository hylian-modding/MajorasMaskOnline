import { EventHandler } from "modloader64_api/EventHandler";
import { zzstatic } from "src/MMO/Z64Lib/API/zzstatic";
import fs from 'fs';
import { Z64LibSupportedGames } from "src/MMO/Z64Lib/API/Z64LibSupportedGames";
import { Z64RomTools } from "src/MMO/Z64Lib/API/Z64RomTools";
import { ModLoaderEvents, IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { MMO_EVENTS, MMO_CHILD_MODEL_EVENT } from "src/MMO/MMOAPI/MMO_API";

class ManifestBuffer {
    buf: Buffer;
    cur: number = 0;
    start: number;
    constructor(buf: Buffer, start: number) {
        this.buf = buf;
        this.start = start;
    }

    GoTo(num: number) {
        this.cur = num;
    }

    Write32(data: number) {
        this.buf.writeUInt32BE(this.start + data, this.cur);
        this.cur += 0x4;
    }

    Hi32(data: number) {
        let temp: Buffer = Buffer.alloc(0x4);
        temp.writeUInt32BE(data, 0);
        this.buf.writeUInt32BE(temp.readUInt16BE(0), this.cur);
    }

    Lo32(data: number) {
        let temp: Buffer = Buffer.alloc(0x4);
        temp.writeUInt32BE(data, 0);
        this.buf.writeUInt32BE(temp.readUInt16BE(2), this.cur);
    }

    HexString(hex: string) {
        let b = Buffer.from(hex, 'hex');
        b.copy(this.buf, this.cur);
        this.cur += b.byteLength;
    }
}

class ModelManagerContainer {
    childFile: string = '';
    isChildBig: boolean = false;

    hasChildModel() {
        return this.childFile !== '';
    }
}

export class ModelManager {

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    container: ModelManagerContainer = new ModelManagerContainer();

    @EventHandler(MMO_EVENTS.CUSTOM_MODEL_APPLIED_CHILD)
    CUSTOM_MODEL_APPLIED_CHILD(data: MMO_CHILD_MODEL_EVENT) {
        this.container.childFile = data.file;
        this.container.isChildBig = data.isAdultHeight
    }

    private injectChildModel(rom: Buffer, file: string): Buffer {
        let zz: zzstatic = new zzstatic(Z64LibSupportedGames.MAJORAS_MASK);
        let buf = Buffer.alloc(0x37800, 0xAB);
        zz.doRepoint(fs.readFileSync(file), 0, true, 0x80950000).copy(buf);
        let tools = new Z64RomTools(this.ModLoader, 0x1A500);
        let child = tools.decompressFileFromRom(rom, 654);
        buf.copy(child, 0, 0, 0x5000);
        tools.recompressFileIntoRom(rom, 654, buf);

        let obj_start: number = 0x80950000;
        let code: ManifestBuffer = new ManifestBuffer(tools.decompressFileFromRom(rom, 31), obj_start);
        let player: ManifestBuffer = new ManifestBuffer(tools.decompressFileFromRom(rom, 38), obj_start);
        let hookshot: ManifestBuffer = new ManifestBuffer(tools.decompressFileFromRom(rom, 83), obj_start);

        code.GoTo(VROM_CODE + 0x11A55C);
        code.Write32(LUT_DL_WAIST);
        code.Write32(LUT_DL_WAIST);
        code.Write32(LUT_DL_RFIST_SHIELD_HERO);       // Right Fist + Hero's Shield
        code.Write32(LUT_DL_RFIST_SHIELD_HERO);
        code.Write32(LUT_DL_RFIST_SHIELD_MIRROR);     // Right Fist + Mirror Shield
        code.Write32(LUT_DL_RFIST_SHIELD_MIRROR);
        code.GoTo(VROM_CODE + 0x11A5EC);
        code.Write32(LUT_DL_SHIELD_HERO_BACK);        // Rotated Hero's Shield
        code.Write32(LUT_DL_SHIELD_HERO_BACK);
        code.Write32(LUT_DL_SHIELD_MIRROR_BACK);      // Rotated Mirror Shield
        code.Write32(LUT_DL_SHIELD_MIRROR_BACK);
        code.Write32(LUT_DL_SWORD_KOKIRI_SHEATHED);   // Sheathed Kokiri Sword
        code.Write32(LUT_DL_SWORD_KOKIRI_SHEATHED);
        code.Write32(LUT_DL_SWORD_RAZOR_SHEATHED);   // Sheathed Razor Sword
        code.Write32(LUT_DL_SWORD_RAZOR_SHEATHED);
        code.Write32(LUT_DL_SWORD_GILDED_SHEATHED);   // Sheathed Gilded Sword
        code.Write32(LUT_DL_SWORD_GILDED_SHEATHED);
        code.Write32(LUT_DL_SHEATH_KOKIRI);           // Kokiri Sword Sheath
        code.Write32(LUT_DL_SHEATH_KOKIRI);
        code.Write32(LUT_DL_SHEATH_RAZOR);            // Razor Sword Sheath
        code.Write32(LUT_DL_SHEATH_RAZOR);
        code.Write32(LUT_DL_SHEATH_GILDED);           // Gilded Sword Sheath
        code.Write32(LUT_DL_SHEATH_GILDED);
        code.GoTo(VROM_CODE + 0x11A64C);                    // Left Fist + Great Fairy's Sword
        code.Write32(LUT_DL_LFIST_GFSWORD_SWORD);
        code.Write32(LUT_DL_LFIST_GFSWORD_SWORD);
        code.GoTo(VROM_CODE + 0x11A674);                    // Left Hand
        code.Write32(LUT_DL_LHAND);
        code.Write32(LUT_DL_LHAND);
        code.GoTo(VROM_CODE + 0x11A69C);                    // Left Fist
        code.Write32(LUT_DL_LFIST);
        code.Write32(LUT_DL_LFIST);
        code.GoTo(VROM_CODE + 0x11A6CC);                    // Left Fist + Kokiri Sword
        code.Write32(LUT_DL_LFIST_KOKIRI_SWORD);
        code.Write32(LUT_DL_LFIST_KOKIRI_SWORD);
        code.GoTo(VROM_CODE + 0x11A6D4);                    // Left Fist + Razor Sword
        code.Write32(LUT_DL_LFIST_RAZOR_SWORD);
        code.Write32(LUT_DL_LFIST_RAZOR_SWORD);
        code.GoTo(VROM_CODE + 0x11A6DC);                    // Left Fist + Gilded Sword
        code.Write32(LUT_DL_LFIST_GILDED_SWORD);
        code.Write32(LUT_DL_LFIST_GILDED_SWORD);
        code.GoTo(VROM_CODE + 0x11A704);                    // Right Hand
        code.Write32(LUT_DL_RHAND);
        code.Write32(LUT_DL_RHAND);
        code.GoTo(VROM_CODE + 0x11A72C);                    // Right Fist
        code.Write32(LUT_DL_RFIST);
        code.Write32(LUT_DL_RFIST);
        code.GoTo(VROM_CODE + 0x11A754);                    // Right Fist + Hero's Bow
        code.Write32(LUT_DL_RFIST_BOW);
        code.Write32(LUT_DL_RFIST_BOW);
        code.GoTo(VROM_CODE + 0x11A77C);                    // Right Hand + Ocarina of Time
        code.Write32(LUT_DL_RHAND_OCARINA_TIME);
        code.Write32(LUT_DL_RHAND_OCARINA_TIME);
        code.GoTo(VROM_CODE + 0x11A7A4);                    // Right Fist + Hookshot
        code.Write32(LUT_DL_RFIST_HOOKSHOT);
        code.Write32(LUT_DL_RFIST_HOOKSHOT);
        code.GoTo(VROM_CODE + 0x11A7CC);                    // Outstreched Left Hand (for holding bottles)
        code.Write32(LUT_DL_LHAND_BOTTLE);
        code.Write32(LUT_DL_LHAND_BOTTLE);
        code.GoTo(VROM_CODE + 0x11A7F8);                    // Left Fist
        code.Write32(LUT_DL_LFIST);
        code.GoTo(VROM_CODE + 0x11A80C);                    // Right Shoulder
        code.Write32(LUT_DL_RSHOULDER);
        code.GoTo(VROM_CODE + 0X11A820);                    // FPS Right Arm + Hero's Bow
        code.Write32(LUT_DL_FPS_RARM_BOW);
        code.GoTo(VROM_CODE + 0x11A834);                    // FPS Right Arm + Hookshot
        code.Write32(LUT_DL_FPS_RARM_HOOKSHOT);
        code.GoTo(VROM_CODE + 0x11B2D4);                    // Hero's Bow String
        code.Write32(LUT_DL_BOW_STRING);
        // Hookshot Spike
        hookshot.GoTo(VROM_ARMS_HOOK + 0xA2E);
        hookshot.Hi32(LUT_DL_HOOKSHOT_SPIKE);
        hookshot.GoTo(VROM_ARMS_HOOK + 0xA32);
        hookshot.Lo32(LUT_DL_HOOKSHOT_SPIKE);
        // FPS Glitch Fix (Thanks Fkualol!)
        code.GoTo(VROM_CODE + 0x11A7E4);
        code.Write32(LUT_DL_DF_COMMAND);

        // Swordless fix    (Thanks Nick!)
        code.GoTo(VROM_CODE + 0x11A5E4);
        code.Write32(LUT_DL_DF_COMMAND);                   // Sheathed Sword + Shield
        code.GoTo(VROM_CODE + 0x11A5BC);
        code.Write32(LUT_DL_DF_COMMAND);                   // Sheathed Sword

        // Unknown Pointers (?)
        code.GoTo(VROM_CODE + 0x11A594);
        code.Write32(LUT_DL_DF_COMMAND);
        code.GoTo(VROM_CODE + 0x11A598);
        code.Write32(LUT_DL_DF_COMMAND);
        code.GoTo(VROM_CODE + 0x11A5C0);
        code.Write32(LUT_DL_DF_COMMAND);
        code.GoTo(VROM_CODE + 0x11A5E8);
        code.Write32(LUT_DL_DF_COMMAND);
        //
        code.GoTo(VROM_CODE + HIERARCHY_CODE);
        code.Write32(LUT_HIERARCHY);

        tools.recompressFileIntoRom(rom, 31, code.buf);
        tools.recompressFileIntoRom(rom, 83, hookshot.buf);
        tools.recompressFileIntoRom(rom, 38, player.buf);
        return buf;
    }

    private adultHeightFix(code: ManifestBuffer, player: ManifestBuffer): ManifestBuffer {
        code.GoTo(0x11A378);
        code.HexString("00C803E8012C02BC0226010E02BC012C007803200258FF9C0258024E02EE007D00C80082");
        code.GoTo(0x2E318);

        return code;
    }

    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED_POST)
    onRomPatched(evt: any) {
        if (this.container.hasChildModel()) {
            evt.rom = this.injectChildModel(evt.rom, this.container.childFile);
        }
    }
}

// zzplayas stuff. Leave alone.
const LUT_DL_WAIST: number = 0x5110;
const LUT_DL_RTHIGH: number = 0x5118;
const LUT_DL_RSHIN: number = 0x5120;
const LUT_DL_RFOOT: number = 0x5128;
const LUT_DL_LTHIGH: number = 0x5130;
const LUT_DL_LSHIN: number = 0x5138;
const LUT_DL_LFOOT: number = 0x5140;
const LUT_DL_HEAD: number = 0x5148;
const LUT_DL_HAT: number = 0x5150;
const LUT_DL_COLLAR: number = 0x5158;
const LUT_DL_LSHOULDER: number = 0x5160;
const LUT_DL_LFOREARM: number = 0x5168;
const LUT_DL_RSHOULDER: number = 0x5170;
const LUT_DL_RFOREARM: number = 0x5178;
const LUT_DL_TORSO: number = 0x5180;
const LUT_DL_LHAND: number = 0x5188;
const LUT_DL_LFIST: number = 0x5190;
const LUT_DL_LHAND_BOTTLE: number = 0x5198;
const LUT_DL_RHAND: number = 0x51A0;
const LUT_DL_RFIST: number = 0x51A8;
const LUT_DL_SHIELD_MIRROR_FACE: number = 0x51B0;
const LUT_DL_SHIELD_MIRROR: number = 0x51B8;
const LUT_DL_BLADE_GFSWORD: number = 0x51C0;
const LUT_DL_SHEATH_GILDED: number = 0x51C8;
const LUT_DL_HILT_GILDED: number = 0x51D0;
const LUT_DL_BLADE_GILDED: number = 0x51D8;
const LUT_DL_SHEATH_RAZOR: number = 0x51E0;
const LUT_DL_SHIELD_HERO: number = 0x51E8;
const LUT_DL_SHEATH_KOKIRI: number = 0x51F0;
const LUT_DL_HOOKSHOT: number = 0x51F8;
const LUT_DL_BOW: number = 0x5200;
const LUT_DL_HOOKSHOT_SPIKE: number = 0x5208;
const LUT_DL_OCARINA_TIME: number = 0x5210;
const LUT_DL_FPS_RIGHT_ARM: number = 0x5218;
const LUT_DL_BOW_STRING: number = 0x5220;
const DL_SHIELD_HERO_BACK: number = 0x5228;
const LUT_DL_SHIELD_HERO_BACK: number = 0x5238;
const DL_SHIELD_MIRROR_COMBINED: number = 0x5240;
const LUT_DL_SHIELD_MIRROR_COMBINED: number = 0x5250;
const DL_SHIELD_MIRROR_BACK: number = 0x5258;
const LUT_DL_SHIELD_MIRROR_BACK: number = 0x5268;
const DL_SWORD_KOKIRI_SHEATHED: number = 0x5270;
const LUT_DL_SWORD_KOKIRI_SHEATHED: number = 0x5290;
const DL_SWORD_RAZOR_SHEATHED: number = 0x5298;
const LUT_DL_SWORD_RAZOR_SHEATHED: number = 0x52B8;
const DL_SWORD_GILDED_SHEATHED: number = 0x52C0;
const LUT_DL_SWORD_GILDED_SHEATHED: number = 0x52E0;
const DL_LFIST_KOKIRI_SWORD: number = 0x52E8;
const LUT_DL_LFIST_KOKIRI_SWORD: number = 0x5300;
const DL_LFIST_RAZOR_SWORD: number = 0x5308;
const LUT_DL_LFIST_RAZOR_SWORD: number = 0x5320;
const DL_LFIST_GILDED_SWORD: number = 0x5328;
const LUT_DL_LFIST_GILDED_SWORD: number = 0x5340;
const DL_LFIST_GFSWORD_SWORD: number = 0x5348;
const LUT_DL_LFIST_GFSWORD_SWORD: number = 0x5358;
//const LUT_DL_BLADE_GFSWORD: number = 0x5360;
const DL_RFIST_SHIELD_HERO: number = 0x5368;
const LUT_DL_RFIST_SHIELD_HERO: number = 0x5378;
const DL_RFIST_SHIELD_MIRROR: number = 0x5380;
const LUT_DL_RFIST_SHIELD_MIRROR: number = 0x5390;
const DL_RFIST_HOOKSHOT: number = 0x5398;
const LUT_DL_RFIST_HOOKSHOT: number = 0x53A8;
const DL_RFIST_BOW: number = 0x53B0;
const LUT_DL_RFIST_BOW: number = 0x53C0;
const DL_RHAND_OCARINA_TIME: number = 0x53C8;
const LUT_DL_RHAND_OCARINA_TIME: number = 0x53D8;
const DL_FPS_RARM_HOOKSHOT: number = 0x53E0;
const LUT_DL_FPS_RARM_HOOKSHOT: number = 0x53F0;
const DL_FPS_RARM_BOW: number = 0x53F8;
const LUT_DL_FPS_RARM_BOW: number = 0x5408;
const DL_DF_COMMAND: number = 0x5410;
const LUT_DL_DF_COMMAND: number = 0x5418;
const VROM_CODE: number = 0;
const VROM_ARMS_HOOK = 0;
const HIERARCHY_CODE = 0x11A350;
const LUT_HIERARCHY = 0x5420;