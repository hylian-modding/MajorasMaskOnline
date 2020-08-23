import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { Link } from "./Link";
import { GlobalContext } from "./GlobalContext";
import { SaveContext } from "./SaveContext";
import { MMOffsets } from "./API/MMOffsets";
import { IMMHelper, ISaveContext, IGlobalContext, ILink } from "./API/MMAPI";
import { JSONTemplate } from "modloader64_api/JSONTemplate";
import IMemory from "modloader64_api/IMemory";

export class MMHelper extends JSONTemplate implements IMMHelper {

    private save: ISaveContext;
    private global: IGlobalContext;
    private link: ILink;
    private emu: IMemory;
    constructor(
        save: ISaveContext,
        global: IGlobalContext,
        link: ILink,
        memory: IMemory
    ) {
        super();
        this.save = save;
        this.global = global;
        this.link = link;
        this.emu = memory;
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
        let offsets = (global.ModLoader.offsets.link as MMOffsets);
        return this.emu.rdramRead32(offsets.paused) !== 0x3;
    }

    isInterfaceShown(): boolean{
        let offsets = (global.ModLoader.offsets.link as MMOffsets);
        return this.emu.rdramRead8(offsets.interface_shown) === 0xFF;
    }
}