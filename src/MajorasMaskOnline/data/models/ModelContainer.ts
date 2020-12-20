import { Z64Online_ModelAllocation } from "@MajorasMaskOnline/Z64OnlineAPI/Z64OnlineAPI";

export class ModelContainer {
  human: ModelObject = new ModelObject(Buffer.alloc(1));
  equipment: Array<ModelObject> = [];

  setHuman(zobj: Buffer){
    this.human = new ModelObject(zobj);
  }
}

export class ModelObject {
  zobj: Buffer;
  proxy?: Z64Online_ModelAllocation;

  constructor(zobj: Buffer) {
    this.zobj = zobj;
  }
}