using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class BVFXSparks
*/
[Babylon(Class="PROJECT.BVFXSparks"), AddComponentMenu("Scripts/My Project/BVFXSparks")]
public class BVFXSparks : EditorScriptComponent
{
    /* Add Editor Properties To Script Component */
    // Example: [Tooltip("Example hello world property")]
    // Example: [Auto] public string helloWorld = "Hello World";

	/* [Serializable, HideInInspector] public string exportProperty = null; */
    public override void OnUpdateProperties(Transform transform, SceneExporterTool exporter)
    {
        // Example: this.helloWorld = "Update Hello World";
    }
}

// Optional Script Component Custom Editor Class
[CustomEditor(typeof(BVFXSparks)), CanEditMultipleObjects]
public class BVFXSparksEditor : Editor
{
    public void OnEnable()
    {
        BVFXSparks owner = (BVFXSparks)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}