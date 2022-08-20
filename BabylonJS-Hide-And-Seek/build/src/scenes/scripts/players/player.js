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
var PlayerInputMessage_1 = require("../../../../../Server/hide-and-seek/src/models/PlayerInputMessage");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function Player() {
        var _this = this;
        _this._movementSpeed = 1;
        _this.isLocalPlayer = false;
        _this._rigidbody = null;
        _this._xDirection = 0;
        _this._zDirection = 0;
        _this._previousMovements = null;
        _this._state = null;
        _this._lineOptions = null;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    Player.prototype.onInitialize = function () {
        // ...
        this._previousMovements = [];
    };
    /**
     * Called on the scene starts.
     */
    Player.prototype.onStart = function () {
        // ...
        this._rigidbody = this.getPhysicsImpostor();
        // Workaround to the inspector failing to load the "visibleInInspector" tagged properties
        this.isLocalPlayer = !this.name.includes('Remote Player') ? true : false;
        this._lastPosition = this.position;
        this._physics = this.getScene()._physicsEngine;
        if (this.isLocalPlayer) {
            console.log("Player Visual: %o", this._visual);
        }
        if (this._visual) {
            this._visual.setTarget(this);
            this._visual.setParent(null);
        }
        if (this.isLocalPlayer) {
            this._lineOptions = {
                points: [this.position, this.position],
                colors: [new core_1.Color4(0, 0, 1), new core_1.Color4(0, 0, 1)],
                updatable: true,
                instance: null,
            };
            var lines = core_1.MeshBuilder.CreateLines('lines', this._lineOptions, core_1.UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene);
            this._lineOptions.instance = lines;
        }
    };
    Player.prototype.toggleEnabled = function (enabled) {
        var _a;
        this.setEnabled(enabled);
        (_a = this._visual) === null || _a === void 0 ? void 0 : _a.setEnabled(enabled);
    };
    Player.prototype.setPlayerState = function (state) {
        console.log("Player - Set Player State");
        this._state = state;
    };
    Player.prototype.setBodyRotation = function (rot) { };
    /**
     * Called each frame.
     */
    Player.prototype.onUpdate = function () {
        if (!this.isEnabled(false)) {
            return;
        }
        // console.log(`Player Rotation: %o`, this.rotation);
        this.updatePlayerMovement();
        this.updatePositionFromState();
        this.updateOrientation();
        // Seeker detection of Hider players
        if (this._state.isSeeker) {
            this.checkForHiders();
        }
        if (this.isLocalPlayer) {
            this.updateDebugLines();
        }
    };
    Player.prototype.setVelocity = function (vel) {
        this._rigidbody.setLinearVelocity(vel);
        this._visual.setLookTargetDirection(vel);
    };
    Player.prototype.updatePlayerMovement = function () {
        if (!this.isLocalPlayer || !this._state.canMove) {
            if (this._rigidbody.getLinearVelocity().length() > 0) {
                this._rigidbody.setLinearVelocity(core_1.Vector3.Zero());
            }
            return;
        }
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
        direction.x *= this._movementSpeed * gameManager_1.default.DeltaTime;
        direction.z *= this._movementSpeed * gameManager_1.default.DeltaTime;
        this.setVelocity(direction);
        this._rigidbody.setAngularVelocity(core_1.Vector3.Zero());
        this.position.y = 0.5;
        if (!this.position.equals(this._lastPosition)) {
            this._lastPosition.copyFrom(this.position);
            // Position has changed; send position to the server
            this.sendPositionUpdateToServer();
        }
    };
    Player.prototype.updatePositionFromState = function () {
        if (!this._state) {
            return;
        }
        // Remove up to and out of date movements from the collection//
        for (var i = this._previousMovements.length - 1; i >= 0; i--) {
            var timestamp = this._previousMovements[i].timestamp;
            if (timestamp <= this._state.positionTimestamp || Date.now() - timestamp > 200) {
                this._previousMovements.splice(i, 1);
            }
        }
        if (this.isLocalPlayer) {
            // Update from the state received from the server if we don't have any other previous movements
            if (this._previousMovements.length === 0) {
                this.position.copyFrom(new core_1.Vector3(this._state.xPos, 0.5, this._state.zPos));
            }
        }
        else {
            // Lerp the remote player object to their position
            this.position.copyFrom(core_1.Vector3.Lerp(this.position, new core_1.Vector3(this._state.xPos, 0.5, this._state.zPos), gameManager_1.default.DeltaTime * 35));
        }
    };
    Player.prototype.updateOrientation = function () { };
    Player.prototype.sendPositionUpdateToServer = function () {
        var inputMsg = new PlayerInputMessage_1.PlayerInputMessage([this.position.x, 0.5, this.position.z]);
        this._previousMovements.push(inputMsg);
        networkManager_1.default.Instance.sendPlayerPosition(inputMsg);
    };
    Player.prototype.checkForHiders = function () {
        // When all nearby Hiders have been collected we can do a raycast check from the Seeker to each of the Hiders to determine if they are within line of sight
        // Send a message to the server with the Ids of all the Hiders that are within line of sight.
        var _this = this;
        var hiders = gameManager_1.default.Instance.getOverlappingHiders();
        if (hiders && hiders.length > 0) {
            hiders.forEach(function (hider) {
                // console.log(`Hider: %o`, hider);
                _this._physics.raycast(_this.position, _this.forward.scale(100));
            });
        }
    };
    Player.prototype.updateDebugLines = function () {
        this._lineOptions.points[0] = this.position;
        this._lineOptions.points[1] = this.position.add(this.forward.scale(2));
        core_1.MeshBuilder.CreateLines('lines', this._lineOptions, core_1.UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene);
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    Player.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    Player.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.visibleInInspector)('number', 'Movement Speed', 1)
    ], Player.prototype, "_movementSpeed", void 0);
    __decorate([
        (0, decorators_1.fromChildren)('PlayerBody')
    ], Player.prototype, "_visual", void 0);
    return Player;
}(core_1.Mesh));
exports.default = Player;
//# sourceMappingURL=player.js.map