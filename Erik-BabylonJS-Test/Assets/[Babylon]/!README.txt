Babylon Editor Toolkit 2020 - Version: 5.0.0
============================================
Author: Mackey Kinard
Email:  MackeyK24@gmail.com
Web:    https://www.babylontoolkit.com
============================================

Built With Unity Editor Version
* Unity Editor 2020.1.0f1 Binaries
* Xcode 12.4 (Catalina 10.15.7) Binaries
* Omnisharp: Use Global Mono" to "always"


Babylon Game Framework Version
* Build With 5.0.0 - A63.1X


Cubemap Filter Tools Version
* Updated: 02 May 2015


Default Babylon Color Schemes
* Primary Color: #2A2342
* Secondary Color: #E0684B


Project Config Folder Files
* Project Settings File (settings.json)
* Custom Index Export Page (index.html)
* Custom Engine Export Page (engine.html)


Shaders Store Packaging
* Fragment Shader Files - shader.fragment.fx
* Vertex Shader Files - shader.vertex.fx
* Particle Shader Files - shader.particle.fx
* Include Shader Files - shader.include.fx


Recast Navigation System
* Manually Placed Native Off Mesh Link Components Only


TODO Babylon Toolkit Editor Items
* Support Multi Level Detail Renderers (LOD)
* Better Unity WebView Browser With Request Headers


Unity Editor Platform Notes
* Khronos Texture Tools - 4.0.0
  https://github.com/KhronosGroup/KTX-Software/releases
  https://github.khronos.org/KTX-Software/ktxtools/toktx.html


* Unity Cascaded Shadow Map Genertors
  https://doc.babylonjs.com/babylon101/shadows_csm
  Note: Realtime shadows in second viewport has issues


* Unity Vertex Snapping
- Use vertex snapping to quickly assemble your Scenes: take any vertex from a given Mesh and place that vertex in the same position as any vertex from any other Mesh you choose.
- For example, use vertex snapping to align road sections precisely in a racing game, or to position power-up items at the vertices of a Mesh.
- Follow the steps below to use vertex snapping:
1. Select the Mesh you want to manipulate and make sure the Move tool is active.
2. Press and hold the V key to activate the vertex snapping mode.
3. Move your cursor over the vertex on your Mesh that you want to use as the pivot point.
4. Hold down the left mouse button once your cursor is over the vertex you want and drag your Mesh next to any other vertex on another Mesh.
To snap a vertex to a surface on another Mesh, add and hold down the Shift+Ctrl (Windows) or Shift+Command (macOS) key while you move over the surface you want to snap to.
To snap the pivot to a vertex on another Mesh, add and hold the Ctrl (Windows) or Command (macOS) key while you move the cursor to the vertex you want to snap to.
Release the mouse button and the V key when you are happy with the results (Shift+V acts as a toggle of this functionality).


* Compiler Symlinks (Node Version Manager)
===========================================
- Node: ln -s -f /Users/name/.nvm/versions/node/v14.11.0/bin/node /usr/local/bin/node
- Tsc:  ln -s -f /Users/name/.nvm/versions/node/v14.11.0/bin/tsc /usr/local/bin/tsc


* Github Submodule Pull Commands
=================================
  - git pull --recurse-submodules
  - git submodule update --remote


* Using Github Assets (raw.githubusercontent.com)
==================================================
  - Ensure that your git repo is set to public
  - Navigate to your file. We'll take as example https://github.com/BabylonJS/MeshesLibrary/blob/master/PBR_Spheres.glb
  - Remove /blob/ part
  - Replace https://github.com by https://raw.githubusercontent.com
  - You now have raw access to your file https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/PBR_Spheres.glb
  - Example: var mx = await BABYLON.SceneLoader.ImportMeshAsync("", "https://raw.githubusercontent.com/MackeyK24/MackeyK24.github.io/master/temp/", "RightHandBot.glb", scene);


Disable SRGB Buffer Support
============================
- engine.getCaps().supportSRGBBuffers = false;


* External Tools Access Denied (Mac)
====================================================
  - chmod +x Assets/Plugins/Filter/cmft_osx64/cmft
  - chmod +x Assets/Plugins/Texture/osx64/toktx


* Secure Socket Layer (HTTPS)
==============================
  - Generate self-signed certifcate example
    openssl req -x509 -newkey rsa:2048 -keyout myKey.pem -out cert.pem -days 365 -subj '/CN=localhost'
  
  - Convert to p12 certifcate format
    openssl pkcs12 -export -out keyStore.p12 -inkey myKey.pem -in cert.pem
  
  - Assign certifcate to port number - (MacOS)
    httpcfg -add -port 4444 -p12 keyStore.p12 -pwd password
  
  - Assign certifcate to port number - (Windows)
    netsh http add sslcert ipport=0.0.0.0:4444 certhash=bb14d78228ff2c8965de040c2cc1a1fff3132d76 appid={B8CA0613-6250-4DDB-A693-74B8678C2DF6}


* Yield Wait For Seconds
=========================
let testAsync = async () => { // From an async function you can Yield and wair for seconds
    for (var i = 0; i < 30; i++) {
      console.log(i);
      await SM.WaitForSeconds(75);
    }
}
testAsync();


* Experimental Decarators
==========================
module Backing {
    export function Class(klass: string) {
        return function (constructor: Function) {
            constructor.prototype.__classname = klass;
        }        
    }
}

module PROJECT {
  @Backing.Class("PROJECT.TestClass");
  export class TestClass extends BABYLON.ScriptComponent {
    ...
  }
}


* Deltakosh Test Playgrounds
================================
- Cameras:  https://playground.babylonjs.com/#L92PHY#36
- Lights:   https://playground.babylonjs.com/#CQNGRK#490


* Tester Playground
=========================
- https://playground.babylonjs.com/#KXLBRQ?UnityToolkit


* Bone IK Controller
=========================
- https://playground.babylonjs.com/#1EVNNB#230
- https://www.babylonjs-playground.com/#4HTBYP#12
- https://playground.babylonjs.com/#D0T14K#4?UnityToolkit (GLTF)
- https://playground.babylonjs.com/#D0T14K#3?UnityToolkit (BABYLON)


* Demo Grass Shaders
=====================
- https://playground.babylonjs.com/#KBXIPD#22
- https://playground.babylonjs.com/#NZDFUB#3
- https://playground.babylonjs.com/#A0YCX2#8
- https://nme.babylonjs.com/#8WH2KS#22


* VR Physics Playgrounds
============================
- https://playground.babylonjs.com/#B922X8#19


* VR Simple Grab Playgrounds
=============================
- https://playground.babylonjs.com/#9M1I08#5


* VR Hand Tracking Playgrounds
===============================
- https://playground.babylonjs.com/#X7Y4H8#16


* VR Throwing Lab Playgrounds
===============================
- https://playground.babylonjs.com/#K1WGX0#36


============================================
All rights reserved (c) 2020 Mackey Kinard