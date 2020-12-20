import { IModLoaderAPI, ModLoaderEvents } from "modloader64_api/IModLoaderAPI";
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { Init, onCreateResources, onTick, onViUpdate, Postinit, Preinit } from "modloader64_api/PluginLifecycle";
import { AssetHeap } from "../AssetHeap";
import { IWorldEvent, Z64_EventReward, Z64_RewardEvents } from "../WorldEvents";
import path from 'path';
import { bus, EventHandler, EventsClient, EventsServer } from "modloader64_api/EventHandler";
import { LobbyData } from "modloader64_api/NetworkHandler";
import fs from 'fs';
import { InjectCore } from "modloader64_api/CoreInjection";
import { SmartBuffer } from 'smart-buffer';
import crypto from 'crypto';
import { addToKillFeedQueue } from "modloader64_api/Announcements";
import { StorageContainer } from "modloader64_api/Storage";
import { bool_ref, number_ref } from "modloader64_api/Sylvain/ImGui";
import { FlipFlags, Texture } from "modloader64_api/Sylvain/Gfx";
import { rgba, vec4, xywh } from "modloader64_api/Sylvain/vec";
import { Music, SoundSourceStatus } from "modloader64_api/Sound/sfml_audio";
import { Command } from "modloader64_api/OOT/ICommandBuffer";
import { CostumeHelper } from "../CostumeHelper";
import { Z64OnlineEvents, Z64Online_EquipmentPak, Z64Online_ModelAllocation } from "@MajorasMaskOnline/Z64OnlineAPI/Z64OnlineAPI";
import { IMMCore, InventoryItem, MMEvents, MMForms, UpgradeCountLookup } from "MajorasMask/API/MMAPI";
import { IOvlPayloadResult } from "modloader64_api/OOT/OOTAPI";
import { ActorCategory } from "MajorasMask/src/Imports";
import { CreditsController } from "../CreditsController";
import { ProxySide, SidedProxy } from "modloader64_api/SidedProxy/SidedProxy";

class FakeOvlResult implements IOvlPayloadResult {

    file: string = "";
    slot: number = -1;
    addr: number = -1;
    params: number = -1;
    buf: Buffer = Buffer.alloc(1);
    relocate: number = -1;
    core: IMMCore;

    constructor(core: IMMCore, params: number) {
        this.core = core;
        this.params = params;
    }

    spawn(obj: IOvlPayloadResult, callback?: (success: boolean, result: number) => {}): void {
        this.core.commandBuffer.runCommand(Command.SPAWN_ACTOR, this.params, callback);
    }

}

class ChristmasGuiStuff {
    showTree: bool_ref = [true];
    snow: bool_ref = [false];
    boxVariant: number_ref = [0];
}

class TitleScreenData {
    tex!: Texture;
    icon!: Texture;
    fadeIn: vec4 = rgba(255, 255, 255, 0);
    onTitleScreen: boolean = false;
    titleMusic!: Music;
    creditsMusic!: Music;
}

interface OotO_Christmas_Config {
    textures: boolean;
    disableEvent: boolean;
}

interface IChristmasReward {
    msg: string;
    trigger: number;
    run(client: ChristmasClient): void;
}

class ChristmasReward implements IChristmasReward {

    msg: string;
    trigger: number;
    ModLoader: IModLoaderAPI;
    core: IMMCore;
    callback: Function;

    constructor(msg: string, trigger: number, ModLoader: IModLoaderAPI, core: IMMCore, callback: (ModLoader: IModLoaderAPI, core: IMMCore, client: ChristmasClient) => void) {
        this.ModLoader = ModLoader;
        this.core = core;
        this.callback = callback;
        this.trigger = trigger;
        this.msg = msg;
    }

    run(client: ChristmasClient): void {
        this.callback(this.ModLoader, this.core, client);
    }
}

class ChristmasBombReward extends ChristmasReward {
    constructor(trigger: number, ModLoader: IModLoaderAPI, core: IMMCore) {
        super("You got a present full of bombs.", trigger, ModLoader, core, (ModLoader: IModLoaderAPI, core: IMMCore, client: ChristmasClient) => {
            this.core.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.save.inventory.bombBag);
        });
    }
}

class ChristmasRNGReward extends ChristmasReward {
    constructor(trigger: number, ModLoader: IModLoaderAPI, core: IMMCore, override?: number) {
        super("If you see this message yell at den for fucking up", trigger, ModLoader, core, (ModLoader: IModLoaderAPI, core: IMMCore, client: ChristmasClient) => {
            let rng = client.getRandomInt(0, 100);
            if (rng <= client.currentProc || override !== undefined) {
                // Winner.
                client.cleanRewards();
                client.currentProc = 30;
                if (client.rewardsMap.length > 0) {
                    let data = client.rewardsMap.shift()!;
                    this.msg = "Costume: " + data;
                    if (client.costumesChild.has(data)) {
                        new ChristmasChildCostumeReward(data, "Costume: " + data, this.trigger, this.ModLoader, this.core).run(client);
                    } else if (client.costumesGear.has(data)) {
                        new ChristmasEquipmentCostumeReward(data, "Costume: " + data, this.trigger, this.ModLoader, this.core).run(client);
                    }
                    if (override !== undefined) {
                        addToKillFeedQueue("Winner!");
                    }
                    if (client.rewardsMap.length === 0) {
                        addToKillFeedQueue("All rewards found today!");
                    }
                } else {
                    this.doFail(client);
                }
            } else {
                this.doFail(client);
            }
        });
    }

    doFail(client: ChristmasClient) {
        // Loser.
        client.currentProc += 30;
        // What do we give? Lets see.
        // Rupees, Bombs, Arrows, Bombchus, Sticks, Nuts.
        let spin = client.getRandomInt(0, 5);
        if (spin === 1 && this.core.save.inventory.bombBag === 0) {
            spin = 0;
        }
        if (spin === 2 && (this.core.save.inventory.quiver === 0)) {
            spin = 0;
        }
        if (spin === 4 && this.core.save.inventory.dekuSticksCapacity === 0) {
            spin = 0;
        }
        if (spin === 5 && this.core.save.inventory.dekuNutsCapacity === 0) {
            spin = 0;
        }
        switch (spin) {
            case 0:
                this.msg = "Money? Money. (Rupees)";
                this.core.save.rupees = this.core.save.inventory.getMaxRupeeCount();
                break;
            case 1:
                this.msg = "More explosions. (Bombs)";
                this.core.save.inventory.bombsCount = UpgradeCountLookup(InventoryItem.BOMB, this.core.save.inventory.bombBag);
                break;
            case 2:
                this.msg = "Like getting socks for Christmas. (Ammo refill)";
                this.core.save.inventory.arrows = UpgradeCountLookup(InventoryItem.HEROES_BOW, this.core.save.inventory.quiver);
                break;
            case 3:
                this.msg = "Careful now. These are dangerous. (Bombchus)";
                this.core.save.inventory.bombchuCount = this.core.save.inventory.bombchuCount + 5;
                break;
            case 4:
                this.msg = "More sticks for bonking. (Deku Sticks)"
                this.core.save.inventory.dekuSticksCount = UpgradeCountLookup(InventoryItem.DEKU_STICK, this.core.save.inventory.dekuSticksCapacity);
                break;
            case 5:
                this.msg = "Aw nuts. (Deku Nuts, obviously)";
                this.core.save.inventory.dekuNutsCount = UpgradeCountLookup(InventoryItem.DEKU_NUT, this.core.save.inventory.dekuNutsCapacity);
                break;
        }
    }
}

class ChristmasChildCostumeReward extends ChristmasReward {

    private key: string;

    constructor(key: string, msg: string, trigger: number, ModLoader: IModLoaderAPI, core: IMMCore) {
        super(msg, trigger, ModLoader, core, (ModLoader: IModLoaderAPI, core: IMMCore, client: ChristmasClient) => {
            let data = client.costumesChild.get(this.key)!;
            let name = CostumeHelper.getCostumeName(data);
            bus.emit(Z64_RewardEvents.UNLOCK_PLAYAS, { name: name, age: MMForms.HUMAN, data: data, event: "Christmas 2020" } as Z64_EventReward)
            bus.emit(Z64OnlineEvents.CHANGE_CUSTOM_MODEL_CHILD_GAMEPLAY, new Z64Online_ModelAllocation(data, MMForms.HUMAN));
        });
        this.key = key;
    }
}

class ChristmasEquipmentCostumeReward extends ChristmasReward {

    private key: string;

    constructor(key: string, msg: string, trigger: number, ModLoader: IModLoaderAPI, core: IMMCore) {
        super(msg, trigger, ModLoader, core, (ModLoader: IModLoaderAPI, core: IMMCore, client: ChristmasClient) => {
            let data = client.costumesGear.get(this.key)!;
            let name = CostumeHelper.getCostumeName(data);
            bus.emit(Z64_RewardEvents.UNLOCK_PLAYAS, { name: name, age: 0x69, data: data, event: "Christmas 2020", equipmentCategory: CostumeHelper.getEquipmentCategory(data) } as Z64_EventReward)
            bus.emit(Z64OnlineEvents.LOAD_EQUIPMENT_BUFFER, new Z64Online_EquipmentPak(name, data));
            bus.emit(Z64OnlineEvents.REFRESH_EQUIPMENT, {});
        });
        this.key = key;
    }
}

export class ChristmasClient implements IWorldEvent {

    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    heap!: AssetHeap;
    rewardChecks: any = {};
    treePointer: number = 0;
    presentParams: number = 0;
    present!: IOvlPayloadResult;
    @InjectCore()
    core!: IMMCore;
    collectionFlags!: Buffer[];
    url: string = "https://repo.modloader64.com/mods/Ooto/events/christmas/MM_Christmas_content_final.content";
    GuiVariables: ChristmasGuiStuff = new ChristmasGuiStuff();
    resourceLoad: boolean = false;
    title!: TitleScreenData;
    config!: OotO_Christmas_Config;
    //
    snowList: number = 0;
    snowHeap: number = 0;
    onlyOneSnow: boolean = false;
    rewardsToday: Array<IChristmasReward> = [];
    treeDay: number = 0;
    rewardsMap: Array<string> = [];
    costumesChild: Map<string, Buffer> = new Map<string, Buffer>();
    costumesAdult: Map<string, Buffer> = new Map<string, Buffer>();
    costumesGear: Map<string, Buffer> = new Map<string, Buffer>();
    christmasSpawnLocations!: Array<number>;
    currentProc: number = 30;
    treeProc: string = "";
    disableEvent: boolean = false;
    @SidedProxy(ProxySide.CLIENT, CreditsController)
    credits!: CreditsController;
    alreadyUnlocked: Array<string> = [];

    @Preinit()
    preinit() {
        if (this.disableEvent) {
            return;
        }
        this.config = this.ModLoader.config.registerConfigCategory("MM_Christmas") as OotO_Christmas_Config;
        this.ModLoader.config.setData("MM_Christmas", "textures", true);
        this.ModLoader.config.setData("MM_Christmas", "disableEvent", false);
        this.disableEvent = this.config.disableEvent;
        this.title = new TitleScreenData();
        //this.heap = new AssetHeap(this.ModLoader, "Christmas", undefined, path.resolve(global.ModLoader.startdir, "Christmas"));
        this.heap = new AssetHeap(this.ModLoader, "Christmas", this.url, undefined);
        this.collectionFlags = [];
        for (let i = 0; i < 31; i++) {
            this.collectionFlags.push(Buffer.alloc(100));
        }
        //this.rewardsToday.push(new ChristmasEquipmentCostumeReward("Ice Sword", "An icey blade.", 43, this.ModLoader, this.core));
    }

    @onCreateResources()
    onLoadAssets() {
        if (!this.resourceLoad) {
            if (this.disableEvent) {
                return;
            }
            this.ModLoader.logger.debug("Creating resources...");
            this.title.tex = this.ModLoader.Gfx.createTexture();
            fs.writeFileSync(path.resolve(__dirname, "Christmas.png"), this.heap.assets.get("assets/Christmas.png")!);
            this.title.tex.loadFromFile(path.resolve(__dirname, "Christmas.png"));
            this.title.icon = this.ModLoader.Gfx.createTexture();
            this.title.icon.loadFromFile(path.resolve(__dirname, "../", "../", "icon.png"));
            // Sounds
            this.title.titleMusic = this.ModLoader.sound.initMusic(this.heap.assets.get("assets/music/titlescreen.ogg")!);
            this.title.creditsMusic = this.ModLoader.sound.initMusic(this.heap.assets.get("assets/music/credits.ogg")!);
            this.resourceLoad = true;
        }
    }

    cleanRewards() {
        this.alreadyUnlocked = [];
        this.heap.costumes.get(MMForms.HUMAN)!.forEach((value: Buffer, index: number) => {
            let name = CostumeHelper.getCostumeName(value);
            let e = { name: name, age: MMForms.HUMAN, data: value, event: "Christmas 2020", checked: false } as Z64_EventReward;
            bus.emit(Z64_RewardEvents.CHECK_REWARD, e);
            if (e.checked === true) {
                this.alreadyUnlocked.push(name);
            }
        });
        this.heap.equipment!.forEach((value: Buffer[], key: string) => {
            for (let i = 0; i < value.length; i++) {
                let name = CostumeHelper.getCostumeName(value[i]);
                let e = { name: name, age: 0x69, data: value[i], event: "Christmas 2020", checked: false, equipmentCategory: CostumeHelper.getEquipmentCategory(value[i]) } as Z64_EventReward;
                bus.emit(Z64_RewardEvents.CHECK_REWARD, e);
                if (e.checked === true) {
                    this.alreadyUnlocked.push(name);
                }
            }
        });
        for (let i = 0; i < this.alreadyUnlocked.length; i++) {
            if (this.rewardsMap.indexOf(this.alreadyUnlocked[i]) > -1) {
                this.ModLoader.logger.debug(this.alreadyUnlocked[i] + " already unlocked. Removing from item pool.");
                this.rewardsMap.splice(this.rewardsMap.indexOf(this.alreadyUnlocked[i]), 1);
            }
        }
    }

    @Init()
    init() {
        if (this.disableEvent) {
            return;
        }
        this.heap.init();
        let tcWrap = (fn: Function) => {
            try {
                fn();
            } catch (err) {
            }
        };
        let tex = path.resolve(__dirname, "cache");
        tcWrap(() => { fs.mkdirSync(tex) });
        tcWrap(() => {
            let p = path.resolve(".", "saves", this.ModLoader.clientLobby, "christmas_flags_mm.json");
            if (fs.existsSync(p)) {
                this.collectionFlags = JSON.parse(fs.readFileSync(p).toString());
            }
        });
        if (this.config.textures) {
            bus.emit(ModLoaderEvents.OVERRIDE_TEXTURE_PATH, tex);
        }
        this.heap.assets.forEach((value: Buffer, key: string) => {
            let parse = path.parse(key);
            if (parse.ext === ".htc") {
                fs.writeFileSync(path.resolve(tex, parse.base), value);
            }
        });
    }

    @Postinit()
    postinit() {
        if (this.disableEvent) {
            return;
        }
        this.heap.postinit();
        let items: Array<string> = [];
        this.heap.costumes.get(MMForms.HUMAN)!.forEach((value: Buffer, index: number) => {
            let name = CostumeHelper.getCostumeName(value);
            this.costumesChild.set(name, value);
            let e = { name: name, age: MMForms.HUMAN, data: value, event: "Christmas 2020", checked: false } as Z64_EventReward;
            bus.emit(Z64_RewardEvents.CHECK_REWARD, e);
            if (e.checked === true) {
                this.alreadyUnlocked.push(name);
            }
            items.push(name);
        });
        this.heap.equipment!.forEach((value: Buffer[], key: string) => {
            for (let i = 0; i < value.length; i++) {
                let name = CostumeHelper.getCostumeName(value[i]);
                this.costumesGear.set(name, value[i]);
                let e = { name: name, age: 0x69, data: value[i], event: "Christmas 2020", checked: false, equipmentCategory: CostumeHelper.getEquipmentCategory(value[i]) } as Z64_EventReward;
                bus.emit(Z64_RewardEvents.CHECK_REWARD, e);
                if (e.checked === true) {
                    this.alreadyUnlocked.push(name);
                }
                items.push(name);
            }
        });
        for (let i = 0; i < this.alreadyUnlocked.length; i++) {
            if (this.rewardsMap.indexOf(this.alreadyUnlocked[i]) > -1) {
                this.ModLoader.logger.debug(this.alreadyUnlocked[i] + " already unlocked. Removing from item pool.");
            }
        }
        let generate: boolean = false;
        if (generate) {
            let dist: any = {};
            for (let i = 1; i < 32; i++) {
                dist[i.toString()] = [];
            }
            let curDay = 20;
            let shuffle = (array: Array<string>) => {
                let currentIndex = array.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }
            let copy = (array: Array<string>) => {
                let arr = [];
                for (let i = 0; i < array.length; i++) {
                    arr.push(array[i]);
                }
                return arr;
            }
            items = shuffle(items);
            let c = copy(items);
            let c2 = copy(items);
            console.log(JSON.stringify(dist, null, 2));
            while (items.length > 0) {
                console.log(curDay);
                dist[curDay.toString()].push(items.shift());
                curDay++;
                if (curDay > 31) {
                    curDay = 20;
                }
            }
            dist["1"] = shuffle(c);
            dist["2"] = shuffle(c2);
            console.log(JSON.stringify(dist, null, 2));
        }
    }

    @EventHandler(ModLoaderEvents.ON_ROM_PATCHED)
    onRomPatched(evt: any) {
        if (this.disableEvent) {
            return;
        }
        try {
            this.heap.onRomPatched(evt);
        } catch (err) {
            console.log(err.stack);
        }
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onSoftReset1() {
        if (this.disableEvent) {
            return;
        }
        this.heap.pre_reset();
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_POST)
    onSoftReset2() {
        if (this.disableEvent) {
            return;
        }
        this.heap.post_reset();
    }

    @EventHandler(EventsClient.CONFIGURE_LOBBY)
    onLobbySetup(lobby: LobbyData): void {
        lobby.data['OotOnline:christmas'] = !this.disableEvent;
        if (!this.disableEvent) {
            this.heap.preinit();
            let pos: any[] = JSON.parse(this.heap.findRawAsset("assets/PresentLocations.json")!.toString()).locations;
            let clone: any[] = JSON.parse(JSON.stringify(pos));
            let days: any[] = [];
            for (let i = 0; i < 1; i++) {
                let used: number[] = [];
                let trees: number[] = [];
                for (let j = 0; j < 80; j++) {
                    let c = this.getRandomInt(0, clone.length);
                    while (used.indexOf(c) === -1) {
                        c = this.getRandomInt(0, clone.length);
                        used.push(c);
                        trees.push(c);
                    }

                }
                days[i] = trees;
            }
            lobby.data['OotOnline:christmas_spawns'] = days[0];
            let winner = days[0][this.getRandomInt(0, days[0].length - 1)];
            lobby.data["OotOnline:christmas_winner"] = winner;
        }
    }

    @EventHandler(EventsClient.ON_LOBBY_JOIN)
    onJoinedLobby(lobby: LobbyData): void {
        if (lobby.data['OotOnline:christmas']) {
            this.christmasSpawnLocations = lobby.data['OotOnline:christmas_spawns'];
            let rewardArrs: any = lobby.data["OotOnline:ChristmasRewardMap"];
            let rewardDay: number = lobby.data["OotOnline:ChristmasProgress"];
            let rewardArr: Array<string> = rewardArrs[rewardDay];
            this.rewardsMap = rewardArr;
            for (let i = 0; i < rewardArr.length; i++) {
                this.rewardsToday.push(new ChristmasRNGReward(lobby.data["OotOnline:christmas_winner"], this.ModLoader, this.core, 1));
            }
            for (let i = 0; i < this.christmasSpawnLocations.length; i++) {
                if (this.christmasSpawnLocations[i] !== lobby.data["OotOnline:christmas_winner"]) {
                    this.rewardsToday.push(new ChristmasRNGReward(this.christmasSpawnLocations[i], this.ModLoader, this.core));
                }
            }
            this.treeDay = lobby.data["OotOnline:ChristmasProgress"];
            this.credits.eventDisabled = this.disableEvent;
            this.credits.assets = this.heap.assets;
        }
    }

    @EventHandler(EventsClient.ON_INJECT_FINISHED)
    onPayload() {
        if (this.disableEvent) {
            return;
        }
        fs.writeFileSync(path.resolve(__dirname, "present.ovl"), this.heap.assets.get("assets/payloads/E0/present.ovl")!);
        fs.writeFileSync(path.resolve(__dirname, "present.json"), this.heap.assets.get("assets/payloads/E0/present.json")!);
        this.ModLoader.utils.setTimeoutFrames(() => {
            let slot: number = this.ModLoader.payloadManager.parseFile(path.resolve(__dirname, "present.ovl"));
            let params = this.heap.heap!.malloc(0x20);
            this.ModLoader.emulator.rdramWriteBuffer(params, Buffer.from('00130000000000000000000000000000', 'hex'));
            this.ModLoader.emulator.rdramWrite16(params, slot);
            let d = params + 0x10;
            let e = 0;
            let final = 0x80F00070;
            let relocate_final: number = d + e;
            this.ModLoader.emulator.rdramWrite32(d + e, final);
            e += 0x4;
            this.ModLoader.emulator.rdramWrite32(d + e, final + (this.heap.assets.get("assets/payloads/E0/present.ovl")!.byteLength - this.heap.assets.get("assets/payloads/E0/present.ovl")!.readUInt32BE(this.heap.assets.get("assets/payloads/E0/present.ovl")!.byteLength - 0x4)));
            e += 0x4;
            this.ModLoader.emulator.rdramWrite32(d + e, 0x80800000);
            e += 0x4;
            this.ModLoader.emulator.rdramWrite32(d + e, this.heap.assets.get("assets/payloads/E0/present.ovl")!.byteLength);
            e += 0x4;
            this.presentParams = this.heap.heap!.malloc(0x40);
            this.ModLoader.emulator.rdramWrite32(this.presentParams, params);
            this.core.commandBuffer.runCommand(Command.RELOCATE_OVL, relocate_final, () => {
                let hash = this.ModLoader.utils.hashBuffer(this.heap.assets.get("assets/payloads/E0/present.ovl")!);
                let hash2 = this.ModLoader.utils.hashBuffer(this.ModLoader.emulator.rdramReadBuffer(0x80F00070, this.heap.assets.get("assets/payloads/E0/present.ovl")!.byteLength));
                if (hash !== hash2) {
                    this.present = new FakeOvlResult(this.core, params);
                    this.ModLoader.logger.info("Setting up tree actor...");
                }
            });
            this.treePointer = this.heap.header;
        }, 100);
    }

    getRandomInt(min: number, max: number) {
        return this.cryptoRandomNumber(min, max);
    }

    private cryptoRandomNumber(minimum: number, maximum: number) {
        let maxBytes = 6;
        let maxDec = 281474976710656;

        let randbytes = parseInt(crypto.randomBytes(maxBytes).toString('hex'), 16);
        let result = Math.floor(randbytes / maxDec * (maximum - minimum + 1) + minimum);

        if (result > maximum) {
            result = maximum;
        }
        return result;
    }

    @EventHandler(MMEvents.ON_SCENE_CHANGE)
    onScene(scene: number) {
        if (this.disableEvent) {
            return;
        }
        this.onlyOneSnow = false;
        if (this.heap.findRawAsset("assets/PresentLocations.json") === undefined) {
            this.ModLoader.logger.error("Can't load tree locations. Something is mega fucked.");
            return;
        }
        let pos: any[] = JSON.parse(this.heap.findRawAsset("assets/PresentLocations.json")!.toString()).locations;
        let treeList: Buffer[] = [];
        let possibleSpawns: Buffer[] = [];
        for (let i = 0; i < pos.length; i++) {
            let p: Buffer = pos[i].present;
            treeList.push(p);
            let _scene = p.readUInt32BE(0);
            if (_scene === scene) {
                possibleSpawns.push(p);
            }
        }
        this.spawnTree(possibleSpawns, treeList);
    }

    private spawnTree(possibleSpawns: Array<Buffer>, treeList: Array<Buffer>) {
        if (possibleSpawns.length === 0) {
            return;
        }
        if (this.treeProc !== "") {
            this.ModLoader.utils.clearIntervalFrames(this.treeProc);
            this.treeProc = "";
        }
        this.treeProc = this.ModLoader.utils.setIntervalFrames(() => {
            if (!this.core.helper.isInterfaceShown() && !this.core.helper.isTitleScreen()) {
                return;
            }
            if (this.core.helper.isLinkEnteringLoadingZone()) {
                return;
            }
            if (this.ModLoader.emulator.rdramRead16(0x803E6D60) !== 0x071C) {
                return;
            }
            this.ModLoader.utils.clearIntervalFrames(this.treeProc);
            this.treeProc = "";
            for (let i = 0; i < possibleSpawns.length; i++) {
                let valid: boolean = false;
                let treeIndex = treeList.indexOf(possibleSpawns[i]);
                for (let j = 0; j < this.rewardsToday.length; j++) {
                    let index = this.rewardsToday[j].trigger;
                    if (index === treeIndex) {
                        valid = true;
                    }
                }
                if (valid) {
                    if (this.collectionFlags[this.treeDay].readUInt8(treeIndex) > 0) {
                        valid = false;
                    }
                }
                let p = possibleSpawns[i];
                this.ModLoader.utils.setTimeoutFrames(() => {
                    // Slots used:
                    // XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXX
                    // XXXXXXXX XXXXXXXX XXXXXXXX XXXXXXXX
                    // XXXXXXXX XXXXXXXX XXXXXXXX 00000000
                    this.ModLoader.emulator.rdramWrite32(this.treePointer, this.presentParams);
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x4, this.heap.getSlotAddress(this.heap.findAsset("PresentPsi")!));
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x8, this.heap.getSlotAddress(this.heap.findAsset("TreePsi")!));
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0xC, this.heap.getSlotAddress(this.heap.findAsset("PsiTopper")!));
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x10, valid ? 1 : 0);
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x14, p.readUInt32BE(0x16));
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x18, p.readUInt32BE(0x1A));
                    let snow = p.readUInt32BE(0x1E) === 1 ? true : false;
                    if (this.onlyOneSnow) {
                        snow = false;
                    }
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x1C, snow ? 1 : 0);
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x20, this.snowList);
                    this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x28, treeIndex);
                    if (snow) {
                        this.onlyOneSnow = snow;
                        let cats = [ActorCategory.MISC, ActorCategory.ITEM_ACTION];
                        Object.keys(cats).forEach((key: any) => {
                            let cat = this.core.actorManager.getActors(cats[key]);
                            /* for (let i = 0; i < cat.length; i++) {
                                if (cat[i].actorID === 0x97 || cat[i].actorID === 0x165) {
                                    this.ModLoader.logger.debug("Found existing weather to erase.");
                                    cat[i].destroy();
                                }
                            } */
                        });
                    }
                    this.present.spawn(this.present, (success: boolean, result: number) => {
                        if (success) {
                            console.log(valid);
                            let a = this.core.actorManager.createIActorFromPointer(result);
                            a.position.setRawPos(p.slice(0x4, 0x4 + 0xC));
                            a.rotation.setRawRot(p.slice(0x10, 0x10 + 0x6));
                            a.room = 0xFF;
                            console.log(result.toString(16));
                        }
                        return {};
                    });
                }, 2 + (i * 2));
            }
        }, 1);
    }

    @onTick()
    onTick() {
        if (this.disableEvent) {
            return;
        }
        this.title.onTitleScreen = this.core.helper.isTitleScreen() && this.core.helper.isSceneNumberValid();
        if (this.ModLoader.emulator.rdramRead32(this.presentParams + 0x24) > 0 && this.ModLoader.emulator.rdramRead32(this.presentParams + 0x24) < 255) {
            let treeId = this.ModLoader.emulator.rdramRead32(this.presentParams + 0x24);
            // Someone touched a present.
            this.ModLoader.emulator.rdramWrite32(this.presentParams + 0x24, 0x0);
            for (let i = 0; i < this.rewardsToday.length; i++) {
                if (treeId === this.rewardsToday[i].trigger) {
                    this.rewardsToday[i].run(this);
                    addToKillFeedQueue(this.rewardsToday[i].msg);
                    break;
                }
            }
            this.collectionFlags[this.treeDay].writeUInt8(1, treeId);
            let p = path.resolve(".", "saves", this.ModLoader.clientLobby, "christmas_flags_mm.json");
            fs.writeFileSync(p, JSON.stringify(this.collectionFlags));
        }
    }

    @onViUpdate()
    onVi() {
        if (this.disableEvent) {
            return;
        }
        if (!this.resourceLoad) {
            this.onLoadAssets();
        }
        if (!this.title.onTitleScreen) {
            this.title.fadeIn.w = 0;
            try {
                if (this.title.titleMusic.status !== SoundSourceStatus.Stopped) {
                    this.title.titleMusic.stop();
                }
            } catch (err) { }
            return;
        }
        try {
            if (this.title.titleMusic.status !== SoundSourceStatus.Playing) {
                this.core.commandBuffer.runCommand(Command.PLAY_MUSIC, 0);
                this.title.titleMusic.volume = 50;
                this.title.titleMusic.play();
            }
        } catch (err) { }
        if (this.title.fadeIn.w < 1.0) {
            this.title.fadeIn.w += 0.001;
        }
        this.ModLoader.Gfx.addSprite(this.ModLoader.ImGui.getWindowDrawList(), this.title.tex, xywh(0, 0, this.title.tex.width, this.title.tex.height), xywh(0, 0, this.ModLoader.ImGui.getMainViewport().size.x, this.ModLoader.ImGui.getMainViewport().size.y), this.title.fadeIn, FlipFlags.None);
    }

}

export class ChristmasServer implements IWorldEvent {
    @ModLoaderAPIInject()
    ModLoader!: IModLoaderAPI;
    rewardData: any;

    @Preinit()
    preinit() {
        if (fs.existsSync(path.resolve(global.ModLoader.startdir, "christmas2020_rewardmap.json"))) {
            this.rewardData = JSON.parse(fs.readFileSync(path.resolve(global.ModLoader.startdir, "christmas2020_rewardmap.json")).toString());
        } else {
            this.rewardData = {};
            for (let i = 0; i < 31; i++) {
                this.rewardData[i.toString()] = [];
            }
        }
    }
    @EventHandler(EventsServer.ON_LOBBY_DATA)
    onData(data: LobbyData) {
        let d = new Date();
        let day = d.getDate();
        data.data["OotOnline:ChristmasRewardMap"] = this.rewardData;
        data.data["OotOnline:ChristmasProgress"] = day;
    }
}