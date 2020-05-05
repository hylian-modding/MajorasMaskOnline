import Vector3 from 'modloader64_api/math/Vector3';
import IMemory from 'modloader64_api/IMemory';

//TODO: Is this the same?
export const enum ActorCategory {
    SWITCH,
    BACKGROUNDS,
    PLAYER,
    BOMB,
    NPC,
    ENEMY,
    PROP_2,
    ITEM_ACTION,
    MISC,
    BOSS,
    DOOR,
    CHEST,
}

export interface IActor extends IMemory {
    actorUUID: string;
    actorID: number;                /*0x0000 : s16      */
    actorType: ActorCategory;       /*0x0002 : u8       */
    room: number;                   /*0x0003 : u8       */
    flags: number;                  /*0x0004 : u32      */
    posInit: Vector3;               /*0x0008 : v3       */
    rotInit: Vector3;               /*0x0014 : v3s      */
    variable: number;               /*0x001C : u16      */
    objectTableIndex: number;       /*0x001E : u8       */
    targetDistanceIndex: number;    /*0x001F : u8       */
    soundEffect: number;            /*0x0020 : u16      */
    pos: Vector3;                   /*0x0024 : v3       */
    dir: Vector3;                   /*0x0032 : v3s      */
    posTatl: Vector3;               /*0x003C : v3       */
    rot_1: Vector3;                 /*0x0048 : v3s      */
    scale: Vector3;                 /*0x0058 : v3       */
    vel: Vector3;                   /*0x0064 : v3       */
    xzSpeed: number;                /*0x0070 : float    */
    gravity: number;                /*0x0074 : float    */
    minVelY: number;                /*0x0078 : float    */
    wallPolyPtr: number;            /*0x007C : u32      */
    floorPolyPtr: number;           /*0x0080 : u32      */
    wallRot: number;                /*0x0084 : s16      */
    floorHeight: number;            /*0x0088 : float    */
    waterSurfaceDist: number;       /*0x008C : float    */
    bgcheckFlags: number;           /*0x0090 : u16      */
    rotTowardLinkY: number;         /*0x0092 : s16      */
    distFromLinkXZ: number;         /*0x0098 : float    */
    distFromLinkY: number;          /*0x009C : float    */
    damageTable: number;            /*0x00A0 : u32      */
    vel_2: Vector3;                 /*0x00A4 : v3       */
    mass: number;                   /*0x00B6 : u8       */
    health: number;                 /*0x00B7 : u8       */
    damage: number;                 /*0x00B8 : u8       */
    damageEffect: number;           /*0x00B9 : u8       */
    impactEffect: number;           /*0x00BA : u8       */
    rot: Vector3;                   /*0x00BC : v3s      */
    drawDropShadowPtr: number;      /*0x00C8 : u32      */
    shadowRadius: number;           /*0x00CC : float    */
    drawDistance: number;           /*0x00FC : float    */
    cameraClipNear: number;         /*0x0100 : float    */
    cameraClipFar: number;          /*0x0104 : float    */
    pos_4: Vector3;                 /*0x0108 : v3       */

    destroy(): void;
    exists: boolean;
}



//TODO: Is this the same?
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
    Z_TARGETING
}
  
//TODO: Is this the same? (I don't think so)
export const enum LinkState2 {
    UNKNOWN,
    IDLE,
    CRAWLSPACE,
    MOVING_FORWARD
}

export interface ILink extends IActor {
    state: LinkState;
    state2: LinkState2;
    isInterfaceShown(): boolean;  //TODO: Implement
}



