
Shader "Hidden/Export/SecondaryDetailMaps" {
	Properties{
		_AlbedoTexture("Texture", 2D) = "white" {}
		_NormalTexture("Texture", 2D) = "white" {}
		_RoughnessTexture("Texture", 2D) = "white" {}
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

			 sampler2D _AlbedoTexture;
			 sampler2D _NormalTexture;
			 sampler2D _RoughnessTexture;
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
				// The detail map can contains albedo (diffuse), normal and roughness (for PBR materials only) channels, dispatched this way (following Unity convention):
				// Red channel: red component of the greyscale albedo
				// Green channel: green component of the normal map
				// Blue channel: red component of the roughness map
				// Alpha channel: red component of the normal map
				// 
			 	float4 final = float4(0.0, 0.0, 0.0 ,1.0);
				float4 albedo2 = tex2D(_AlbedoTexture, output.texcoord);
			 	float4 bump2 = tex2D(_NormalTexture, output.texcoord);
 				fixed3 normal2 = 0.5f + 0.5f * UnpackNormal(bump2);
				float4 roughness2 = tex2D(_RoughnessTexture, output.texcoord);
				//
				final.r = albedo2.r;
				final.g = normal2.g;
				final.b	= roughness2.r;
			 	final.a = normal2.r;
				return final;
			 }

			ENDCG
		}
	}
}
