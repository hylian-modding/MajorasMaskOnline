import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import * as API from 'MajorasMask/API/Imports';

export interface IPuppetData {
    pointer: number;
    ModLoader: IModLoaderAPI;
    core: API.IMMCore;
    pos: Buffer;
    rot: Buffer;
    toJSON(): any;
}
