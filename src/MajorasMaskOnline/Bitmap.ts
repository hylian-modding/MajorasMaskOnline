// TODO: Probably needs a lot of reworking if it's being used for more than just pictographs

export enum BitDepth {
    BPP_1 = 1,
    BPP_4 = 4,
    BPP_8 = 8,
    BPP_16 = 16,
    BPP_24 = 24,
    BPP_32 = 32
}

export class BMP_Image {

    file: Buffer;

    constructor(width: number, height: number, bitDepth: BitDepth, colorAmt?: number) {
        let colorTableSize = ((): number => {
            if (colorAmt) return colorAmt;
            if (bitDepth <= 8) return Math.pow(2, bitDepth);
            return 0;
        })();
        colorAmt = colorAmt ? colorAmt : 0;
        let pixelSize = ((): number => {
            return Math.ceil(bitDepth / 8);
        })();
        this.file = Buffer.alloc(
            14 +                                            // File Header
            40 +                                            // Image Header
            colorTableSize * 4 +                            // Color Table
            Math.ceil(pixelSize * width / 4) * 4 * height   // Pixel Data size
        );
        this.file.write("BM", "ascii");
        this.file.writeInt32LE(54 + colorTableSize * 4, 10);
        this.file.writeInt32LE(40, 14);
        this.file.writeInt32LE(width, 18);
        this.file.writeInt32LE(-height, 22);
        this.file.writeInt16LE(1, 26);
        this.file.writeInt16LE(bitDepth, 28);
        this.file.writeInt32LE(colorAmt, 46);
        this.fileHeader = new BMP_FileHeader(this.file);
        this.imageHeader = new BMP_ImageHeader(this.file);
        this.colorTable = this.file.slice(54, (colorTableSize * 4) + 54);
        this.pixelData = this.file.slice(this.fileHeader.pixelDataOffset);
    }

    fileHeader: BMP_FileHeader;
    imageHeader: BMP_ImageHeader;
    colorTable: Buffer;
    pixelData: Buffer;

}

class BMP_FileHeader {
    private file: Buffer

    constructor(file: Buffer) {
        this.file = file;
    }

    get type(): string {
        return this.file.toString("ascii", 0, 2);
    }

    get size(): number {
        return this.file.readInt32LE(2);
    }

    get pixelDataOffset(): number {
        return this.file.readInt32LE(10);
    }
}

class BMP_ImageHeader {
    private file: Buffer

    constructor(file: Buffer) {
        this.file = file;
    }

    get headerSize(): number {
        return this.file.readInt32LE(14);
    }

    get width(): number {
        return this.file.readInt32LE(18);
    }

    get height(): number {
        return this.file.readInt32LE(22);
    }

    get bpp(): BitDepth {
        return this.file.readInt16LE(28);
    }

    get colorAmt(): number {
        return this.file.readInt32LE(46);
    }
}