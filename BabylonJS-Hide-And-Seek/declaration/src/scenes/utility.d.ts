import { Quaternion, Vector3 } from '@babylonjs/core';
export declare class Vec3 {
    static MoveTowards(current: Vector3, target: Vector3, maxDistanceDelta: number): Vector3;
}
export declare class Quat {
    static LookRotation(forward: Vector3, up: Vector3): Quaternion;
}
