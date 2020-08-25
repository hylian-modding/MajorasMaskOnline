import { INetworkPlayer, IPacketHeader } from "modloader64_api/NetworkHandler";
import { MMForms } from "MajorasMask/API/MMAPI";

export interface IPuppetOverlord {
    readonly current_scene: number;
    postinit(): void;
    localPlayerLoadingZone(): void;
    localPlayerChangingScenes(entering_scene: number, form: MMForms): void;
    registerPuppet(player: INetworkPlayer): void;
    unregisterPuppet(player: INetworkPlayer): void;
    changePuppetScene(player: INetworkPlayer, entering_scene: number, form: MMForms): void;
    processNewPlayers(): void;
    processAwaitingSpawns(): void;
    lookForMissingOrStrandedPuppets(): void;
    sendPuppetPacket(): void;
    processPuppetPacket(packet: IPacketHeader): void;
    generateCrashDump(): void;
    onTick(): void;
}