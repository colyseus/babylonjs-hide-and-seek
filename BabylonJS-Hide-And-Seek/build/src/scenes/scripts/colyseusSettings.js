"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_1 = require("@babylonjs/core/node");
var decorators_1 = require("../decorators");
var ColyseusSettings = /** @class */ (function (_super) {
    __extends(ColyseusSettings, _super);
    function ColyseusSettings() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.colyseusServerAddress = 'localhost';
        _this.colyseusServerPort = 2567;
        _this.useSecureProtocol = false;
        return _this;
    }
    __decorate([
        (0, decorators_1.visibleInInspector)('string', 'Colyseus Server Address', 'localhost')
    ], ColyseusSettings.prototype, "colyseusServerAddress", void 0);
    __decorate([
        (0, decorators_1.visibleInInspector)('number', 'Colyseus Server Port', 2567)
    ], ColyseusSettings.prototype, "colyseusServerPort", void 0);
    __decorate([
        (0, decorators_1.visibleInInspector)('boolean', 'Use Secure Protocol', false)
    ], ColyseusSettings.prototype, "useSecureProtocol", void 0);
    return ColyseusSettings;
}(node_1.Node));
exports.default = ColyseusSettings;
//# sourceMappingURL=colyseusSettings.js.map