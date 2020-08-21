"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MMO_SceneGUIPacket = exports.MMO_IconAllocatePacket = exports.MMO_BottleUpdatePacket = exports.MMO_DownloadAllModelsPacket = exports.MMO_AllocateModelPacket = exports.MMO_ActorDeadPacket = exports.MMO_ClientSceneContextUpdate = exports.MMO_ServerFlagUpdate = exports.MMO_ClientFlagUpdate = exports.MMO_DownloadRequestPacket = exports.MMO_DownloadResponsePacket2 = exports.MMO_BankSyncPacket = exports.MMO_SceneRequestPacket = exports.MMO_ScenePacket = exports.MMO_PuppetWrapperPacket = exports.MMO_DownloadResponsePacket = exports.MMO_SubscreenSyncPacket = exports.MMO_PuppetPacket = void 0;
const ModLoaderDefaultImpls_1 = require("modloader64_api/ModLoaderDefaultImpls");
class MMO_PuppetPacket {
    //horse_data!: HorseData;
    constructor(puppetData, lobby) {
        this.data = puppetData;
    }
}
exports.MMO_PuppetPacket = MMO_PuppetPacket;
class MMO_SubscreenSyncPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(save, equipment, quest, dungeonItems, lobby) {
        super('MMO_SubscreenSyncPacket', 'MMOnline', lobby, false);
        this.inventory = save;
        this.equipment = equipment;
        this.quest = quest;
        this.dungeonItems = dungeonItems;
    }
}
exports.MMO_SubscreenSyncPacket = MMO_SubscreenSyncPacket;
class MMO_DownloadResponsePacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(subscreen, scenes, bank, lobby) {
        super('MMO_DownloadResponsePacket', 'MMOnline', lobby, false);
        this.subscreen = subscreen;
        this.flags = scenes;
        this.bank = bank;
        ModLoaderDefaultImpls_1.packetHelper.cloneDestination(this, this.subscreen);
        ModLoaderDefaultImpls_1.packetHelper.cloneDestination(this, this.flags);
        ModLoaderDefaultImpls_1.packetHelper.cloneDestination(this, this.bank);
    }
}
exports.MMO_DownloadResponsePacket = MMO_DownloadResponsePacket;
class MMO_PuppetWrapperPacket extends ModLoaderDefaultImpls_1.UDPPacket {
    constructor(packet, lobby) {
        super('MMO_PuppetPacket', 'MMOnline', lobby, false);
        this.data = JSON.stringify(packet);
    }
}
exports.MMO_PuppetWrapperPacket = MMO_PuppetWrapperPacket;
class MMO_ScenePacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(lobby, scene, form) {
        super('MMO_ScenePacket', 'MMOnline', lobby, true);
        this.scene = scene;
        this.form = form;
    }
}
exports.MMO_ScenePacket = MMO_ScenePacket;
class MMO_SceneRequestPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(lobby) {
        super('MMO_SceneRequestPacket', 'MMOnline', lobby, true);
    }
}
exports.MMO_SceneRequestPacket = MMO_SceneRequestPacket;
class MMO_BankSyncPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(saving, lobby) {
        super('MMO_BankSyncPacket', 'MMOnline', lobby, true);
        this.savings = saving;
    }
}
exports.MMO_BankSyncPacket = MMO_BankSyncPacket;
class MMO_DownloadResponsePacket2 extends ModLoaderDefaultImpls_1.Packet {
    constructor(lobby) {
        super('MMO_DownloadResponsePacket2', 'MMOnline', lobby, false);
    }
}
exports.MMO_DownloadResponsePacket2 = MMO_DownloadResponsePacket2;
class MMO_DownloadRequestPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(lobby) {
        super('MMO_DownloadRequestPacket', 'MMOnline', lobby, false);
    }
}
exports.MMO_DownloadRequestPacket = MMO_DownloadRequestPacket;
class MMO_ClientFlagUpdate extends ModLoaderDefaultImpls_1.Packet {
    constructor(scenes, events, items, inf, skulltulas, lobby) {
        super('MMO_ClientFlagUpdate', 'MMOnline', lobby, false);
        this.scenes = scenes;
        this.events = events;
        this.items = items;
        this.inf = inf;
        this.skulltulas = skulltulas;
    }
}
exports.MMO_ClientFlagUpdate = MMO_ClientFlagUpdate;
class MMO_ServerFlagUpdate extends ModLoaderDefaultImpls_1.Packet {
    constructor(scenes, events, items, inf, skulltulas, lobby) {
        super('MMO_ServerFlagUpdate', 'MMOnline', lobby, false);
        this.scenes = scenes;
        this.events = events;
        this.items = items;
        this.inf = inf;
        this.skulltulas = skulltulas;
    }
}
exports.MMO_ServerFlagUpdate = MMO_ServerFlagUpdate;
class MMO_ClientSceneContextUpdate extends ModLoaderDefaultImpls_1.Packet {
    constructor(chests, switches, 
    //collect: Buffer,
    clear, temp, lobby, scene) {
        super('MMO_ClientSceneContextUpdate', 'MMOnline', lobby, false);
        this.chests = chests;
        this.switches = switches;
        //this.collect = collect;
        this.clear = clear;
        this.temp = temp;
        this.scene = scene;
    }
}
exports.MMO_ClientSceneContextUpdate = MMO_ClientSceneContextUpdate;
class MMO_ActorDeadPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(aid, scene, room, lobby) {
        super('MMO_ActorDeadPacket', 'MMOnline', lobby, true);
        this.actorUUID = aid;
        this.scene = scene;
        this.room = room;
    }
}
exports.MMO_ActorDeadPacket = MMO_ActorDeadPacket;
class MMO_AllocateModelPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(model, form, lobby) {
        super('MMO_AllocateModelPacket', 'MMOnline', lobby, true);
        this.model = model;
        this.form = form;
    }
}
exports.MMO_AllocateModelPacket = MMO_AllocateModelPacket;
class MMO_DownloadAllModelsPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(models, lobby) {
        super('MMO_DownloadAllModelsPacket', 'MMOnline', lobby, false);
        this.models = models;
    }
}
exports.MMO_DownloadAllModelsPacket = MMO_DownloadAllModelsPacket;
class MMO_BottleUpdatePacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(slot, contents, lobby) {
        super('MMO_BottleUpdatePacket', 'MMOnline', lobby, true);
        this.slot = slot;
        this.contents = contents;
    }
}
exports.MMO_BottleUpdatePacket = MMO_BottleUpdatePacket;
class MMO_IconAllocatePacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(buf, form, lobby) {
        super('MMO_IconAllocatePacket', 'MMOnline', lobby, true);
        this.icon = buf;
        this.form = form;
    }
}
exports.MMO_IconAllocatePacket = MMO_IconAllocatePacket;
class MMO_SceneGUIPacket extends ModLoaderDefaultImpls_1.Packet {
    constructor(scene, form, lobby, iconAdult, iconChild) {
        super('MMO_SceneGUIPacket', 'MMOnline', lobby, false);
        this.scene = scene;
        this.form = form;
        if (iconAdult !== undefined) {
            this.iconAdult = iconAdult.toString('base64');
        }
        if (iconChild !== undefined) {
            this.iconChild = iconChild.toString('base64');
        }
    }
    setAdultIcon(iconAdult) {
        this.iconAdult = iconAdult.toString('base64');
    }
    setChildIcon(iconChild) {
        this.iconChild = iconChild.toString('base64');
    }
}
exports.MMO_SceneGUIPacket = MMO_SceneGUIPacket;
//# sourceMappingURL=MMOPackets.js.map