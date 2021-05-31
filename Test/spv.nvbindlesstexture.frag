#version 450
#extension GL_NV_bindless_texture : enable
#extension GL_ARB_gpu_shader_int64 : enable

// Test case 1
// If both bindless_sampler and bound_sampler, or bindless_image and bound_image, are declared at 
// global scope in any compilation unit, a link-time error will be generated
layout (location=0) uniform sampler2D theSampler; // decoration should be BindlessSamplerNV
layout (location=1) uniform layout(rgba32f) image2D theImage1;// decoration should be BindlessImageNV

in vec2 tCoord;

layout(binding = 2) uniform UBO
{
    int some_int;
    float fixed_array[3];
    sampler2D uboSampler[3];
    layout(rgba32f) image2D uboImage;
    uint64_t textureHandle;
    uint64_t textureHandleI;
};

layout(std430, binding = 0) buffer SSBO
{
    int var1;
    float ssboArray[3];
    sampler2D ssboSampler[3];
    layout(rgba32f) image2D inUniformImage;
    uint64_t utextureHandle;
};

// 3. Enables sampler/image type as part of a structure
struct Light
{
   sampler2D theStructSampler;
   layout(rgba32f) image2D inImage;
} test;

void testSamplerConstructors()
{
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

    // identity constructors
    sampler1D samp1D_iden = sampler1D(samp1D);
    isampler2D isamp2D_iden = isampler2D(isamp2D);
    usampler3D usamp3D_iden = usampler3D(usamp3D);
    samplerCube sampCube_iden = samplerCube(sampCube); 
    isampler1DArray isamp1DA_iden = isampler1DArray(isamp1DA);
    usampler2DArray usamp2DA_iden = usampler2DArray(usamp2DA);
    isamplerCubeArray isampCubeA_iden = isamplerCubeArray(isampCubeA);

    sampler1DShadow samp1Ds_iden = sampler1DShadow(samp1Ds);
    sampler2DShadow samp2Ds_iden = sampler2DShadow(samp2Ds);
    samplerCubeShadow sampCubes_iden = samplerCubeShadow(sampCubes);
    sampler1DArrayShadow samp1DAs_iden = sampler1DArrayShadow(samp1DAs);
    sampler2DArrayShadow samp2DAs_iden = sampler2DArrayShadow(samp2DAs);
    samplerCubeArrayShadow sampCubeAs_iden = samplerCubeArrayShadow(sampCubeAs);

}

void testImageConstructors() {
    // Test additional image layouts
    // uint64_t <-> image Type
    layout(rgba32f) image1D  i1D = layout(rgba32f) image1D(textureHandle);
    layout(rgba32f) image2D  i2D = layout(rgba32f) image2D(textureHandle);
    layout(rgba32f) image3D  i3D = layout(rgba32f) image3D(textureHandle);
    layout(rgba32f) imageCube  iCube = layout(rgba32f) imageCube(textureHandle);

    layout(rgba32f) imageCubeArray  iCubeArray = layout(rgba32f) imageCubeArray(utextureHandle);
    layout(rgba32f) image1DArray    i1DArray = layout(rgba32f) image1DArray(utextureHandle);
    layout(rg16)    image2DArray    i2DArray = layout(rg16)    image2DArray(utextureHandle);
    layout(rgba32f) imageBuffer     iBuffer  = layout(rgba32f) imageBuffer(textureHandle);
    layout(rgba32f) image2DMS       i2DMS = layout(rgba32f) image2DMS(textureHandle);
    layout(rgba32f) image2DMSArray  i2DMSArray = layout(rgba32f) image2DMSArray(utextureHandle);

    layout(r32i) iimage1D  ii1D = layout(r32i) iimage1D(textureHandle);
    layout(r32ui) uimage2D ui2D = layout(r32ui) uimage2D(utextureHandle);
    layout(r32i)  iimage2DMS ii2DMS = layout(r32i)  iimage2DMS(textureHandle);
    layout(r32ui) uimage2DMSArray ui2DMSArray = layout(r32ui) uimage2DMSArray(utextureHandle);

    // Test identity constructors
    layout(rgba32f) image1D  i1D_iden = layout(rgba32f) image1D(i1D);
    layout(rgba32f) image2D  i2D_iden = layout(rgba32f) image2D(i2D);
    layout(rgba32f) image3D  i3D_iden = layout(rgba32f) image3D(i3D);
    layout(rgba32f) imageCube  iCube_iden = layout(rgba32f) imageCube(iCube);

    layout(rgba32f) imageCubeArray  iCubeArray_iden = layout(rgba32f) imageCubeArray(iCubeArray);
    layout(rgba32f) image1DArray    i1DArray_iden = layout(rgba32f) image1DArray(i1DArray);
    layout(rg16)    image2DArray    i2DArray_iden = layout(rg16)    image2DArray(i2DArray);
    layout(rgba32f) imageBuffer     iBuffer_iden  = layout(rgba32f) imageBuffer(iBuffer);
    layout(rgba32f) image2DMS       i2DMS_iden = layout(rgba32f) image2DMS(i2DMS);
    layout(rgba32f) image2DMSArray  i2DMSArray_iden = layout(rgba32f) image2DMSArray(i2DMSArray);

    layout(r32i) iimage1D  ii1D_iden = layout(r32i) iimage1D(ii1D);
    layout(r32ui) uimage2D ui2D_iden = layout(r32ui) uimage2D(ui2D);
    layout(r32i)  iimage2DMS ii2DMS_iden = layout(r32i)  iimage2DMS(ii2DMS);
    layout(r32ui) uimage2DMSArray ui2DMSArray_iden = layout(r32ui) uimage2DMSArray(ui2DMSArray);

}

void main()
{

    sampler2D theLocalSampler = sampler2D(textureHandle);
    textureQueryLevels(theSampler);
    textureQueryLevels(theLocalSampler);
    layout(rgba32f) image2D localimg = layout(rgba32f) image2D(textureHandleI);
    test.inImage = layout(rgba32f) image2D(textureHandleI);

    vec4 res = texture(sampler2D(textureHandle), vec2(0));
    vec4 res1 = imageLoad(localimg, ivec2(0));
    vec4 res2 = imageLoad(layout(rgba32f) image2D(textureHandleI), ivec2(0));


    sampler2D utheSampler = sampler2D(textureHandle);      // uint64 -> sampler
    layout(rgba32f) image2D ulocalImage = layout(rgba32f) image2D(textureHandle); // uint64 -> image
    uint64_t lu64utextureHandle = uint64_t(uboSampler[0]);      // sampler -> uint64
    uint64_t lu64imgutextureHandle = uint64_t(uboImage);	    // image -> uint64
    
    testSamplerConstructors();
    testImageConstructors();
}
