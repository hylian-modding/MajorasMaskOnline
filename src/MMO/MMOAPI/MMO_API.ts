export const enum MMO_EVENTS{
    CUSTOM_MODEL_APPLIED_CHILD = "MMO:CUSTOM_MODEL_APPLIED_CHILD"
}

export class MMO_CHILD_MODEL_EVENT{
    file: string;
    isAdultHeight: boolean;

    constructor(file: string, isAdultHeight = false){
        this.file = file;
        this.isAdultHeight = isAdultHeight;
    }
}