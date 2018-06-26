#include <d3d11_1.h>
#include <d3dcompiler.h>
#include <vector>
#include <cstdio>

#define ASSERT(X) \
    if (!(X)) { \
        *(int*)3 = 42; \
    }

constexpr UINT DISJOINT_SO_RANGES = 2;

const std::string vs_src(R"(
struct vs_in
{
    float2 xy : POSITION;
};

struct vs_out
{
    float4 pos : SV_POSITION;
    float2 xy : POSITION;
};

//--------------------------------------------------------------------------------------
// Vertex Shader
//--------------------------------------------------------------------------------------
vs_out Main(vs_in input)
{
    vs_out output;
    output.pos = float4(0,0,0,1);
    output.xy = input.xy * 3;
    return output;
}
)");

int
main(const int argc, const char* const argv[])
{
    HRESULT hr;

    UINT flags = D3D11_CREATE_DEVICE_DEBUG;
    const std::vector<D3D_FEATURE_LEVEL> feature_levels({
        //D3D_FEATURE_LEVEL_11_1,
        D3D_FEATURE_LEVEL_11_0,
    });
    ID3D11Device* device = nullptr;
    D3D_FEATURE_LEVEL feature_level;
    ID3D11DeviceContext* context = nullptr;
    hr = D3D11CreateDevice(nullptr, D3D_DRIVER_TYPE_REFERENCE, nullptr,
                           flags, feature_levels.data(), feature_levels.size(),
                           D3D11_SDK_VERSION, &device, &feature_level, &context);
    ASSERT(device);

    // --

    ID3DBlob* vs_blob = nullptr;
    ID3DBlob* err_blob = nullptr;
    hr = D3DCompile(vs_src.data(), vs_src.size(), "vs_src", nullptr, nullptr, "Main", "vs_5_0",
        D3DCOMPILE_ENABLE_STRICTNESS, 0, &vs_blob, &err_blob);
    const char* err_str = nullptr;
    if (err_blob) {
        err_str = (const char*)err_blob->GetBufferPointer();
        printf("%s", err_str);
    }
    ASSERT(vs_blob);
    const auto vs_bytes_ptr = vs_blob->GetBufferPointer();
    const auto vs_bytes_size = vs_blob->GetBufferSize();

    ID3D11VertexShader* vs_shader = nullptr;
    hr = device->CreateVertexShader(vs_bytes_ptr, vs_bytes_size,
                                    nullptr, &vs_shader);
    ASSERT(vs_shader);

    ID3D11GeometryShader* gs_shader = nullptr;
    {
        const D3D11_SO_DECLARATION_ENTRY descs[] {
            { 0, "POSITION", 0, 0, 1, 0 },
            { 0, "POSITION", 0, 1, 1, 1 },
        };
        const UINT strides[2] { 4, 4 };
        hr = device->CreateGeometryShaderWithStreamOutput(vs_bytes_ptr, vs_bytes_size,
            descs, DISJOINT_SO_RANGES, strides, DISJOINT_SO_RANGES,
            D3D11_SO_NO_RASTERIZED_STREAM, nullptr, &gs_shader);
        ASSERT(gs_shader);
    }

    // --

    const float in_data[]{
        0.5, 1, 2, 3,
    };

    ID3D11Buffer* in_buffer = nullptr;
    {
        const D3D11_BUFFER_DESC desc{
            sizeof(in_data), D3D11_USAGE_DEFAULT,
            D3D11_BIND_VERTEX_BUFFER,
            0, 0,
            0
        };
        const D3D11_SUBRESOURCE_DATA data{ in_data };
        hr = device->CreateBuffer(&desc, &data, &in_buffer);
        ASSERT(in_buffer);
    }

    ID3D11Buffer* out_buffer = nullptr;
    {
        const D3D11_BUFFER_DESC desc{
            sizeof(in_data), D3D11_USAGE_DEFAULT,
            D3D11_BIND_STREAM_OUTPUT,
            0, 0,
            0
        };
        hr = device->CreateBuffer(&desc, nullptr, &out_buffer);
        ASSERT(out_buffer);
    }

    ID3D11Buffer* read_buffer = nullptr;
    {
        const D3D11_BUFFER_DESC desc{
            sizeof(in_data), D3D11_USAGE_STAGING,
            0,
            D3D11_CPU_ACCESS_READ, 0,
            0
        };
        hr = device->CreateBuffer(&desc, nullptr, &read_buffer);
        ASSERT(read_buffer);
    }

    // --

    context->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_POINTLIST);
    context->VSSetShader(vs_shader, nullptr, 0);
    context->GSSetShader(gs_shader, nullptr, 0);

    ID3D11InputLayout* input_layout = nullptr;
    {
        const D3D11_INPUT_ELEMENT_DESC desc{
            "POSITION", 0, DXGI_FORMAT_R32G32_FLOAT, 0, 0,
            D3D11_INPUT_PER_VERTEX_DATA, 0
        };
        hr = device->CreateInputLayout(&desc, 1, vs_bytes_ptr, vs_bytes_size,
            &input_layout);
        ASSERT(input_layout);
    }
    context->IASetInputLayout(input_layout);

    {
        const UINT strides[]{ 8 };
        const UINT offsets[]{ 0 };
        context->IASetVertexBuffers(0, 1, &in_buffer, strides, offsets);
    }
    {
        ID3D11Buffer* const buffers[]{ out_buffer, out_buffer };
        const UINT offsets[]{ 0, 8 };
        context->SOSetTargets(DISJOINT_SO_RANGES, buffers, offsets);
    }
    context->Draw(1, 0);

    // --

    context->CopyResource(read_buffer, out_buffer);

    D3D11_MAPPED_SUBRESOURCE mapped{};
    hr = context->Map(read_buffer, 0, D3D11_MAP_READ, 0, &mapped);
    ASSERT(mapped.pData);

    const auto out_data = (const float*)mapped.pData;
    ASSERT(out_data[0] == in_data[0] * 3.0f);

    context->Unmap(read_buffer, 0);

    // --

    printf("OK\n");
    return 0;
}
