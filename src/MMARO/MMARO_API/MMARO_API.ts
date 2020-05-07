export const enum MMARO_EVENTS{
    CUSTOM_MODEL_APPLIED_CHILD = "MMARO:CUSTOM_MODEL_APPLIED_CHILD"
}

export class MMARO_CHILD_MODEL_EVENT{
    file: string;
    isAdultHeight: boolean;

    constructor(file: string, isAdultHeight = false){
        this.file = file;
        this.isAdultHeight = isAdultHeight;
    }
}