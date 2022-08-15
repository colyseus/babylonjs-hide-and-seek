"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onControlPointerOut = exports.onControlPointerEnter = exports.onControlClick = exports.fromControls = exports.guiComponent = exports.onEngineResize = exports.onKeyboardEvent = exports.onPointerEvent = exports.fromMaterials = exports.fromSounds = exports.fromAnimationGroups = exports.fromParticleSystems = exports.fromScene = exports.fromChildren = exports.visibleInInspector = void 0;
/**
 * Sets the decorated member visible in the inspector.
 * @param type the property type.
 * @param name optional name to be shown in the editor's inspector.
 * @param defaultValue optional default value set in the TS code.
 * @param options defines the optional object defining the options of the decorated property.
 */
function visibleInInspector(type, name, defaultValue, options) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._InspectorValues = (_a = ctor._InspectorValues) !== null && _a !== void 0 ? _a : [];
        ctor._InspectorValues.push({
            type: type,
            options: options,
            defaultValue: defaultValue,
            propertyKey: propertyKey.toString(),
            name: name !== null && name !== void 0 ? name : propertyKey.toString(),
        });
    };
}
exports.visibleInInspector = visibleInInspector;
/**
 * Sets the decorated member linked to a child node.
 * @param nodeName defines the name of the node in children to retrieve.
 */
function fromChildren(nodeName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._ChildrenValues = (_a = ctor._ChildrenValues) !== null && _a !== void 0 ? _a : [];
        ctor._ChildrenValues.push({
            propertyKey: propertyKey.toString(),
            nodeName: nodeName !== null && nodeName !== void 0 ? nodeName : propertyKey.toString(),
        });
    };
}
exports.fromChildren = fromChildren;
/**
 * Sets the decorated member linked to a node in the scene.
 * @param nodeName defines the name of the node in the scene to retrieve.
 */
function fromScene(nodeName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._SceneValues = (_a = ctor._SceneValues) !== null && _a !== void 0 ? _a : [];
        ctor._SceneValues.push({
            propertyKey: propertyKey.toString(),
            nodeName: nodeName !== null && nodeName !== void 0 ? nodeName : propertyKey.toString(),
        });
    };
}
exports.fromScene = fromScene;
/**
 * Sets the decorated member linked to a particle system which has the current Mesh attached.
 * @param particleSystemName defines the name of the attached particle system to retrieve.
 */
function fromParticleSystems(particleSystemName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._ParticleSystemValues = (_a = ctor._ParticleSystemValues) !== null && _a !== void 0 ? _a : [];
        ctor._ParticleSystemValues.push({
            propertyKey: propertyKey.toString(),
            particleSystemName: particleSystemName !== null && particleSystemName !== void 0 ? particleSystemName : propertyKey.toString(),
        });
    };
}
exports.fromParticleSystems = fromParticleSystems;
/**
 * Sets the decorated member linked to an animation group.
 * @param animationGroupName defines the name of the animation group to retrieve.
 */
function fromAnimationGroups(animationGroupName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._AnimationGroupValues = (_a = ctor._AnimationGroupValues) !== null && _a !== void 0 ? _a : [];
        ctor._AnimationGroupValues.push({
            propertyKey: propertyKey.toString(),
            animationGroupName: animationGroupName !== null && animationGroupName !== void 0 ? animationGroupName : propertyKey.toString(),
        });
    };
}
exports.fromAnimationGroups = fromAnimationGroups;
/**
 * Sets the decorated member linked to a sound.
 * @param soundName defines the name of the sound to retrieve.
 * @param type defines the type of sound to retrieve. "global" means "not spatial". By default, any sound matching the given name is retrieved.
 */
function fromSounds(soundName, type) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._SoundValues = (_a = ctor._SoundValues) !== null && _a !== void 0 ? _a : [];
        ctor._SoundValues.push({
            type: type,
            propertyKey: propertyKey.toString(),
            soundName: soundName !== null && soundName !== void 0 ? soundName : propertyKey.toString(),
        });
    };
}
exports.fromSounds = fromSounds;
/**
 * Sets the decorated member linked to a material.
 * @param materialName defines the name of the material to retrieve.
 */
function fromMaterials(materialName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._MaterialsValues = (_a = ctor._MaterialsValues) !== null && _a !== void 0 ? _a : [];
        ctor._MaterialsValues.push({
            propertyKey: propertyKey.toString(),
            nodeName: materialName !== null && materialName !== void 0 ? materialName : propertyKey.toString(),
        });
    };
}
exports.fromMaterials = fromMaterials;
/**
 * Sets the decorated member function to be called on the given pointer event is fired.
 * @param type the event type to listen to execute the decorated function.
 * @param onlyWhenMeshPicked defines wether or not the decorated function should be called only when the mesh is picked. default true.
 */
function onPointerEvent(type, onlyWhenMeshPicked) {
    if (onlyWhenMeshPicked === void 0) { onlyWhenMeshPicked = true; }
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"".concat(propertyKey.toString(), "\" in class \"").concat(target.constructor.name, "\" must be a function."));
        }
        var ctor = target.constructor;
        ctor._PointerValues = (_a = ctor._PointerValues) !== null && _a !== void 0 ? _a : [];
        ctor._PointerValues.push({
            type: type,
            onlyWhenMeshPicked: onlyWhenMeshPicked,
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.onPointerEvent = onPointerEvent;
/**
 * Sets the decorated member function to be called on the given keyboard key(s) is/are pressed.
 * @param key the key or array of key to listen to execute the decorated function.
 */
function onKeyboardEvent(key, type) {
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"".concat(propertyKey.toString(), "\" in class \"").concat(target.constructor.name, "\" must be a function."));
        }
        var ctor = target.constructor;
        ctor._KeyboardValues = (_a = ctor._KeyboardValues) !== null && _a !== void 0 ? _a : [];
        ctor._KeyboardValues.push({
            type: type,
            propertyKey: propertyKey.toString(),
            keys: Array.isArray(key) ? key : [key],
        });
    };
}
exports.onKeyboardEvent = onKeyboardEvent;
/**
 * Sets the decorated member function to be called each time the engine is resized.
 * The decorated function can take 2 arguments:
 *  - width: number defines the new width
 *  - height: number defines the new height
 */
function onEngineResize() {
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"".concat(propertyKey.toString(), "\" in class \"").concat(target.constructor.name, "\" must be a function."));
        }
        var ctor = target.constructor;
        ctor._ResizeValues = (_a = ctor._ResizeValues) !== null && _a !== void 0 ? _a : [];
        ctor._ResizeValues.push({
            propertyKey: propertyKey.toString(),
        });
    };
}
exports.onEngineResize = onEngineResize;
/**
 * Sets the component as a GUI component. Loads the GUI data located at the given path
 * and allows to use the @fromControls decorator.
 * @param path defines the path to the GUI data to load and parse.
 */
function guiComponent(path) {
    return function (target) {
        target._GuiPath = path;
    };
}
exports.guiComponent = guiComponent;
/**
 * Sets the decorated member linked to a GUI control.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to retrieve.
 */
function fromControls(controlName) {
    return function (target, propertyKey) {
        var _a;
        var ctor = target.constructor;
        ctor._ControlsValues = (_a = ctor._ControlsValues) !== null && _a !== void 0 ? _a : [];
        ctor._ControlsValues.push({
            propertyKey: propertyKey.toString(),
            controlName: controlName !== null && controlName !== void 0 ? controlName : propertyKey.toString(),
        });
    };
}
exports.fromControls = fromControls;
function onControlEvent(controlName, type) {
    return function (target, propertyKey) {
        var _a;
        if (typeof (target[propertyKey]) !== "function") {
            throw new Error("Decorated propery \"".concat(propertyKey.toString(), "\" in class \"").concat(target.constructor.name, "\" must be a function."));
        }
        var ctor = target.constructor;
        ctor._ControlsClickValues = (_a = ctor._ControlsClickValues) !== null && _a !== void 0 ? _a : [];
        ctor._ControlsClickValues.push({
            type: type,
            controlName: controlName,
            propertyKey: propertyKey.toString(),
        });
    };
}
/**
 * Sets the decorated member function to be called on the control identified by the given name is clicked.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the click event.
 */
function onControlClick(controlName) {
    return onControlEvent(controlName, "onPointerClickObservable");
}
exports.onControlClick = onControlClick;
/**
 * Sets the decorated member function to be called on the pointer enters the control identified by the given name.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the pointer enter event.
 */
function onControlPointerEnter(controlName) {
    return onControlEvent(controlName, "onPointerEnterObservable");
}
exports.onControlPointerEnter = onControlPointerEnter;
/**
 * Sets the decorated member function to be called on the pointer is out of the control identified by the given name.
 * Handled only if the component is tagged @guiComponent
 * @param controlName defines the name of the control to listen the pointer out event.
 */
function onControlPointerOut(controlName) {
    return onControlEvent(controlName, "onPointerOutObservable");
}
exports.onControlPointerOut = onControlPointerOut;
//# sourceMappingURL=decorators.js.map