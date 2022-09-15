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
var InteractableTrigger = /** @class */ (function (_super) {
    __extends(InteractableTrigger, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function InteractableTrigger() {
        var _this = this;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    InteractableTrigger.prototype.onInitialize = function () {
        // ...
        this.onPlayerEnteredTrigger = this.onPlayerEnteredTrigger.bind(this);
        this.onPlayerExitedTrigger = this.onPlayerExitedTrigger.bind(this);
    };
    /**
     * Called on the node has been fully initialized and is ready.
     */
    InteractableTrigger.prototype.onInitialized = function () {
        // ...
        this.actionManager = new core_1.ActionManager(this.getScene());
    };
    /**
     * Called on the scene starts.
     */
    InteractableTrigger.prototype.onStart = function () {
        // ...
        gameManager_1.default.Instance.registerInteractable(this);
    };
    InteractableTrigger.prototype.registerMeshForIntersection = function (mesh) {
        var _this = this;
        var enterAction = new core_1.ExecuteCodeAction({
            trigger: core_1.ActionManager.OnIntersectionEnterTrigger,
            parameter: {
                mesh: mesh,
                usePreciseIntersection: true,
            },
        }, function (event) {
            var playerVisual = event.additionalData;
            var player = playerVisual.player;
            _this.onPlayerEnteredTrigger(player);
        });
        var exitAction = new core_1.ExecuteCodeAction({
            trigger: core_1.ActionManager.OnIntersectionExitTrigger,
            parameter: {
                mesh: mesh,
                usePreciseIntersection: true,
            },
        }, function (event) {
            var playerVisual = event.additionalData;
            var player = playerVisual.player;
            if (_this.onPlayerExitedTrigger) {
                _this.onPlayerExitedTrigger(player);
            }
        });
        this.actionManager.registerAction(enterAction);
        this.actionManager.registerAction(exitAction);
    };
    InteractableTrigger.prototype.onPlayerEnteredTrigger = function (player) { };
    InteractableTrigger.prototype.onPlayerExitedTrigger = function (player) { };
    /**
     * Called each frame.
     */
    InteractableTrigger.prototype.onUpdate = function () {
        // ...
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    InteractableTrigger.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    InteractableTrigger.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    return InteractableTrigger;
}(core_1.Mesh));
exports.default = InteractableTrigger;
//# sourceMappingURL=interactableTrigger.js.map