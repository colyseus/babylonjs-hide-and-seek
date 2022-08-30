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
var gameManager_1 = require("../managers/gameManager");
var CameraHolder = /** @class */ (function (_super) {
    __extends(CameraHolder, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function CameraHolder() {
        var _this = this;
        _this._target = null;
        _this._targetPosition = null;
        _this._chaseSpeed = 1;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    CameraHolder.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    CameraHolder.prototype.onStart = function () {
        // ...
        console.log("Player Camera: %o", this._camera);
        this._camera.layerMask = 1;
    };
    /**
     * Called each frame.
     */
    CameraHolder.prototype.onUpdate = function () {
        if (this._target) {
            this._targetPosition.copyFrom(this._target.position);
        }
        if (!this._targetPosition) {
            return;
        }
        // TODO: rather than just use a straight up lerp, have option to use an easing value to feed the lerp
        this.position.copyFrom(core_1.Vector3.Lerp(this.position, this._targetPosition, gameManager_1.default.DeltaTime * this._chaseSpeed));
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    CameraHolder.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    CameraHolder.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    CameraHolder.prototype.setTarget = function (transform, chaseSpeed) {
        console.log("Camera Holder - Set Target to %o", transform);
        this._target = transform;
        this._chaseSpeed = chaseSpeed;
        this._targetPosition = new core_1.Vector3(transform.position.x, transform.position.y, transform.position.z);
    };
    CameraHolder.prototype.setTargetPosition = function (position, chaseSpeed) {
        this._targetPosition = new core_1.Vector3(position.x, position.y, position.z);
        this._chaseSpeed = chaseSpeed;
        this._target = null;
    };
    __decorate([
        (0, decorators_1.fromChildren)('Player Camera')
    ], CameraHolder.prototype, "_camera", void 0);
    return CameraHolder;
}(core_1.Mesh));
exports.default = CameraHolder;
//# sourceMappingURL=cameraHolder.js.map