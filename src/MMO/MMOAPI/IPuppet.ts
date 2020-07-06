/*
 * File generated by Interface generator (dotup.dotup-vscode-interface-generator)
 * Date: 2020-03-02 22:27:23 
*/
//@Psi-Hate TODO: Needs implementing in z64lib
import { INetworkPlayer } from "modloader64_api/NetworkHandler";
import { IModLoaderAPI } from "modloader64_api/IModLoaderAPI";
import { IPuppetData } from "./IPuppetData";
import { MMForms } from "../MMAPI/MMForms";

export interface IPuppet {
    player: INetworkPlayer;
    id: string;
    data: IPuppetData;
    isSpawned: boolean;
    isSpawning: boolean;
    isShoveled: boolean;
    scene: number;
    age: MMForms;
    ModLoader: IModLoaderAPI;
    spawn(): void;
    shovel(): void;
    despawn(): void;
}
