"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorseData = void 0;
class HorseData {
    constructor(actor, parent, core) {
        this.copyFields = ["pos", "rot", "anim_id", "speed"];
        this.actor = actor;
        this.parent = parent;
        if (this.parent.hasAttachedHorse()) {
            this.puppet = core.actorManager.createIActorFromPointer(this.parent.getAttachedHorse());
        }
    }
    get pos() {
        return this.actor.position.getRawPos();
    }
    set pos(buf) {
        this.puppet.rdramWriteBuffer(0x24, buf);
    }
    get rot() {
        return this.actor.rotation.getRawRot();
    }
    set rot(buf) {
        this.puppet.rdramWriteBuffer(0xB4, buf);
    }
    get anim_id() {
        return this.actor.rdramRead32(0x1a4);
    }
    set anim_id(id) {
        this.puppet.rdramWrite32(0x214, id);
    }
    get speed() {
        return this.actor.rdramRead32(0x1b8);
    }
    set speed(s) {
        this.puppet.rdramWrite32(0x1a4, s);
    }
    toJSON() {
        const jsonObj = {};
        for (let i = 0; i < this.copyFields.length; i++) {
            jsonObj[this.copyFields[i]] = this[this.copyFields[i]];
        }
        //console.log(JSON.stringify(jsonObj, null, 2));
        return jsonObj;
    }
}
exports.HorseData = HorseData;
//# sourceMappingURL=HorseData.js.map