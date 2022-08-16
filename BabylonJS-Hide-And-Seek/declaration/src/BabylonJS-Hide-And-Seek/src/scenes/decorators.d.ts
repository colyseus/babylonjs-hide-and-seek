import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { KeyboardEventTypes } from "@babylonjs/core/Events/keyboardEvents";
export declare type VisiblityPropertyType = "number" | "string" | "boolean" | "Vector2" | "Vector3" | "Vector4" | "Color3" | "Color4" | "Texture" | "KeyMap";
export interface IVisibleInInspectorOptions {
    /**
     * Defines the section of the inspector.
     */
    section?: string;
    /**
     * In case of numbers, defines the minimum value.
     */
    min?: number;
    /**
     * In case of numbers, defines the maximum value.
     */
    max?: number;
    /**
     * In case of numbers, defines the step applied in the editor.
     */
    step?: number;
}
/**
 * Sets the decorated member visible in the inspector.
 * @param type the property type.
 * @param name optional name to be shown in the editor's inspector.
 * @param defaultValue optional default value set in the TS code.
 * @param options defines the optional object defining the options of the decorated property.
 */
export declare function visibleInInspector(type: VisiblityPropertyType, name?: string, defaultValue?: any, options?: IVisibleInInspectorOptions): any;
/**
 * Sets the decorated member linked to a child node.
 * @param nodeName defines the name of the node in children to retrieve.
 */
export declare function fromChildren(nodeName?: string): any;
/**
 * Sets the decorated member linked to a node in the scene.
 * @param nodeName defines the name of the node in the scene to retrieve.
 */
export declare function fromScene(nodeName?: string): any;
/**
 * Sets the decorated member linked to a particle system which has the current Mesh attached.
 * @param particleSystemName defines the name of the attached particle system to retrieve.
 */
export declare function fromParticleSystems(particleSystemName?: string): any;
/**
 * Sets the decorated member linked to an animation group.
 * @param animationGroupName defines the name of the animation group to retrieve.
 */
export declare function fromAnimationGroups(animationGroupName?: string): any;
/**
 * Sets the decorated member linked to a sound.
 * @param soundName defines the name of the sound to retrieve.
 * @param type defines the type of sound to retrieve. "global" means "not spatial". By default, any sound matching the given name is retrieved.
 */
export declare function fromSounds(soundName?: string, type?: "global" | "spatial"): any;
/**
 * Sets the decorated member linked to a material.
 * @param materialName defines the name of the material to retrieve.
 */
export declare function fromMaterials(materialName?: string): any;
/**
 * Sets the decorated member function to be called on the given pointer event is fired.
 * @param type the event type to listen to execute the decorated function.
 * @param onlyWhenMeshPicked defines wether or not the decorated function should be called only when the mesh is picked. default true.
 */
export declare function onPointerEvent(type: PointerEventTypes, onlyWhenMeshPicked?: boolean): any;
/**
 * Sets the decorated member function to be called on the given keyboard key(s) is/are pressed.
 * @param key the key or array of key to listen to execute the decorated function.
 */
export declare function onKeyboardEvent(key: number | number[] | string | string[], type?: KeyboardEventTypes): any;
/**
 * Sets the decorated member function to be called each time the engine is resized.
 * The decorated function can take 2 arguments:
 *  - width: number defines the new width
 *  - height: number defines the new height
 */
export declare function onEngineResize(): any;
/**
 * Sets the component as a GUI component. Loads the GUI data located at the given path
 * and allows to use the @fromControls decorator.
 * @param path defines the path to the GUI data to load and parse.
 */
export declare function guiComponent(path: string): any;
/**
 * Sets the decorated member linked to a GUI control.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to retrieve.
 */
export declare function fromControls(controlName?: string): any;
/**
 * Sets the decorated member function to be called on the control identified by the given name is clicked.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the click event.
 */
export declare function onControlClick(controlName: string): any;
/**
 * Sets the decorated member function to be called on the pointer enters the control identified by the given name.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the pointer enter event.
 */
export declare function onControlPointerEnter(controlName: string): any;
/**
 * Sets the decorated member function to be called on the pointer is out of the control identified by the given name.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the pointer out event.
 */
export declare function onControlPointerOut(controlName: string): any;
