Canvas Maya Art Tools
=========================================
1. Install Maya art tool scripts (.mel) in your scripts folder.
   
   Window Folder:
   C:\Users\USERNAME\Documents\maya\*VERSION*\scripts
   
   Macintosh Folder:
   ~/Library/Preferences/Autodesk/maya/*VERSION*/scripts

========================
Add Reskin Tool To Shelf
========================
*** Usage: Reskin and combine selected meshes with new max influencers.
1. In Maya open the Script Editor and go to the Mel tab, copy and paste command below:
########################

BabylonReskinTool();

########################
2. Highlight it and click on "Save Script to Shelf...", specify a name ('Reskin') and click "OK".

Important Note: Must Clean up uvs and make all matching uv set names when combining meshes for reskinning.

========================
Add Mirror Tool To Shelf
========================
*** Usage: Mirror animation to flip direction. You must manually set the animation timeline to match.
1. In Maya open the Script Editor and go to the Mel tab, copy and paste command below:
########################

BabylonMirrorTool();

########################
2. Highlight it and click on "Save Script to Shelf...", specify a name ('Mirror') and click "OK".

Important Note: First pass select hips, spine, neck and head. Second pass select arms (shoulders, arms, forearms to hand) and legs (upper leg, lower leg, foot to toe base)


=========================================
Reanme Namespaces Using Namespace Editor
=========================================

1. Open the Namespace Editor by selecting Window > General Editors > Namespace Editor. The Namespace Editor appears.
2. To rename the new namespace, double-click it. ...
3. In the Rename Namespace window type a new name, and then click OK.