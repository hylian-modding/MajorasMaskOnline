"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMOnlineStorage = void 0;
const MMOnlineStorageBase_1 = require("./MMOnlineStorageBase");
class MMOnlineStorage extends MMOnlineStorageBase_1.MMOnlineStorageBase {
    constructor() {
        super(...arguments);
        this.networkPlayerInstances = {};
        this.players = {};
        this.saveGameSetup = false;
    }
}
exports.MMOnlineStorage = MMOnlineStorage;
//# sourceMappingURL=MMOnlineStorage.js.map