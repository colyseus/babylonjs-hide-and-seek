
Shader "Hidden/Export/MetalGlossChannel" {
	Properties{
		_MetallicGlossMap("Texture", 2D) = "white" {}
		_AlbedoTexture("Texture", 2D) = "white" {}
        _AlbedoHasAlpha("Albedo Has Alpha", Int) = 0
		_GlossinessScale("Glossiness Scale", float) = 1.0
		_FlipY("Flip texture Y", Int) = 0
	}

	SubShader {
		ZTest Always Cull Off ZWrite Off lighting off
		Fog { Mode off }      
		Pass {
			 CGPROGRAM

			 #pragma vertex vert
			 #pragma fragment frag
			 #include "UnityCG.cginc"
			 #include "GLTFConvertColors.cginc"

			 struct vertInput {
			 float4 pos : POSITION;
			 float2 texcoord : TEXCOORD0;
			 };

			 struct vertOutput {
			 float4 pos : SV_POSITION;
			 float2 texcoord : TEXCOORD0;
			 };

			 sampler2D _MetallicGlossMap;
			 sampler2D _AlbedoTexture;
			 float _GlossinessScale;
			 int _AlbedoHasAlpha;
			 int _FlipY;

			 vertOutput vert(vertInput input) {
				 vertOutput o;
				 o.pos = UnityObjectToClipPos(input.pos);
				 o.texcoord.x = input.texcoord.x;
				 if(_FlipY == 1) o.texcoord.y = (1.0 - input.texcoord.y);
				 else o.texcoord.y = input.texcoord.y;
				 return o;
			 }

			 float4 frag(vertOutput output) : COLOR {
				// From the GLTF 2.0 spec
				// The metallic-roughness texture. The metalness values are sampled from the B channel. 
				// The roughness values are sampled from the G channel. These values are linear. 
				// If other channels are present (R or A), they are ignored for metallic-roughness calculations.
				//
				// Unity, by default, puts metallic in R channel and glossiness in A channel.
				// Unity uses a metallic-gloss texture so we need to invert the value in the g channel.
				//
				// Conversion Summary
				// Unity R channel goes into B channel
				// Unity A channel goes into G channel
				float4 metal = tex2D(_MetallicGlossMap, output.texcoord);
				metal.r = pow(metal.r, 2.2);
				if (_AlbedoHasAlpha == 1) {
					float4 albedo = tex2D(_AlbedoTexture, output.texcoord);
					metal.g = (1.0 - (albedo.a * _GlossinessScale));
				} else {
					metal.g = (1.0 - (metal.a * _GlossinessScale));
				}
				metal.b = metal.r;
				metal.a = 1.0;
				return metal;
			 }

			ENDCG
		}
	}
}
