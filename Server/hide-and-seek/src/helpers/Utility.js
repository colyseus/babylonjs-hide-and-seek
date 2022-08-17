"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = exports.clamp = void 0;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
function random(min, max) {
    return Math.floor(Math.random() * max + min);
}
exports.random = random;
//# sourceMappingURL=Utility.js.map