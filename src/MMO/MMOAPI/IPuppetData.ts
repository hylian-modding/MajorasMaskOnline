import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { MajorasMask } from "../Core/MajorasMask/MajorasMask";
import { IMMCore } from "../Core/MajorasMask/API/MMAPI";

export interface IPuppetData {
    pointer: number;
    ModLoader: IModLoaderAPI;
    core: IMMCore;
    pos: Buffer;
    rot: Buffer;
    toJSON(): any;
}
