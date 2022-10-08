"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quat = exports.Vec3 = exports.Easing = exports.lerpNumber = exports.delay = exports.random = exports.clamp = void 0;
var core_1 = require("@babylonjs/core");
var deg2Rad = 360 / (Math.PI * 2);
var kEpsilonNormalSqrt = 1e-15;
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
exports.clamp = clamp;
function random(min, max) {
    return Math.floor(Math.random() * max + min);
}
exports.random = random;
/** Delay for a number of milliseconds */
function delay(delay) {
    return new Promise(function (resolve) {
        setTimeout(resolve, delay);
    });
}
exports.delay = delay;
function lerpNumber(from, to, t) {
    return (1 - t) * from + t * to;
}
exports.lerpNumber = lerpNumber;
var Easing = /** @class */ (function () {
    function Easing() {
    }
    Easing.easeOutExpo = function (x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };
    Easing.easeInExpo = function (x) {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    };
    Easing.easeInSine = function (x) {
        return 1 - Math.cos((x * Math.PI) / 2);
    };
    Easing.easeInCirc = function (x) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    };
    Easing.easeOutCirc = function (x) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    };
    Easing.easeOutElastic = function (x) {
        var c4 = (2 * Math.PI) / 3;
        return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
    };
    Easing.easeOutBounce = function (x) {
        var n1 = 7.5625;
        var d1 = 2.75;
        if (x < 1 / d1) {
            return n1 * x * x;
        }
        else if (x < 2 / d1) {
            return n1 * (x -= 1.5 / d1) * x + 0.75;
        }
        else if (x < 2.5 / d1) {
            return n1 * (x -= 2.25 / d1) * x + 0.9375;
        }
        else {
            return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
    };
    return Easing;
}());
exports.Easing = Easing;
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
    Vec3.Angle = function (from, to) {
        var denominator = Math.sqrt(from.lengthSquared() * to.lengthSquared());
        if (denominator < kEpsilonNormalSqrt) {
            return 0;
        }
        var dot = clamp(core_1.Vector3.Dot(from, to) / denominator, -1, 1);
        return Math.acos(dot) * deg2Rad;
    };
    Vec3.SignedAngle = function (from, to, axis) {
        var unsignedAngle = Vec3.Angle(from, to);
        var cross_x = from.y * to.z - from.z * to.y;
        var cross_y = from.z * to.x - from.x * to.z;
        var cross_z = from.x * to.y - from.y * to.x;
        var sign = Math.sign(axis.x * cross_x + axis.y * cross_y + axis.z * cross_z);
        if (sign === 0) {
            sign = 1;
        }
        return unsignedAngle * sign;
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