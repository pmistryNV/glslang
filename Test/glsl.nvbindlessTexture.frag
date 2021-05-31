#version 450
#extension GL_NV_bindless_texture : enable
#extension GL_ARB_gpu_shader_int64 : enable //enables unit64_t

// 1. Input sampler and image data type with flat qualifier
flat in sampler2D inSampler;
flat in layout(rgba32f) image2D inImage;
flat in uint64_t inTexturehandle;

in vec2 texCoord;

// opaque layout qualifier on a uniform variable
layout (location=0) uniform sampler2D theSampler; 
layout (location=1, rgba32f) uniform image2D theImage; 

// 2. Enables sampler/image type as part of a structure
struct Light
{
   sampler2D theStructSampler;
   layout(rgba32f) image2D theStructImage;
} test;

// 3. Inside a uniform block 
uniform samplerBlock {
   sampler2D UboSampler;
   layout(rgba32f) image2D UboImage;
   uint64_t utextureHandle;
};

// 4. Inside SSBO
buffer ssboName
{
    sampler2D ssboSampler;
    layout(rgba32f) image2D ssboImage;
};

// 5. As out parameter. Error in fragment shader only
//out sampler2D outSampler; 
//out layout(rgba32f) image2D OutImage;

// 6. sampler/images as out/inout function parameters
vec4 funcSampler(inout sampler2D paramSampler, out sampler2D paramSampler1)
{
    paramSampler = sampler2D(utextureHandle);
    return  texture(paramSampler, texCoord);
}

void funcImage(inout layout(rgba32f) image2D imgTemp)
{  
    imgTemp = layout(rgba32f) image2D(utextureHandle);      
}


void main()
{
    // 7. declare as uninitialized temporaries
    sampler2D theLocalSampler; 
    layout(rgba32f) image2D localimg;

    // conversions
    sampler2D utheSampler = sampler2D(utextureHandle);      // uint64 -> sampler
    layout(rgba32f) image2D ulocalImage = layout(rgba32f) image2D(utextureHandle); // uint64 -> image
    uint64_t lu64utextureHandle = uint64_t(inSampler);      // sampler -> uint64
    uint64_t lu64imgutextureHandle = uint64_t(inImage);	    // uint64 -> image
    writeonly image2D tempi2D = image2D(inTexturehandle);   // ignoring writeonly as part of casting

    // Use in sampler/image in texture/image operations
    vec4 res = texture(theSampler, texCoord); 
    vec4 res1 = texture(utheSampler, texCoord);
    vec4 res2 = texture(sampler2D(utextureHandle), texCoord);

    vec4 res4 = imageLoad(inImage, ivec2(0));
    ivec2 res5 = imageSize(tempi2D);

    // invoking in function
    sampler2D theLocalSampler1;    
    vec4 res6 = funcSampler(theLocalSampler, theLocalSampler1);
    funcImage(localimg);        

}

flat in int     ic1D;
flat in ivec2   ic2D;
flat in ivec3   ic3D;
flat in ivec4   ic4D;
flat in uint value;

void testImageTypes() {
    // Test additional image layouts
    // uint64_t <-> image Type
    layout(rgba32f) image1D  i1D = layout(rgba32f) image1D(utextureHandle);
    layout(rgba32f) image2D  i2D = layout(rgba32f) image2D(utextureHandle);
    layout(rgba32f) image3D  i3D = layout(rgba32f) image3D(utextureHandle);
    layout(rgba32f) imageCube  iCube = layout(rgba32f) imageCube(utextureHandle);

    layout(rgba32f) imageCubeArray  iCubeArray = layout(rgba32f) imageCubeArray(utextureHandle);
    layout(rgba32f) image2DRect     i2DRect = layout(rgba32f) image2DRect(utextureHandle);
    layout(rgba32f) image1DArray    i1DArray = layout(rgba32f) image1DArray(utextureHandle);
    layout(rg16)    image2DArray    i2DArray = layout(rg16)    image2DArray(utextureHandle);
    layout(rgba32f) imageBuffer     iBuffer  = layout(rgba32f) imageBuffer(utextureHandle);
    layout(rgba32f) image2DMS       i2DMS = layout(rgba32f) image2DMS(utextureHandle);
    layout(rgba32f) image2DMSArray  i2DMSArray = layout(rgba32f) image2DMSArray(utextureHandle);

    layout(r32i) iimage1D  ii1D = layout(r32i) iimage1D(utextureHandle);
    layout(r32ui) uimage2D ui2D = layout(r32ui) uimage2D(utextureHandle);
    layout(r32i)  iimage2DMS ii2DMS = layout(r32i)  iimage2DMS(utextureHandle);
    layout(r32ui) uimage2DMSArray ui2DMSArray = layout(r32ui) uimage2DMSArray(utextureHandle);

    ivec3 iv = ivec3(0);
    iv.x    += imageSize(i1D);
    iv.xy   += imageSize(i2D);
    iv.xyz  += imageSize(i3D);
    iv.xy   += imageSize(iCube);
    iv.xyz  += imageSize(iCubeArray);
    iv.xy   += imageSize(i2DRect);
    iv.xy   += imageSize(i1DArray);
    iv.xyz  += imageSize(i2DArray);
    iv.x    += imageSize(iBuffer);
    iv.xy   += imageSize(i2DMS);
    iv.xyz  += imageSize(i2DMSArray);

    ivec3 iv1 = ivec3(0);
    iv1.x    += imageSize(layout(rgba32f) image1D(utextureHandle));
    iv1.xy   += imageSize(layout(rgba32f) image2D(utextureHandle));
    iv1.xyz  += imageSize(layout(rgba32f) image3D(utextureHandle));
    iv1.xy   += imageSize(layout(rgba32f) imageCube(utextureHandle));
    iv1.xyz  += imageSize(layout(rgba32f) imageCubeArray(utextureHandle));
    iv1.xy   += imageSize(layout(rgba32f) image2DRect(utextureHandle));
    iv1.xy   += imageSize(layout(rgba32f) image1DArray(utextureHandle));
    iv1.xyz  += imageSize(layout(rgba32f) imageBuffer(utextureHandle));
    iv1.x    += imageSize(layout(rgba32f) imageBuffer(utextureHandle));
    iv1.xy   += imageSize(layout(rgba32f) image2DMS(utextureHandle));
    iv1.xyz  += imageSize(layout(rgba32f) image2DMSArray(utextureHandle));

    uint ui = 0;
    iv.x    += imageAtomicAdd(ii1D, ic1D, 10);
    ui      += imageAtomicAdd(ui2D, ic2D, value);
    iv.x    += imageAtomicCompSwap(ii2DMS, ic2D, 2, 18, 17);
    ui      += imageAtomicCompSwap(ui2DMSArray, ic3D, 3, 19u, value);
}


void testSamplerTypes() {

    sampler1D samp1D = sampler1D(utextureHandle);
    isampler2D isamp2D = isampler2D(utextureHandle);
    usampler3D usamp3D = usampler3D(utextureHandle);
    samplerCube sampCube = samplerCube(utextureHandle); 
    isampler1DArray isamp1DA = isampler1DArray(utextureHandle);
    usampler2DArray usamp2DA = usampler2DArray(utextureHandle);
    isamplerCubeArray isampCubeA = isamplerCubeArray(utextureHandle);

    sampler1DShadow samp1Ds = sampler1DShadow(utextureHandle);
    sampler2DShadow samp2Ds = sampler2DShadow(utextureHandle);
    samplerCubeShadow sampCubes = samplerCubeShadow(utextureHandle);
    sampler1DArrayShadow samp1DAs = sampler1DArrayShadow(utextureHandle);
    sampler2DArrayShadow samp2DAs = sampler2DArrayShadow(utextureHandle);
    samplerCubeArrayShadow sampCubeAs = samplerCubeArrayShadow(utextureHandle);

    vec2 lod;
    float pf;
    vec2 pf2;
    vec3 pf3;
    // Using temporaries
    lod = textureQueryLod(samp1D, pf);
    lod = textureQueryLod(isamp2D, pf2);
    lod = textureQueryLod(usamp3D, pf3);
    lod = textureQueryLod(sampCube, pf3);
    lod = textureQueryLod(isamp1DA, pf);
    lod = textureQueryLod(usamp2DA, pf2);
    lod = textureQueryLod(isampCubeA, pf3);

    lod = textureQueryLod(samp1Ds, pf);
    lod = textureQueryLod(samp2Ds, pf2);
    lod = textureQueryLod(sampCubes, pf3);
    lod = textureQueryLod(samp1DAs, pf);
    lod = textureQueryLod(samp2DAs, pf2);
    lod = textureQueryLod(sampCubeAs, pf3);

    // Using uvec2/uint64_t <-> sampler
    lod = textureQueryLod(sampler1D(utextureHandle), pf);
    lod = textureQueryLod(isampler2D(utextureHandle), pf2);
    lod = textureQueryLod(usampler3D(utextureHandle), pf3);
    lod = textureQueryLod(samplerCube(utextureHandle), pf3);
    lod = textureQueryLod(isampler1DArray(utextureHandle), pf);
    lod = textureQueryLod(usampler2DArray(utextureHandle), pf2);
    lod = textureQueryLod(isamplerCubeArray(utextureHandle), pf3);

    lod = textureQueryLod(sampler1DShadow(utextureHandle), pf);
    lod = textureQueryLod(sampler2DShadow(utextureHandle), pf2);
    lod = textureQueryLod(samplerCubeShadow(utextureHandle), pf3);
    lod = textureQueryLod(sampler1DArrayShadow(utextureHandle), pf);
    lod = textureQueryLod(sampler2DArrayShadow(utextureHandle), pf2);
    lod = textureQueryLod(samplerCubeArrayShadow(utextureHandle), pf3);
}

#extension GL_NV_bindless_texture : disable
void errorcases()
{
    sampler2D theLocalSampler; // Error : Declaring temporaries
    sampler2D utheSampler = sampler2D(utextureHandle);      // Error: explicit conversion uint64 -> sampler
    uint64_t lu64utextureHandle = uint64_t(inSampler);      // Error: explicit conversion sampler -> uint64
}