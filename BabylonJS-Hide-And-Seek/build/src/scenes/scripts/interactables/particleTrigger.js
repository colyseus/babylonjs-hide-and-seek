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
var decorators_1 = require("../../decorators");
var interactableTrigger_1 = require("./interactableTrigger");
var BatsTrigger = /** @class */ (function (_super) {
    __extends(BatsTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function BatsTrigger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    BatsTrigger.prototype.onInitialize = function () {
        // ...
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    BatsTrigger.prototype.onInitialized = function () {
        // ...
        _super.prototype.onInitialized.call(this);
    };
    /**
     * Called on the scene starts.
     */
    BatsTrigger.prototype.onStart = function () {
        // ...
        _super.prototype.onStart.call(this);
        this._bats = this._batsPrefab.clone('bats', {});
        console.log("Bats Prefab: %o", this._batsPrefab);
        console.log("Bats: %o", this._bats);
    };
    BatsTrigger.prototype.registerMeshForIntersection = function (mesh) {
        _super.prototype.registerMeshForIntersection.call(this, mesh);
    };
    BatsTrigger.prototype.onPlayerEnteredTrigger = function (player) {
        if (player.isCaptured()) {
            return;
        }
        // Tell the particle system to play
    };
    /**
     * Called each frame.
     */
    BatsTrigger.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    BatsTrigger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    BatsTrigger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.fromParticleSystems)('bats')
    ], BatsTrigger.prototype, "_batsPrefab", void 0);
    return BatsTrigger;
}(interactableTrigger_1.default));
exports.default = BatsTrigger;
//# sourceMappingURL=particleTrigger.js.map