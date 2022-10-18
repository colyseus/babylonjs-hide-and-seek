/**
 * Generated by the Babylon.JS Editor v4.4.0
 */
import { Node } from "@babylonjs/core/node";
import { Scene } from "@babylonjs/core/scene";
import { Nullable } from "@babylonjs/core/types";
import { Engine } from "@babylonjs/core/Engines/engine";
import { MotionBlurPostProcess } from "@babylonjs/core/PostProcesses/motionBlurPostProcess";
import { ScreenSpaceReflectionPostProcess } from "@babylonjs/core/PostProcesses/screenSpaceReflectionPostProcess";
import { SSAO2RenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import "@babylonjs/core/Audio/audioSceneComponent";
import "@babylonjs/core/Physics/physicsEngineComponent";
import "@babylonjs/core/Engines/Extensions/engine.textureSelector";
import "@babylonjs/core/Materials/Textures/Loaders/ktxTextureLoader";
import { ISceneScriptMap } from "./scripts-map";
export declare type NodeScriptConstructor = (new (...args: any[]) => Node);
export declare type GraphScriptConstructor = (new (scene: Scene) => any);
export declare type ScriptMap = {
    IsGraph?: boolean;
    IsGraphAttached?: boolean;
    default: (new (...args: any[]) => NodeScriptConstructor | GraphScriptConstructor);
};
export interface IScript {
    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    onInitialize?(): void;
    /**
     * Called on the node has been fully initialized and is ready.
     */
    onInitialized?(): void;
    /**
     * Called on the scene starts.
     */
    onStart?(): void;
    /**
     * Called each frame.
     */
    onUpdate?(): void;
    /**
     * Called on the object has been disposed.
     * Object can be disposed manually or when the editor stops running the scene.
     */
    onStop?(): void;
    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    onMessage?(name: string, data: any, sender: any): void;
    /**
     * In case the component is decorated @guiComponent this function iscalled once the GUI data
     * has been loaded and ready to be parsed. Returns the reference to the GUI advanced dynamic texture.
     * @param parsedData defines the reference to the GUI data to be parsed coming from the server.
     */
    onGuiInitialized?(parsedData: any): AdvancedDynamicTexture;
}
export declare const projectConfiguration: {
    compressedTextures: {
        supportedFormats: any[];
    };
};
/**
 * Configures the given engine according to the current project configuration (compressed textures, etc.).
 * @param engine defines the reference to the engine to configure.
 */
export declare function configureEngine(engine: Engine): void;
/**
 * Loads the given scene file and appends it to the given scene reference (`toScene`).
 * @param toScene defines the instance of `Scene` to append to.
 * @param rootUrl defines the root url for the scene and resources or the concatenation of rootURL and filename (e.g. http://example.com/test.glb)
 * @param sceneFilename defines the name of the scene file.
 */
export declare function appendScene(toScene: Scene, rootUrl: string, sceneFilename: string): Promise<void>;
/**
 * Works as an helper, this will:
 * - attach scripts on objects.
 * - configure post-processes
 * - setup rendering groups
 * @param scene the scene to attach scripts, etc.
 */
export declare function runScene(scene: Scene, rootUrl?: string): Promise<void>;
/**
 * Attaches all available scripts on nodes of the given scene.
 * @param scene the scene reference that contains the nodes to attach scripts.
 */
export declare function attachScripts(scriptsMap: ISceneScriptMap, scene: Scene): void;
/**
 * Applies the waiting mesh colliders in case the scene is incremental.
 * @param scene defines the reference to the scene that contains the mesh colliders to apply.
 */
export declare function applyMeshColliders(scene: Scene): void;
/**
 * Setups the rendering groups for meshes in the given scene.
 * @param scene defines the scene containing the meshes to configure their rendering group Ids.
 */
export declare function setupRenderingGroups(scene: Scene): void;
/**
 * Meshes using pose matrices with skeletons can't be parsed directly as the pose matrix is
 * missing from the serialzied data of meshes. These matrices are stored in the meshes metadata
 * instead and can be applied by calling this function.
 * @param scene defines the scene containing the meshes to configure their pose matrix.
 */
export declare function applyMeshesPoseMatrices(scene: Scene): void;
/**
 * Checks scene's transform nodes in order to attach to related bones.
 * @param scene defines the reference to the scene containing the transform nodes to potentially attach to bones.
 */
export declare function attachTransformNodesToBones(scene: Scene): void;
/**
 * Attaches the a script at runtime to the given node according to the given script's path.
 * @param scriptPath defines the path to the script to attach (available as a key in the exported "scriptsMap" map).
 * @param object defines the reference to the object (node or scene) to attach the script to.
 */
export declare function attachScriptToNodeAtRuntime<T extends (Node | Scene)>(scriptPath: keyof ISceneScriptMap, object: T | (Node | Scene)): T;
/**
 * Defines the reference to the SSAO2 rendering pipeline.
 */
export declare let ssao2RenderingPipelineRef: Nullable<SSAO2RenderingPipeline>;
/**
 * Defines the reference to the SSR post-process.
 */
export declare let screenSpaceReflectionPostProcessRef: Nullable<ScreenSpaceReflectionPostProcess>;
/**
 * Defines the reference to the default rendering pipeline.
 */
export declare let defaultRenderingPipelineRef: Nullable<DefaultRenderingPipeline>;
/**
 * Defines the reference to the motion blur post-process.
 */
export declare let motionBlurPostProcessRef: Nullable<MotionBlurPostProcess>;
/**
 * Configures and attaches the post-processes of the given scene.
 * @param scene the scene where to create the post-processes and attach to its cameras.
 * @param rootUrl the root Url where to find extra assets used by pipelines. Should be the same as the scene.
 */
export declare function configurePostProcesses(scene: Scene, rootUrl?: Nullable<string>): void;