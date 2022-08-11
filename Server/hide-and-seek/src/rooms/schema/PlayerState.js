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
exports.PlayerState = void 0;
var schema_1 = require("@colyseus/schema");
var Utility_1 = require("../../helpers/Utility");
var PlayerState = /** @class */ (function (_super) {
    __extends(PlayerState, _super);
    function PlayerState(room) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, args) || this;
        _this.id = 'ID';
        // //Position
        // @type('number') xPos: number = 0.0;
        // @type('number') yPos: number = 0.0;
        // @type('number') zPos: number = 0.0;
        // //Interpolation values
        // @type('number') timestamp: number = 0.0;
        _this.username = '';
        _this.xVel = 0.0;
        _this.yVel = 0.0;
        _this.zVel = 0.0;
        _this.roomRef = null;
        _this.xDir = 0;
        _this.yDir = 0;
        _this.zDir = 0;
        _this.roomRef = room;
        return _this;
    }
    PlayerState.prototype.setMovementDirection = function (direction) {
        this.xDir = (0, Utility_1.clamp)(direction[0], -1, 1);
        this.yDir = (0, Utility_1.clamp)(direction[1], -1, 1);
        this.zDir = (0, Utility_1.clamp)(direction[2], -1, 1);
    };
    PlayerState.prototype.update = function (deltaTime) {
        //
        this.calculateVelocityWithDirection(deltaTime);
    };
    PlayerState.prototype.calculateVelocityWithDirection = function (deltaTime) {
        var velocity = [this.xDir, this.yDir, this.zDir];
        velocity[0] *= this.roomRef.movementSpeed * deltaTime;
        velocity[1] *= this.roomRef.movementSpeed * deltaTime;
        velocity[2] *= this.roomRef.movementSpeed * deltaTime;
        // TODO: take the average of velocity readings to get a smoother velocity over time
        this.setVelocity(velocity);
    };
    PlayerState.prototype.setVelocity = function (velocity) {
        this.xVel = velocity[0];
        this.yVel = velocity[1];
        this.zVel = velocity[2];
        // logger.debug(`Player State - Set Velocity: (${velocity[0]}, ${velocity[1]}, ${velocity[2]})`);
    };
    __decorate([
        (0, schema_1.type)('string')
    ], PlayerState.prototype, "id", void 0);
    __decorate([
        (0, schema_1.type)('string')
    ], PlayerState.prototype, "username", void 0);
    __decorate([
        (0, schema_1.type)('number')
    ], PlayerState.prototype, "xVel", void 0);
    __decorate([
        (0, schema_1.type)('number')
    ], PlayerState.prototype, "yVel", void 0);
    __decorate([
        (0, schema_1.type)('number')
    ], PlayerState.prototype, "zVel", void 0);
    return PlayerState;
}(schema_1.Schema));
exports.PlayerState = PlayerState;
//# sourceMappingURL=PlayerState.js.map