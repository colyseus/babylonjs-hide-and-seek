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
exports.HASRoom = void 0;
var colyseus_1 = require("colyseus");
var HASRoomState_1 = require("./schema/HASRoomState");
var HASRoom = /** @class */ (function (_super) {
    __extends(HASRoom, _super);
    function HASRoom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HASRoom.prototype.onCreate = function (options) {
        this.setState(new HASRoomState_1.HASRoomState());
        this.onMessage('type', function (client, message) {
            //
            // handle "type" message
            //
        });
    };
    HASRoom.prototype.onJoin = function (client, options) {
        console.log(client.sessionId, 'joined!');
    };
    HASRoom.prototype.onLeave = function (client, consented) {
        console.log(client.sessionId, 'left!');
    };
    HASRoom.prototype.onDispose = function () {
        console.log('room', this.roomId, 'disposing...');
    };
    return HASRoom;
}(colyseus_1.Room));
exports.HASRoom = HASRoom;
//# sourceMappingURL=HASRoom.js.map