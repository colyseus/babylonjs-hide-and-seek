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
var core_1 = require("@babylonjs/core");
var decorators_1 = require("../../decorators");
var utility_1 = require("../../utility");
var gameManager_1 = require("../managers/gameManager");
var PlayerVisual = /** @class */ (function (_super) {
    __extends(PlayerVisual, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function PlayerVisual() {
        var _this = this;
        _this._target = null;
        _this._lerpSpeed = 10;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    PlayerVisual.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    PlayerVisual.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    PlayerVisual.prototype.onStart = function () {
        // ...
        this.setEnabled(false);
        this.setCaptured(false);
        this._prevDir = this.forward;
        this._currentDir = this.forward;
    };
    PlayerVisual.prototype.setPlayerReference = function (player) {
        var _a;
        this.player = player;
        (_a = this._capturedTrigger) === null || _a === void 0 ? void 0 : _a.setPlayerReference(player);
    };
    PlayerVisual.prototype.setTriggerSize = function (size) {
        var _a;
        console.log("Player Visual - Set trigger size: ".concat(size));
        (_a = this._capturedTrigger) === null || _a === void 0 ? void 0 : _a.setTriggerSize(size);
    };
    PlayerVisual.prototype.setTarget = function (player) {
        this._target = player;
    };
    PlayerVisual.prototype.setLookTargetDirection = function (direction) {
        this._targetLookDirection = core_1.Vector3.Normalize(direction);
    };
    PlayerVisual.prototype.setPickable = function (isPickable) {
        this.isPickable = isPickable;
        this.getChildMeshes().forEach(function (mesh) {
            mesh.isPickable = isPickable;
        });
    };
    PlayerVisual.prototype.setVisibility = function (visible) {
        var _this = this;
        this.isVisible = visible;
        this.getChildMeshes().forEach(function (mesh) {
            if (mesh === _this._capturedTrigger) {
                return;
            }
            mesh.isVisible = visible;
        });
    };
    PlayerVisual.prototype.setCaptured = function (captured) {
        this._captured.setEnabled(captured);
    };
    PlayerVisual.prototype.registerPlayerMeshForIntersection = function (mesh) {
        this._capturedTrigger.registerMeshForIntersection(mesh);
    };
    /**
     * Called each frame.
     */
    PlayerVisual.prototype.onUpdate = function () {
        // ...
        // Position the visual with its target
        if (this._target) {
            this.setAbsolutePosition(this._target.getAbsolutePosition());
        }
        if (this._targetLookDirection) {
            this.rotateToTargetDirection();
        }
    };
    PlayerVisual.prototype.rotateToTargetDirection = function () {
        // this.setDirection(this._targetLookDirection);
        var angle = utility_1.Vec3.SignedAngle(this.forward, this._targetLookDirection, core_1.Vector3.Up());
        // console.log(`Angle between Forward (${this.forward.x}, ${this.forward.y}, ${this.forward.z}) and Target (${this._targetLookDirection.x}, ${this._targetLookDirection.y}, ${this._targetLookDirection.z}):  %o`, angle);
        var absAngle = Math.abs(angle);
        var turnDirection = 0;
        if (absAngle < 5) {
            this.setDirection(this._targetLookDirection);
        }
        else {
            // If the angle 180 randomize which direction the visual will rotate
            if (absAngle === 180) {
                turnDirection = (0, utility_1.random)(1, 100) < 50 ? -1 : 1;
            }
            else {
                turnDirection = Math.sign(angle);
            }
            this.rotate(core_1.Vector3.Up(), gameManager_1.default.DeltaTime * this._lerpSpeed * turnDirection);
        }
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    PlayerVisual.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    PlayerVisual.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.fromChildren)('Captured')
    ], PlayerVisual.prototype, "_captured", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('RescueMesh')
    ], PlayerVisual.prototype, "rescueMesh", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('CapturedTrigger')
    ], PlayerVisual.prototype, "_capturedTrigger", void 0);
    return PlayerVisual;
}(core_1.Mesh));
exports.default = PlayerVisual;
//# sourceMappingURL=playerVisual.js.map