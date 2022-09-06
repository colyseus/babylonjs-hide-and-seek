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
var OptimizationManager = /** @class */ (function (_super) {
    __extends(OptimizationManager, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function OptimizationManager() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    OptimizationManager.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    OptimizationManager.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    OptimizationManager.prototype.onStart = function () {
        // ...
        // this.getScene().getMeshesByTags();
        var allMeshes = this._scene.meshes;
        allMeshes.forEach(function (mesh) {
            mesh.freezeWorldMatrix();
            mesh.doNotSyncBoundingInfo = true;
        });
        this._scene.freeActiveMeshes();
    };
    /**
     * Called each frame.
     */
    OptimizationManager.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    OptimizationManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    OptimizationManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    return OptimizationManager;
}(core_1.TransformNode));
exports.default = OptimizationManager;
//# sourceMappingURL=optimizationManager.js.map