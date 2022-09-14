import { Matrix, Quaternion, Vector3 } from '@babylonjs/core';

const deg2Rad = 360 / (Math.PI * 2);
const kEpsilonNormalSqrt = 1e-15;

export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export function random(min: number, max: number): number {
	return Math.floor(Math.random() * max + min);
}

/** Delay for a number of milliseconds */
export function delay(delay: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
}

export class Easing {
	public static easeOutExpo(x: number): number {
		return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
	}

	public static easeInExpo(x: number): number {
		return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
	}
}

export class Vec3 {
	public static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3 {
		let toVector_x = target.x - current.x;
		let toVector_y = target.y - current.y;
		let toVector_z = target.z - current.z;

		let sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;

		if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)) return target;
		var dist = Math.sqrt(sqdist);

		return new Vector3(current.x + (toVector_x / dist) * maxDistanceDelta, current.y + (toVector_y / dist) * maxDistanceDelta, current.z + (toVector_z / dist) * maxDistanceDelta);
	}

	public static Angle(from: Vector3, to: Vector3): number {
		let denominator: number = Math.sqrt(from.lengthSquared() * to.lengthSquared());
		if (denominator < kEpsilonNormalSqrt) {
			return 0;
		}

		let dot: number = clamp(Vector3.Dot(from, to) / denominator, -1, 1);
		return Math.acos(dot) * deg2Rad;
	}

	public static SignedAngle(from: Vector3, to: Vector3, axis: Vector3) {
		let unsignedAngle: number = Vec3.Angle(from, to);

		let cross_x: number = from.y * to.z - from.z * to.y;
		let cross_y: number = from.z * to.x - from.x * to.z;
		let cross_z: number = from.x * to.y - from.y * to.x;
		let sign: number = Math.sign(axis.x * cross_x + axis.y * cross_y + axis.z * cross_z);

		if (sign === 0) {
			sign = 1;
		}

		return unsignedAngle * sign;
	}
}

export class Quat {
	public static LookRotation(forward: Vector3, up: Vector3): Quaternion {
		let vector = Vector3.Normalize(forward);
		let vector2 = Vector3.Normalize(Vector3.Cross(up, vector));
		let vector3 = Vector3.Cross(vector, vector2);
		var m00 = vector2.x;
		var m01 = vector2.y;
		var m02 = vector2.z;
		var m10 = vector3.x;
		var m11 = vector3.y;
		var m12 = vector3.z;
		var m20 = vector.x;
		var m21 = vector.y;
		var m22 = vector.z;

		let num8: number = m00 + m11 + m22;
		var quaternion = new Quaternion();
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
	}
}
