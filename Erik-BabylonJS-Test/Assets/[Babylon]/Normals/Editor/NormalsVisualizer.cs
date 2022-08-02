using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(MeshFilter))]
public class NormalsVisualizer : Editor
{
    private Mesh mesh = null;
    private Vector3[] verts = null;
    private Vector3[] normals = null;
    private GeometryNormals geo = null;

    void OnEnable()
    {
        if (CanvasToolsInfo.Instance.EnableGeometryNormals == true)
        {
            if (geo == null)
            {
                MeshFilter mf = target as MeshFilter;
                if (mf != null)
                {
                    geo = mf.gameObject.GetComponent<GeometryNormals>();
                }
            }
        }
    }

    void OnSceneGUI()
    {
        if (CanvasToolsInfo.Instance.EnableGeometryNormals == true)
        {
            if (geo == null || geo.enabled == false)
            {
                return;
            }
            // ..
            if (mesh == null)
            {
                MeshFilter mf = target as MeshFilter;
                if (mf != null)
                {
                    mesh = mf.sharedMesh;
                }
            }
            if (verts == null)
            {
                verts = mesh.vertices;
            }
            if (normals == null)
            {
                normals = mesh.normals;
            }
            // ..
            if (mesh == null || verts == null || normals == null)
            {
                return;
            }
            Handles.matrix = (target as MeshFilter).transform.localToWorldMatrix;
            Handles.color = Color.yellow;
            // ..
            int len = mesh.vertexCount;
            for (int i = 0; i < len; i++)
            {
                Handles.DrawLine(verts[i], verts[i] + normals[i]);
            }
        }
    }
}
