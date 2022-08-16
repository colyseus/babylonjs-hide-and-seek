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
var node_1 = require("@babylonjs/core/node");
var InputManager = /** @class */ (function (_super) {
    __extends(InputManager, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function InputManager() {
        var _this = this;
        _this.dsm = null;
        _this._inputSource = null;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    InputManager.prototype.onInitialize = function () {
        // ...
        InputManager._instance = this;
        this.dsm = new core_1.DeviceSourceManager(this.getScene().getEngine());
    };
    /**
     * Called on the scene starts.
     */
    InputManager.prototype.onStart = function () {
        // ...
    };
    /**
     * Called each frame.
     */
    InputManager.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    InputManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    InputManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    InputManager.getKey = function (key) {
        if (!this._instance._inputSource) {
            this._instance._inputSource = this._instance.dsm.getDeviceSource(core_1.DeviceType.Keyboard);
        }
        if (!this._instance._inputSource) {
            return false;
        }
        return this._instance._inputSource.getInput(key) === 1;
    };
    return InputManager;
}(node_1.Node));
exports.default = InputManager;
//# sourceMappingURL=inputManager.js.map