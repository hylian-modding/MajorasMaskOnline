import { onTick, Preinit, Init, Postinit } from "modloader64_api/PluginLifecycle";
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { ModLoaderAPIInject } from "modloader64_api/ModLoaderAPIInjector";
import { IModLoaderAPI, ILogger, ICore, ModLoaderEvents } from "modloader64_api/IModLoaderAPI";
import { bus, EventHandler } from "modloader64_api/EventHandler";
import { PayloadType } from "modloader64_api/PayloadType";
import IMemory from "modloader64_api/IMemory";
import fs from 'fs';
import path from 'path';

import * as API from './API/Imports';
import * as CORE from './src/Imports';
import { CommandBuffer } from "./src/CommandBuffer";
import { ActorManager } from "./src/Imports";


export class MajorasMask implements ICore, API.IMMCore {
    header = "ZELDA MAJORA'S MASK";
    @ModLoaderAPIInject()
    ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
    eventTicks: Map<string, Function> = new Map<string, Function>();
    link!: API.ILink;
    save!: API.ISaveContext;
    global!: API.IGlobalContext;
    helper!: API.IMMHelper;
    commandBuffer!: CommandBuffer;
    isSaveLoaded = false;
    touching_loading_zone : boolean = false;
    last_known_scene : number = -1;
    last_known_room = -1;
    last_known_age: number = -1;
    log!: ILogger;
    actorManager!: API.IActorManager;
    payloads: string[] = new Array<string>();
    inventory_cache: Buffer = Buffer.alloc(0x18, 0xff);
    doorcheck = false;
    
    constructor() {
    }

    @Preinit()
    preinit() {

        global.ModLoader["offsets"] = {};
        global.ModLoader["offsets"]["link"] = {} as API.MMOffsets;
        let offsets: API.MMOffsets = global.ModLoader["offsets"]["link"];


        global.ModLoader["offsets"] = {};
        global.ModLoader["offsets"]["link"] = new API.MMOffsets();
        global.ModLoader['save_context'] = 0x1EF670;
        global.ModLoader['global_context_pointer'] = 0x1F9C60;
        global.ModLoader['overlay_table'] = 0x1AEFD0;
        global.ModLoader['link_instance'] = 0x3FFDB0;
        global.ModLoader['gui_isShown'] = 0x3FD77B;
    }

    
    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_PRE)
    onReset1(evt: any) {
        this.isSaveLoaded = false;
    }

    @EventHandler(ModLoaderEvents.ON_SOFT_RESET_POST)
    onReset2(evt: any) {
        this.isSaveLoaded = false;
    }
    
    @Init()
    init() {}

    @Postinit()
    postinit(): void {
        this.global = new CORE.GlobalContext(this.ModLoader);
        this.link = new CORE.Link(this.ModLoader.emulator);
        this.save = new CORE.SaveContext(this.ModLoader.emulator, this.ModLoader.logger);
        this.helper = new CORE.MMHelper(
            this.save,
            this.global,
            this.link,
            this.ModLoader.emulator
        );
        this.commandBuffer = new CommandBuffer(this.ModLoader.emulator);
        this.actorManager = new ActorManager(
            this.ModLoader.emulator,
            this.ModLoader.logger,
            this.helper,
            this.global,
            this.ModLoader.utils
        );
        this.ModLoader.payloadManager.registerPayloadType(
            new OverlayPayload('.ovl', this.ModLoader.logger.getLogger("OverlayPayload"), this)
        );

        
        this.eventTicks.set('waitingForAgeChange', () => {
            if (this.save.form !== this.last_known_age) {
                bus.emit(API.MMEvents.ON_AGE_CHANGE, this.save.form);
                this.last_known_age = this.save.form;
            }
        });
        this.eventTicks.set('waitingForSaveload', () => {
            if (!this.isSaveLoaded && this.helper.isSceneNumberValid()) {
                this.isSaveLoaded = true;
                bus.emit(API.MMEvents.ON_SAVE_LOADED, {});
            }
        });
        this.eventTicks.set('waitingForLoadingZoneTrigger', () => {
            if (
                this.helper.isLinkEnteringLoadingZone() &&
                !this.touching_loading_zone
            ) {
                bus.emit(API.MMEvents.ON_LOADING_ZONE, {});
                this.touching_loading_zone = true;
            }
        });
        this.eventTicks.set('waitingForFrameCount', () => {
            if (
                this.global.scene_framecount === 1 &&
                !this.helper.isTitleScreen() &&
                this.helper.isSceneNumberValid()
            ) {
                let cur = this.global.current_scene;
                this.last_known_scene = cur;
                bus.emit(API.MMEvents.ON_SCENE_CHANGE, this.last_known_scene);
                this.touching_loading_zone = false;
                let inventory: Buffer = this.ModLoader.emulator.rdramReadBuffer(
                    global.ModLoader.save_context + 0x0074,
                    0x24
                );
                for (let i = 0; i < inventory.byteLength; i++) {
                    if (inventory[i] === 0x004d) {
                        inventory[i] = this.inventory_cache[i];
                    }
                }
                inventory.copy(this.inventory_cache);
                this.ModLoader.emulator.rdramWriteBuffer(
                    global.ModLoader.save_context + 0x0074,
                    inventory
                );
            }
        });
        this.eventTicks.set('waitingForRoomChange', () => {
            let cur = this.global.room;
            if (this.last_known_room !== cur) {
                this.last_known_room = cur;
                bus.emit(API.MMEvents.ON_ROOM_CHANGE, this.last_known_room);
                this.doorcheck = false;
            }
            let doorState = this.ModLoader.emulator.rdramReadPtr8(
                global.ModLoader.global_context_pointer,
                0x11ced
            );
            if (doorState === 1 && !this.doorcheck) {
                bus.emit(API.MMEvents.ON_ROOM_CHANGE_PRE, doorState);
                this.doorcheck = true;
            }
        });

    }

    @onTick()
    onTick() {
        if (this.helper.isTitleScreen() || !this.helper.isSceneNumberValid()) return;
        
        // Loading zone check
        if (this.helper.isLinkEnteringLoadingZone() && !this.touching_loading_zone ) {
            bus.emit(API.MMEvents.ON_LOADING_ZONE, {});
            this.touching_loading_zone  = true;
        }
        
        // Scene change check
        if (this.global.scene_framecount === 1) {
            this.last_known_scene  = this.global.current_scene;
            bus.emit(API.MMEvents.ON_SCENE_CHANGE, this.last_known_scene );
            this.touching_loading_zone  = false;
        }
        
        // Age check
        if (this.save.form !== this.last_known_age) {
            this.last_known_age = this.save.form;
            bus.emit(API.MMEvents.ON_AGE_CHANGE, this.last_known_age);
        }
        this.commandBuffer.onTick();
    }
}

class find_init {
    constructor() { }

    find(buf: Buffer, locate: string): number {
        let loc: Buffer = Buffer.from(locate, 'hex');
        if (buf.indexOf(loc) > -1) {
            return buf.indexOf(loc);
        }
        return -1;
    }
}

interface ovl_meta {
    init: string;
    forceSlot: string;
}

export class OverlayPayload extends PayloadType {

    private logger: ILogger;
    private start: number = 0x80601A00;
    private ovl_offset: number = 0;
    private core: API.IMMCore;

    constructor(ext: string, logger: ILogger, core: API.IMMCore) {
        super(ext);
        this.logger = logger;
        this.core = core;
    }

    parse(file: string, buf: Buffer, dest: IMemory) {
        this.logger.debug('Trying to allocate actor...');
        let overlay_start: number = global.ModLoader['overlay_table'];
        let size = 0x01d6;
        let empty_slots: number[] = new Array<number>();
        for (let i = 0; i < size; i++) {
            let entry_start: number = overlay_start + i * 0x20;
            let _i: number = dest.rdramRead32(entry_start + 0x14);
            let total = 0;
            total += _i;
            if (total === 0) {
                empty_slots.push(i);
            }
        }
        this.logger.debug(empty_slots.length + ' empty actor slots found.');
        let finder: find_init = new find_init();
        let meta: ovl_meta = JSON.parse(
            fs
                .readFileSync(
                    path.join(path.parse(file).dir, path.parse(file).name + '.json')
                )
                .toString()
        );
        let offset: number = finder.find(buf, meta.init);
        if (offset === -1) {
            this.logger.debug(
                'Failed to find spawn parameters for actor ' +
                path.parse(file).base +
                '.'
            );
            return -1;
        }
        let slot: number = empty_slots.shift() as number;
        if (meta.forceSlot !== undefined){
            slot = parseInt(meta.forceSlot);
        }
        this.logger.debug(
            'Assigning ' + path.parse(file).base + ' to slot ' + slot + '.'
        );
        let final: number = this.start + this.ovl_offset;
        dest.rdramWrite32(slot * 0x20 + overlay_start + 0x14, final + offset);
        buf.writeUInt8(slot, offset + 0x1);
        dest.rdramWriteBuffer(final, buf);
        this.ovl_offset += buf.byteLength;
        let relocate_final: number = this.start + this.ovl_offset;
        dest.rdramWrite32(this.start + this.ovl_offset, final);
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, final + (buf.byteLength - buf.readUInt32BE(buf.byteLength - 0x4)));
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, 0x80800000);
        this.ovl_offset += 0x4;
        dest.rdramWrite32(this.start + this.ovl_offset, buf.byteLength);
        this.ovl_offset += 0x4;
        let params: Buffer = Buffer.from("00014600C50046000000000000000000", 'hex');
        let params_addr: number = this.start + this.ovl_offset;
        dest.rdramWriteBuffer(params_addr, params);
        dest.rdramWrite16(params_addr, slot);
        this.ovl_offset += params.byteLength;
        let hash: string = this.core.ModLoader.utils.hashBuffer(buf);
        this.core.commandBuffer.runCommand(API.Command.RELOCATE_OVL, relocate_final, () => {
            let hash2: string = this.core.ModLoader.utils.hashBuffer(dest.rdramReadBuffer(final, buf.byteLength));
            if (hash !== hash2) {
                this.logger.debug("ovl " + path.parse(file).base + " relocated successfully!");
            }
        });
        return {
            file: file, slot: slot, addr: final, params: params_addr, buf: buf, relocate: relocate_final, spawn: (obj: any, cb?: Function) => {
                if (cb !== undefined) {
                    this.core.commandBuffer.runCommand(API.Command.SPAWN_ACTOR, obj["params"], cb);
                } else {
                    this.core.commandBuffer.runCommand(API.Command.SPAWN_ACTOR, obj["params"]);
                }
            }
        } as API.IOvlPayloadResult;
    }
}