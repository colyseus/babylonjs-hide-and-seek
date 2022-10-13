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
var gameManager_1 = require("../managers/gameManager");
var CapturedTrigger = /** @class */ (function (_super) {
    __extends(CapturedTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function CapturedTrigger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    CapturedTrigger.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    CapturedTrigger.prototype.onInitialized = function () {
        // ...
        this.actionManager = new core_1.ActionManager(this.getScene());
    };
    /**
     * Called on the scene starts.
     */
    CapturedTrigger.prototype.onStart = function () {
        // ...
        this.isVisible = false;
        this.setEnabled(true);
    };
    CapturedTrigger.prototype.registerMeshForIntersection = function (mesh) {
        var _this = this;
        var enterAction = new core_1.ExecuteCodeAction({
            trigger: core_1.ActionManager.OnIntersectionEnterTrigger,
            parameter: {
                mesh: mesh,
                usePreciseIntersection: true,
            },
        }, function (event) {
            // console.log(`Captured Trigger - Mesh intersection ENTER %o`, event);
            var localPlayerVisual = event.additionalData.parent;
            // console.log(`Captured Trigger - Player is captured?: ${this._player.isCaptured()}`);
            if (_this._player.isCaptured() && !_this._player.visual.playingCapturedVFX() && localPlayerVisual.player.isLocalPlayer) {
                gameManager_1.default.Instance.rescueCapturedHider(_this._player);
            }
        });
        this.actionManager.registerAction(enterAction);
    };
    CapturedTrigger.prototype.setPlayerReference = function (player) {
        this._player = player;
    };
    /** Size is the radius of the trigger so actual scale of the trigger will be double the size */
    CapturedTrigger.prototype.setTriggerSize = function (size) {
        var scale = size * 2;
        this.scaling = new core_1.Vector3(scale, scale, scale);
    };
    /**
     * Called each frame.
     */
    CapturedTrigger.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    CapturedTrigger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    CapturedTrigger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    return CapturedTrigger;
}(core_1.Mesh));
exports.default = CapturedTrigger;
//# sourceMappingURL=capturedTrigger.js.map