Shader "Hidden/Export/EncodeTexture" {
	Properties {
		_MainTex ("Base (HDR RT)", 2D) = "black" {}
		_GammaOut ("Gamma Out", float) = 1.0
		_EncodeHDR ("Encode HDR", int) = 0
		_FlipY("Flip texture Y", Int) = 0
	}
	Subshader  {
		ZTest Always Cull Off ZWrite Off lighting off
		Fog { Mode off }      
		Pass {
			CGPROGRAM
			
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 3.0
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

			sampler2D _MainTex;
			float _GammaOut;
			int _EncodeHDR;
			int _FlipY;

			float4 EncodeRGBD(float3 rgb)
			{
				float MaxRange = 256;
				float maxRGB = max(rgb.r, max(rgb.g, rgb.b));
				float D      = max(MaxRange / maxRGB, 1);
				D            = saturate(floor(D) / 255.0);
				// NOTE: BABYLONJS RGBA Encoding
				// vec3 rgb = color.rgb * D;
				// rgb = toGammaSpace(rgb); // Helps with png quantization.
				// return vec4(rgb, D); 
				return float4(rgb.rgb * (D * (255.0 / MaxRange)), D);
			}

			float3 DecodeRGBD(float4 rgbd)
			{
				float MaxRange = 256;
				// NOTE: BABYLONJS RGBA Decoding
				// rgbd.rgb = toLinearSpace(rgbd.rgb); // Helps with png quantization.
				// return rgbd.rgb / rgbd.a;
				return rgbd.rgb * ((MaxRange / 255.0) / rgbd.a);
			}

			vertOutput vert(vertInput input)
			{
				vertOutput o;
				o.pos = UnityObjectToClipPos(input.pos);
				o.texcoord.x = input.texcoord.x;
				if(_FlipY == 1) o.texcoord.y = (1.0 - input.texcoord.y);
				else o.texcoord.y = input.texcoord.y;
				return o;
			}

			float4 frag(vertOutput output) : COLOR
			{
				float4 result = tex2D(_MainTex, output.texcoord);
				if(_GammaOut != 1.0){
					result.rgb = pow(result.rgb, _GammaOut);
				}
				if (_EncodeHDR == 1) {
					result = EncodeRGBD(result.rgb);
				}
				return result;
			}
	    	ENDCG
	  	}
	}
	Fallback off
}