#ifndef GLTF_CONVERT_COLORS
#define GLTF_CONVERT_COLORS

float linearToGamma1(float c) {
    if (c <= 0.0F)
        return 0.0F;
    else if (c <= 0.0031308F)
        return 12.92F * c;
    else if (c < 1.0F)
        return 1.055F * pow(c, 0.4166667F) - 0.055F;
    else
        return pow(c, 0.45454545F);
};
float linearToSrgb1(float c) {
	float gamma = 2.4;
    float v = 0.0;
    if (c < 0.0031308) {
        if (c > 0.0) v = c * 12.92;
    } else {
        v = 1.055 * pow(c, 1.0 / gamma) - 0.055;
    }
    return v;
};




float gammaToLinear1(float c) {
    if (c <= 0.04045F)
        return c / 12.92F;
    else if (c < 1.0F)
        return pow((c + 0.055F)/1.055F, 2.4F);
    else
        return pow(c, 2.2F);
};
float srgbToLinear1(float c) {
	float gamma = 2.4;
    float v = 0.0;
    if (c < 0.04045) {
        if (c >= 0.0) v = c * (1.0 / 12.92);
    } else {
        v = pow((c + 0.055) * (1.0 / 1.055), gamma);
    }
    return v;
};




float4 linearToGamma(float4 c) {
    float4 col = float4(0.0, 0.0, 0.0 ,1.0);
    col.r = linearToGamma1(c.r);
    col.g = linearToGamma1(c.g);
    col.b = linearToGamma1(c.b);
    col.a = c.a;
    return col;
};
float4 linearToSrgb(float4 c){
    float4 col = float4(0.0, 0.0, 0.0 ,1.0);
    col.r = linearToSrgb1(c.r);
    col.g = linearToSrgb1(c.g);
    col.b = linearToSrgb1(c.b);
    col.a = c.a;
    return col;
};






float4 gammaToLinear(float4 c) {
	float4 col = float4(0.0, 0.0, 0.0 ,1.0);
    col.r = gammaToLinear1(c.r);
    col.g = gammaToLinear1(c.g);
    col.b = gammaToLinear1(c.b);
    col.a = c.a;
    return col;
};
float4 srgbToLinear(float4 c){
	float4 col = float4(0.0, 0.0, 0.0 ,1.0);
    col.r = srgbToLinear1(c.r);
    col.g = srgbToLinear1(c.g);
    col.b = srgbToLinear1(c.b);
    col.a = c.a;
    return col;
};

#endif // GLTF_CONVERT_COLORS
