Shader "Hidden/Export/BumpToNormal"
{
	Properties
	{
		_BumpMap ("Normal Texture", 2D) = "white" {}
		_FlipY("Flip texture Y", Int) = 0
	}
	SubShader
	{
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
				float4 bump = tex2D(_BumpMap, output.texcoord);
 				fixed3 normal = (0.5f + 0.5f * UnpackNormal(bump));
				return float4(pow(normal.rgb, 2.2), 1.0);
			}
			ENDCG
		}
	}
}
