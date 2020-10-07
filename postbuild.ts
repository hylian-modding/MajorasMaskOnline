import fse from 'fs-extra';

if (!fse.existsSync("./build/src/MMOnline/libs")) {
    fse.mkdirSync("./build/src/MMOnline/libs");
}
fse.copySync("./libs/Z64Lib", "./build/src/MMOnline/libs/Z64Lib", { dereference: true });
try {
    fse.unlinkSync("./build/src/MMOnline/libs/Z64Lib/icon.gif");
} catch (err) {
}
try {
    fse.unlinkSync("./build/src/MMOnline/libs/Z64Lib/icon.png");
} catch (err) {
}