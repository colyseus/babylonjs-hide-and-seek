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
var node_1 = require("@babylonjs/core/node");
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
var ParticleSystemManager = /** @class */ (function (_super) {
    __extends(ParticleSystemManager, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function ParticleSystemManager() {
        var _this = this;
        return _this;
    }
    Object.defineProperty(ParticleSystemManager, "instance", {
        get: function () {
            return this._instance;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    ParticleSystemManager.prototype.onInitialize = function () {
        // ...
        // console.log(`Particle System Manager - On Initialize: %o`, this);
        ParticleSystemManager._instance = this;
    };
    /**
     * Called on the scene starts.
     */
    ParticleSystemManager.prototype.onStart = function () {
        // ...
    };
    /**
     * Called each frame.
     */
    ParticleSystemManager.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    ParticleSystemManager.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    ParticleSystemManager.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    ParticleSystemManager.registerParticleSystem = function (name, ps) { };
    return ParticleSystemManager;
}(node_1.Node));
exports.default = ParticleSystemManager;
//# sourceMappingURL=ParticleSystemManager.js.map