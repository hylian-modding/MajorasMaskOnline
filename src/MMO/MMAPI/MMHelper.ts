import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { Link } from "./Link";
import { GlobalContext } from "./GlobalContext";
import { SaveContext } from "./SaveContext";
import { MMOffsets } from "src/MMO/MMAPI/MMOffsets";

export class MMHelper{

    ModLoader: IModLoaderAPI;
    link: Link;
    global: GlobalContext;
    save: SaveContext;

    constructor(ModLoader: IModLoaderAPI, link: Link, global: GlobalContext, save: SaveContext){
        this.link = link;
        this.ModLoader = ModLoader;
        this.global = global;
        this.save = save;
    }

    isLinkEnteringLoadingZone(): boolean {
        let r = this.link.rawStateValue;
        return (r & 0x000000ff) === 1;
    }

    isTitleScreen(): boolean{
        return this.save.checksum === 0 || !this.isSceneNumberValid();
    }

    isSceneNumberValid(): boolean{
        return this.global.current_scene <= 112;
    }

    isPaused(): boolean{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead32(offsets.paused) !== 0x3;
    }

    isInterfaceShown(): boolean{
        let offsets = (global.ModLoader.MMOffsets as MMOffsets);
        return this.ModLoader.emulator.rdramRead8(offsets.interface_shown) === 0xFF;
    }
}