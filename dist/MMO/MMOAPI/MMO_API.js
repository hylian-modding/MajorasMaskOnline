"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMO_CHILD_MODEL_EVENT = exports.MMO_PlayerScene = void 0;
class MMO_PlayerScene {
    constructor(player, lobby, scene) {
        this.player = player;
        this.scene = scene;
        this.lobby = lobby;
    }
}
exports.MMO_PlayerScene = MMO_PlayerScene;
class MMO_CHILD_MODEL_EVENT {
    constructor(file, isAdultHeight = false) {
        this.file = file;
        this.isAdultHeight = isAdultHeight;
    }
}
exports.MMO_CHILD_MODEL_EVENT = MMO_CHILD_MODEL_EVENT;
//# sourceMappingURL=MMO_API.js.map