"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMO_SceneStruct = exports.mergeQuestSaveData = exports.applyQuestSaveToContext = exports.createQuestSaveFromContext = exports.QuestSave = exports.EquipmentSave = exports.applyEquipmentToContext = exports.createEquipmentFromContext = exports.mergeEquipmentData = exports.InventorySave = exports.applyInventoryToContext = exports.createInventoryFromContext = exports.mergeInventoryData = exports.applyDungeonItemDataToContext = exports.mergeDungeonItemData = exports.createDungeonItemDataFromContext = exports.isAdultTradeItem = exports.MMODungeonItemContext = exports.MMODungeonItemContainer = void 0;
const MMAPI_1 = require("../MMAPI/MMAPI");
const EventHandler_1 = require("modloader64_api/EventHandler");
const MMOAPI_1 = require("../MMOAPI/MMOAPI");
class MMODungeonItemContainer {
    constructor() {
        this.bossKey = false;
        this.compass = false;
        this.map = false;
    }
}
exports.MMODungeonItemContainer = MMODungeonItemContainer;
class MMODungeonItemContext {
    constructor() {
        this.WOODFALL_TEMPLE = new MMODungeonItemContainer();
        this.SNOWHEAD_TEMPLE = new MMODungeonItemContainer();
        this.GREAT_BAY_TEMPLE = new MMODungeonItemContainer();
        this.STONE_TOWER_TEMPLE = new MMODungeonItemContainer();
    }
}
exports.MMODungeonItemContext = MMODungeonItemContext;
function isAdultTradeItem(item) {
    return (item === MMAPI_1.InventoryItem.QSLOT1_MOONS_TEAR ||
        item === MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_LAND ||
        item === MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_MOUNTAIN ||
        item === MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_OCEAN ||
        item === MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_SWAMP ||
        item === MMAPI_1.InventoryItem.QSLOT2_ROOM_KEY ||
        item === MMAPI_1.InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA ||
        item === MMAPI_1.InventoryItem.QSLOT3_LETTER_TO_KAFEI ||
        item === MMAPI_1.InventoryItem.QSLOT3_PENDANT_OF_MEMORIES);
}
exports.isAdultTradeItem = isAdultTradeItem;
function createDungeonItemDataFromContext(context) {
    let m = new MMODungeonItemContext();
    m.WOODFALL_TEMPLE.bossKey = context.WOODFALL_TEMPLE.bossKey;
    m.WOODFALL_TEMPLE.compass = context.WOODFALL_TEMPLE.compass;
    m.WOODFALL_TEMPLE.map = context.WOODFALL_TEMPLE.map;
    m.SNOWHEAD_TEMPLE.bossKey = context.SNOWHEAD_TEMPLE.bossKey;
    m.SNOWHEAD_TEMPLE.compass = context.SNOWHEAD_TEMPLE.compass;
    m.SNOWHEAD_TEMPLE.map = context.SNOWHEAD_TEMPLE.map;
    m.GREAT_BAY_TEMPLE.bossKey = context.GREAT_BAY_TEMPLE.bossKey;
    m.GREAT_BAY_TEMPLE.compass = context.GREAT_BAY_TEMPLE.compass;
    m.GREAT_BAY_TEMPLE.map = context.GREAT_BAY_TEMPLE.map;
    m.STONE_TOWER_TEMPLE.bossKey = context.STONE_TOWER_TEMPLE.bossKey;
    m.STONE_TOWER_TEMPLE.compass = context.STONE_TOWER_TEMPLE.compass;
    m.STONE_TOWER_TEMPLE.map = context.STONE_TOWER_TEMPLE.map;
    return m;
}
exports.createDungeonItemDataFromContext = createDungeonItemDataFromContext;
function mergeDungeonItemData(storage, incoming) {
    if (incoming.WOODFALL_TEMPLE.bossKey && !storage.WOODFALL_TEMPLE.bossKey) {
        storage.WOODFALL_TEMPLE.bossKey = incoming.WOODFALL_TEMPLE.bossKey;
    }
    if (incoming.WOODFALL_TEMPLE.compass && !storage.WOODFALL_TEMPLE.compass) {
        storage.WOODFALL_TEMPLE.compass = incoming.WOODFALL_TEMPLE.compass;
    }
    if (incoming.WOODFALL_TEMPLE.map && !storage.WOODFALL_TEMPLE.map) {
        storage.WOODFALL_TEMPLE.map = incoming.WOODFALL_TEMPLE.map;
    }
    if (incoming.SNOWHEAD_TEMPLE.bossKey && !storage.SNOWHEAD_TEMPLE.bossKey) {
        storage.SNOWHEAD_TEMPLE.bossKey = incoming.SNOWHEAD_TEMPLE.bossKey;
    }
    if (incoming.SNOWHEAD_TEMPLE.compass && !storage.SNOWHEAD_TEMPLE.compass) {
        storage.SNOWHEAD_TEMPLE.compass = incoming.SNOWHEAD_TEMPLE.compass;
    }
    if (incoming.SNOWHEAD_TEMPLE.map && !storage.SNOWHEAD_TEMPLE.map) {
        storage.SNOWHEAD_TEMPLE.map = incoming.SNOWHEAD_TEMPLE.map;
    }
    if (incoming.GREAT_BAY_TEMPLE.bossKey && !storage.GREAT_BAY_TEMPLE.bossKey) {
        storage.GREAT_BAY_TEMPLE.bossKey = incoming.GREAT_BAY_TEMPLE.bossKey;
    }
    if (incoming.GREAT_BAY_TEMPLE.compass && !storage.GREAT_BAY_TEMPLE.compass) {
        storage.GREAT_BAY_TEMPLE.compass = incoming.GREAT_BAY_TEMPLE.compass;
    }
    if (incoming.GREAT_BAY_TEMPLE.map && !storage.GREAT_BAY_TEMPLE.map) {
        storage.GREAT_BAY_TEMPLE.map = incoming.GREAT_BAY_TEMPLE.map;
    }
    if (incoming.STONE_TOWER_TEMPLE.bossKey && !storage.STONE_TOWER_TEMPLE.bossKey) {
        storage.STONE_TOWER_TEMPLE.bossKey = incoming.STONE_TOWER_TEMPLE.bossKey;
    }
    if (incoming.STONE_TOWER_TEMPLE.compass && !storage.STONE_TOWER_TEMPLE.compass) {
        storage.STONE_TOWER_TEMPLE.compass = incoming.STONE_TOWER_TEMPLE.compass;
    }
    if (incoming.STONE_TOWER_TEMPLE.map && !storage.STONE_TOWER_TEMPLE.map) {
        storage.STONE_TOWER_TEMPLE.map = incoming.STONE_TOWER_TEMPLE.map;
    }
}
exports.mergeDungeonItemData = mergeDungeonItemData;
function applyDungeonItemDataToContext(incoming, context) {
    context.WOODFALL_TEMPLE.bossKey = incoming.WOODFALL_TEMPLE.bossKey;
    context.WOODFALL_TEMPLE.compass = incoming.WOODFALL_TEMPLE.compass;
    context.WOODFALL_TEMPLE.map = incoming.WOODFALL_TEMPLE.map;
    context.SNOWHEAD_TEMPLE.bossKey = incoming.SNOWHEAD_TEMPLE.bossKey;
    context.SNOWHEAD_TEMPLE.compass = incoming.SNOWHEAD_TEMPLE.compass;
    context.SNOWHEAD_TEMPLE.map = incoming.SNOWHEAD_TEMPLE.map;
    context.GREAT_BAY_TEMPLE.bossKey = incoming.GREAT_BAY_TEMPLE.bossKey;
    context.GREAT_BAY_TEMPLE.compass = incoming.GREAT_BAY_TEMPLE.compass;
    context.GREAT_BAY_TEMPLE.map = incoming.GREAT_BAY_TEMPLE.map;
    context.STONE_TOWER_TEMPLE.bossKey = incoming.STONE_TOWER_TEMPLE.bossKey;
    context.STONE_TOWER_TEMPLE.compass = incoming.STONE_TOWER_TEMPLE.compass;
    context.STONE_TOWER_TEMPLE.map = incoming.STONE_TOWER_TEMPLE.map;
}
exports.applyDungeonItemDataToContext = applyDungeonItemDataToContext;
// As much as I want to pull some Object.keys bullshit here to make writing this less verbose, I don't want any sneaky bugs.
// So, we write it all verbose as hell.
function mergeInventoryData(save, incoming) {
    if (incoming.FIELD_DEKU_STICKS) {
        save.FIELD_DEKU_STICKS = true;
    }
    if (incoming.FIELD_DEKU_NUT) {
        save.FIELD_DEKU_NUT = true;
    }
    if (incoming.FIELD_BOMB) {
        save.FIELD_BOMB = true;
    }
    if (incoming.FIELD_BOMBCHU) {
        save.FIELD_BOMBCHU = true;
    }
    if (incoming.FIELD_MAGIC_BEAN) {
        save.FIELD_MAGIC_BEAN = true;
        save.magicBeansCount = incoming.magicBeansCount;
    }
    if (incoming.FIELD_HEROES_BOW) {
        save.FIELD_HEROES_BOW = true;
    }
    if (incoming.FIELD_FIRE_ARROW) {
        save.FIELD_FIRE_ARROW = true;
    }
    if (incoming.FIELD_ICE_ARROW) {
        save.FIELD_ICE_ARROW = true;
    }
    if (incoming.FIELD_LIGHT_ARROW) {
        save.FIELD_LIGHT_ARROW = true;
    }
    if (incoming.FIELD_OCARINA > save.FIELD_OCARINA) {
        save.FIELD_OCARINA = incoming.FIELD_OCARINA;
    }
    if (incoming.FIELD_HOOKSHOT > save.FIELD_HOOKSHOT) {
        save.FIELD_HOOKSHOT = true;
    }
    if (incoming.FIELD_LENS_OF_TRUTH) {
        save.FIELD_LENS_OF_TRUTH = true;
    }
    if (incoming.FIELD_GREAT_FAIRYS_SWORD) {
        save.FIELD_GREAT_FAIRYS_SWORD = true;
    }
    if (incoming.FIELD_POWDER_KEG) {
        save.FIELD_POWDER_KEG = true;
    }
    if (incoming.FIELD_PICTOGRAPH_BOX) {
        save.FIELD_PICTOGRAPH_BOX = true;
    }
    if (incoming.FIELD_BOTTLE1 > save.FIELD_BOTTLE1) {
        save.FIELD_BOTTLE1 = incoming.FIELD_BOTTLE1;
    }
    if (incoming.FIELD_BOTTLE2 > save.FIELD_BOTTLE2) {
        save.FIELD_BOTTLE2 = incoming.FIELD_BOTTLE2;
    }
    if (incoming.FIELD_BOTTLE3 > save.FIELD_BOTTLE3) {
        save.FIELD_BOTTLE3 = incoming.FIELD_BOTTLE3;
    }
    if (incoming.FIELD_BOTTLE4 > save.FIELD_BOTTLE4) {
        save.FIELD_BOTTLE4 = incoming.FIELD_BOTTLE4;
    }
    if (incoming.FIELD_BOTTLE5 > save.FIELD_BOTTLE5) {
        save.FIELD_BOTTLE5 = incoming.FIELD_BOTTLE5;
    }
    if (incoming.FIELD_BOTTLE6 > save.FIELD_BOTTLE6) {
        save.FIELD_BOTTLE6 = incoming.FIELD_BOTTLE6;
    }
    if (incoming.FIELD_QUEST_ITEM_1 > save.FIELD_QUEST_ITEM_1) {
        save.FIELD_QUEST_ITEM_1 = incoming.FIELD_QUEST_ITEM_1;
    }
    if (incoming.FIELD_QUEST_ITEM_2 > save.FIELD_QUEST_ITEM_2) {
        save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
    }
    if (incoming.FIELD_QUEST_ITEM_3 > save.FIELD_QUEST_ITEM_3) {
        save.FIELD_QUEST_ITEM_3 = incoming.FIELD_QUEST_ITEM_3;
    }
    //-----------------------------------------------------
    // 1st Quest Item Slot
    // TODO: Add actual flag checks to make SOLD_OUT safe.
    //-----------------------------------------------------
    // Catchup code first.
    if (incoming.FIELD_QUEST_ITEM_1 !== MMAPI_1.InventoryItem.NONE &&
        save.FIELD_QUEST_ITEM_1 === MMAPI_1.InventoryItem.NONE) {
        save.FIELD_QUEST_ITEM_1 = incoming.FIELD_QUEST_ITEM_1;
    }
    if (save.FIELD_QUEST_ITEM_1 === MMAPI_1.InventoryItem.DEKU_STICK) {
        // I don't understand why this is necessary, but Deku Sticks will not stop getting into this slot for some reason.
        save.FIELD_QUEST_ITEM_1 = MMAPI_1.InventoryItem.NONE;
    }
    if (incoming.FIELD_QUEST_ITEM_1 > save.FIELD_QUEST_ITEM_1 &&
        save.FIELD_QUEST_ITEM_1 <= MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_SWAMP) {
        save.FIELD_QUEST_ITEM_1 = incoming.FIELD_QUEST_ITEM_1;
    }
    //-----------------------------------------------------
    // 2nd Quest Item Slot
    //-----------------------------------------------------
    // Catchup code first.
    if (incoming.FIELD_QUEST_ITEM_2 !== MMAPI_1.InventoryItem.NONE &&
        save.FIELD_QUEST_ITEM_2 === MMAPI_1.InventoryItem.NONE) {
        save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
    }
    if (save.FIELD_QUEST_ITEM_2 === MMAPI_1.InventoryItem.DEKU_STICK) {
        // I don't understand why this is necessary, but Deku Sticks will not stop getting into this slot for some reason.
        save.FIELD_QUEST_ITEM_2 = MMAPI_1.InventoryItem.NONE;
    }
    if (incoming.FIELD_QUEST_ITEM_2 > save.FIELD_QUEST_ITEM_2) {
        if (isAdultTradeItem(incoming.FIELD_QUEST_ITEM_2)) {
            save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
        }
    }
    // Allow people to bottle dupe over CLAIM_CHECK.
    if (!isAdultTradeItem(incoming.FIELD_QUEST_ITEM_2) &&
        save.FIELD_QUEST_ITEM_2 === MMAPI_1.InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA) {
        save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
    }
    //-----------------------------------------------------
    // Bottles
    //-----------------------------------------------------
    if (incoming.FIELD_BOTTLE1 !== MMAPI_1.InventoryItem.NONE) {
        save.FIELD_BOTTLE1 = incoming.FIELD_BOTTLE1;
    }
    if (incoming.FIELD_BOTTLE2 !== MMAPI_1.InventoryItem.NONE) {
        save.FIELD_BOTTLE2 = incoming.FIELD_BOTTLE2;
    }
    if (incoming.FIELD_BOTTLE3 !== MMAPI_1.InventoryItem.NONE) {
        save.FIELD_BOTTLE3 = incoming.FIELD_BOTTLE3;
    }
    if (incoming.FIELD_BOTTLE4 !== MMAPI_1.InventoryItem.NONE) {
        save.FIELD_BOTTLE4 = incoming.FIELD_BOTTLE4;
    }
    //-----------------------------------------------------
    // Upgrades
    //-----------------------------------------------------
    if (save.wallet < incoming.wallet) {
        save.wallet = incoming.wallet;
    }
    if (save.quiver < incoming.quiver) {
        save.quiver = incoming.quiver;
    }
    if (save.bombBag < incoming.bombBag) {
        save.bombBag = incoming.bombBag;
    }
    if (save.dekuNutsCapacity < incoming.dekuNutsCapacity) {
        save.dekuNutsCapacity = incoming.dekuNutsCapacity;
    }
    if (save.dekuSticksCapacity < incoming.dekuSticksCapacity) {
        save.dekuSticksCapacity = incoming.dekuSticksCapacity;
    }
}
exports.mergeInventoryData = mergeInventoryData;
function createInventoryFromContext(save) {
    let data = new InventorySave();
    data.FIELD_DEKU_STICKS = save.inventory.FIELD_DEKU_STICKS;
    data.FIELD_DEKU_NUT = save.inventory.FIELD_DEKU_NUT;
    data.FIELD_BOMB = save.inventory.FIELD_BOMB;
    data.FIELD_BOMBCHU = save.inventory.FIELD_BOMBCHU;
    data.FIELD_MAGIC_BEAN = save.inventory.FIELD_MAGIC_BEAN;
    data.magicBeansCount = save.inventory.magicBeansCount;
    data.FIELD_HEROES_BOW = save.inventory.FIELD_HEROES_BOW;
    data.FIELD_FIRE_ARROW = save.inventory.FIELD_FIRE_ARROW;
    data.FIELD_ICE_ARROW = save.inventory.FIELD_ICE_ARROW;
    data.FIELD_LIGHT_ARROW = save.inventory.FIELD_LIGHT_ARROW;
    data.FIELD_OCARINA = save.inventory.FIELD_OCARINA;
    data.FIELD_HOOKSHOT = save.inventory.FIELD_HOOKSHOT;
    data.FIELD_LENS_OF_TRUTH = save.inventory.FIELD_LENS_OF_TRUTH;
    data.FIELD_QUEST_ITEM_1 = save.inventory.FIELD_QUEST_ITEM_1;
    data.FIELD_QUEST_ITEM_2 = save.inventory.FIELD_QUEST_ITEM_2;
    data.FIELD_QUEST_ITEM_3 = save.inventory.FIELD_QUEST_ITEM_3;
    data.FIELD_BOTTLE1 = save.inventory.FIELD_BOTTLE1;
    data.FIELD_BOTTLE2 = save.inventory.FIELD_BOTTLE2;
    data.FIELD_BOTTLE3 = save.inventory.FIELD_BOTTLE3;
    data.FIELD_BOTTLE4 = save.inventory.FIELD_BOTTLE4;
    data.FIELD_BOTTLE5 = save.inventory.FIELD_BOTTLE5;
    data.FIELD_BOTTLE6 = save.inventory.FIELD_BOTTLE6;
    data.FIELD_PICTOGRAPH_BOX = save.inventory.FIELD_PICTOGRAPH_BOX;
    data.FIELD_POWDER_KEG = save.inventory.FIELD_POWDER_KEG;
    data.FIELD_GREAT_FAIRYS_SWORD = save.inventory.FIELD_GREAT_FAIRYS_SWORD;
    data.wallet = save.inventory.wallet;
    data.quiver = save.inventory.quiver;
    data.bombBag = save.inventory.bombBag;
    data.dekuNutsCapacity = save.inventory.dekuNutsCapacity;
    data.dekuSticksCapacity = save.inventory.dekuSticksCapacity;
    return data;
}
exports.createInventoryFromContext = createInventoryFromContext;
function applyInventoryToContext(data, save, overrideBottles = false) {
    save.inventory.FIELD_DEKU_STICKS = data.FIELD_DEKU_STICKS;
    save.inventory.FIELD_DEKU_NUT = data.FIELD_DEKU_NUT;
    save.inventory.FIELD_BOMB = data.FIELD_BOMB;
    if (!save.inventory.FIELD_BOMBCHU && data.FIELD_BOMBCHU) {
        global.ModLoader['fuckyouBombchu'] = setInterval(() => {
            if (save.inventory.bombchuCount > 0) {
                clearInterval(global.ModLoader['fuckyouBombchu']);
            }
            save.inventory.bombchuCount = MMAPI_1.UpgradeCountLookup(MMAPI_1.InventoryItem.BOMBCHU, 1 /* BASE */);
        }, 1);
    }
    save.inventory.FIELD_DEKU_STICKS = data.FIELD_DEKU_STICKS;
    save.inventory.FIELD_DEKU_NUT = data.FIELD_DEKU_NUT;
    save.inventory.FIELD_BOMB = data.FIELD_BOMB;
    save.inventory.FIELD_BOMBCHU = data.FIELD_BOMBCHU;
    save.inventory.FIELD_MAGIC_BEAN = data.FIELD_MAGIC_BEAN;
    save.inventory.magicBeansCount = data.magicBeansCount;
    save.inventory.FIELD_HEROES_BOW = data.FIELD_HEROES_BOW;
    save.inventory.FIELD_FIRE_ARROW = data.FIELD_FIRE_ARROW;
    save.inventory.FIELD_ICE_ARROW = data.FIELD_ICE_ARROW;
    save.inventory.FIELD_LIGHT_ARROW = data.FIELD_LIGHT_ARROW;
    save.inventory.FIELD_OCARINA = data.FIELD_OCARINA;
    save.inventory.FIELD_HOOKSHOT = data.FIELD_HOOKSHOT;
    save.inventory.FIELD_LENS_OF_TRUTH = data.FIELD_LENS_OF_TRUTH;
    save.inventory.FIELD_QUEST_ITEM_1 = data.FIELD_QUEST_ITEM_1;
    save.inventory.FIELD_QUEST_ITEM_2 = data.FIELD_QUEST_ITEM_2;
    save.inventory.FIELD_QUEST_ITEM_3 = data.FIELD_QUEST_ITEM_3;
    save.inventory.FIELD_BOTTLE1 = data.FIELD_BOTTLE1;
    save.inventory.FIELD_BOTTLE2 = data.FIELD_BOTTLE2;
    save.inventory.FIELD_BOTTLE3 = data.FIELD_BOTTLE3;
    save.inventory.FIELD_BOTTLE4 = data.FIELD_BOTTLE4;
    save.inventory.FIELD_BOTTLE5 = data.FIELD_BOTTLE5;
    save.inventory.FIELD_BOTTLE6 = data.FIELD_BOTTLE6;
    save.inventory.FIELD_PICTOGRAPH_BOX = data.FIELD_PICTOGRAPH_BOX;
    save.inventory.FIELD_POWDER_KEG = data.FIELD_POWDER_KEG;
    save.inventory.FIELD_GREAT_FAIRYS_SWORD = data.FIELD_GREAT_FAIRYS_SWORD;
    if (overrideBottles) {
        save.inventory.FIELD_BOTTLE1 = data.FIELD_BOTTLE1;
        save.inventory.FIELD_BOTTLE2 = data.FIELD_BOTTLE2;
        save.inventory.FIELD_BOTTLE3 = data.FIELD_BOTTLE3;
        save.inventory.FIELD_BOTTLE4 = data.FIELD_BOTTLE4;
    }
    save.inventory.wallet = data.wallet;
    if (data.quiver > save.inventory.quiver) {
        save.inventory.arrows = MMAPI_1.UpgradeCountLookup(MMAPI_1.InventoryItem.HEROES_BOW, data.quiver);
    }
    save.inventory.quiver = data.quiver;
    if (data.bombBag > save.inventory.bombBag) {
        save.inventory.bombsCount = MMAPI_1.UpgradeCountLookup(MMAPI_1.InventoryItem.BOMB, data.bombBag);
    }
    save.inventory.bombBag = data.bombBag;
    if (data.dekuNutsCapacity > save.inventory.dekuNutsCapacity) {
        if (data.dekuNutsCapacity > 1) {
            save.inventory.dekuNutsCount = MMAPI_1.UpgradeCountLookup(MMAPI_1.InventoryItem.DEKU_NUT, data.dekuNutsCapacity);
        }
        else {
            if (data.dekuNutsCapacity === 1) {
                save.inventory.dekuNutsCount = 5;
            }
        }
    }
    save.inventory.dekuNutsCapacity = data.dekuNutsCapacity;
    if (data.dekuSticksCapacity > save.inventory.dekuSticksCapacity) {
        if (data.dekuSticksCapacity > 1) {
            save.inventory.dekuSticksCount = MMAPI_1.UpgradeCountLookup(MMAPI_1.InventoryItem.DEKU_STICK, data.dekuSticksCapacity);
        }
        else {
            if (data.dekuSticksCapacity === 1) {
                save.inventory.dekuSticksCount = 1;
            }
        }
    }
    save.inventory.dekuSticksCapacity = data.dekuSticksCapacity;
}
exports.applyInventoryToContext = applyInventoryToContext;
class InventorySave {
    constructor() {
        this.FIELD_DEKU_STICKS = false;
        this.FIELD_DEKU_NUT = false;
        this.FIELD_BOMB = false;
        this.FIELD_BOMBCHU = false;
        this.FIELD_MAGIC_BEAN = false;
        this.magicBeansCount = 0;
        this.FIELD_HEROES_BOW = false;
        this.FIELD_FIRE_ARROW = false;
        this.FIELD_ICE_ARROW = false;
        this.FIELD_LIGHT_ARROW = false;
        this.FIELD_OCARINA = 0 /* NONE */;
        this.FIELD_HOOKSHOT = false;
        this.FIELD_LENS_OF_TRUTH = false;
        this.FIELD_GREAT_FAIRYS_SWORD = false;
        this.FIELD_PICTOGRAPH_BOX = false;
        this.FIELD_POWDER_KEG = false;
        this.FIELD_QUEST_ITEM_1 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_QUEST_ITEM_2 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_QUEST_ITEM_3 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE1 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE2 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE3 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE4 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE5 = MMAPI_1.InventoryItem.NONE;
        this.FIELD_BOTTLE6 = MMAPI_1.InventoryItem.NONE;
        this.wallet = 0 /* CHILD */;
        this.quiver = 0 /* NONE */;
        this.dekuSticksCapacity = 0 /* NONE */;
        this.dekuNutsCapacity = 0 /* NONE */;
        this.bombBag = 0 /* NONE */;
    }
}
exports.InventorySave = InventorySave;
//-----------------------------------------------------
// Equipment
//-----------------------------------------------------
function mergeEquipmentData(save, incoming) {
    // Swords
    if (incoming.kokiriSword) {
        save.kokiriSword = true;
    }
    if (incoming.razorSword) {
        save.razorSword = true;
    }
    if (incoming.gilded) {
        save.gilded = true;
    }
    // Shields
    if (incoming.heroesShield) {
        save.heroesShield = true;
    }
    if (incoming.mirrorShield) {
        save.mirrorShield = true;
    }
}
exports.mergeEquipmentData = mergeEquipmentData;
function createEquipmentFromContext(save) {
    let data = new EquipmentSave();
    data.kokiriSword = save.swords.kokiriSword;
    data.razorSword = save.swords.razorSword;
    data.gilded = save.swords.gilded;
    data.heroesShield = save.shields.heroesShield;
    data.mirrorShield = save.shields.mirrorShield;
    return data;
}
exports.createEquipmentFromContext = createEquipmentFromContext;
function applyEquipmentToContext(data, save) {
    save.swords.kokiriSword = data.kokiriSword;
    save.swords.razorSword = data.razorSword;
    save.swords.gilded = data.gilded;
    save.shields.heroesShield = data.heroesShield;
    save.shields.mirrorShield = data.mirrorShield;
}
exports.applyEquipmentToContext = applyEquipmentToContext;
class EquipmentSave {
    constructor() {
        this.kokiriSword = false;
        this.razorSword = false;
        this.gilded = false;
        this.heroesShield = false;
        this.mirrorShield = false;
    }
}
exports.EquipmentSave = EquipmentSave;
class QuestSave {
    constructor() {
        this.heart_containers = 0;
        this.odolwaRemains = false;
        this.gohtRemains = false;
        this.gyorgRemains = false;
        this.twinmoldRemains = false;
        this.songOfTime = false;
        this.songOfHealing = false;
        this.eponaSong = false;
        this.songOfSoaring = false;
        this.songOfStorms = false;
        this.sonataOfAwakening = false;
        this.goronLullaby = false;
        this.newWaveBossaNova = false;
        this.elegyOfEmptiness = false;
        this.oathToOrder = false;
        this.bombersNotebook = false;
        this.heartPieces = 0;
        this.magic_meter_size = 0 /* NONE */;
        this.double_defense = 0;
    }
}
exports.QuestSave = QuestSave;
function createQuestSaveFromContext(save) {
    let data = new QuestSave();
    data.odolwaRemains = save.questStatus.odolwaRemains;
    data.gohtRemains = save.questStatus.gohtRemains;
    data.gyorgRemains = save.questStatus.gyorgRemains;
    data.twinmoldRemains = save.questStatus.twinmoldRemains;
    data.songOfTime = save.questStatus.songOfTime;
    data.songOfHealing = save.questStatus.songOfHealing;
    data.eponaSong = save.questStatus.eponaSong;
    data.songOfSoaring = save.questStatus.songOfSoaring;
    data.songOfStorms = save.questStatus.songOfStorms;
    data.sonataOfAwakening = save.questStatus.sonataOfAwakening;
    data.goronLullaby = save.questStatus.goronLullaby;
    data.newWaveBossaNova = save.questStatus.newWaveBossaNova;
    data.elegyOfEmptiness = save.questStatus.elegyOfEmptiness;
    data.oathToOrder = save.questStatus.oathToOrder;
    data.bombersNotebook = save.questStatus.bombersNotebook;
    data.heartPieces = save.questStatus.heartPieces;
    data.heart_containers = save.heart_containers;
    data.magic_meter_size = save.magic_meter_size;
    data.double_defense = save.double_defense;
    return data;
}
exports.createQuestSaveFromContext = createQuestSaveFromContext;
function applyQuestSaveToContext(data, save) {
    save.questStatus.odolwaRemains = data.odolwaRemains;
    save.questStatus.gohtRemains = data.gohtRemains;
    save.questStatus.gyorgRemains = data.gyorgRemains;
    save.questStatus.twinmoldRemains = data.twinmoldRemains;
    save.questStatus.songOfTime = data.songOfTime;
    save.questStatus.songOfHealing = data.songOfHealing;
    save.questStatus.eponaSong = data.eponaSong;
    save.questStatus.songOfSoaring = data.songOfSoaring;
    save.questStatus.songOfStorms = data.songOfStorms;
    save.questStatus.sonataOfAwakening = data.sonataOfAwakening;
    save.questStatus.goronLullaby = data.goronLullaby;
    save.questStatus.newWaveBossaNova = data.newWaveBossaNova;
    save.questStatus.elegyOfEmptiness = data.elegyOfEmptiness;
    save.questStatus.oathToOrder = data.oathToOrder;
    let lastKnownHP = save.questStatus.heartPieces;
    save.questStatus.heartPieces = data.heartPieces;
    if (lastKnownHP < data.heartPieces) {
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.GAINED_PIECE_OF_HEART, data.heartPieces);
    }
    let lastKnownHC = save.heart_containers;
    save.heart_containers = data.heart_containers;
    if (lastKnownHC < data.heart_containers) {
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.GAINED_HEART_CONTAINER, data.heart_containers);
    }
    let lastKnownMagic = save.magic_meter_size;
    save.magic_meter_size = data.magic_meter_size;
    if (lastKnownMagic < data.magic_meter_size) {
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.MAGIC_METER_INCREASED, data.magic_meter_size);
    }
    let lastKnownDD = save.double_defense;
    save.double_defense = data.double_defense;
    if (lastKnownDD < data.double_defense) {
        EventHandler_1.bus.emit(MMOAPI_1.MMOnlineEvents.GAINED_HEART_CONTAINER, data.double_defense);
    }
}
exports.applyQuestSaveToContext = applyQuestSaveToContext;
function mergeQuestSaveData(save, incoming) {
    if (incoming.odolwaRemains) {
        save.odolwaRemains = true;
    }
    if (incoming.gohtRemains) {
        save.gohtRemains = true;
    }
    if (incoming.gyorgRemains) {
        save.gyorgRemains = true;
    }
    if (incoming.twinmoldRemains) {
        save.twinmoldRemains = true;
    }
    if (incoming.songOfTime) {
        save.songOfTime = true;
    }
    if (incoming.songOfHealing) {
        save.songOfHealing = true;
    }
    if (incoming.eponaSong) {
        save.eponaSong = true;
    }
    if (incoming.songOfSoaring) {
        save.songOfSoaring = true;
    }
    if (incoming.songOfStorms) {
        save.songOfStorms = true;
    }
    if (incoming.sonataOfAwakening) {
        save.sonataOfAwakening = true;
    }
    if (incoming.goronLullaby) {
        save.goronLullaby = true;
    }
    if (incoming.newWaveBossaNova) {
        save.newWaveBossaNova = true;
    }
    if (incoming.elegyOfEmptiness) {
        save.elegyOfEmptiness = true;
    }
    if (incoming.oathToOrder) {
        save.oathToOrder = true;
    }
    if (incoming.bombersNotebook) {
        save.bombersNotebook = true;
    }
    if (incoming.songOfStorms > save.songOfStorms) {
        save.songOfStorms = true;
    }
    // No idea if this logic is correct. Needs testing.
    if (incoming.heartPieces > save.heartPieces) {
        save.heartPieces = incoming.heartPieces;
    }
    else if (incoming.heartPieces === 0 && save.heartPieces >= 3) {
        save.heartPieces = 0;
    }
    if (incoming.heart_containers > save.heart_containers) {
        save.heart_containers = incoming.heart_containers;
    }
    if (incoming.magic_meter_size > save.magic_meter_size) {
        save.magic_meter_size = incoming.magic_meter_size;
    }
    if (incoming.double_defense > save.double_defense) {
        save.double_defense = incoming.double_defense;
    }
}
exports.mergeQuestSaveData = mergeQuestSaveData;
class MMO_SceneStruct {
    constructor(buf) {
        this.buf = buf;
    }
    get chests() {
        return this.buf.slice(0x0, 0x4);
    }
    get switches() {
        return this.buf.slice(0x4, 0x8);
    }
    get room_clear() {
        return this.buf.slice(0x8, 0xC);
    }
    get collectible() {
        return this.buf.slice(0xC, 0x10);
    }
    get unused() {
        return this.buf.slice(0x10, 0x14);
    }
    get visited_rooms() {
        return this.buf.slice(0x14, 0x18);
    }
    get visited_floors() {
        return this.buf.slice(0x18, 0x1C);
    }
}
exports.MMO_SceneStruct = MMO_SceneStruct;
//# sourceMappingURL=MMOSaveData.js.map