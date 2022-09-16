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
var decorators_1 = require("../../decorators");
var interactableTrigger_1 = require("./interactableTrigger");
var ParticlesTrigger = /** @class */ (function (_super) {
    __extends(ParticlesTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function ParticlesTrigger() {
        var _this = this;
        _this._timeout = null;
        return _this;
    }
    ParticlesTrigger.prototype.onInitialized = function () {
        // ...
        _super.prototype.onInitialized.call(this);
    };
    ParticlesTrigger.prototype.registerMeshForIntersection = function (mesh) {
        _super.prototype.registerMeshForIntersection.call(this, mesh);
    };
    __decorate([
        (0, decorators_1.fromChildren)('emitter')
    ], ParticlesTrigger.prototype, "_emitter", void 0);
    return ParticlesTrigger;
}(interactableTrigger_1.default));
exports.default = ParticlesTrigger;
//# sourceMappingURL=particlesTrigger.js.map