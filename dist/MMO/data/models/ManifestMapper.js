"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestMapper = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class ManifestMapper {
    map(file) {
        let lines = fs_extra_1.default.readFileSync(path_1.default.join(file)).toString().split("\n");
        let start_line = 0;
        let end_line = 0;
        let start_txt = "OBJECT POOL";
        let end_txt = "END";
        for (let i = 0; i < lines.length; i++) {
            console.log(lines[i]);
            if (lines[i].indexOf(start_txt) > -1) {
                start_line = i;
                continue;
            }
            if (lines[i].indexOf(end_txt) > -1 && start_line > 0) {
                end_line = i;
                break;
            }
        }
        let ignore = ["LUT_ZZ_MODLOADER", "MATRIX_SWORD_BACK", "MATRIX_SHIELD_BACK", "MATRIX_ITEM_SHIELD", "MATRIX_SHIELD_MIRROR_BACK", "MATRIX_SHIELD_HERO_BACK", "MATRIX_SWORD_BACK_A", "MATRIX_SWORD_BACK_B"];
        //let offset: number = 0x50d0;
        let offset = 0x5110;
        let def = "";
        let curSize = 0;
        let curMark = "";
        let descriminator = "";
        console.log(start_line);
        console.log(end_line);
        for (let i = start_line; i < end_line; i++) {
            let ig = false;
            for (let j = 0; j < ignore.length; j++) {
                if (lines[i].indexOf(ignore[j]) > -1 && lines[i].indexOf(":") > -1) {
                    ig = true;
                }
            }
            if (ig) {
                continue;
            }
            if (lines[i].indexOf(":") > -1) {
                if (curMark !== "") {
                    def += "const " + curMark + ": number = " + "0x" + (offset).toString(16).toUpperCase() + ";\r\n";
                }
                offset += curSize;
                curSize = 0;
                curMark = descriminator + "" + lines[i].split(":")[0].trim();
                continue;
            }
            else {
                if (lines[i].trim() === "") {
                    continue;
                }
                if (curMark === "") {
                    continue;
                }
                curSize += 0x8;
            }
        }
        def += "const " + curMark + ": number = " + "0x" + (offset).toString(16).toUpperCase() + ";\r\n";
        console.log(def);
    }
}
exports.ManifestMapper = ManifestMapper;
//# sourceMappingURL=ManifestMapper.js.map