import { Node } from '@babylonjs/core/node';
export default class ColyseusSettings extends Node {
    colyseusServerAddress: string;
    colyseusServerPort: number;
    useSecureProtocol: boolean;
}
