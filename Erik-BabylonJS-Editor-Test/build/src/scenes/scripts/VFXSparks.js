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
var node_1 = require("@babylonjs/core/node");
var decorators_1 = require("../decorators");
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
var VFXSparks = /** @class */ (function (_super) {
    __extends(VFXSparks, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function VFXSparks() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    VFXSparks.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the scene starts.
     */
    VFXSparks.prototype.onStart = function () {
        // ...
        // console.log(`VFX Sparks: %o`, this._particles);
        this.stop();
    };
    /**
     * Called each frame.
     */
    VFXSparks.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    VFXSparks.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    VFXSparks.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    VFXSparks.prototype.play = function () {
        this._particles.start();
    };
    VFXSparks.prototype.stop = function () {
        this._particles.stop();
    };
    __decorate([
        (0, decorators_1.fromParticleSystems)('Sparks')
    ], VFXSparks.prototype, "_particles", void 0);
    return VFXSparks;
}(node_1.Node));
exports.default = VFXSparks;
//# sourceMappingURL=VFXSparks.js.map