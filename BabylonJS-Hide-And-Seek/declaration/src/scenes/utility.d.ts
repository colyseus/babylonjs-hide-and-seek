import { Quaternion, Vector3 } from '@babylonjs/core';
export declare function clamp(value: number, min: number, max: number): number;
export declare function random(min: number, max: number): number;
/** Delay for a number of milliseconds */
export declare function delay(delay: number): Promise<void>;
export declare class Easing {
    static easeOutExpo(x: number): number;
    static easeInExpo(x: number): number;
}
export declare class Vec3 {
    static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3;
    static Angle(from: Vector3, to: Vector3): number;
    static SignedAngle(from: Vector3, to: Vector3, axis: Vector3): number;
}
export declare class Quat {
    static LookRotation(forward: Vector3, up: Vector3): Quaternion;
}
