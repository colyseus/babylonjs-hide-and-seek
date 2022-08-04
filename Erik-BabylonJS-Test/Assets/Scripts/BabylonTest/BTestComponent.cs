using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class BTestComponent
*/
[Babylon(Class = "PROJECT.BTestComponent"), AddComponentMenu("Scripts/My Project/BTestComponent")]
public class BTestComponent : EditorScriptComponent
{
    /* Add Editor Properties To Script Component */
    // Example: [Tooltip("Example hello world property")]
    // Example: [Auto] public string helloWorld = "Hello World";

    public float testVal_1 = 1.0f;
    public float testVal_2 = 2.0f;
    public bool testVal_3 = true;

    /* [Serializable, HideInInspector] public string exportProperty = null; */
    public override void OnUpdateProperties(Transform transform, SceneExporterTool exporter)
    {
        // Example: this.helloWorld = "Update Hello World";
    }
}

// Optional Script Component Custom Editor Class
[CustomEditor(typeof(BTestComponent)), CanEditMultipleObjects]
public class BTestComponentEditor : Editor
{
    public void OnEnable()
    {
        BTestComponent owner = (BTestComponent)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}