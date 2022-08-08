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
/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameas
 *      - Transform nodes
 *
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
var VFXTrigger = /** @class */ (function (_super) {
    __extends(VFXTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function VFXTrigger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    VFXTrigger.prototype.onInitialize = function () {
        // ...
        this.onCollided = this.onCollided.bind(this);
        this.onCollideObservable.add(this.onCollided);
        console.log("VFX Trigger - On Initialize");
    };
    /**
     * Called on the scene starts.
     */
    VFXTrigger.prototype.onStart = function () { };
    /**
     * Called each frame.
     */
    VFXTrigger.prototype.onUpdate = function () {
        // ...
        // this.intersectsMesh();
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    VFXTrigger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    VFXTrigger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    VFXTrigger.prototype.onCollided = function (eventData, eventState) {
        console.log("VFX Trigger - On Collide");
    };
    return VFXTrigger;
}(core_1.Mesh));
exports.default = VFXTrigger;
//# sourceMappingURL=VFXTrigger.js.map