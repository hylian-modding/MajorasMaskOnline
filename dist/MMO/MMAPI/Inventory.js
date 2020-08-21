"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const MMAPI_1 = require("./MMAPI");
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class Inventory extends JSONTemplate_1.JSONTemplate {
    constructor(emu, log) {
        super();
        this.instance = global.ModLoader.save_context;
        this.inventory_addr = this.instance + 0x0074;
        this.inventory_ammo_addr = this.instance + 0x008c;
        this.inventory_upgrades_addr = this.instance + 0x00a0;
        this.jsonFields = [
            'dekuSticksCapacity',
            'dekuNutsCapacity',
            'bombBag',
            'quiver',
            'FIELD_OCARINA',
            'FIELD_HEROES_BOW',
            'FIELD_FIRE_ARROW',
            'FIELD_ICE_ARROW',
            'FIELD_LIGHT_ARROW',
            'FIELD_EVENT_ITEM_1',
            'FIELD_BOMB',
            'FIELD_BOMBCHU',
            'FIELD_DEKU_STICKS',
            'FIELD_DEKU_NUT',
            'FIELD_MAGIC_BEAN',
            'FIELD_EVENT_ITEM_2',
            'FIELD_POWDER_KEG',
            'FIELD_PICTOGRAPH_BOX',
            'FIELD_LENS_OF_TRUTH',
            'FIELD_HOOKSHOT',
            'FIELD_GREAT_FAIRYS_SWORD',
            'FIELD_EVENT_ITEM_3',
            'FIELD_BOTTLE1',
            'FIELD_BOTTLE2',
            'FIELD_BOTTLE3',
            'FIELD_BOTTLE4',
            'FIELD_BOTTLE5',
            'FIELD_BOTTLE6'
        ];
        this.emulator = emu;
        this.log = log;
    }
    get FIELD_OCARINA() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.OCARINA_OF_TIME);
        if (val)
            return 1 /* OCARINA_OF_TIME */;
        return 0 /* NONE */;
    }
    set FIELD_OCARINA(ocarina) {
        let value = ocarina ? MMAPI_1.InventoryItem.OCARINA_OF_TIME : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, 0 /* OCARINA_OF_TIME */);
    }
    get FIELD_HEROES_BOW() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.HEROES_BOW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_HEROES_BOW(bow) {
        let value = bow ? MMAPI_1.InventoryItem.HEROES_BOW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, 1 /* HEROES_BOW */);
    }
    get FIELD_FIRE_ARROW() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_FIRE_ARROW(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_ICE_ARROW() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_ICE_ARROW(bool) {
        let value = bool ? MMAPI_1.InventoryItem.ICE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.ICE_ARROW);
    }
    get FIELD_LIGHT_ARROW() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_LIGHT_ARROW(lightA) {
        let value = lightA ? MMAPI_1.InventoryItem.LIGHT_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.LIGHT_ARROW);
    }
    get FIELD_BOMB() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_BOMB(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_BOMBCHU() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_BOMBCHU(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_DEKU_STICKS() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_DEKU_STICKS(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_DEKU_NUT() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_DEKU_NUT(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_MAGIC_BEAN() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_MAGIC_BEAN(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_POWDER_KEG() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_POWDER_KEG(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_PICTOGRAPH_BOX() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_PICTOGRAPH_BOX(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_LENS_OF_TRUTH() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_LENS_OF_TRUTH(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_HOOKSHOT() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_HOOKSHOT(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    get FIELD_GREAT_FAIRYS_SWORD() {
        let val = this.getItemInSlot(MMAPI_1.InventoryItem.FIRE_ARROW);
        return !(val === MMAPI_1.InventoryItem.NONE);
    }
    set FIELD_GREAT_FAIRYS_SWORD(bool) {
        let value = bool ? MMAPI_1.InventoryItem.FIRE_ARROW : MMAPI_1.InventoryItem.NONE;
        this.setItemInSlot(value, MMAPI_1.InventoryItem.FIRE_ARROW);
    }
    isChildTradeFinished() {
        throw new Error("Method not implemented.");
    }
    isAdultTradeFinished() {
        throw new Error("Method not implemented.");
    }
    set bombBag(bb) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x3);
        switch (bb) {
            case 0 /* NONE */:
                buf[0x3] = 0x00;
                buf[0x4] = 0x00;
                break;
            case 1 /* BASE */:
                buf[0x3] = 0x00;
                buf[0x4] = 0x01;
                break;
            case 2 /* UPGRADED */:
                buf[0x3] = 0x01;
                buf[0x4] = 0x00;
                break;
            case 3 /* MAX */:
                buf[0x3] = 0x01;
                buf[0x4] = 0x01;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
    }
    get bombBag() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x3);
        let str = buf.slice(3, 5).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* NONE */;
            case '0001':
                return 1 /* BASE */;
            case '0100':
                return 2 /* UPGRADED */;
            case '0101':
                return 3 /* MAX */;
        }
        return 0 /* NONE */;
    }
    set dekuSticksCapacity(bb) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x1);
        switch (bb) {
            case 0 /* NONE */:
                buf[0x5] = 0x00;
                buf[0x6] = 0x00;
                break;
            case 1 /* BASE */:
                buf[0x5] = 0x00;
                buf[0x6] = 0x01;
                break;
            case 2 /* UPGRADED */:
                buf[0x5] = 0x01;
                buf[0x6] = 0x00;
                break;
            case 3 /* MAX */:
                buf[0x5] = 0x01;
                buf[0x6] = 0x01;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
    }
    get dekuSticksCapacity() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x1);
        let str = buf.slice(5, 7).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* NONE */;
            case '0001':
                return 1 /* BASE */;
            case '0100':
                return 2 /* UPGRADED */;
            case '0101':
                return 3 /* MAX */;
        }
        return 0 /* NONE */;
    }
    set dekuNutsCapacity(bb) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x1);
        switch (bb) {
            case 0 /* NONE */:
                buf[0x2] = 0x00;
                buf[0x3] = 0x00;
                break;
            case 1 /* BASE */:
                buf[0x2] = 0x00;
                buf[0x3] = 0x01;
                break;
            case 2 /* UPGRADED */:
                buf[0x2] = 0x01;
                buf[0x3] = 0x00;
                break;
            case 3 /* MAX */:
                buf[0x2] = 0x01;
                buf[0x3] = 0x01;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x1, buf);
    }
    get dekuNutsCapacity() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x1);
        let str = buf.slice(2, 4).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* NONE */;
            case '0001':
                return 1 /* BASE */;
            case '0100':
                return 2 /* UPGRADED */;
            case '0101':
                return 3 /* MAX */;
        }
        return 0 /* NONE */;
    }
    get bulletBag() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x2);
        let str = buf.slice(0, 2).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* NONE */;
            case '0001':
                return 1 /* BASE */;
            case '0100':
                return 2 /* UPGRADED */;
            case '0101':
                return 3 /* MAX */;
        }
        return 0 /* NONE */;
    }
    set bulletBag(bb) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x2);
        switch (bb) {
            case 0 /* NONE */:
                buf[0x0] = 0x00;
                buf[0x1] = 0x00;
                break;
            case 1 /* BASE */:
                buf[0x0] = 0x00;
                buf[0x1] = 0x01;
                break;
            case 2 /* UPGRADED */:
                buf[0x0] = 0x01;
                buf[0x1] = 0x00;
                break;
            case 3 /* MAX */:
                buf[0x0] = 0x01;
                buf[0x1] = 0x01;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
    }
    get quiver() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x3);
        let str = buf.slice(6, 8).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* NONE */;
            case '0001':
                return 1 /* BASE */;
            case '0100':
                return 2 /* UPGRADED */;
            case '0101':
                return 3 /* MAX */;
        }
        return 0 /* NONE */;
    }
    set quiver(q) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x3);
        switch (q) {
            case 0 /* NONE */:
                buf[0x6] = 0x00;
                buf[0x7] = 0x00;
                break;
            case 1 /* BASE */:
                buf[0x6] = 0x00;
                buf[0x7] = 0x01;
                break;
            case 2 /* UPGRADED */:
                buf[0x6] = 0x01;
                buf[0x7] = 0x00;
                break;
            case 3 /* MAX */:
                buf[0x6] = 0x01;
                buf[0x7] = 0x01;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x3, buf);
    }
    get wallet() {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x2);
        let str = buf.slice(2, 4).toString('hex');
        switch (str) {
            case '0000':
                return 0 /* CHILD */;
            case '0001':
                return 1 /* ADULT */;
            case '0100':
                return 2 /* GIANT */;
        }
        return 0 /* CHILD */;
    }
    set wallet(w) {
        let buf = this.emulator.rdramReadBits8(this.inventory_upgrades_addr + 0x2);
        switch (w) {
            case 0 /* CHILD */:
                buf[0x2] = 0x00;
                buf[0x3] = 0x00;
                break;
            case 1 /* ADULT */:
                buf[0x2] = 0x00;
                buf[0x3] = 0x01;
                break;
            case 2 /* GIANT */:
                buf[0x2] = 0x10;
                buf[0x3] = 0x00;
                break;
        }
        this.emulator.rdramWriteBits8(this.inventory_upgrades_addr + 0x2, buf);
    }
    getMaxRupeeCount() {
        let addr = 0x800F8CEC;
        let capacities = [];
        for (let i = 0; i < 8; i += 2) {
            capacities.push(this.emulator.rdramRead16(addr + i));
        }
        return capacities[this.wallet];
    }
    get dekuSticksCount() {
        return this.getAmmoForSlot(8 /* DEKU_STICKS */);
    }
    set dekuSticksCount(count) {
        this.setAmmoInSlot(8 /* DEKU_STICKS */, count);
    }
    get bombsCount() {
        return this.getAmmoForSlot(6 /* BOMBS */);
    }
    set bombsCount(count) {
        this.setAmmoInSlot(6 /* BOMBS */, count);
    }
    get bombchuCount() {
        return this.getAmmoForSlot(7 /* BOMBCHUS */);
    }
    set bombchuCount(count) {
        this.setAmmoInSlot(7 /* BOMBCHUS */, count);
    }
    get magicBeansCount() {
        return this.getAmmoForSlot(10 /* MAGIC_BEANS */);
    }
    set magicBeansCount(count) {
        this.setAmmoInSlot(10 /* MAGIC_BEANS */, count);
    }
    get arrows() {
        return this.getAmmoForSlot(1 /* HEROES_BOW */);
    }
    set arrows(count) {
        this.setAmmoInSlot(1 /* HEROES_BOW */, count);
    }
    get dekuNutsCount() {
        return this.getAmmoForSlot(9 /* DEKU_NUTS */);
    }
    set dekuNutsCount(count) {
        this.setAmmoInSlot(9 /* DEKU_NUTS */, count);
    }
    get FIELD_BOTTLE1() {
        return this.getItemInSlot(18 /* BOTTLE1 */);
    }
    set FIELD_BOTTLE1(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 18 /* BOTTLE1 */);
    }
    get FIELD_BOTTLE2() {
        return this.getItemInSlot(19 /* BOTTLE2 */);
    }
    set FIELD_BOTTLE2(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 19 /* BOTTLE2 */);
    }
    get FIELD_BOTTLE3() {
        return this.getItemInSlot(20 /* BOTTLE3 */);
    }
    set FIELD_BOTTLE3(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 20 /* BOTTLE3 */);
    }
    get FIELD_BOTTLE4() {
        return this.getItemInSlot(21 /* BOTTLE4 */);
    }
    set FIELD_BOTTLE4(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 21 /* BOTTLE4 */);
    }
    get FIELD_BOTTLE5() {
        return this.getItemInSlot(21 /* BOTTLE4 */);
    }
    set FIELD_BOTTLE5(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 21 /* BOTTLE4 */);
    }
    get FIELD_BOTTLE6() {
        return this.getItemInSlot(21 /* BOTTLE4 */);
    }
    set FIELD_BOTTLE6(content) {
        if (content < MMAPI_1.InventoryItem.BOTTLE_EMPTY ||
            content > MMAPI_1.InventoryItem.BOTTLE_EMPTY) {
            return;
        }
        this.setItemInSlot(content, 21 /* BOTTLE4 */);
    }
    hasBottle() {
        for (let i = 18 /* BOTTLE1 */; i <= 21 /* BOTTLE4 */; i++) {
            let item = this.getItemInSlot(i);
            if (item >= MMAPI_1.InventoryItem.BOTTLE_EMPTY &&
                item <= MMAPI_1.InventoryItem.BOTTLE_POE_SMALL //TODO: Check if Big or Small Poe in-game
            ) {
                return true;
            }
        }
        return false;
    }
    getBottleCount() {
        let bottles = 0;
        for (let i = 18 /* BOTTLE1 */; i <= 21 /* BOTTLE4 */; i++) {
            let item = this.getItemInSlot(i);
            if (item >= MMAPI_1.InventoryItem.BOTTLE_EMPTY &&
                item <= MMAPI_1.InventoryItem.BOTTLE_POE_SMALL) {
                bottles++;
            }
        }
        return bottles;
    }
    getBottledItems() {
        let bottles = new Array();
        for (let i = 18 /* BOTTLE1 */; i <= 21 /* BOTTLE4 */; i++) {
            let item = this.getItemInSlot(i);
            if (item >= MMAPI_1.InventoryItem.BOTTLE_EMPTY &&
                item <= MMAPI_1.InventoryItem.BOTTLE_POE_SMALL) {
                bottles.push(item);
            }
        }
        return bottles;
    }
    get FIELD_QUEST_ITEM_1() {
        return this.getItemInSlot(5 /* EVENT_ITEM_1 */);
    }
    set FIELD_QUEST_ITEM_1(item) {
        if (item < MMAPI_1.InventoryItem.QSLOT1_MOONS_TEAR || item > MMAPI_1.InventoryItem.QSLOT1_TITLE_DEED_OCEAN)
            return;
        this.setItemInSlot(item, 5 /* EVENT_ITEM_1 */);
    }
    get FIELD_QUEST_ITEM_2() {
        return this.getItemInSlot(11 /* EVENT_ITEM_2 */);
    }
    set FIELD_QUEST_ITEM_2(item) {
        if (item < MMAPI_1.InventoryItem.QSLOT2_ROOM_KEY || item > MMAPI_1.InventoryItem.QSLOT2_SPECIAL_DELIVERY_TO_MAMA) {
            return;
        }
        this.setItemInSlot(item, 11 /* EVENT_ITEM_2 */);
    }
    get FIELD_QUEST_ITEM_3() {
        return this.getItemInSlot(17 /* EVENT_ITEM_3 */);
    }
    set FIELD_QUEST_ITEM_3(item) {
        if (item < MMAPI_1.InventoryItem.QSLOT3_LETTER_TO_KAFEI || item > MMAPI_1.InventoryItem.QSLOT3_PENDANT_OF_MEMORIES) {
            return;
        }
        this.setItemInSlot(item, 17 /* EVENT_ITEM_3 */);
    }
    isEvt1TradeFinished() {
        // This is going to require more complex flag checks
        return true;
    }
    isEvt2TradeFinished() {
        // This should be done with flags also
        return true;
    }
    isEvt3TradeFinished() {
        // This should be done with flags also
        return true;
    }
    getItemInSlot(slotId) {
        if (slotId < 0 || slotId > 23 /* BOTTLE6 */) {
            return MMAPI_1.InventoryItem.NONE;
        }
        let itemId = this.emulator.rdramRead8(this.inventory_addr + slotId);
        return itemId;
    }
    getSlotForItem(item) {
        for (let i = 0; i <= 23 /* BOTTLE6 */; i++) {
            if (this.getItemInSlot(i) == item) {
                return i;
            }
        }
        return -1;
    }
    getSlotsForItem(item) {
        let slots = new Array();
        for (let i = 0; i <= 23 /* BOTTLE6 */; i++) {
            if (this.getItemInSlot(i) == item) {
                slots.push(i);
            }
        }
        return slots;
    }
    hasItem(item) {
        return this.getSlotForItem(item) != -1;
    }
    getAmmoForItem(item) {
        if (!this.hasAmmo(item))
            return 0;
        let ammo = 0;
        let slots = this.getSlotsForItem(item);
        for (let i = 0; i < slots.length; i++) {
            ammo += this.getAmmoForSlot(slots[i]);
        }
        return ammo;
    }
    hasAmmo(item) {
        switch (item) {
            case MMAPI_1.InventoryItem.DEKU_STICK:
            case MMAPI_1.InventoryItem.DEKU_NUT:
            case MMAPI_1.InventoryItem.HEROES_BOW:
            case MMAPI_1.InventoryItem.BOMB:
            case MMAPI_1.InventoryItem.BOMBCHU:
            case MMAPI_1.InventoryItem.MAGIC_BEAN:
                return true;
        }
        return false;
    }
    getAmmoForSlot(slotId) {
        if (slotId < 0 || slotId > 0xf)
            return 0;
        return this.emulator.rdramRead8(this.inventory_ammo_addr + slotId);
    }
    setAmmoInSlot(slot, amount) {
        if (slot < 0 || slot >= 0xf)
            return;
        this.emulator.rdramWrite8(this.inventory_ammo_addr + slot, amount);
    }
    setItemInSlot(item, slot) {
        if (slot < 0 || slot > 23 /* BOTTLE6 */) {
            return;
        }
        this.emulator.rdramWrite8(this.inventory_addr + slot, item.valueOf());
    }
    giveItem(item, desiredSlot) {
        if (this.getItemInSlot(desiredSlot) == MMAPI_1.InventoryItem.NONE ||
            this.getItemInSlot(desiredSlot) == item) {
            this.setItemInSlot(item, desiredSlot);
        }
    }
    removeItem(item) {
        let slots = this.getSlotsForItem(item);
        for (let i = 0; i < slots.length; i++) {
            this.setItemInSlot(MMAPI_1.InventoryItem.NONE, i);
        }
    }
    getEmptySlots() {
        let slots = new Array();
        for (let i = 0; i <= 23 /* BOTTLE6 */; i++) {
            if (this.getItemInSlot(i) == MMAPI_1.InventoryItem.NONE) {
                slots.push(i);
            }
        }
        return slots;
    }
}
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.js.map