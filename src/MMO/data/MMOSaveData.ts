import {
    Ocarina,
    InventoryItem,
    ISaveContext,
    ISwords,
    IShields,
    IQuestStatus,
    Wallet,
    AmmoUpgrade,
    IInventoryFields,
    UpgradeCountLookup,
    Magic,
  } from '../MMAPI/MMAPI';
  import { bus } from 'modloader64_api/EventHandler';
  import { MMOnlineEvents } from '../MMOAPI/MMOAPI';
  import { IDungeonItemContainer } from '../MMAPI/IDungeonItemContainer';
  import { IDungeonItemManager } from '../MMAPI/IDungeonItemManager';
  
  
  export interface IDungeonItemSave extends IDungeonItemManager { }
  
  export class MMODungeonItemContainer implements IDungeonItemContainer {
    bossKey = false;
    compass = false;
    map = false;
  }
  
  export class MMODungeonItemContext implements IDungeonItemSave {
    WOODFALL_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    SNOWHEAD_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    GREAT_BAY_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    STONE_TOWER_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    FIRE_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    WATER_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    SPIRIT_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    SHADOW_TEMPLE: IDungeonItemContainer = new MMODungeonItemContainer();
    BOTTOM_OF_THE_WELL: IDungeonItemContainer = new MMODungeonItemContainer();
    ICE_CAVERN: IDungeonItemContainer = new MMODungeonItemContainer();
    GANONS_CASTLE: IDungeonItemContainer = new MMODungeonItemContainer();
  }
  
  export function isAdultTradeItem(item: InventoryItem) {
    return (
      item === InventoryItem.QSLOT1_MOONS_TEAR ||
      item === InventoryItem.QSLOT1_TITLE_DEED_LAND ||
      item === InventoryItem.QSLOT1_TITLE_DEED_MOUNTAIN ||
      item === InventoryItem.QSLOT1_TITLE_DEED_OCEAN ||
      item === InventoryItem.QSLOT1_TITLE_DEED_SWAMP ||
      item === InventoryItem.QSLOT2_ROOM_KEY ||
      item === InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA ||
      item === InventoryItem.QSLOT3_LETTER_TO_KAFEI ||
      item === InventoryItem.QSLOT3_PENDANT_OF_MEMORIES
    );
  }

  export function createDungeonItemDataFromContext(
    context: IDungeonItemManager
  ): IDungeonItemSave {
    let m: IDungeonItemSave = new MMODungeonItemContext();
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
  
  export function mergeDungeonItemData(
    storage: IDungeonItemManager,
    incoming: IDungeonItemSave
  ) {
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
  
  export function applyDungeonItemDataToContext(
    incoming: IDungeonItemSave,
    context: IDungeonItemManager
  ) {
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
  
  // As much as I want to pull some Object.keys bullshit here to make writing this less verbose, I don't want any sneaky bugs.
  // So, we write it all verbose as hell.
  export function mergeInventoryData(
    save: InventorySave,
    incoming: InventorySave
  ) {
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
    if (
      incoming.FIELD_QUEST_ITEM_1 !== InventoryItem.NONE &&
      save.FIELD_QUEST_ITEM_1 === InventoryItem.NONE
    ) {
      save.FIELD_QUEST_ITEM_1 = incoming.FIELD_QUEST_ITEM_1;
    }
  
    if (save.FIELD_QUEST_ITEM_1 === InventoryItem.DEKU_STICK) {
      // I don't understand why this is necessary, but Deku Sticks will not stop getting into this slot for some reason.
      save.FIELD_QUEST_ITEM_1 = InventoryItem.NONE;
    }
  
    if (
    incoming.FIELD_QUEST_ITEM_1 > save.FIELD_QUEST_ITEM_1 &&
    save.FIELD_QUEST_ITEM_1 <= InventoryItem.QSLOT1_TITLE_DEED_SWAMP
    ) {
    save.FIELD_QUEST_ITEM_1 = incoming.FIELD_QUEST_ITEM_1;
    }

    //-----------------------------------------------------
    // 2nd Quest Item Slot
    //-----------------------------------------------------
  
    // Catchup code first.
    if (
      incoming.FIELD_QUEST_ITEM_2 !== InventoryItem.NONE &&
      save.FIELD_QUEST_ITEM_2 === InventoryItem.NONE
    ) {
      save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
    }
  
    if (save.FIELD_QUEST_ITEM_2 === InventoryItem.DEKU_STICK) {
      // I don't understand why this is necessary, but Deku Sticks will not stop getting into this slot for some reason.
      save.FIELD_QUEST_ITEM_2 = InventoryItem.NONE;
    }
  
    if (incoming.FIELD_QUEST_ITEM_2 > save.FIELD_QUEST_ITEM_2) {
      if (isAdultTradeItem(incoming.FIELD_QUEST_ITEM_2)) {
        save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
      }
    }
  
    // Allow people to bottle dupe over CLAIM_CHECK.
    if (
      !isAdultTradeItem(incoming.FIELD_QUEST_ITEM_2) &&
      save.FIELD_QUEST_ITEM_2 === InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA
    ) {
      save.FIELD_QUEST_ITEM_2 = incoming.FIELD_QUEST_ITEM_2;
    }
  
    //-----------------------------------------------------
    // Bottles
    //-----------------------------------------------------
    if (incoming.FIELD_BOTTLE1 !== InventoryItem.NONE) {
      save.FIELD_BOTTLE1 = incoming.FIELD_BOTTLE1;
    }
    if (incoming.FIELD_BOTTLE2 !== InventoryItem.NONE) {
      save.FIELD_BOTTLE2 = incoming.FIELD_BOTTLE2;
    }
    if (incoming.FIELD_BOTTLE3 !== InventoryItem.NONE) {
      save.FIELD_BOTTLE3 = incoming.FIELD_BOTTLE3;
    }
    if (incoming.FIELD_BOTTLE4 !== InventoryItem.NONE) {
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
  
  export function createInventoryFromContext(save: ISaveContext): InventorySave {
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
  
  export function applyInventoryToContext(
    data: InventorySave,
    save: ISaveContext,
    overrideBottles = false
  ) {
    save.inventory.FIELD_DEKU_STICKS = data.FIELD_DEKU_STICKS;
    save.inventory.FIELD_DEKU_NUT = data.FIELD_DEKU_NUT;
    save.inventory.FIELD_BOMB = data.FIELD_BOMB;
    if (!save.inventory.FIELD_BOMBCHU && data.FIELD_BOMBCHU) {
      global.ModLoader['fuckyouBombchu'] = setInterval(() => {
        if (save.inventory.bombchuCount > 0) {
          clearInterval(global.ModLoader['fuckyouBombchu']);
        }
        save.inventory.bombchuCount = UpgradeCountLookup(
          InventoryItem.BOMBCHU,
          AmmoUpgrade.BASE
        );
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
      save.inventory.arrows = UpgradeCountLookup(
        InventoryItem.HEROES_BOW,
        data.quiver
      );
    }
    save.inventory.quiver = data.quiver;
    if (data.bombBag > save.inventory.bombBag) {
      save.inventory.bombsCount = UpgradeCountLookup(
        InventoryItem.BOMB,
        data.bombBag
      );
    }
    save.inventory.bombBag = data.bombBag;
    if (data.dekuNutsCapacity > save.inventory.dekuNutsCapacity) {
      if (data.dekuNutsCapacity > 1) {
        save.inventory.dekuNutsCount = UpgradeCountLookup(
          InventoryItem.DEKU_NUT,
          data.dekuNutsCapacity
        );
      } else {
        if (data.dekuNutsCapacity === 1) {
          save.inventory.dekuNutsCount = 5;
        }
      }
    }
    save.inventory.dekuNutsCapacity = data.dekuNutsCapacity;
    if (data.dekuSticksCapacity > save.inventory.dekuSticksCapacity) {
      if (data.dekuSticksCapacity > 1) {
        save.inventory.dekuSticksCount = UpgradeCountLookup(
          InventoryItem.DEKU_STICK,
          data.dekuSticksCapacity
        );
      } else {
        if (data.dekuSticksCapacity === 1) {
          save.inventory.dekuSticksCount = 1;
        }
      }
    }
    save.inventory.dekuSticksCapacity = data.dekuSticksCapacity;
  }
  
  export class InventorySave implements IInventoryFields {

    FIELD_DEKU_STICKS = false;
    FIELD_DEKU_NUT = false;
    FIELD_BOMB = false;
    FIELD_BOMBCHU = false;
    FIELD_MAGIC_BEAN = false;
    magicBeansCount = 0;
    FIELD_HEROES_BOW = false;
    FIELD_FIRE_ARROW = false;
    FIELD_ICE_ARROW = false;
    FIELD_LIGHT_ARROW = false;
    FIELD_OCARINA: Ocarina = Ocarina.NONE;
    FIELD_HOOKSHOT = false;
    FIELD_LENS_OF_TRUTH = false;
    FIELD_GREAT_FAIRYS_SWORD = false;
    FIELD_PICTOGRAPH_BOX = false;
    FIELD_POWDER_KEG = false;
    FIELD_QUEST_ITEM_1: InventoryItem = InventoryItem.NONE;
    FIELD_QUEST_ITEM_2: InventoryItem = InventoryItem.NONE;
    FIELD_QUEST_ITEM_3: InventoryItem = InventoryItem.NONE;

    FIELD_BOTTLE1: InventoryItem = InventoryItem.NONE;
    FIELD_BOTTLE2: InventoryItem = InventoryItem.NONE;
    FIELD_BOTTLE3: InventoryItem = InventoryItem.NONE;
    FIELD_BOTTLE4: InventoryItem = InventoryItem.NONE;
    FIELD_BOTTLE5: InventoryItem = InventoryItem.NONE;
    FIELD_BOTTLE6: InventoryItem = InventoryItem.NONE;

    wallet: Wallet = Wallet.CHILD;
    quiver: AmmoUpgrade = AmmoUpgrade.NONE;
    dekuSticksCapacity: AmmoUpgrade = AmmoUpgrade.NONE;
    dekuNutsCapacity: AmmoUpgrade = AmmoUpgrade.NONE;
    bombBag: AmmoUpgrade = AmmoUpgrade.NONE;
  }
  
  //-----------------------------------------------------
  // Equipment
  //-----------------------------------------------------
  
  export function mergeEquipmentData(
    save: IEquipmentSave,
    incoming: IEquipmentSave
  ) {
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
  
  export function createEquipmentFromContext(save: ISaveContext) {
    let data = new EquipmentSave();
    data.kokiriSword = save.swords.kokiriSword;
    data.razorSword = save.swords.razorSword;
    data.gilded = save.swords.gilded;

    data.heroesShield = save.shields.heroesShield;
    data.mirrorShield = save.shields.mirrorShield;
    return data;
  }
  
  export function applyEquipmentToContext(
    data: IEquipmentSave,
    save: ISaveContext
  ) {
    save.swords.kokiriSword = data.kokiriSword;
    save.swords.razorSword = data.razorSword;
    save.swords.gilded = data.gilded;

    save.shields.heroesShield = data.heroesShield;
    save.shields.mirrorShield = data.mirrorShield;
  }
  
  // Combine the four API interfaces into one.
  export interface IEquipmentSave extends ISwords, IShields { }
  
  export class EquipmentSave implements IEquipmentSave {
    kokiriSword = false;
    razorSword = false;
    gilded = false;
    heroesShield = false;
    mirrorShield = false;
  }
  
  // Add heart containers here, it makes sense to put them with the heart pieces.
  export interface IQuestSave extends IQuestStatus {
    heart_containers: number;
    magic_meter_size: Magic;
    double_defense: number;
  }
  
  export class QuestSave implements IQuestSave {
    heart_containers = 0;
    odolwaRemains = false;
    gohtRemains = false;
    gyorgRemains = false;
    twinmoldRemains = false;
  
    songOfTime = false;
    songOfHealing = false;
    eponaSong = false;
    songOfSoaring = false;
    songOfStorms = false;
  
    sonataOfAwakening = false;
    goronLullaby = false;
    newWaveBossaNova = false;
    elegyOfEmptiness = false;
    oathToOrder = false;
  
    bombersNotebook = false;

    heartPieces = 0;
    magic_meter_size: Magic = Magic.NONE;
    double_defense = 0;
  }
  
  export function createQuestSaveFromContext(save: ISaveContext): IQuestSave {
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
  
  export function applyQuestSaveToContext(data: IQuestSave, save: ISaveContext) {
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

    let lastKnownHP: number = save.questStatus.heartPieces;
    save.questStatus.heartPieces = data.heartPieces;
    if (lastKnownHP < data.heartPieces) {
      bus.emit(MMOnlineEvents.GAINED_PIECE_OF_HEART, data.heartPieces);
    }
    let lastKnownHC: number = save.heart_containers;
    save.heart_containers = data.heart_containers;
    if (lastKnownHC < data.heart_containers) {
      bus.emit(MMOnlineEvents.GAINED_HEART_CONTAINER, data.heart_containers);
    }
    let lastKnownMagic: Magic = save.magic_meter_size;
    save.magic_meter_size = data.magic_meter_size;
    if (lastKnownMagic < data.magic_meter_size) {
      bus.emit(MMOnlineEvents.MAGIC_METER_INCREASED, data.magic_meter_size);
    }
    let lastKnownDD: number = save.double_defense;
    save.double_defense = data.double_defense;
    if (lastKnownDD < data.double_defense) {
      bus.emit(MMOnlineEvents.GAINED_HEART_CONTAINER, data.double_defense);
    }
  }
  
  export function mergeQuestSaveData(save: IQuestSave, incoming: IQuestSave) {
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
    } else if (incoming.heartPieces === 0 && save.heartPieces >= 3) {
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
  
  export class MMO_SceneStruct {
    buf: Buffer;
  
    constructor(buf: Buffer) {
      this.buf = buf;
    }
  
    get chests(): Buffer {
      return this.buf.slice(0x0, 0x4);
    }
  
    get switches(): Buffer {
      return this.buf.slice(0x4, 0x8);
    }
  
    get room_clear(): Buffer {
      return this.buf.slice(0x8, 0xC);
    }
  
    get collectible(): Buffer {
      return this.buf.slice(0xC, 0x10);
    }
  
    get unused(): Buffer {
      return this.buf.slice(0x10, 0x14);
    }
  
    get visited_rooms(): Buffer {
      return this.buf.slice(0x14, 0x18);
    }
  
    get visited_floors(): Buffer {
      return this.buf.slice(0x18, 0x1C);
    }
  }