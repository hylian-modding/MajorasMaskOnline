import { onTick, Preinit, Init, Postinit } from "modloader64_api/PluginLifecycle";
import { Link } from "./Link";
import { MMHelper } from "./MMHelper";
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { IModLoaderAPI, ILogger } from "modloader64_api/IModLoaderAPI";
import { bus } from "modloader64_api/EventHandler";
import { MMEvents } from "./MMAPI";
import { GlobalContext } from "./GlobalContext";
import { SaveContext } from "./SaveContext";
import { OverlayPayload } from "./ovl/ovlinjector";
import { CommandBuffer } from "./CommandBuffer";
import { MMOffsets } from "./MMOffsets";
import { ActorManager } from "./ActorManager";

export class MMCore {

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    link!: Link;
    helper!: MMHelper;
    global!: GlobalContext;
    save!: SaveContext;
    commandBuffer!: CommandBuffer;
    private isTouchingLoadingZone: boolean = false;
    private lastKnownSceneNumber: number = -1;
    private lastKnownAge: number = -1;
    log!: ILogger;
    actorManager!: ActorManager;
    
    constructor() {
    }

    @Preinit()
    preinit() {
        global.ModLoader["MMOffsets"] = new MMOffsets();
    }

    @Init()
    init() {
    }

    @Postinit()
    post() {
        this.link = new Link(this.ModLoader);
        this.save = new SaveContext(this.ModLoader.emulator, this.log);
        this.global = new GlobalContext(this.ModLoader);
        this.helper = new MMHelper(this.ModLoader, this.link, this.global, this.save);
        this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
        this.ModLoader.payloadManager.registerPayloadType(new OverlayPayload(".ovl"));
    }

    @onTick()
    onTick() {
        if (this.helper.isTitleScreen() || !this.helper.isSceneNumberValid()) return;
        // Loading zone check
        if (this.helper.isLinkEnteringLoadingZone() && !this.isTouchingLoadingZone) {
            bus.emit(MMEvents.ON_LOADING_ZONE, {});
            this.isTouchingLoadingZone = true;
        }
        // Scene change check
        if (
            this.global.scene_frame_count === 1
        ) {
            this.lastKnownSceneNumber = this.global.current_scene;
            bus.emit(MMEvents.ON_SCENE_CHANGE, this.lastKnownSceneNumber);
            this.isTouchingLoadingZone = false;
        }
        // Age check
        if (this.save.form !== this.lastKnownAge){
            this.lastKnownAge = this.save.form;
            bus.emit(MMEvents.ON_AGE_CHANGE, this.lastKnownAge);
        }
        this.commandBuffer.onTick();
    }
}