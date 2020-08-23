import { EventHandler } from "modloader64_api/EventHandler";
import { ModLoaderEvents } from "modloader64_api/IModLoaderAPI";

class obj_entry
{
    start!: number;
    end!: number;
}

export class LoadedMasks {

    mask_objects: number[] = [
		0x01DE, 0x01FF, 0x025D, 0x01DB
	  , 0x01DA, 0x01FE, 0x0219, 0x024C
	  , 0x0221, 0x025E, 0x0200, 0x01FD
	  , 0x025C, 0x025F, 0x01DC, 0x024E
	  , 0x0252, 0x01DD, 0x01D9, 0x0214
	  , 0x01E4, 0x01E1, 0x01E2, 0x01E3
	];

    mask_id = 1;
    object_table_u10 = (0x801C2738 + 8); // 801C2740‬
    object_vrom_start_in_ram = (this.object_table_u10 + (this.mask_objects[this.mask_id] * 8));
    object_vrom_end_in_ram = ((this.object_table_u10 + (this.mask_objects[this.mask_id] * 8)) + 4);
    //object_rom_start = 4 bytes at object_vrom_start_in_ram
    //object_rom_end =  4 bytes at object_vrom_end_in_ram
    //object_size = (object_rom_end - object_rom_start);

    
    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED) onRomPatched(evt: any)
    {
        
    }
}