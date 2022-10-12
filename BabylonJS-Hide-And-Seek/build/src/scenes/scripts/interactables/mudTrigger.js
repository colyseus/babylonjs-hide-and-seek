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
var interactableTrigger_1 = require("./interactableTrigger");
var MudTrigger = /** @class */ (function (_super) {
    __extends(MudTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function MudTrigger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    MudTrigger.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    MudTrigger.prototype.onInitialized = function () {
        // ...
        _super.prototype.onInitialized.call(this);
        this.isPickable = false;
        this.getChildMeshes().forEach(function (mesh) {
            mesh.isPickable = false;
        });
    };
    /**
     * Called on the scene starts.
     */
    MudTrigger.prototype.onStart = function () {
        // ...
        _super.prototype.onStart.call(this);
    };
    MudTrigger.prototype.registerMeshForIntersection = function (mesh) {
        _super.prototype.registerMeshForIntersection.call(this, mesh);
    };
    MudTrigger.prototype.onPlayerEnteredTrigger = function (player) {
        if (player.isCaptured()) {
            return;
        }
        // Turn on mud prints with no run time
        player.visual.toggleMudPrints(true);
    };
    MudTrigger.prototype.onPlayerExitedTrigger = function (player) {
        if (player.isCaptured()) {
            return;
        }
        // Start a runtime for the mud prints so they stop after a time
        player.visual.toggleMudPrints(true, 1500);
    };
    /**
     * Called each frame.
     */
    MudTrigger.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    MudTrigger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    MudTrigger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    return MudTrigger;
}(interactableTrigger_1.default));
exports.default = MudTrigger;
//# sourceMappingURL=mudTrigger.js.map