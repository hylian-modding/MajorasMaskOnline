"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMO_CHILD_MODEL_EVENT = exports.MMOnlineAPI_EnableGhostMode = exports.MMOnline_PlayerScene = exports.MMOnlineEvents = void 0;
const EventHandler_1 = require("modloader64_api/EventHandler");
var MMOnlineEvents;
(function (MMOnlineEvents) {
    MMOnlineEvents["PLAYER_PUPPET_PRESPAWN"] = "MMOnline:onPlayerPuppetPreSpawned";
    MMOnlineEvents["PLAYER_PUPPET_SPAWNED"] = "MMOnline:onPlayerPuppetSpawned";
    MMOnlineEvents["PLAYER_PUPPET_DESPAWNED"] = "MMOnline:onPlayerPuppetDespawned";
    MMOnlineEvents["SERVER_PLAYER_CHANGED_SCENES"] = "MMOnline:onServerPlayerChangedScenes";
    MMOnlineEvents["CLIENT_REMOTE_PLAYER_CHANGED_SCENES"] = "MMOnline:onRemotePlayerChangedScenes";
    MMOnlineEvents["GHOST_MODE"] = "MMOnline:EnableGhostMode";
    MMOnlineEvents["GAINED_HEART_CONTAINER"] = "MMOnline:GainedHeartContainer";
    MMOnlineEvents["GAINED_PIECE_OF_HEART"] = "MMOnline:GainedPieceOfHeart";
    MMOnlineEvents["MAGIC_METER_INCREASED"] = "MMOnline:GainedMagicMeter";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ADULT"] = "MMOnline:ApplyCustomModelAdult";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_CHILD"] = "MMOnline:ApplyCustomModelChild";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ANIMATIONS"] = "MMOnline:ApplyCustomAnims";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ICON_ADULT"] = "MMOnline:ApplyCustomIconAdult";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ICON_CHILD"] = "MMOnline:ApplyCustomIconChild";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_EQUIPMENT"] = "MMOnline:ApplyCustomEquipment";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SWORD_BACK"] = "MMOnline:CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SWORD_BACK";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_ADULT_MATRIX_SHIELD_BACK"] = "MMOnline:CUSTOM_MODEL_APPLIED_ADULT_MATRIX_MATRIX_SHIELD_BACK";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SWORD_BACK"] = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SWORD_BACK";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SHIELD_BACK"] = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_SHIELD_BACK";
    MMOnlineEvents["CUSTOM_MODEL_APPLIED_CHILD_MATRIX_ITEM_SHIELD"] = "MMOnline:CUSTOM_MODEL_APPLIED_CHILD_MATRIX_ITEM_SHIELD";
    MMOnlineEvents["ON_INVENTORY_UPDATE"] = "MMOnline:OnInventoryUpdate";
    MMOnlineEvents["ON_EXTERNAL_ACTOR_SYNC_LOAD"] = "MMOnline:OnExternalActorSyncLoad";
    MMOnlineEvents["ON_REGISTER_EMOTE"] = "MMOnline:OnRegisterEmote";
})(MMOnlineEvents = exports.MMOnlineEvents || (exports.MMOnlineEvents = {}));
class MMOnline_PlayerScene {
    constructor(player, lobby, scene) {
        this.player = player;
        this.scene = scene;
        this.lobby = lobby;
    }
}
exports.MMOnline_PlayerScene = MMOnline_PlayerScene;
function MMOnlineAPI_EnableGhostMode() {
    EventHandler_1.bus.emit(MMOnlineEvents.GHOST_MODE, {});
}
exports.MMOnlineAPI_EnableGhostMode = MMOnlineAPI_EnableGhostMode;
class MMO_CHILD_MODEL_EVENT {
    constructor(file, isAdultHeight = false) {
        this.file = file;
        this.isAdultHeight = isAdultHeight;
    }
}
exports.MMO_CHILD_MODEL_EVENT = MMO_CHILD_MODEL_EVENT;
//# sourceMappingURL=MMOAPI.js.map