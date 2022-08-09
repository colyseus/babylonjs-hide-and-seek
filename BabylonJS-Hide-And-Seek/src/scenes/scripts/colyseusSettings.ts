import { Node } from '@babylonjs/core/node';
import { visibleInInspector } from '../decorators';

export default class ColyseusSettings extends Node {
	@visibleInInspector('string', 'Colyseus Server Address', 'localhost')
	public colyseusServerAddress: string = 'localhost';
	@visibleInInspector('number', 'Colyseus Server Port', 2567)
	public colyseusServerPort: number = 2567;
	@visibleInInspector('boolean', 'Use Secure Protocol', false)
	public useSecureProtocol: boolean = false;
}
