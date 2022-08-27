/// <reference types="node" />
import { Scene } from '@babylonjs/core';
import { AdvancedDynamicTexture, Control } from '@babylonjs/gui';
import EventEmitter = require('events');
export declare class UIController extends EventEmitter {
    protected _uiName: string;
    protected _scene: Scene;
    protected _uiLayer: number;
    protected _uiTex: AdvancedDynamicTexture;
    protected _root: Control;
    loaded(): boolean;
    constructor(uiName: string, scene: Scene, layer: number);
    protected initialize(): Promise<void>;
    protected loadGUI(guiName: string): Promise<AdvancedDynamicTexture>;
    protected getControl(name: string): Control;
    protected cloneControl(control: Control): Control;
    protected getControlChild(control: Control, childName: string): Control;
    setVisible(visible: boolean): void;
}