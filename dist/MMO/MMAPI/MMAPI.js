"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeCountLookup = exports.NO_KEYS = exports.MMEvents = exports.InventoryItem = void 0;
var InventoryItem;
(function (InventoryItem) {
    InventoryItem[InventoryItem["NONE"] = 255] = "NONE";
    InventoryItem[InventoryItem["OCARINA_OF_TIME"] = 0] = "OCARINA_OF_TIME";
    InventoryItem[InventoryItem["HEROES_BOW"] = 1] = "HEROES_BOW";
    InventoryItem[InventoryItem["FIRE_ARROW"] = 2] = "FIRE_ARROW";
    InventoryItem[InventoryItem["ICE_ARROW"] = 3] = "ICE_ARROW";
    InventoryItem[InventoryItem["LIGHT_ARROW"] = 4] = "LIGHT_ARROW";
    InventoryItem[InventoryItem["OCARINA_FAIRY"] = 5] = "OCARINA_FAIRY";
    InventoryItem[InventoryItem["BOMB"] = 6] = "BOMB";
    InventoryItem[InventoryItem["BOMBCHU"] = 7] = "BOMBCHU";
    InventoryItem[InventoryItem["DEKU_STICK"] = 8] = "DEKU_STICK";
    InventoryItem[InventoryItem["DEKU_NUT"] = 9] = "DEKU_NUT";
    InventoryItem[InventoryItem["MAGIC_BEAN"] = 10] = "MAGIC_BEAN";
    InventoryItem[InventoryItem["FAIRY_SLINGSHOT"] = 11] = "FAIRY_SLINGSHOT";
    InventoryItem[InventoryItem["POWDER_KEG"] = 12] = "POWDER_KEG";
    InventoryItem[InventoryItem["PICTOGRAPH_BOX"] = 13] = "PICTOGRAPH_BOX";
    InventoryItem[InventoryItem["LENS_OF_TRUTH"] = 14] = "LENS_OF_TRUTH";
    InventoryItem[InventoryItem["HOOKSHOT"] = 15] = "HOOKSHOT";
    InventoryItem[InventoryItem["GREAT_FAIRYS_SWORD"] = 16] = "GREAT_FAIRYS_SWORD";
    InventoryItem[InventoryItem["HOOKSHOT_JP"] = 17] = "HOOKSHOT_JP";
    InventoryItem[InventoryItem["BOTTLE_EMPTY"] = 18] = "BOTTLE_EMPTY";
    InventoryItem[InventoryItem["BOTTLE_POTION_RED"] = 19] = "BOTTLE_POTION_RED";
    InventoryItem[InventoryItem["BOTTLE_POTION_GREEN"] = 20] = "BOTTLE_POTION_GREEN";
    InventoryItem[InventoryItem["BOTTLE_POTION_BLUE"] = 21] = "BOTTLE_POTION_BLUE";
    InventoryItem[InventoryItem["BOTTLE_FAIRY"] = 22] = "BOTTLE_FAIRY";
    InventoryItem[InventoryItem["BOTTLE_DEKU_PRINCESS"] = 23] = "BOTTLE_DEKU_PRINCESS";
    InventoryItem[InventoryItem["BOTTLE_MILK_FULL"] = 24] = "BOTTLE_MILK_FULL";
    InventoryItem[InventoryItem["BOTTLE_MILK_HALF"] = 25] = "BOTTLE_MILK_HALF";
    InventoryItem[InventoryItem["BOTTLE_FISH"] = 26] = "BOTTLE_FISH";
    InventoryItem[InventoryItem["BOTTLE_BUGS"] = 27] = "BOTTLE_BUGS";
    InventoryItem[InventoryItem["BOTTLE_BLUE_FIRE"] = 28] = "BOTTLE_BLUE_FIRE";
    InventoryItem[InventoryItem["BOTTLE_POE_SMALL"] = 29] = "BOTTLE_POE_SMALL";
    InventoryItem[InventoryItem["BOTTLE_POE_BIG"] = 30] = "BOTTLE_POE_BIG";
    InventoryItem[InventoryItem["BOTTLE_SPRING_WATER_COLD"] = 31] = "BOTTLE_SPRING_WATER_COLD";
    InventoryItem[InventoryItem["BOTTLE_SPRING_WATER_HOT"] = 32] = "BOTTLE_SPRING_WATER_HOT";
    InventoryItem[InventoryItem["BOTTLE_ZORA_EGG"] = 33] = "BOTTLE_ZORA_EGG";
    InventoryItem[InventoryItem["BOTTLE_GOLD_DUST"] = 34] = "BOTTLE_GOLD_DUST";
    InventoryItem[InventoryItem["BOTTLE_MAGICAL_MUSHROOM"] = 35] = "BOTTLE_MAGICAL_MUSHROOM";
    InventoryItem[InventoryItem["BOTTLE_SEA_HORSE"] = 36] = "BOTTLE_SEA_HORSE";
    InventoryItem[InventoryItem["BOTTLE_CHATEAU_ROMANI"] = 37] = "BOTTLE_CHATEAU_ROMANI";
    InventoryItem[InventoryItem["BOTTLE_EEL"] = 38] = "BOTTLE_EEL";
    InventoryItem[InventoryItem["BOTTLE_GRANNYS_DRINK"] = 39] = "BOTTLE_GRANNYS_DRINK";
    InventoryItem[InventoryItem["QSLOT1_MOONS_TEAR"] = 40] = "QSLOT1_MOONS_TEAR";
    InventoryItem[InventoryItem["QSLOT1_TITLE_DEED_LAND"] = 41] = "QSLOT1_TITLE_DEED_LAND";
    InventoryItem[InventoryItem["QSLOT1_TITLE_DEED_SWAMP"] = 42] = "QSLOT1_TITLE_DEED_SWAMP";
    InventoryItem[InventoryItem["QSLOT1_TITLE_DEED_MOUNTAIN"] = 43] = "QSLOT1_TITLE_DEED_MOUNTAIN";
    InventoryItem[InventoryItem["QSLOT1_TITLE_DEED_OCEAN"] = 44] = "QSLOT1_TITLE_DEED_OCEAN";
    InventoryItem[InventoryItem["QSLOT2_ROOM_KEY"] = 45] = "QSLOT2_ROOM_KEY";
    InventoryItem[InventoryItem["QSLOT2_SPECIAL_DELIVERY_TO_MAMA"] = 46] = "QSLOT2_SPECIAL_DELIVERY_TO_MAMA";
    InventoryItem[InventoryItem["QSLOT3_LETTER_TO_KAFEI"] = 47] = "QSLOT3_LETTER_TO_KAFEI";
    InventoryItem[InventoryItem["QSLOT3_PENDANT_OF_MEMORIES"] = 48] = "QSLOT3_PENDANT_OF_MEMORIES";
    InventoryItem[InventoryItem["LUNAR_ROCK"] = 49] = "LUNAR_ROCK";
    InventoryItem[InventoryItem["MASK_DEKU"] = 50] = "MASK_DEKU";
    InventoryItem[InventoryItem["MASK_GORON"] = 51] = "MASK_GORON";
    InventoryItem[InventoryItem["MASK_ZORA"] = 52] = "MASK_ZORA";
    InventoryItem[InventoryItem["MASK_FIERCE_DEITY"] = 53] = "MASK_FIERCE_DEITY";
    InventoryItem[InventoryItem["MASK_OF_TRUTH"] = 54] = "MASK_OF_TRUTH";
    InventoryItem[InventoryItem["MASK_KAFEI"] = 55] = "MASK_KAFEI";
    InventoryItem[InventoryItem["MASK_ALL_NIGHT"] = 56] = "MASK_ALL_NIGHT";
    InventoryItem[InventoryItem["MASK_BUNNY_HOOD"] = 57] = "MASK_BUNNY_HOOD";
    InventoryItem[InventoryItem["MASK_KEATON"] = 58] = "MASK_KEATON";
    InventoryItem[InventoryItem["MASK_GARO"] = 59] = "MASK_GARO";
    InventoryItem[InventoryItem["MASK_ROMANI"] = 60] = "MASK_ROMANI";
    InventoryItem[InventoryItem["MASK_CIRCUS_LEADER"] = 61] = "MASK_CIRCUS_LEADER";
    InventoryItem[InventoryItem["MASK_POSTMAN"] = 62] = "MASK_POSTMAN";
    InventoryItem[InventoryItem["MASK_COUPLES"] = 63] = "MASK_COUPLES";
    InventoryItem[InventoryItem["MASK_GREAT_FAIRY"] = 64] = "MASK_GREAT_FAIRY";
    InventoryItem[InventoryItem["MASK_GIBDO"] = 65] = "MASK_GIBDO";
    InventoryItem[InventoryItem["MASK_DON_GERO"] = 66] = "MASK_DON_GERO";
    InventoryItem[InventoryItem["MASK_KAMERO"] = 67] = "MASK_KAMERO";
    InventoryItem[InventoryItem["MASK_CAPTAIN"] = 68] = "MASK_CAPTAIN";
    InventoryItem[InventoryItem["MASK_STONE"] = 69] = "MASK_STONE";
    InventoryItem[InventoryItem["MASK_BREMEN"] = 70] = "MASK_BREMEN";
    InventoryItem[InventoryItem["MASK_BLAST"] = 71] = "MASK_BLAST";
    InventoryItem[InventoryItem["MASK_OF_SCENTS"] = 72] = "MASK_OF_SCENTS";
    InventoryItem[InventoryItem["MASK_GIANT"] = 73] = "MASK_GIANT";
    InventoryItem[InventoryItem["HEROES_BOW_FIRE_ARROW"] = 74] = "HEROES_BOW_FIRE_ARROW";
    InventoryItem[InventoryItem["HEROES_BOW_ICE_ARROW"] = 75] = "HEROES_BOW_ICE_ARROW";
    InventoryItem[InventoryItem["HEROES_BOW_LIGHT_ARROW"] = 76] = "HEROES_BOW_LIGHT_ARROW";
    InventoryItem[InventoryItem["SWORD_KOKIRI"] = 77] = "SWORD_KOKIRI";
    InventoryItem[InventoryItem["SWORD_RAZOR"] = 78] = "SWORD_RAZOR";
    InventoryItem[InventoryItem["SWORD_GILDED"] = 79] = "SWORD_GILDED";
    InventoryItem[InventoryItem["SWORD_DOUBLE_HELIX"] = 80] = "SWORD_DOUBLE_HELIX";
    InventoryItem[InventoryItem["SHIELD_HERO"] = 81] = "SHIELD_HERO";
    InventoryItem[InventoryItem["SHIELD_MIRROR"] = 82] = "SHIELD_MIRROR";
    InventoryItem[InventoryItem["QUIVER_30"] = 83] = "QUIVER_30";
    InventoryItem[InventoryItem["QUIVER_40"] = 84] = "QUIVER_40";
    InventoryItem[InventoryItem["QUIVER_50"] = 85] = "QUIVER_50";
    InventoryItem[InventoryItem["BOMB_BAG_20"] = 86] = "BOMB_BAG_20";
    InventoryItem[InventoryItem["BOMB_BAG_30"] = 87] = "BOMB_BAG_30";
    InventoryItem[InventoryItem["BOMB_BAG_40"] = 88] = "BOMB_BAG_40";
    InventoryItem[InventoryItem["WALLET_CHILD"] = 89] = "WALLET_CHILD";
    InventoryItem[InventoryItem["WALLET_ADULT"] = 90] = "WALLET_ADULT";
    InventoryItem[InventoryItem["WALLET_GIANT"] = 91] = "WALLET_GIANT";
    InventoryItem[InventoryItem["FISHING_POLE"] = 92] = "FISHING_POLE";
    InventoryItem[InventoryItem["REMAINS_ODOLWA"] = 93] = "REMAINS_ODOLWA";
    InventoryItem[InventoryItem["REMAINS_GOHT"] = 94] = "REMAINS_GOHT";
    InventoryItem[InventoryItem["REMAINS_GYORG"] = 95] = "REMAINS_GYORG";
    InventoryItem[InventoryItem["REMAINS_TWINMOLD"] = 96] = "REMAINS_TWINMOLD";
    InventoryItem[InventoryItem["SONG_SONATA_OF_AWAKENING"] = 97] = "SONG_SONATA_OF_AWAKENING";
    InventoryItem[InventoryItem["SONG_GORON_LULLABY"] = 98] = "SONG_GORON_LULLABY";
    InventoryItem[InventoryItem["SONG_NEW_WAVE_BOSSA_NOVA"] = 99] = "SONG_NEW_WAVE_BOSSA_NOVA";
    InventoryItem[InventoryItem["SONG_ELEGY_OF_EMPTINESS"] = 100] = "SONG_ELEGY_OF_EMPTINESS";
    InventoryItem[InventoryItem["SONG_OATH_TO_ORDER"] = 101] = "SONG_OATH_TO_ORDER";
    InventoryItem[InventoryItem["UNKNOWN_0X66"] = 102] = "UNKNOWN_0X66";
    InventoryItem[InventoryItem["SONG_OF_TIME"] = 103] = "SONG_OF_TIME";
    InventoryItem[InventoryItem["SONG_OF_HEALING"] = 104] = "SONG_OF_HEALING";
    InventoryItem[InventoryItem["SONG_EPONA"] = 105] = "SONG_EPONA";
    InventoryItem[InventoryItem["SONG_OF_SOARING"] = 106] = "SONG_OF_SOARING";
    InventoryItem[InventoryItem["SONG_OF_STORMS"] = 107] = "SONG_OF_STORMS";
    InventoryItem[InventoryItem["UNKNOWN_0X6C"] = 108] = "UNKNOWN_0X6C";
    InventoryItem[InventoryItem["BOMBER_NOTEBOOK"] = 109] = "BOMBER_NOTEBOOK";
    InventoryItem[InventoryItem["GOLDEN_SKULLTULA"] = 110] = "GOLDEN_SKULLTULA";
    InventoryItem[InventoryItem["PIECE_OF_HEART"] = 111] = "PIECE_OF_HEART";
    InventoryItem[InventoryItem["PIECE_OF_HEART_JP"] = 112] = "PIECE_OF_HEART_JP";
    InventoryItem[InventoryItem["SONG_SUN"] = 113] = "SONG_SUN";
    InventoryItem[InventoryItem["SONG_OF_TIME_JP"] = 114] = "SONG_OF_TIME_JP";
    InventoryItem[InventoryItem["LULLABY_INTRO"] = 115] = "LULLABY_INTRO";
    InventoryItem[InventoryItem["KEY_BIG"] = 116] = "KEY_BIG";
    InventoryItem[InventoryItem["COMPASS"] = 117] = "COMPASS";
    InventoryItem[InventoryItem["DUNGEON_MAP"] = 118] = "DUNGEON_MAP";
    InventoryItem[InventoryItem["STRAY_FAIRIES"] = 119] = "STRAY_FAIRIES";
    InventoryItem[InventoryItem["KSMALL"] = 120] = "KSMALL";
    InventoryItem[InventoryItem["MAGIC_JAR"] = 121] = "MAGIC_JAR";
    InventoryItem[InventoryItem["BIG_MAGIC_JAR"] = 122] = "BIG_MAGIC_JAR";
    InventoryItem[InventoryItem["HEART"] = 131] = "HEART";
    InventoryItem[InventoryItem["RUPEE_GREEN"] = 132] = "RUPEE_GREEN";
    InventoryItem[InventoryItem["RUPEE_BLUE"] = 133] = "RUPEE_BLUE";
    InventoryItem[InventoryItem["RUPEE_SILVER_1"] = 134] = "RUPEE_SILVER_1";
    InventoryItem[InventoryItem["RUPEE_RED"] = 135] = "RUPEE_RED";
    InventoryItem[InventoryItem["RUPEE_PINK"] = 136] = "RUPEE_PINK";
    InventoryItem[InventoryItem["RUPEE_SILVER_2"] = 137] = "RUPEE_SILVER_2";
    InventoryItem[InventoryItem["RUPEE_ORANGE"] = 138] = "RUPEE_ORANGE";
    InventoryItem[InventoryItem["ANJU"] = 184] = "ANJU";
    InventoryItem[InventoryItem["KAFEI"] = 185] = "KAFEI";
    InventoryItem[InventoryItem["MAN_FROM_CURIOSITY_SHOP"] = 186] = "MAN_FROM_CURIOSITY_SHOP";
    InventoryItem[InventoryItem["OLD_LADY_FROM_BOMB_SHOP"] = 187] = "OLD_LADY_FROM_BOMB_SHOP";
    InventoryItem[InventoryItem["ROMANI"] = 188] = "ROMANI";
    InventoryItem[InventoryItem["CREMIA"] = 189] = "CREMIA";
    InventoryItem[InventoryItem["MAYOR_DOTOUR"] = 190] = "MAYOR_DOTOUR";
    InventoryItem[InventoryItem["MADAME_AROMA"] = 191] = "MADAME_AROMA";
    InventoryItem[InventoryItem["TOTO"] = 192] = "TOTO";
    InventoryItem[InventoryItem["GORMAN"] = 193] = "GORMAN";
    InventoryItem[InventoryItem["POSTMAN"] = 194] = "POSTMAN";
    InventoryItem[InventoryItem["ROSA_SISTERS"] = 195] = "ROSA_SISTERS";
    InventoryItem[InventoryItem["UNKNOWN_0XC4"] = 196] = "UNKNOWN_0XC4";
    InventoryItem[InventoryItem["ANJUS_GRANDMOTHER"] = 197] = "ANJUS_GRANDMOTHER";
    InventoryItem[InventoryItem["KAMARO"] = 198] = "KAMARO";
    InventoryItem[InventoryItem["GROG"] = 199] = "GROG";
    InventoryItem[InventoryItem["GORMAN_BROTHERS"] = 200] = "GORMAN_BROTHERS";
    InventoryItem[InventoryItem["SHIRO"] = 201] = "SHIRO";
    InventoryItem[InventoryItem["EXPRESSION_MARK"] = 121] = "EXPRESSION_MARK";
})(InventoryItem = exports.InventoryItem || (exports.InventoryItem = {}));
// Note: ON_ACTOR_SPAWN/ON_ACTOR_DESPAWN won't detect anything created by ICommandBuffer. This is intentional behavior.
var MMEvents;
(function (MMEvents) {
    MMEvents["ON_SAVE_LOADED"] = "onSaveLoaded";
    MMEvents["ON_SCENE_CHANGE"] = "onSceneChange";
    MMEvents["ON_LOADING_ZONE"] = "onLoadingZone";
    MMEvents["ON_ACTOR_SPAWN"] = "onActorSpawn";
    MMEvents["ON_ACTOR_DESPAWN"] = "onActorDespawn";
    MMEvents["ON_ROOM_CHANGE"] = "onRoomChange";
    MMEvents["ON_ROOM_CHANGE_PRE"] = "onPreRoomChange";
    MMEvents["ON_AGE_CHANGE"] = "onAgeChange";
})(MMEvents = exports.MMEvents || (exports.MMEvents = {}));
exports.NO_KEYS = 0xff;
class UpgradeCount {
    constructor(item, level, count) {
        this.item = item;
        this.level = level;
        this.count = count;
    }
    isMatch(inst) {
        return inst.item === this.item && inst.level === this.level;
    }
}
const UpgradeCountLookupTable = [
    // Bombs
    new UpgradeCount(InventoryItem.BOMB, 0 /* NONE */, 0),
    new UpgradeCount(InventoryItem.BOMB, 1 /* BASE */, 20),
    new UpgradeCount(InventoryItem.BOMB, 2 /* UPGRADED */, 30),
    new UpgradeCount(InventoryItem.BOMB, 3 /* MAX */, 40),
    // Sticks
    new UpgradeCount(InventoryItem.DEKU_STICK, 0 /* NONE */, 0),
    new UpgradeCount(InventoryItem.DEKU_STICK, 1 /* BASE */, 10),
    new UpgradeCount(InventoryItem.DEKU_STICK, 2 /* UPGRADED */, 20),
    new UpgradeCount(InventoryItem.DEKU_STICK, 3 /* MAX */, 30),
    // Nuts
    new UpgradeCount(InventoryItem.DEKU_NUT, 0 /* NONE */, 0),
    new UpgradeCount(InventoryItem.DEKU_NUT, 1 /* BASE */, 20),
    new UpgradeCount(InventoryItem.DEKU_NUT, 2 /* UPGRADED */, 30),
    new UpgradeCount(InventoryItem.DEKU_NUT, 3 /* MAX */, 40),
    // Arrows
    new UpgradeCount(InventoryItem.HEROES_BOW, 0 /* NONE */, 0),
    new UpgradeCount(InventoryItem.HEROES_BOW, 1 /* BASE */, 30),
    new UpgradeCount(InventoryItem.HEROES_BOW, 2 /* UPGRADED */, 40),
    new UpgradeCount(InventoryItem.HEROES_BOW, 3 /* MAX */, 50),
    // Bombchu
    new UpgradeCount(InventoryItem.BOMBCHU, 0 /* NONE */, 0),
    new UpgradeCount(InventoryItem.BOMBCHU, 1 /* BASE */, 5),
    new UpgradeCount(InventoryItem.BOMBCHU, 2 /* UPGRADED */, 10),
    new UpgradeCount(InventoryItem.BOMBCHU, 3 /* MAX */, 20),
];
function UpgradeCountLookup(item, level) {
    let inst = new UpgradeCount(item, level, -1);
    for (let i = 0; i < UpgradeCountLookupTable.length; i++) {
        if (inst.isMatch(UpgradeCountLookupTable[i])) {
            return UpgradeCountLookupTable[i].count;
        }
    }
    return 0;
}
exports.UpgradeCountLookup = UpgradeCountLookup;
//# sourceMappingURL=MMAPI.js.map