import { IActor } from '../../Core/MajorasMask/API/IActor'
import { Puppet } from "./Puppet";
import { MajorasMask } from '../../Core/MajorasMask/MajorasMask'
export class HorseData{

    actor: IActor;
    parent: Puppet;
    puppet!: IActor;
    private readonly copyFields: string[] = ["pos", "rot", "anim_id", "speed"];

    constructor(actor: IActor, parent: Puppet, core: MajorasMask){
        this.actor = actor;
        this.parent = parent;
        if (this.parent.hasAttachedHorse()){
            this.puppet = core.actorManager.createIActorFromPointer(this.parent.getAttachedHorse());
        }
    }

    /*get pos(): Buffer{
        return this.actor.pos.getRawPos();
    }

    set pos(buf: Buffer){
        this.puppet.rdramWriteBuffer(0x24, buf);
    }

    get rot(): Buffer{
        return this.actor.rot.getRawRot();
    }

    set rot(buf: Buffer){
        this.puppet.rdramWriteBuffer(0xB4, buf);
    }*/

    get anim_id(): number{
        return this.actor.rdramRead32(0x1a4);
    }

    set anim_id(id: number){
        this.puppet.rdramWrite32(0x214, id);
    }

    get speed(): number{
        return this.actor.rdramRead32(0x1b8);
    }

    set speed(s: number){
        this.puppet.rdramWrite32(0x1a4, s);
    }

    toJSON() {
        const jsonObj: any = {};
    
        for (let i = 0; i < this.copyFields.length; i++) {
          jsonObj[this.copyFields[i]] = (this as any)[this.copyFields[i]];
        }
        //console.log(JSON.stringify(jsonObj, null, 2));
        return jsonObj;
      }

}