"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMOnlineStorageBase = void 0;
const MMO_1 = require("./MMO");
const MMOSaveData_1 = require("./data/MMOSaveData");
class MMOnlineStorageBase {
    constructor() {
        this.sceneStorage = Buffer.alloc(MMO_1.SCENE_ARR_SIZE);
        this.eventStorage = Buffer.alloc(MMO_1.EVENT_ARR_SIZE);
        this.itemFlagStorage = Buffer.alloc(MMO_1.ITEM_FLAG_ARR_SIZE);
        this.infStorage = Buffer.alloc(MMO_1.MASK_FLAG_ARR_SIZE);
        this.skulltulaStorage = Buffer.alloc(MMO_1.WEEK_EVENT_ARR_SIZE);
        this.playerModelCache = {};
        this.dungeonItemStorage = new MMOSaveData_1.MMODungeonItemContext();
        this.inventoryStorage = new MMOSaveData_1.InventorySave();
        this.equipmentStorage = new MMOSaveData_1.EquipmentSave();
        this.questStorage = new MMOSaveData_1.QuestSave();
        this.bank = 0;
    }
}
exports.MMOnlineStorageBase = MMOnlineStorageBase;
//# sourceMappingURL=MMOnlineStorageBase.js.map