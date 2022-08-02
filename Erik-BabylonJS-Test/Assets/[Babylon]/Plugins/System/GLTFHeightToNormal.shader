Shader "Hidden/Export/HeightToNormal"
{
	Properties
	{
		_BumpMap ("Normal Texture", 2D) = "white" {}
		_HeightMap ("Height Texture", 2D) = "white" {}
		_HeightScale("Height Map Scale", float) = 1.0
		_FlipY("Flip texture Y", Int) = 0
	}
	SubShader
	{
		// No culling or depth
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
			
			sampler2D _BumpMap;
			sampler2D _HeightMap;
			float _HeightScale;
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
				float4 bumpmap = tex2D(_BumpMap, output.texcoord);
				float4 heightmap = tex2D(_HeightMap, output.texcoord);
 				fixed3 normal = (0.5f + 0.5f * UnpackNormal(bumpmap));
				float height = (heightmap.r + heightmap.g + heightmap.b / 3.0); // Greyscale Height
				float scale = min(1.0, _HeightScale);
				return float4(pow(normal.rgb, 2.2), (height * scale));
			}
			ENDCG
		}
	}
}
