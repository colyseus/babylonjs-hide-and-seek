using System.Collections;
 using System.Collections.Generic;
 using UnityEngine;
 using UnityEngine.Animations;
 using UnityEditor;
 using UnityEditor.Animations;
 
 public class AnimUnhideTool : ScriptableObject
 {
     [MenuItem("Window/Animation Unhide Tool")]
     private static void UnhideFix()
     {
         UnityEditor.Animations.AnimatorController ac = Selection.activeObject as UnityEditor.Animations.AnimatorController;
         if (ac != null)
         {
            foreach (UnityEditor.Animations.AnimatorControllerLayer layer in ac.layers)
            {
                foreach (UnityEditor.Animations.ChildAnimatorState curState in layer.stateMachine.states)
                {
                    if (curState.state.hideFlags != 0) curState.state.hideFlags = (HideFlags)1;
                    foreach (var trans in curState.state.transitions)
                    {
                        if (trans.hideFlags == (HideFlags)3) trans.hideFlags = (HideFlags)1;
                    }
                    if (curState.state.motion != null) {
                        ProcessMotion(curState.state.motion);
                    }
                }
                foreach (var anyTrans in layer.stateMachine.anyStateTransitions)
                {
                    if (anyTrans.hideFlags != 0) anyTrans.hideFlags = (HideFlags)1;
                }
                foreach (var entryTrans in layer.stateMachine.entryTransitions)
                {
                    if (entryTrans.hideFlags != 0) entryTrans.hideFlags = (HideFlags)1;
                }
            }
            EditorUtility.SetDirty(ac);
            EditorUtility.DisplayDialog("Anim Unhide Tool", "Animation Controller Fixed: " + ac.name, "OK");
         }
         else
         {
             UnityEngine.Debug.LogWarning("ANIM-FIX: You select an animation controller to fix.");
         }
     }
     private static void ProcessMotion(Motion motion)
     {
        if (motion.hideFlags == (HideFlags)3) motion.hideFlags = (HideFlags)1;
        if (motion is BlendTree) {
            var tree = motion as BlendTree;
            foreach (var child in tree.children) {
                if (child.motion != null) {
                    ProcessMotion(child.motion);
                }
            }
        }
     }
 }