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
var gameManager_1 = require("../managers/gameManager");
var inputManager_1 = require("../managers/inputManager");
var networkManager_1 = require("../managers/networkManager");
var player_1 = require("./player");
var LocalPlayer = /** @class */ (function (_super) {
    __extends(LocalPlayer, _super);
    // private _state: PlayerState = null;
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function LocalPlayer() {
        var _this = this;
        _this._movementSpeed = 1;
        // private _rigidbody: PhysicsImpostor = null;
        _this._xDirection = 0;
        _this._zDirection = 0;
        _this._lastXDirection = 0;
        _this._lastZDirection = 0;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    LocalPlayer.prototype.onInitialize = function () {
        _super.prototype.onInitialize.call(this);
        // ...
    };
    /**
     * Called on the scene starts.
     */
    LocalPlayer.prototype.onStart = function () {
        _super.prototype.onStart.call(this);
        // ...
        // this._rigidbody = this.getPhysicsImpostor();
        console.log("Local Player: %o", this);
    };
    // public setPlayerState(state: PlayerState) {
    // 	console.log(`Player - Set Player State`);
    // 	this._state = state;
    // 	// state.onChange = (changes: any[]) => {
    // 	// 	console.log(`Player State Changed: %o`, changes);
    // 	// };
    // }
    /**
     * Called each frame.
     */
    LocalPlayer.prototype.onUpdate = function () {
        this.updatePlayerMovement();
        _super.prototype.onUpdate.call(this);
    };
    // private updateVelocityFromState() {
    // 	if (!this._state) {
    // 		return;
    // 	}
    // 	this._rigidbody.setLinearVelocity(new Vector3(this._state.xVel, this._state.yVel, this._state.zVel));
    // }
    LocalPlayer.prototype.updatePlayerMovement = function () {
        var direction = new core_1.Vector3();
        // W + -S (1/0 + -1/0)
        this._zDirection = (inputManager_1.default.getKey(87) ? 1 : 0) + (inputManager_1.default.getKey(83) ? -1 : 0);
        // -A + D (-1/0 + 1/0)
        this._xDirection = (inputManager_1.default.getKey(65) ? -1 : 0) + (inputManager_1.default.getKey(68) ? 1 : 0);
        // Prevent the player from moving faster than it should in a diagonal direction
        if (this._zDirection !== 0 && this._xDirection !== 0) {
            this._xDirection *= 0.75;
            this._zDirection *= 0.75;
        }
        direction.x = this._xDirection;
        direction.z = this._zDirection;
        // Only send the direction input if it has changed
        if (this._lastXDirection !== this._xDirection || this._lastZDirection !== this._zDirection) {
            // Send direction update message to the server
            networkManager_1.default.Instance.sendPlayerDirectionInput(direction);
        }
        this._lastXDirection = this._xDirection;
        this._lastZDirection = this._zDirection;
        direction.x *= this._movementSpeed * gameManager_1.default.DeltaTime;
        direction.z *= this._movementSpeed * gameManager_1.default.DeltaTime;
        // this._rigidbody.setLinearVelocity(direction);
        // this._rigidbody.setAngularVelocity(Vector3.Zero());
        // this.position.y = 0.5;
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    LocalPlayer.prototype.onStop = function () {
        // ...
        _super.prototype.onStop.call(this);
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    LocalPlayer.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.visibleInInspector)('number', 'Movement Speed', 1)
    ], LocalPlayer.prototype, "_movementSpeed", void 0);
    return LocalPlayer;
}(player_1.Player));
exports.default = LocalPlayer;
//# sourceMappingURL=localPlayer.js.map