"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColyseusSettings = void 0;
var ColyseusSettings = /** @class */ (function () {
    function ColyseusSettings(address, port, secure) {
        this.colyseusServerAddress = 'localhost';
        this.colyseusServerPort = 2567;
        this.useSecureProtocol = false;
        this.colyseusServerAddress = address;
        this.colyseusServerPort = port;
        this.useSecureProtocol = secure;
    }
    return ColyseusSettings;
}());
exports.ColyseusSettings = ColyseusSettings;
//# sourceMappingURL=colyseusSettings.js.map