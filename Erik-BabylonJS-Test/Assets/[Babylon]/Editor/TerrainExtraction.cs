using UnityEngine;
 using System.Collections;
 using System.Collections.Generic;
 using UnityEditor;
 // Extracts Unity terrain nodes with GameObject prefabs.
 // http://answers.unity3d.com/questions/723266/converting-all-terrain-trees-to-gameobjects.html
 [ExecuteInEditMode]
public class TerrainExtraction : EditorWindow
{
    private const string NODE_LABEL = "NODES_EXTRACTED";

    [Header("References")]
    public Terrain _terrain;
    //============================================
    [MenuItem("Tools/" + CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Terrain Extraction", false, 61)]
    static void Init()
    {
        TerrainExtraction window = (TerrainExtraction)GetWindow(typeof(TerrainExtraction));
        window.minSize = new Vector2(400, 300);
        window.Show();
    }
    void OnGUI()
    {
        _terrain = (Terrain)EditorGUILayout.ObjectField(_terrain, typeof(Terrain), true);
        EditorGUILayout.Space();
        EditorGUILayout.HelpBox("Extracts game object prefabs from the selected terrain.", MessageType.Info);
        EditorGUILayout.Space();
        if (GUILayout.Button("Extract Terrain Nodes"))
        {
            Extract();
            EditorGUILayout.Space();
        }
        if (GUILayout.Button("Remove Extracted Nodes"))
        {
            Remove();
            EditorGUILayout.Space();
        }
    }
    //============================================
    public void Extract()
    {
        TerrainData data = _terrain.terrainData;
        float width = data.size.x;
        float height = data.size.z;
        float y = data.size.y;
        // Create parent
        GameObject parent = GameObject.Find(TerrainExtraction.NODE_LABEL);
        if (parent == null)
        {
            parent = new GameObject(TerrainExtraction.NODE_LABEL);
        }
        // Create trees
        foreach (TreeInstance tree in data.treeInstances)
        {
            if (tree.prototypeIndex >= data.treePrototypes.Length)
                continue;
            var _tree = data.treePrototypes[tree.prototypeIndex].prefab;
            Vector3 position = new Vector3(
                tree.position.x * width,
                tree.position.y * y,
                tree.position.z * height) + _terrain.transform.position;
            Vector3 scale = new Vector3(tree.widthScale, tree.heightScale, tree.widthScale);
            GameObject go = Instantiate(_tree, position, Quaternion.Euler(0f, Mathf.Rad2Deg * tree.rotation, 0f), parent.transform) as GameObject;
            go.transform.localScale = scale;
        }
        // TODO: Create details
    }
    public void Remove()
    {
        DestroyImmediate(GameObject.Find(TerrainExtraction.NODE_LABEL));
    }
}