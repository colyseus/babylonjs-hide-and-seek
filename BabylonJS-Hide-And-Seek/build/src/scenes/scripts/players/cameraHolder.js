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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var CameraHolder = /** @class */ (function (_super) {
    __extends(CameraHolder, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function CameraHolder() {
        var _this = this;
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
        // console.log(`Camera Holder Target: %o`, this._target);
    };
    /**
     * Called each frame.
     */
    CameraHolder.prototype.onUpdate = function () {
        // ...
        // this.lookAt(Vector3.Forward(), 0, 0, 0, Space.WORLD);
        if (!this._target) {
            return;
        }
        this.position = this._target.position;
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
    CameraHolder.prototype.setTarget = function (mesh) {
        console.log("Camera Holder - Set Target to %o", mesh);
        this._target = mesh;
    };
    return CameraHolder;
}(core_1.Mesh));
exports.default = CameraHolder;
//# sourceMappingURL=cameraHolder.js.map