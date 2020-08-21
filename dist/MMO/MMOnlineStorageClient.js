"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMOnlineStorageClient = void 0;
const MMOnlineStorageBase_1 = require("./MMOnlineStorageBase");
const MMAPI_1 = require("./MMAPI/MMAPI");
class MMOnlineStorageClient extends MMOnlineStorageBase_1.MMOnlineStorageBase {
    constructor() {
        super(...arguments);
        this.autoSaveHash = '!';
        this.needs_update = false;
        this.lastKnownSkullCount = -1;
        this.bottleCache = [
            MMAPI_1.InventoryItem.NONE,
            MMAPI_1.InventoryItem.NONE,
            MMAPI_1.InventoryItem.NONE,
            MMAPI_1.InventoryItem.NONE,
            MMAPI_1.InventoryItem.NONE,
            MMAPI_1.InventoryItem.NONE,
        ];
        this.childModel = Buffer.alloc(1);
        this.adultModel = Buffer.alloc(1);
        this.equipmentModel = Buffer.alloc(1);
        this.adultIcon = Buffer.alloc(1);
        this.childIcon = Buffer.alloc(1);
        this.overlayCache = {};
        this.localization = {};
        this.scene_keys = {};
        this.first_time_sync = false;
    }
}
exports.MMOnlineStorageClient = MMOnlineStorageClient;
//# sourceMappingURL=MMOnlineStorageClient.js.map