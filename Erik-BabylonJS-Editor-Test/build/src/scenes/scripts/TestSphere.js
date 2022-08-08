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
var TestSphere = /** @class */ (function (_super) {
    __extends(TestSphere, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function TestSphere() {
        var _this = this;
        _this._forceMultipler = 1;
        _this.dsm = null;
        _this._inputSource = null;
        _this._rigidbody = null;
        return _this;
    }
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    TestSphere.prototype.onInitialize = function () {
        // ...
        this.dsm = new core_1.DeviceSourceManager(this.getScene().getEngine());
    };
    /**
     * Called on the scene starts.
     */
    TestSphere.prototype.onStart = function () {
        // ...
        this._rigidbody = this.getPhysicsImpostor();
        // console.log(`Rigidbody: %o`, this._rigidbody);
    };
    /**
     * Called each frame.
     */
    TestSphere.prototype.onUpdate = function () {
        // ...
        if (!this._inputSource) {
            this._inputSource = this.dsm.getDeviceSource(core_1.DeviceType.Keyboard);
        }
        var force = new core_1.Vector3();
        var z = 0;
        var x = 0;
        if (this._inputSource) {
            // W + -S (1/0 + -1/0)
            z = this._inputSource.getInput(87) + -this._inputSource.getInput(83);
            // -A + D (-1/0 + 1/0)
            x = -this._inputSource.getInput(65) + this._inputSource.getInput(68);
            // console.log(`Z: ${z}  X: ${x}`);
        }
        // Move sphere via transform position
        // this.transform.position = new BABYLON.Vector3(this.transform.position.x + x * this.getDeltaSeconds(), this.transform.position.y, this.transform.position.z + z * this.getDeltaSeconds());
        force.x = x * this._forceMultipler;
        force.z = z * this._forceMultipler;
        // console.log(`Force: (${force.x}, 0, ${force.z})`);
        this._rigidbody.applyForce(force, this.position);
    };
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    TestSphere.prototype.onStop = function () {
        // ...
    };
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    TestSphere.prototype.onMessage = function (name, data, sender) {
        switch (name) {
            case 'myMessage':
                // Do something...
                break;
        }
    };
    __decorate([
        (0, decorators_1.visibleInInspector)('number', 'Force Multiplier', 1)
    ], TestSphere.prototype, "_forceMultipler", void 0);
    return TestSphere;
}(core_1.Mesh));
exports.default = TestSphere;
//# sourceMappingURL=TestSphere.js.map