"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMOffsets = void 0;
class MMOffsets {
    constructor() {
        this.link_instance = 0x803FFDB0;
        this.link_state = 0x8040081C;
        this.current_scene = 0x803e6bc4;
        this.scene_frame_count = 0x803FF360;
        this.checksum = 0x801EF694;
        this.paused = 0x801D1500;
        this.interface_shown = 0x803FD77B;
        this.save_context = 0x801EF670;
        this.mask_offset = 0x0020;
        this.anim = 0x400500;
        //Save Context
        this.max_heart_flag = 0x801EF6A4; //0x2
        this.hearts = 0x801EF6A6; //0x2
        this.magic = 0x801EF6A9; //0x1
        this.magic_amt = 0x801EF6A8; //0x1
        this.razor_hits = 0x801EF6AC; // 0x2
        this.magic_bool1 = 0x801EF6B0;
        this.magic_bool2 = 0x801EF6B1;
        this.owl_statues = 0x801EF6B6; //0x2
        this.sword_equip = 0x801EF6BC; // 0x1
        this.tunic_boots = 0x801EF6DC; //0x1
        this.sword_sheild = 0x801EF6DD;
        this.inventory = 0x801EF6E0; //0x18
        this.masks = 0x801EF6F8; //0x18
        this.item_amts = 0x801EF710; //0x18
        this.upgrades = 0x801EF728; //0x4
        //quest items
        this.questflg1 = 0x801EF72C; //0x1 bit 0: Lullaby Intro; bits 4-7: heart pieces
        this.questflg2 = 0x801EF72D; //0x1 bits 0-1: songs; bit 2: Bomber's Notebook; bit 3: unknown
        this.questflg3 = 0x801EF72E; //0x1 bits 0-7: songs
        this.questflg4 = 0x801EF72F; //0x1 bits 0-3: Remains; bits 6-7: songs
        this.dungeon_flg = 0x801EF730; //0xA
        this.double_defense = 0x801EF743; //0x1
        this.scene_flags = 0x801EF768; //0xD20 dig chest flags out of here
        this.bank_rupees = 0x801F054E; //0x2
        this.event_flg = 0x801F0568;
        this.switch_flags_addr = 0x803E8978;
        this.temp_switch_flags_addr = 0x803E8988;
        this.chest_flags_addr = 0x803E898C;
        this.room_clear_flags_addr = 0x803E8994;
        //misc
        this.mask_object_vram = 0x80402B50;
        this.mask_props = 0x801F58B0;
    }
}
exports.MMOffsets = MMOffsets;
//# sourceMappingURL=MMOffsets.js.map