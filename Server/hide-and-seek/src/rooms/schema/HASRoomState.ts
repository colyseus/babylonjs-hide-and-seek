import { Schema, Context, type } from '@colyseus/schema';

export class HASRoomState extends Schema {
	@type('string') mySynchronizedProperty: string = 'Hello world';
}
