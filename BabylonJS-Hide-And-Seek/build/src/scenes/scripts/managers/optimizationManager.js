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
        var meshes = this._borderFence.getChildMeshes();
        // console.log(`Environment Mesh Count: ${environmentMeshes.length}`);
        console.log("Border Fence Mesh Count: ".concat(meshes.length, " %o"), meshes);
        var newMesh = core_1.Mesh.MergeMeshes(meshes, true, true);
        var settings = [];
        settings.push(new core_1.SimplificationSettings(0.8, 60));
        settings.push(new core_1.SimplificationSettings(0.4, 150));
        newMesh.simplify(settings);
        console.log("Combined Mesh: %o", newMesh);
        // meshes.forEach((mesh: AbstractMesh) => {
        // 	mesh.freezeWorldMatrix();
        // 	mesh.doNotSyncBoundingInfo = true;
        // });
        console.log("Skip Pointer Move Picking");
        this._scene.skipPointerMovePicking = true;
        // this._scene.autoClear = false; // Color buffer
        // this._scene.autoClearDepthAndStencil = false; // Depth and stencil
        // this._scene.freezeActiveMeshes(); // a bunch of meshes don't render
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
    __decorate([
        (0, decorators_1.fromScene)('Environment')
    ], OptimizationManager.prototype, "_environment", void 0);
    __decorate([
        (0, decorators_1.fromScene)('Border Fence')
    ], OptimizationManager.prototype, "_borderFence", void 0);
    return OptimizationManager;
}(core_1.TransformNode));
exports.default = OptimizationManager;
//# sourceMappingURL=optimizationManager.js.map