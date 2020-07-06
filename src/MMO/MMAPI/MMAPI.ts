import { IActor } from './IActor';
import { IDungeonItemManager } from './IDungeonItemManager';
import { MMForms as MMForm } from './MMForms';

export const enum LinkState {
  UNKNOWN,
  STANDING,
  SWIMMING,
  OCARINA,
  BUSY,
  LOADING_ZONE,
  ENTERING_GROTTO,
  FIRST_PERSON,
  JUMPING,
  CLIMBING_OUT_OF_WATER,
  HANGING_FROM_LEDGE,
  CHARGING_SPIN_ATTACK,
  HOLDING_ACTOR,
  GETTING_ITEM,
  SHOOTING_BOW_OR_HOOKSHOT,
  RIDING_EPONA,
  DYING,
  TAKING_DAMAGE,
  FALLING,
  VOIDING_OUT,
  TALKING,
  HOVERING,
  Z_TARGETING,
}

export const enum LinkState2 {
  UNKNOWN,
  IDLE,
  CRAWLSPACE,
  MOVING_FORWARD,
}

export const enum Scene {
    NONE = 0xff,
    SOUTHERN_SWAMP = 0x00,
    UNKNOWN_0X01 = 0x01,
    UNKNOWN_0X02 = 0x02,
    UNKNOWN_0X03 = 0x03,
    UNKNOWN_0X04 = 0x04,
    UNKNOWN_0X05 = 0x05,
    UNKNOWN_0X06 = 0x06,
    GROTTOS = 0x07,
    LENS_OF_TRUTH_CAVERN = 0x07,
    TITLE_SCREEN = 0x08,
    VARIOUS_CUTSCENES = 0x08,
    UNKNOWN_0X09 = 0x09,
    MAGIC_HAGS_POTION_SHOP = 0x0a,
    MAJORAS_MASK_BOSS_ROOM = 0x0b,
    BENEATH_THE_GRAVEYARD = 0x0c,
    CURIOSITY_SHOP = 0x0d,
    UNKNOWN_0X0E = 0x0e,
    UNKNOWN_0X0F = 0x0f,
    MAMAS_HOUSE = 0x10,
    HONEY_AND_DARLINGS_SHOP = 0x11,
    MAYORS_RESIDENCE = 0x12,
    IKANA_CANYON = 0x13,
    PIRATES_FORTRESS = 0x14,
    MILK_BAR = 0x15,
    STONE_TOWER_TEMPLE_NORMAL = 0x16,
    TREASURE_CHEST_SHOP = 0x17,
    STONE_TOWER_TEMPLE_INVERTED = 0x18,
    ON_TOP_OF_CLOCK_TOWER = 0x19,
    CAVE_BEFORE_CLOCK_TOWER = 0x1a,
    WOODFALL_TEMPLE = 0x1b,
    PATH_TO_MOUNTAIN_VILLAGE = 0x1c,
    ANCIENT_CASTLE_OF_IKANA = 0x1d,
    CLOCK_TOWN_GROTTO_MINIGAME = 0x1e,
    WOODFALL_TEMPLE_BOSS_ROOM = 0x1f,
    CLOCK_TOWN_SHOOTING_GALLERY = 0x20,
    SNOWHEAD_TEMPLE = 0x21,
    MILK_ROAD = 0x22,
    PIRATES_FORTRESS_INDOOR = 0x23,
    SWAMP_SHOOTING_GALLERY = 0x24,
    PINNACLE_ROCK = 0x25,
    GREAT_FAIRY_FOUNTAIN = 0x26,
    SPIDER_SWAMP_HOUSE = 0x27,
    OCEAN_SIDE_SPIDER_HOUSE = 0x28,
    ASTRAL_OBSERVATORY = 0x29,
    ODOLWAS_TRIAL_MOON = 0x2a,
    OUTSIDE_DEKU_PALACE = 0x2b,
    MOUNTAIN_SMITHY = 0x2c,
    TERMINA_FIELDS = 0x2d,
    POST_OFFICE = 0x2e,
    MARINE_RESEARCH_LAB = 0x2f,
    DAMPES_HOUSE = 0x30,
    UNKNOWN_0X31 = 0x31,
    GORON_SHRINE = 0x32,
    ZORAS_DOMAIN = 0x33,
    TRADING_POST = 0x34,
    ROMANI_RANCH = 0x35,
    STONE_TOWER_TEMPLE_BOSS_ROOM = 0x36,
    GREAT_BAY_COAST_WEST = 0x37,
    GREAT_BAY_COAST_EAST = 0x38,
    LOTTERY_SHOP = 0x39,
    UNKNOWN_0X3A = 0x3a,
    PIRATES_FORTRESS_ENTRANCE = 0x3b,
    FISHERMANS_HUT = 0x3c,
    GORON_SHOP = 0x3d,
    INSIDE_THE_DEKU_PALACE = 0x3e,
    GOHTS_TRIAL_MOON = 0x3f,
    PATH_TO_SOUTHERN_SWAMPS = 0x40,
    ROMANI_RANCH_DOG_TRACK = 0x41,
    ROMANI_RANCH_CUCCO_AREA = 0x42,
    IKANI_CANYONS_GRAVEYARD = 0x43,
    SNOWHEAD_TEMPLE_BOSS_ROOM = 0x44,
    SOUTHERN_SWAMPS = 0x45,
    WOODFALL = 0x46,
    GYORGS_TRIAL_MOON = 0x47,
    GORON_VILLAGE_SPRING = 0x48,
    GREAT_BAY_TEMPLE = 0x49,
    BEAVER_RACE_MINIGAME = 0x4a,
    BENEATH_THE_WELL = 0x48,
    ZORAS_DOMAIN_ROOMS = 0x4c,
    GORON_VILLAGE_WINTER = 0x4d,
    DARMANIS_GRAVE = 0x4e,
    SAKONS_HIDEOUT = 0x4f,
    MOUNTAIN_VILLAGE_WINTER = 0x50,
    INSIDE_A_POT = 0x51, //Ghost sounds (Beta)
    DEKU_SHRINE = 0x52,
    PATH_TO_IKANA_CANYON = 0x53,
    SWORDSMANS_SCHOOL = 0x54,
    MUSIC_BOX_HOUSE = 0x55,
    ANCIENT_CASTLE_OF_IKANA_THRONE_ROOM = 0x56,
    SOUTHERN_SWAMMP_HOUSE = 0x57,
    STONE_TOWER_NORMAL = 0x58,
    STONE_TOWER_INVERTED_CUTSCENE = 0x59,
    MOUNTAIN_VILLAGE_SPRING = 0x5a,
    PATH_TO_GORON_VILLAGE_WINTER = 0x5b,
    SNOWHEAD = 0x5c,
    UNKNOWN_0X5D = 0x5d,
    PATH_TO_GORON_VILLAGE_SPRING = 0x5e,
    GREAT_BAY_TEMPLE_BOSS_ROOM = 0x5f,
    SECRET_SHRINE = 0x60,
    STOCK_POT_IN = 0x61,
    GREAT_BAY_PIRATE_CUTSCENE = 0x62,
    CLOCK_TOWER_SEWER = 0x63,
    WOODS_OF_MYSTERY = 0x64,
    STARTING_AREA = 0x65,
    TWINMOLDS_TRIAL_MOON = 0x66,
    MOON = 0x67,
    BOMB_SHOP = 0x68,
    GIANTS_ROOM_CUTSCENE = 0x69,
    GORMANS_TRACK = 0x6a,
    GORON_RACETRACK = 0x68,
    CLOCK_TOWN_EAST = 0x6c,
    CLOCK_TOWN_WEST = 0x6d,
    CLOCK_TOWN_NORTH = 0x6e,
    CLOCK_TOWN_SOUTH = 0x6f,
    LAUNDRY_POOL = 0x70,
}

export interface ISceneInfo {}

export const enum Sword {
  NONE,
  KOKIRI,
  RAZOR,
  GILDED,
}

export const enum Shield {
  NONE,
  HERO,
  MIRROR
}

export const enum Mask {
  NONE,
  KEATON,
  SKULL,
  SPOOKY,
  BUNNY,
}

export const enum Magic {
  NONE,
  NORMAL,
  EXTENDED,
}

export const enum MagicQuantities {
  NONE = 0,
  NORMAL = 0x30,
  EXTENDED = 0x60,
}

export const enum AmmoUpgrade {
    NONE,
    BASE,
    UPGRADED,
    MAX,
  }

export interface IInventoryCounts {
    dekuSticksCount: number;
    dekuNutsCount: number;
    bombsCount: number;
    bombchuCount: number;
    magicBeansCount: number;
    arrows: number;
}

export enum InventoryItem {
    NONE = 0xff,
    OCARINA_OF_TIME = 0x00,
    HEROES_BOW = 0x01,
    FIRE_ARROW = 0x02,
    ICE_ARROW = 0x03,
    LIGHT_ARROW = 0x04,
    OCARINA_FAIRY = 0x05, // Japanese
    BOMB = 0x06,
    BOMBCHU = 0x07,
    DEKU_STICK = 0x08,
    DEKU_NUT = 0x09,
    MAGIC_BEAN = 0x0a,
    FAIRY_SLINGSHOT = 0x0b, // Japanese
    POWDER_KEG = 0x0c,
    PICTOGRAPH_BOX = 0x0d,
    LENS_OF_TRUTH = 0x0e,
    HOOKSHOT = 0x0f,
    GREAT_FAIRYS_SWORD = 0x10,
    HOOKSHOT_JP = 0x11, // Japanese
    BOTTLE_EMPTY = 0x12,
    BOTTLE_POTION_RED = 0x13,
    BOTTLE_POTION_GREEN = 0x14,
    BOTTLE_POTION_BLUE = 0x15,
    BOTTLE_FAIRY = 0x16,
    BOTTLE_DEKU_PRINCESS = 0x17,
    BOTTLE_MILK_FULL = 0x18,
    BOTTLE_MILK_HALF = 0x19,
    BOTTLE_FISH = 0x1a,
    BOTTLE_BUGS = 0x1b,
    BOTTLE_BLUE_FIRE = 0x1c,
    BOTTLE_POE_SMALL = 0x1d,
    BOTTLE_POE_BIG = 0x1e,
    BOTTLE_SPRING_WATER_COLD = 0x1f,
    BOTTLE_SPRING_WATER_HOT = 0x20,
    BOTTLE_ZORA_EGG = 0x21,
    BOTTLE_GOLD_DUST = 0x22,
    BOTTLE_MAGICAL_MUSHROOM = 0x23,
    BOTTLE_SEA_HORSE = 0x24,
    BOTTLE_CHATEAU_ROMANI = 0x25,
    BOTTLE_EEL = 0x26, // Japanese
    BOTTLE_GRANNYS_DRINK = 0x27, // Japanese
    QSLOT1_MOONS_TEAR = 0x28,
    QSLOT1_TITLE_DEED_LAND = 0x29,
    QSLOT1_TITLE_DEED_SWAMP = 0x2a,
    QSLOT1_TITLE_DEED_MOUNTAIN = 0x2b,
    QSLOT1_TITLE_DEED_OCEAN = 0x2c,
    QSLOT2_ROOM_KEY = 0x2d,
    QSLOT2_SPECIAL_DELIVERY_TO_MAMA = 0x2e,
    QSLOT3_LETTER_TO_KAFEI = 0x2f,
    QSLOT3_PENDANT_OF_MEMORIES = 0x30,
    LUNAR_ROCK = 0x31, // Japanese Map
    MASK_DEKU = 0x32,
    MASK_GORON = 0x33,
    MASK_ZORA = 0x34,
    MASK_FIERCE_DEITY = 0x35,
    MASK_OF_TRUTH = 0x36,
    MASK_KAFEI = 0x37,
    MASK_ALL_NIGHT = 0x38,
    MASK_BUNNY_HOOD = 0x39,
    MASK_KEATON = 0x3a,
    MASK_GARO = 0x3b,
    MASK_ROMANI = 0x3c,
    MASK_CIRCUS_LEADER = 0x3d,
    MASK_POSTMAN = 0x3e,
    MASK_COUPLES = 0x3f,
    MASK_GREAT_FAIRY = 0x40,
    MASK_GIBDO = 0x41,
    MASK_DON_GERO = 0x42,
    MASK_KAMERO = 0x43,
    MASK_CAPTAIN = 0x44,
    MASK_STONE = 0x45,
    MASK_BREMEN = 0x46,
    MASK_BLAST = 0x47,
    MASK_OF_SCENTS = 0x48,
    MASK_GIANT = 0x49,
    HEROES_BOW_FIRE_ARROW = 0x4a, //Japanese
    HEROES_BOW_ICE_ARROW = 0x4b, //Japanese
    HEROES_BOW_LIGHT_ARROW = 0x4c, //Japanese
    SWORD_KOKIRI = 0x4d,
    SWORD_RAZOR = 0x4e,
    SWORD_GILDED = 0x4f,
    SWORD_DOUBLE_HELIX = 0x50,
    SHIELD_HERO = 0x51,
    SHIELD_MIRROR = 0x52,
    QUIVER_30 = 0x53,
    QUIVER_40 = 0x54,
    QUIVER_50 = 0x55,
    BOMB_BAG_20 = 0x56,
    BOMB_BAG_30 = 0x57,
    BOMB_BAG_40 = 0x58,
    WALLET_CHILD = 0x59, // Japanese 99
    WALLET_ADULT = 0x5a, // Japanese 200
    WALLET_GIANT = 0x5b, // Japanese 500
    FISHING_POLE = 0x5c, // Japanese
    REMAINS_ODOLWA = 0x5d,
    REMAINS_GOHT = 0x5e,
    REMAINS_GYORG = 0x5f,
    REMAINS_TWINMOLD = 0x60,
    SONG_SONATA_OF_AWAKENING = 0x61,
    SONG_GORON_LULLABY = 0x62,
    SONG_NEW_WAVE_BOSSA_NOVA = 0x63,
    SONG_ELEGY_OF_EMPTINESS = 0x64,
    SONG_OATH_TO_ORDER = 0x65,
    UNKNOWN_0X66 = 0x66, // Japanese
    SONG_OF_TIME = 0x67,
    SONG_OF_HEALING = 0x68,
    SONG_EPONA = 0x69,
    SONG_OF_SOARING = 0x6a,
    SONG_OF_STORMS = 0x6b,
    UNKNOWN_0X6C = 0x6c, // Japanese
    BOMBER_NOTEBOOK = 0x6d,
    GOLDEN_SKULLTULA = 0x6e, // Japanese
    PIECE_OF_HEART = 0x6f,
    PIECE_OF_HEART_JP = 0x70, // Japanese
    SONG_SUN = 0x71, // Japanese Piece of Heart
    SONG_OF_TIME_JP = 0x72, // Japanese Heart Container
    LULLABY_INTRO = 0x73, // Heart Container
    KEY_BIG = 0x74,
    COMPASS = 0x75,
    DUNGEON_MAP = 0x76,
    STRAY_FAIRIES = 0x77,
    KSMALL = 0x78, // Garbage
    MAGIC_JAR = 0x79, // Garbage
    BIG_MAGIC_JAR = 0x7a, // Garbage
    HEART = 0x83, // Garbage
    RUPEE_GREEN = 0x84, // Garbage
    RUPEE_BLUE = 0x85, // Garbage
    RUPEE_SILVER_1 = 0x86, // Garbage
    RUPEE_RED = 0x87, // Garbage
    RUPEE_PINK = 0x88, // Garbage
    RUPEE_SILVER_2 = 0x89, // Garbage
    RUPEE_ORANGE = 0x8a, // Garbage
    ANJU = 0xb8, // Garbage
    KAFEI = 0xb9, // Garbage
    MAN_FROM_CURIOSITY_SHOP = 0xba, // Garbage
    OLD_LADY_FROM_BOMB_SHOP = 0xbb, // Garbage
    ROMANI = 0xbc, // Garbage
    CREMIA = 0xbd, // Garbage
    MAYOR_DOTOUR = 0xbe, // Garbage
    MADAME_AROMA = 0xbf, // Garbage
    TOTO = 0xc0, // Garbage
    GORMAN = 0xc1, // Garbage
    POSTMAN = 0xc2, // Garbage
    ROSA_SISTERS = 0xc3, // Garbage
    UNKNOWN_0XC4 = 0xc4, // Garbage
    ANJUS_GRANDMOTHER = 0xc5, // Garbage
    KAMARO = 0xc6, // Garbage
    GROG = 0xc7, // Garbage
    GORMAN_BROTHERS = 0xc8, // Garbage
    SHIRO = 0xc9, // Garbage
    EXPRESSION_MARK = 0x79, // Garbage
}

export const enum Ocarina {
  NONE,
  OCARINA_OF_TIME
}

export const enum Wallet {
  CHILD,
  ADULT,
  GIANT
}

export interface ISwords {
  kokiriSword: boolean;
  razorSword: boolean;
  gilded: boolean;
}

export interface IShields {
  heroesShield: boolean;
  mirrorShield: boolean;
}

export interface IInventoryCounts {
  dekuSticksCount: number;
  dekuNutsCount: number;
  bombsCount: number;
  bombchuCount: number;
  magicBeansCount: number;
  arrows: number;
}

export interface IInventoryFields {
    dekuSticksCapacity: AmmoUpgrade;
    dekuNutsCapacity: AmmoUpgrade;
    bombBag: AmmoUpgrade;
    quiver: AmmoUpgrade;
    
    FIELD_OCARINA: Ocarina;
    FIELD_HEROES_BOW: boolean;
    FIELD_FIRE_ARROW: boolean;
    FIELD_ICE_ARROW: boolean;
    FIELD_LIGHT_ARROW: boolean;
    FIELD_QUEST_ITEM_1: InventoryItem;
    FIELD_BOMB: boolean;
    FIELD_BOMBCHU: boolean;
    FIELD_DEKU_STICKS: boolean;
    FIELD_DEKU_NUT: boolean;
    FIELD_MAGIC_BEAN: boolean;
    FIELD_QUEST_ITEM_2: InventoryItem;
    FIELD_POWDER_KEG: boolean;
    FIELD_PICTOGRAPH_BOX: boolean;
    FIELD_LENS_OF_TRUTH: boolean;
    FIELD_HOOKSHOT: boolean;
    FIELD_GREAT_FAIRYS_SWORD: boolean;
    FIELD_QUEST_ITEM_3: InventoryItem;
    FIELD_BOTTLE1: InventoryItem;
    FIELD_BOTTLE2: InventoryItem;
    FIELD_BOTTLE3: InventoryItem;
    FIELD_BOTTLE4: InventoryItem;
    FIELD_BOTTLE5: InventoryItem;
    FIELD_BOTTLE6: InventoryItem;
}

export interface IInventory extends IInventoryFields, IInventoryCounts {
  wallet: Wallet;
  hasBottle(): boolean;
  getBottleCount(): number;
  getBottledItems(): InventoryItem[];
  isChildTradeFinished(): boolean;
  isAdultTradeFinished(): boolean;
  getItemInSlot(slotId: number): InventoryItem;
  getSlotForItem(item: InventoryItem): number;
  getSlotsForItem(item: InventoryItem): number[];
  hasItem(item: InventoryItem): boolean;
  hasAmmo(item: InventoryItem): boolean;
  getAmmoForItem(item: InventoryItem): number;
  getAmmoForSlot(slotId: number): number;
  setAmmoInSlot(slot: number, amount: number): void;
  setItemInSlot(item: InventoryItem, slot: number): void;
  giveItem(item: InventoryItem, desiredSlot: number): void;
  removeItem(item: InventoryItem): void;
  getEmptySlots(): number[];
  getMaxRupeeCount(): number;
}

export interface IQuestStatus {
  odolwaRemains: boolean;
  gohtRemains: boolean;
  gyorgRemains: boolean;
  twinmoldRemains: boolean;

  songOfTime: boolean;
  songOfHealing: boolean;
  eponaSong: boolean;
  songOfSoaring: boolean;
  songOfStorms: boolean;

  sonataOfAwakening: boolean;
  goronLullaby: boolean;
  newWaveBossaNova: boolean;
  elegyOfEmptiness: boolean;
  oathToOrder: boolean;

  bombersNotebook: boolean;

  heartPieces: number;
}

export interface ISaveContext {
  swords: ISwords;
  shields: IShields;
  inventory: IInventory;
  questStatus: IQuestStatus;
  entrance_index: number;
  cutscene_number: number;
  world_time: number;
  world_night_flag: boolean;
  zeldaz_string: string;
  death_counter: number;
  player_name: string;
  dd_flag: boolean;
  heart_containers: number;
  health: number;
  magic_meter_size: Magic;
  magic_current: number;
  rupee_count: number;
  navi_timer: number;
  checksum: number;
  form: MMForm;
  magic_beans_purchased: number;
  permSceneData: Buffer;
  eventFlags: Buffer;
  itemFlags: Buffer;
  infTable: Buffer;
  skulltulaFlags: Buffer;
  keyManager: IKeyManager;
  dungeonItemManager: IDungeonItemManager;
  double_defense: number;
}

export interface ILink extends IActor {
  state: LinkState;
  state2: LinkState2;
  rawStateValue: number;
  shield: Shield;
  mask: Mask;
  anim_data: Buffer;
  current_sound_id: number;
  sword: Sword;
  get_anim_id(): number;
  get_anim_frame(): number;
}

export interface IGlobalContext {
  scene: number;
  room: number;
  framecount: number;
  scene_framecount: number;
  continue_state: boolean;
  liveSceneData_chests: Buffer;
  liveSceneData_clear: Buffer;
  liveSceneData_switch: Buffer;
  liveSceneData_temp: Buffer;
  liveSceneData_collectable: Buffer;
  getSaveDataForCurrentScene(): Buffer;
  writeSaveDataForCurrentScene(buf: Buffer): void;
}

// Note: ON_ACTOR_SPAWN/ON_ACTOR_DESPAWN won't detect anything created by ICommandBuffer. This is intentional behavior.

export enum MMEvents {
  ON_SAVE_LOADED = 'onSaveLoaded',
  ON_SCENE_CHANGE = 'onSceneChange',
  ON_LOADING_ZONE = 'onLoadingZone',
  ON_ACTOR_SPAWN = 'onActorSpawn',
  ON_ACTOR_DESPAWN = 'onActorDespawn',
  ON_ROOM_CHANGE = 'onRoomChange',
  ON_ROOM_CHANGE_PRE = 'onPreRoomChange',
  ON_AGE_CHANGE = 'onAgeChange',
}

export interface IActorManager {
  // Returns IActor if the actor exists or undefined if the pointer doesn't lead to an actor.
  createIActorFromPointer(pointer: number): IActor;
}

export const NO_KEYS = 0xff;

export const enum VANILLA_KEY_INDEXES { //TODO: Figure this shit out
  FOREST_TEMPLE = 3,
  FIRE_TEMPLE = 4,
  WATER_TEMPLE = 5,
  SPIRIT_TEMPLE = 6,
  SHADOW_TEMPLE = 7,
  BOTTOM_OF_THE_WELL = 8,
  GERUDO_TRAINING_GROUND = 11,
  GERUDO_FORTRESS = 12,
  GANONS_CASTLE = 13,
  TREASURE_CHEST_SHOP = 16,
}

export const enum VANILLA_DUNGEON_ITEM_INDEXES { //TODO: Figure this shit out
  DEKU_TREE,
  DODONGOS_CAVERN,
  JABJ_JABUS_BELLY,
  FOREST_TEMPLE,
  FIRE_TEMPLE,
  WATER_TEMPLE,
  SPIRIT_TEMPLE,
  SHADOW_TEMPLE,
  BOTTOM_OF_THE_WELL,
  ICE_CAVERN,
  GANONS_CASTLE,
}

export interface IKeyManager {
  getKeyCountForIndex(index: number): number;
  setKeyCountByIndex(index: number, count: number): void;
  getRawKeyBuffer(): Buffer;
}

export const enum InventorySlots {
    NONE = 0xff,
    OCARINA_OF_TIME = 0x00,
    HEROES_BOW = 0x01,
    FIRE_ARROWS = 0x02,
    ICE_ARROWS = 0x03,
    LIGHT_ARROWS = 0x04,
    EVENT_ITEM_1 = 0x05,
    BOMBS = 0x06,
    BOMBCHUS = 0x07,
    DEKU_STICKS = 0x08,
    DEKU_NUTS = 0x09,
    MAGIC_BEANS = 0x0a,
    EVENT_ITEM_2 = 0x0b,
    POWDER_KEG = 0x0c,
    PICTOGRAPH_BOX = 0x0d,
    LENS_OF_TRUTH = 0x0e,
    HOOKSHOT = 0x0f,
    GREAT_FAIRYS_SWORD = 0x10,
    EVENT_ITEM_3 = 0x11,
    BOTTLE1 = 0x12,
    BOTTLE2 = 0x13,
    BOTTLE3 = 0x14,
    BOTTLE4 = 0x15,
    BOTTLE5 = 0x16,
    BOTTLE6 = 0x17
}

class UpgradeCount {
  item: InventoryItem;
  level: AmmoUpgrade;
  count: number;

  constructor(item: InventoryItem, level: AmmoUpgrade, count: number) {
      this.item = item;
      this.level = level;
      this.count = count;
  }

  isMatch(inst: UpgradeCount) {
      return inst.item === this.item && inst.level === this.level;
  }
}

const UpgradeCountLookupTable: UpgradeCount[] = [
    // Bombs
    new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.NONE, 0),
    new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.BASE, 20),
    new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.UPGRADED, 30),
    new UpgradeCount(InventoryItem.BOMB, AmmoUpgrade.MAX, 40),
    // Sticks
    new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.NONE, 0),
    new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.BASE, 10),
    new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.UPGRADED, 20),
    new UpgradeCount(InventoryItem.DEKU_STICK, AmmoUpgrade.MAX, 30),
    // Nuts
    new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.NONE, 0),
    new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.BASE, 20),
    new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.UPGRADED, 30),
    new UpgradeCount(InventoryItem.DEKU_NUT, AmmoUpgrade.MAX, 40),
    // Arrows
    new UpgradeCount(InventoryItem.HEROES_BOW, AmmoUpgrade.NONE, 0),
    new UpgradeCount(InventoryItem.HEROES_BOW, AmmoUpgrade.BASE, 30),
    new UpgradeCount(InventoryItem.HEROES_BOW, AmmoUpgrade.UPGRADED, 40),
    new UpgradeCount(InventoryItem.HEROES_BOW, AmmoUpgrade.MAX, 50),
    // Bombchu
    new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.NONE, 0),
    new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.BASE, 5),
    new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.UPGRADED, 10),
    new UpgradeCount(InventoryItem.BOMBCHU, AmmoUpgrade.MAX, 20),
];

export function UpgradeCountLookup(
    item: InventoryItem,
    level: AmmoUpgrade
): number {
    let inst: UpgradeCount = new UpgradeCount(item, level, -1);
    for (let i = 0; i < UpgradeCountLookupTable.length; i++) {
        if (inst.isMatch(UpgradeCountLookupTable[i])) {
            return UpgradeCountLookupTable[i].count;
        }
    }
    return 0;
}

export interface IOvlPayloadResult{
  file: string;
  slot: number;
  addr: number;
  params: number;
  buf: Buffer;
  relocate: number;
  
  spawn(obj: IOvlPayloadResult, callback?: (success: boolean, result: number)=>{}): void;
}