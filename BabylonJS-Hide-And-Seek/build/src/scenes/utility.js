"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quat = exports.Vec3 = void 0;
var core_1 = require("@babylonjs/core");
var Vec3 = /** @class */ (function () {
    function Vec3() {
    }
    Vec3.MoveTowards = function (current, target, maxDistanceDelta) {
        var toVector_x = target.x - current.x;
        var toVector_y = target.y - current.y;
        var toVector_z = target.z - current.z;
        var sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
        if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta))
            return target;
        var dist = Math.sqrt(sqdist);
        return new core_1.Vector3(current.x + (toVector_x / dist) * maxDistanceDelta, current.y + (toVector_y / dist) * maxDistanceDelta, current.z + (toVector_z / dist) * maxDistanceDelta);
    };
    return Vec3;
}());
exports.Vec3 = Vec3;
var Quat = /** @class */ (function () {
    function Quat() {
    }
    Quat.LookRotation = function (forward, up) {
        var vector = core_1.Vector3.Normalize(forward);
        var vector2 = core_1.Vector3.Normalize(core_1.Vector3.Cross(up, vector));
        var vector3 = core_1.Vector3.Cross(vector, vector2);
        var m00 = vector2.x;
        var m01 = vector2.y;
        var m02 = vector2.z;
        var m10 = vector3.x;
        var m11 = vector3.y;
        var m12 = vector3.z;
        var m20 = vector.x;
        var m21 = vector.y;
        var m22 = vector.z;
        var num8 = m00 + m11 + m22;
        var quaternion = new core_1.Quaternion();
        if (num8 > 0) {
            var num = Math.sqrt(num8 + 1);
            quaternion.w = num * 0.5;
            num = 0.5 / num;
            quaternion.x = (m12 - m21) * num;
            quaternion.y = (m20 - m02) * num;
            quaternion.z = (m01 - m10) * num;
            return quaternion;
        }
        if (m00 >= m11 && m00 >= m22) {
            var num7 = Math.sqrt(1 + m00 - m11 - m22);
            var num4 = 0.5 / num7;
            quaternion.x = 0.5 * num7;
            quaternion.y = (m01 + m10) * num4;
            quaternion.z = (m02 + m20) * num4;
            quaternion.w = (m12 - m21) * num4;
            return quaternion;
        }
        if (m11 > m22) {
            var num6 = Math.sqrt(1 + m11 - m00 - m22);
            var num3 = 0.5 / num6;
            quaternion.x = (m10 + m01) * num3;
            quaternion.y = 0.5 * num6;
            quaternion.z = (m21 + m12) * num3;
            quaternion.w = (m20 - m02) * num3;
            return quaternion;
        }
        var num5 = Math.sqrt(1 + m22 - m00 - m11);
        var num2 = 0.5 / num5;
        quaternion.x = (m20 + m02) * num2;
        quaternion.y = (m21 + m12) * num2;
        quaternion.z = 0.5 * num5;
        quaternion.w = (m01 - m10) * num2;
        return quaternion;
    };
    return Quat;
}());
exports.Quat = Quat;
//# sourceMappingURL=utility.js.map