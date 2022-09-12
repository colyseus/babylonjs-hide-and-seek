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
var MeshMerger = /** @class */ (function (_super) {
    __extends(MeshMerger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function MeshMerger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    MeshMerger.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    MeshMerger.prototype.onInitialized = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    MeshMerger.prototype.onStart = function () {
        // ...
        var meshes = this.getChildMeshes();
        // Attempt to combine meshes allow32bit set to false
        this.combineMeshes(meshes, false);
        if (!meshes) {
            // Attempt to combine meshes allow32bit set to true
            this.combineMeshes(meshes, true);
        }
    };
    MeshMerger.prototype.combineMeshes = function (meshes, allow32Bit) {
        var _a;
        var newMesh = core_1.Mesh.MergeMeshes(meshes, true, allow32Bit);
        if (!newMesh) {
            console.error("Failed to combine mesh for ".concat(this.name, " - ").concat(((_a = this.parent) === null || _a === void 0 ? void 0 : _a.name) || 'no parent'));
        }
    };
    /**
     * Called each frame.
     */
    MeshMerger.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    MeshMerger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    MeshMerger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    return MeshMerger;
}(core_1.TransformNode));
exports.default = MeshMerger;
//# sourceMappingURL=meshMerger.js.map