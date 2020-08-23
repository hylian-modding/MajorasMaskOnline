import IMemory from 'modloader64_api/IMemory';
import * as API from '../API/Imports';
import { FlagManager, Flag } from 'modloader64_api/FlagManager';
import { JSONTemplate } from 'modloader64_api/JSONTemplate';

export class QuestStatus extends JSONTemplate implements API.IQuestStatus {
  private emulator: IMemory;
  private instance: number = global.ModLoader.save_context;
  private questFlags: FlagManager;
  private skulltulaAddr: number = this.instance + 0x00d0;
  private questFlagsAddr: number = this.instance + 0x00a4;
  jsonFields: string[] = [
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
  constructor(emu: IMemory) {
      super();
      this.emulator = emu;
      this.questFlags = new FlagManager(emu, this.questFlagsAddr);
  }

  //TODO: ADJUST FOR MM FLAGS

  private odolwaRemainsFlag = new Flag(1, 1);
  get odolwaRemains(): boolean {
      return this.questFlags.isFlagSet(this.odolwaRemainsFlag);
  }
  set odolwaRemains(bool: boolean) {
      this.questFlags.setFlag(this.odolwaRemainsFlag, bool);
  }
  private gohtRemainsFlag = new Flag(1, 2);
  get gohtRemains(): boolean {
      return this.questFlags.isFlagSet(this.gohtRemainsFlag);
  }
  set gohtRemains(bool: boolean) {
      this.questFlags.setFlag(this.gohtRemainsFlag, bool);
  }
  private gyorgRemainsFlag = new Flag(1, 0);
  get gyorgRemains(): boolean {
      return this.questFlags.isFlagSet(this.gyorgRemainsFlag);
  }
  set gyorgRemains(bool: boolean) {
      this.questFlags.setFlag(this.gyorgRemainsFlag, bool);
  }
  private twinmoldRemainsFlag = new Flag(1, 0);
  get twinmoldRemains(): boolean {
        return this.questFlags.isFlagSet(this.twinmoldRemainsFlag);
  }
  set twinmoldRemains(bool: boolean) {
    this.questFlags.setFlag(this.twinmoldRemainsFlag, bool);
  }
  get heartPieces(): number {
      return this.emulator.rdramRead8(this.questFlagsAddr) / 0x10;
  }
  set heartPieces(count: number) {
      let pieces: number = count * 0x10;
      this.emulator.rdramWrite8(this.questFlagsAddr, pieces);
  }
  private songOfTimeFlag = new Flag(2, 3);
  get songOfTime(): boolean {
      return this.questFlags.isFlagSet(this.songOfTimeFlag);
  }
  set songOfTime(bool: boolean) {
      this.questFlags.setFlag(this.songOfTimeFlag, bool);
  }
  private eponaSongFlag = new Flag(2, 2);
  get eponaSong(): boolean {
      return this.questFlags.isFlagSet(this.eponaSongFlag);
  }
  set eponaSong(bool: boolean) {
      this.questFlags.setFlag(this.eponaSongFlag, bool);
  }
  private songOfHealingFlag = new Flag(2, 1);
  get songOfHealing(): boolean {
      return this.questFlags.isFlagSet(this.songOfHealingFlag);
  }
  set songOfHealing(bool: boolean) {
      this.questFlags.setFlag(this.songOfHealingFlag, bool);
  }
  private songOfSoaringFlag = new Flag(2, 0);
  get songOfSoaring(): boolean {
      return this.questFlags.isFlagSet(this.songOfSoaringFlag);
  }
  set songOfSoaring(bool: boolean) {
      this.questFlags.setFlag(this.songOfSoaringFlag, bool);
  }
  private songOfStormsFlag = new Flag(1, 6);
  get songOfStorms(): boolean {
      return this.questFlags.isFlagSet(this.songOfStormsFlag);
  }
  set songOfStorms(bool: boolean) {
      this.questFlags.setFlag(this.songOfStormsFlag, bool);
  }
  private sonataOfAwakeningFlag = new Flag(2, 4);
  get sonataOfAwakening(): boolean {
      return this.questFlags.isFlagSet(this.sonataOfAwakeningFlag);
  }
  set sonataOfAwakening(bool: boolean) {
      this.questFlags.setFlag(this.sonataOfAwakeningFlag, bool);
  }
  private goronLullabyFlag = new Flag(3, 1);
  get goronLullaby(): boolean {
      return this.questFlags.isFlagSet(this.goronLullabyFlag);
  }
  set goronLullaby(bool: boolean) {
      this.questFlags.setFlag(this.goronLullabyFlag, bool);
  }
  private newWaveBossaNovaFlag = new Flag(3, 0);
  get newWaveBossaNova(): boolean {
      return this.questFlags.isFlagSet(this.newWaveBossaNovaFlag);
  }
  set newWaveBossaNova(bool: boolean) {
      this.questFlags.setFlag(this.newWaveBossaNovaFlag, bool);
  }
  private serenadeOfWaterFlag = new Flag(2, 7);
  get serenadeOfWater(): boolean {
      return this.questFlags.isFlagSet(this.serenadeOfWaterFlag);
  }
  set serenadeOfWater(bool: boolean) {
      this.questFlags.setFlag(this.serenadeOfWaterFlag, bool);
  }
  private elegyOfEmptinessFlag = new Flag(2, 5);
  get elegyOfEmptiness(): boolean {
      return this.questFlags.isFlagSet(this.elegyOfEmptinessFlag);
  }
  set elegyOfEmptiness(bool: boolean) {
      this.questFlags.setFlag(this.elegyOfEmptinessFlag, bool);
  }
  private oathToOrderFlag = new Flag(2, 6);
  get oathToOrder(): boolean {
      return this.questFlags.isFlagSet(this.oathToOrderFlag);
  }
  set oathToOrder(bool: boolean) {
      this.questFlags.setFlag(this.oathToOrderFlag, bool);
  }
  private bombersNotebookFlag = new Flag(3, 2);
  get bombersNotebook(): boolean {
      return this.questFlags.isFlagSet(this.bombersNotebookFlag);
  }
  set bombersNotebook(bool: boolean) {
      this.questFlags.setFlag(this.bombersNotebookFlag, bool);
  }
}
