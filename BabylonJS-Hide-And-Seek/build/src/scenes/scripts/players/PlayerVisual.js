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
    };
    PlayerVisual.prototype.setTarget = function (player) {
        this._target = player;
    };
    PlayerVisual.prototype.setLookTargetDirection = function (direction) {
        this._targetLookDirection = direction;
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
            this.lookAt(this.position.add(core_1.Vector3.Normalize(this._targetLookDirection).scale(2)));
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
    return PlayerVisual;
}(core_1.Mesh));
exports.default = PlayerVisual;
//# sourceMappingURL=playerVisual.js.map