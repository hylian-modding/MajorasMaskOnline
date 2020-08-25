import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { IMMCore } from "MajorasMask/API/MMAPI";

export interface IPuppetData {
    pointer: number;
    ModLoader: IModLoaderAPI;
    core: IMMCore;
    pos: Buffer;
    rot: Buffer;
    toJSON(): any;
}