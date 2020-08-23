
export function printf(modloader: any): void {
    let numStrings = modloader.emulator.rdramRead8(0x80E00000);
    let i = 0;
    let offset = 1;
    let out: string = "";

    for (i = 0; i < numStrings; i++) {
        let c = ' ';
        let curSize: number = 0;
        while (c !== '0') {
            c = modloader.emulator.rdramRead8(0x80E00000 + offset + curSize).toString(16);
            curSize++;
        }
        out+= modloader.emulator.rdramReadBuffer(0x80E00000 + offset, curSize).toString();
        offset+=curSize;
        curSize = 0;
    }

    if (out != "") modloader.logger.debug(out)

    modloader.emulator.rdramWrite8(0x80E00000, 0);
}

export default printf


