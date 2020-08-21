"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFlagChanges = void 0;
function parseFlagChanges(incoming, storage) {
    let arr = {};
    for (let i = 0; i < incoming.byteLength; i++) {
        if (storage[i] === incoming[i] || incoming[i] === 0) {
            continue;
        }
        storage[i] |= incoming[i];
        arr[i] = storage[i];
    }
    return arr;
}
exports.parseFlagChanges = parseFlagChanges;
//# sourceMappingURL=ParseFlagChanges.js.map