using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class BTestSphere
*/
[Babylon(Class="PROJECT.BTestSphere"), AddComponentMenu("Scripts/My Project/BTestSphere")]
public class BTestSphere : EditorScriptComponent
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
[CustomEditor(typeof(BTestSphere)), CanEditMultipleObjects]
public class BTestSphereEditor : Editor
{
    public void OnEnable()
    {
        BTestSphere owner = (BTestSphere)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}