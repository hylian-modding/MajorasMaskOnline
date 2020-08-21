"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMCore = void 0;
const PluginLifecycle_1 = require("modloader64_api/PluginLifecycle");
const Link_1 = require("./Link");
const MMHelper_1 = require("./MMHelper");
const ModLoaderAPIInjector_1 = require("modloader64_api/ModLoaderAPIInjector");
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMAPI_1 = require("./MMAPI");
const GlobalContext_1 = require("./GlobalContext");
const SaveContext_1 = require("./SaveContext");
const ovlinjector_1 = require("./ovl/ovlinjector");
const CommandBuffer_1 = require("./CommandBuffer");
const MMOffsets_1 = require("./MMOffsets");
class MMCore {
    constructor() {
        this.isTouchingLoadingZone = false;
        this.lastKnownSceneNumber = -1;
        this.lastKnownAge = -1;
    }
    preinit() {
        global.ModLoader["MMOffsets"] = new MMOffsets_1.MMOffsets();
    }
    init() {
    }
    post() {
        this.link = new Link_1.Link(this.ModLoader);
        this.save = new SaveContext_1.SaveContext(this.ModLoader.emulator, this.log);
        this.global = new GlobalContext_1.GlobalContext(this.ModLoader);
        this.helper = new MMHelper_1.MMHelper(this.ModLoader, this.link, this.global, this.save);
        this.commandBuffer = new CommandBuffer_1.CommandBuffer(this.ModLoader.emulator);
        this.ModLoader.payloadManager.registerPayloadType(new ovlinjector_1.OverlayPayload(".ovl"));
    }
    onTick() {
        if (this.helper.isTitleScreen() || !this.helper.isSceneNumberValid())
            return;
        // Loading zone check
        if (this.helper.isLinkEnteringLoadingZone() && !this.isTouchingLoadingZone) {
            EventHandler_1.bus.emit(MMAPI_1.MMEvents.ON_LOADING_ZONE, {});
            this.isTouchingLoadingZone = true;
        }
        // Scene change check
        if (this.global.scene_frame_count === 1) {
            this.lastKnownSceneNumber = this.global.current_scene;
            EventHandler_1.bus.emit(MMAPI_1.MMEvents.ON_SCENE_CHANGE, this.lastKnownSceneNumber);
            this.isTouchingLoadingZone = false;
        }
        // Age check
        if (this.save.form !== this.lastKnownAge) {
            this.lastKnownAge = this.save.form;
            EventHandler_1.bus.emit(MMAPI_1.MMEvents.ON_AGE_CHANGE, this.lastKnownAge);
        }
        this.commandBuffer.onTick();
    }
}
__decorate([
    ModLoaderAPIInjector_1.ModLoaderAPIInject()
], MMCore.prototype, "ModLoader", void 0);
__decorate([
    PluginLifecycle_1.Preinit()
], MMCore.prototype, "preinit", null);
__decorate([
    PluginLifecycle_1.Init()
], MMCore.prototype, "init", null);
__decorate([
    PluginLifecycle_1.Postinit()
], MMCore.prototype, "post", null);
__decorate([
    PluginLifecycle_1.onTick()
], MMCore.prototype, "onTick", null);
exports.MMCore = MMCore;
//# sourceMappingURL=Core.js.map