"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestStatus = void 0;
const FlagManager_1 = require("modloader64_api/FlagManager");
const JSONTemplate_1 = require("modloader64_api/JSONTemplate");
class QuestStatus extends JSONTemplate_1.JSONTemplate {
    constructor(emu) {
        super();
        this.instance = global.ModLoader.save_context;
        this.skulltulaAddr = this.instance + 0x00d0;
        this.questFlagsAddr = this.instance + 0x00a4;
        this.jsonFields = [
            'odolwaRemains',
            'gohtRemains',
            'gyorgRemains',
            'twinmoldRemains',
            'songOfTime',
            'songOfHealing',
            'eponaSong',
            'songOfSoaring',
            'songOfStorms',
            'sonataOfAwakening',
            'goronLullaby',
            'newWaveBossaNova',
            'elegyOfEmptiness',
            'oathToOrder',
            'bombersNotebook',
            'heartPieces'
        ];
        //TODO: ADJUST FOR MM FLAGS
        this.odolwaRemainsFlag = new FlagManager_1.Flag(1, 1);
        this.gohtRemainsFlag = new FlagManager_1.Flag(1, 2);
        this.gyorgRemainsFlag = new FlagManager_1.Flag(1, 0);
        this.twinmoldRemainsFlag = new FlagManager_1.Flag(1, 0);
        this.songOfTimeFlag = new FlagManager_1.Flag(2, 3);
        this.eponaSongFlag = new FlagManager_1.Flag(2, 2);
        this.songOfHealingFlag = new FlagManager_1.Flag(2, 1);
        this.songOfSoaringFlag = new FlagManager_1.Flag(2, 0);
        this.songOfStormsFlag = new FlagManager_1.Flag(1, 6);
        this.sonataOfAwakeningFlag = new FlagManager_1.Flag(2, 4);
        this.goronLullabyFlag = new FlagManager_1.Flag(3, 1);
        this.newWaveBossaNovaFlag = new FlagManager_1.Flag(3, 0);
        this.serenadeOfWaterFlag = new FlagManager_1.Flag(2, 7);
        this.elegyOfEmptinessFlag = new FlagManager_1.Flag(2, 5);
        this.oathToOrderFlag = new FlagManager_1.Flag(2, 6);
        this.bombersNotebookFlag = new FlagManager_1.Flag(3, 2);
        this.emulator = emu;
        this.questFlags = new FlagManager_1.FlagManager(emu, this.questFlagsAddr);
    }
    get odolwaRemains() {
        return this.questFlags.isFlagSet(this.odolwaRemainsFlag);
    }
    set odolwaRemains(bool) {
        this.questFlags.setFlag(this.odolwaRemainsFlag, bool);
    }
    get gohtRemains() {
        return this.questFlags.isFlagSet(this.gohtRemainsFlag);
    }
    set gohtRemains(bool) {
        this.questFlags.setFlag(this.gohtRemainsFlag, bool);
    }
    get gyorgRemains() {
        return this.questFlags.isFlagSet(this.gyorgRemainsFlag);
    }
    set gyorgRemains(bool) {
        this.questFlags.setFlag(this.gyorgRemainsFlag, bool);
    }
    get twinmoldRemains() {
        return this.questFlags.isFlagSet(this.twinmoldRemainsFlag);
    }
    set twinmoldRemains(bool) {
        this.questFlags.setFlag(this.twinmoldRemainsFlag, bool);
    }
    get heartPieces() {
        return this.emulator.rdramRead8(this.questFlagsAddr) / 0x10;
    }
    set heartPieces(count) {
        let pieces = count * 0x10;
        this.emulator.rdramWrite8(this.questFlagsAddr, pieces);
    }
    get songOfTime() {
        return this.questFlags.isFlagSet(this.songOfTimeFlag);
    }
    set songOfTime(bool) {
        this.questFlags.setFlag(this.songOfTimeFlag, bool);
    }
    get eponaSong() {
        return this.questFlags.isFlagSet(this.eponaSongFlag);
    }
    set eponaSong(bool) {
        this.questFlags.setFlag(this.eponaSongFlag, bool);
    }
    get songOfHealing() {
        return this.questFlags.isFlagSet(this.songOfHealingFlag);
    }
    set songOfHealing(bool) {
        this.questFlags.setFlag(this.songOfHealingFlag, bool);
    }
    get songOfSoaring() {
        return this.questFlags.isFlagSet(this.songOfSoaringFlag);
    }
    set songOfSoaring(bool) {
        this.questFlags.setFlag(this.songOfSoaringFlag, bool);
    }
    get songOfStorms() {
        return this.questFlags.isFlagSet(this.songOfStormsFlag);
    }
    set songOfStorms(bool) {
        this.questFlags.setFlag(this.songOfStormsFlag, bool);
    }
    get sonataOfAwakening() {
        return this.questFlags.isFlagSet(this.sonataOfAwakeningFlag);
    }
    set sonataOfAwakening(bool) {
        this.questFlags.setFlag(this.sonataOfAwakeningFlag, bool);
    }
    get goronLullaby() {
        return this.questFlags.isFlagSet(this.goronLullabyFlag);
    }
    set goronLullaby(bool) {
        this.questFlags.setFlag(this.goronLullabyFlag, bool);
    }
    get newWaveBossaNova() {
        return this.questFlags.isFlagSet(this.newWaveBossaNovaFlag);
    }
    set newWaveBossaNova(bool) {
        this.questFlags.setFlag(this.newWaveBossaNovaFlag, bool);
    }
    get serenadeOfWater() {
        return this.questFlags.isFlagSet(this.serenadeOfWaterFlag);
    }
    set serenadeOfWater(bool) {
        this.questFlags.setFlag(this.serenadeOfWaterFlag, bool);
    }
    get elegyOfEmptiness() {
        return this.questFlags.isFlagSet(this.elegyOfEmptinessFlag);
    }
    set elegyOfEmptiness(bool) {
        this.questFlags.setFlag(this.elegyOfEmptinessFlag, bool);
    }
    get oathToOrder() {
        return this.questFlags.isFlagSet(this.oathToOrderFlag);
    }
    set oathToOrder(bool) {
        this.questFlags.setFlag(this.oathToOrderFlag, bool);
    }
    get bombersNotebook() {
        return this.questFlags.isFlagSet(this.bombersNotebookFlag);
    }
    set bombersNotebook(bool) {
        this.questFlags.setFlag(this.bombersNotebookFlag, bool);
    }
}
exports.QuestStatus = QuestStatus;
//# sourceMappingURL=QuestStatus.js.map