import fse from 'fs-extra';

if (!fse.existsSync("./build/src/MajorasMaskOnline/libs")) {
    fse.mkdirSync("./build/src/MajorasMaskOnline/libs");
}
fse.copySync("./libs/Z64Lib", "./build/src/MajorasMaskOnline/libs/Z64Lib", { dereference: true });
try {
    fse.unlinkSync("./build/src/MajorasMaskOnline/libs/Z64Lib/icon.gif");
} catch (err) {
}
try {
    fse.unlinkSync("./build/src/MajorasMaskOnline/libs/Z64Lib/icon.png");
} catch (err) {
}