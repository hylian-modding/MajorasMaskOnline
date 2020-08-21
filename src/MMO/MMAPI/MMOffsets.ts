export class MMOffsets {
    link_instance: number = 0x803FFDB0;
    link_state: number = 0x8040081C;
    current_scene: number = 0x803e6bc4;
    scene_frame_count: number = 0x803FF360;
    checksum: number = 0x801EF694;
    paused: number = 0x801D1500;
    interface_shown: number = 0x803FD77B;
    save_context: number = 0x801EF670;
    mask_offset: number = 0x0020;
    anim: number = 0x400500;

    //Save Context

    max_heart_flag: number = 0x801EF6A4; //0x2
    hearts: number = 0x801EF6A6; //0x2
    magic: number = 0x801EF6A9; //0x1
    magic_amt: number = 0x801EF6A8; //0x1
    razor_hits: number = 0x801EF6AC; // 0x2
    magic_bool1: number = 0x801EF6B0;
    magic_bool2: number = 0x801EF6B1;
    owl_statues: number = 0x801EF6B6; //0x2
    sword_equip: number = 0x801EF6BC; // 0x1
    tunic_boots: number = 0x801EF6DC; //0x1
    sword_sheild: number = 0x801EF6DD;
    inventory: number = 0x801EF6E0; //0x18
    masks: number = 0x801EF6F8; //0x18
    item_amts: number = 0x801EF710; //0x18
    upgrades: number = 0x801EF728; //0x4
    
    //quest items
    questflg1: number = 0x801EF72C; //0x1 bit 0: Lullaby Intro; bits 4-7: heart pieces
    questflg2: number = 0x801EF72D; //0x1 bits 0-1: songs; bit 2: Bomber's Notebook; bit 3: unknown
    questflg3: number = 0x801EF72E; //0x1 bits 0-7: songs
    questflg4: number = 0x801EF72F; //0x1 bits 0-3: Remains; bits 6-7: songs

    dungeon_flg: number = 0x801EF730; //0xA
    double_defense: number = 0x801EF743; //0x1
    scene_flags = 0x801EF768; //0xD20 dig chest flags out of here
    bank_rupees = 0x801F054E; //0x2

    event_flg: number = 0x801F0568;

    switch_flags_addr = 0x803E8978;
    temp_switch_flags_addr = 0x803E8988;
    chest_flags_addr = 0x803E898C;
    room_clear_flags_addr = 0x803E8994;

    //misc
    mask_object_vram = 0x80402B50;
    mask_props = 0x801F58B0;
}
