# Required deviations from Gecko style

## 4-space instead of 2-space

## 90 character lines
We have longer than usual identifiers, particularly in GL code.
4-space instead of 2-space also often means an extra 4-6 chars per line.

This is 86 chars:

~~~
        gl->fGetVertexAttribiv(0, LOCAL_GL_VERTEX_ATTRIB_ARRAY_ENABLED, &vaa0Enabled);
~~~

## `case` statements are not indented, but their braced blocks are

~~~
    switch (foo) {
    case 0:
        return 5;
    case 1:
        {
            int foo = 7;
            return foo;
        }
    default:
        return 0;
    }
~~~

## No hungarian warts for arguments or enums
Neither is part of the prevailing c++ style.

~~~
enum class ContextProfile : uint8_t {
    Unknown = 0,
    OpenGLCore,
    OpenGLCompatibility,
    OpenGLES
};
~~~
---
~~~
void
WebGLContext::ReadPixelsImpl(GLint x, GLint y, GLsizei rawWidth, GLsizei rawHeight,
                             GLenum packFormat, GLenum packType, void* dest,
                             uint32_t dataLen)
{
~~~

## Simple if blocks omit braces for control flow statements

~~~
        if (!mIsClientData || !mPtr)
            break;
~~~

But!:

~~~
    if (mBoundDrawFramebuffer) {
        if (!mBoundDrawFramebuffer->ValidateAndInitAttachments(funcName))
            return false;
    }
~~~

## Multi-line conditionals must brace their branch block

~~~
        if (!webgl->mPixelStore_FlipY &&
            !webgl->mPixelStore_PremultiplyAlpha)
        {
            break;
        }
~~~

Otherwise this would be:

~~~
        if (!webgl->mPixelStore_FlipY &&
            !webgl->mPixelStore_PremultiplyAlpha) {
            break;
        }
~~~

## Out-vars are `T* const out_foo` (or just `out`, if trivial)
This ensures that the call site is clear when it's expecting a value back.

~~~
bool
GuessDivisors(const gfx::IntSize& ySize, const gfx::IntSize& uvSize,
              gfx::IntSize* const out_divisors)
{
    const gfx::IntSize divisors((ySize.width  == uvSize.width ) ? 1 : 2,
                                (ySize.height == uvSize.height) ? 1 : 2);
    if (uvSize.width  * divisors.width != ySize.width ||
        uvSize.height * divisors.height != ySize.height)
    {
        return false;
    }
    *out_divisors = divisors;
    return true;
}

[...]

    gfx::IntSize divisors;
    if (!GuessDivisors(yTexSize, uvTexSize, &divisors)) {
        gfxCriticalError() << "GuessDivisors failed:"
                           << yTexSize.width << ","
                           << yTexSize.height << ", "
                           << uvTexSize.width << ","
                           << uvTexSize.height;
        return false;
    }
~~~

# Recommendations

## Prefer `(void)Foo();` to `mozilla::unused << Foo();`
It's the prevailing standard for c++.

## Object member declarations at the top of the object
An object's members can tell you a lot about what it does and how it works.
Put them front-and-center at the top of the object declaration.
This also makes it easy to keep your initializer lists sorted.

~~~
struct FormatInfo
{
    const EffectiveFormat effectiveFormat;
    const char* const name;
    const GLenum sizedFormat;
    const UnsizedFormat unsizedFormat;
    const ComponentType componentType;
    const bool isSRGB;

    const CompressedFormatInfo* const compression;

    const uint8_t estimatedBytesPerPixel; // 0 iff bool(compression).

    // In bits. Iff bool(compression), active channels are 1.
    const uint8_t r;
    const uint8_t g;
    const uint8_t b;
    const uint8_t a;
    const uint8_t d;
    const uint8_t s;

    //////

    std::map<UnsizedFormat, const FormatInfo*> copyDecayFormats;

    const FormatInfo* GetCopyDecayFormat(UnsizedFormat) const;

    bool IsColorFormat() const {
         // Alpha is a 'color format' since it's 'color-attachable'.
        return bool(compression) ||
               bool(r | g | b | a);
    }
};
~~~
---
~~~
class TexUnpackBytes final : public TexUnpackBlob
{
public:
    const bool mIsClientData;
    const uint8_t* const mPtr;
    const size_t mAvailBytes;

    TexUnpackBytes(const WebGLContext* webgl, TexImageTarget target, uint32_t width,
                   uint32_t height, uint32_t depth, bool isClientData, const uint8_t* ptr,
                   size_t availBytes);

    virtual bool HasData() const override { return !mIsClientData || bool(mPtr); }

    virtual bool Validate(WebGLContext* webgl, const char* funcName,
                          const webgl::PackingInfo& pi) override;
    virtual bool TexOrSubImage(bool isSubImage, bool needsRespec, const char* funcName,
                               WebGLTexture* tex, TexImageTarget target, GLint level,
                               const webgl::DriverUnpackInfo* dui, GLint xOffset,
                               GLint yOffset, GLint zOffset,
                               const webgl::PackingInfo& pi, GLenum* const out_error) const override;
};
~~~

## `const` All The Things
Use const wherever you can.
Const members should be public, instead of needing a getter.
Const prevents values from changing when you don't expect.
It'd really be best if const were the default, but alas, we must be verbose.

### `final` All The Objects
Default to final. If someone wants it not to be final later, they can change it.

## Use `mutable` to enable caches or notes on otherwise-const objects
Const doesn't have to be absolute.

~~~
    mutable uint64_t mDataAllocGLCallCount;

    void OnDataAllocCall() const {
        mDataAllocGLCallCount++;
    }
~~~

## Use `auto` if the type is obvious or onerous

~~~
    const auto usedRowsPerImage = CheckedUint32(mPixelStore_UnpackSkipRows) + height;
~~~
---
~~~
    auto itr = dest.find(key);
    if (itr == dest.end())
        return nullptr;
~~~

### `const auto&` All The Things
const auto& lets you name an intermediate without ever incurring a copy.
This is powerful for decomposing complicated expressions without needing to be as careful about avoiding copies.

~~~
    for (const auto& uniform : uniforms) {
        if (uniform->mActiveInfo->mBaseUserName == baseUserName) {
            info = uniform;
            break;
        }
    }
~~~
---
~~~
        const auto& map = format->copyDecayFormats;
        const auto itr = map.find(format->unsizedFormat);
        MOZ_ASSERT(itr != map.end(), "Renderable formats must be in copyDecayFormats.");
~~~

## Lambdas provide next-level functional decomposition

~~~
    const auto fnName = [&](WebGLFramebuffer* fb) {
        return fb ? fb->mGLName : 0;
    };

    if (mWebGL->IsWebGL2()) {
        mGL->fBindFramebuffer(LOCAL_GL_DRAW_FRAMEBUFFER, fnName(mWebGL->mBoundDrawFramebuffer));
        mGL->fBindFramebuffer(LOCAL_GL_READ_FRAMEBUFFER, fnName(mWebGL->mBoundReadFramebuffer));
    } else {
        MOZ_ASSERT(mWebGL->mBoundDrawFramebuffer == mWebGL->mBoundReadFramebuffer);
        mGL->fBindFramebuffer(LOCAL_GL_FRAMEBUFFER, fnName(mWebGL->mBoundDrawFramebuffer));
    }
~~~
---
~~~
    const auto fnNarrowType = [&](webgl::ComponentType type) {
        switch (type) {
        case webgl::ComponentType::NormInt:
        case webgl::ComponentType::NormUInt:
            // These both count as "fixed-point".
            return webgl::ComponentType::NormInt;

        default:
            return type;
        }
    };

    const auto srcType = fnNarrowType(srcFormat->componentType);
    const auto dstType = fnNarrowType(dstFormat->componentType);
    if (dstType != srcType) {
~~~

## Getter pattern
Getters should take this pattern:

~~~
    const decltype(mOptions)& Options() const { return mOptions; }
~~~

It's occasionally useful to use a macro for this:

~~~
#define GETTER(X) const decltype(m##X)& X() const { return m##X; }

    GETTER(IntegerFunc)
    GETTER(Type)
    GETTER(BaseType)
    GETTER(Size)
    GETTER(BytesPerVertex)
    GETTER(Normalized)
    GETTER(Stride)
    GETTER(ExplicitStride)
    GETTER(ByteOffset)

#undef GETTER
~~~

## Early-out is better than prolonged or deeply nested code

~~~
uint64_t
IndexedBufferBinding::ByteCount() const
{
    if (!mBufferBinding)
        return 0;

    uint64_t bufferSize = mBufferBinding->ByteLength();
    if (!mRangeSize) // BindBufferBase
        return bufferSize;

    if (mRangeStart >= bufferSize)
        return 0;
    bufferSize -= mRangeStart;

    return std::min(bufferSize, mRangeSize);
}
~~~

## Non-trivial non-inlined functions should be defined in a source file, not a header
Otherwise they get inlined all over, which hurts code locality and cache behaviors.

## Prefer function-style casts for value types

~~~
    if (uint32_t(rwWidth) == width &&
        uint32_t(rwHeight) == height)
~~~

# Code readability or maintainability can override style guidelines

Sometimes it's just cleaner to have one line in a thousand be too long, rather than struggling to wrap it.
If you're frustrated trying to get something to look good within the style guidelines, just cheat.
Don't cheat too often, but style is meant to aid readability and maintainability, not hurt it.

And sometimes you just need to do an ugly thing.

~~~
    switch (internalFormat) {
    case LOCAL_GL_RED:             *out = webgl::UnsizedFormat::R;    break;
    case LOCAL_GL_RG:              *out = webgl::UnsizedFormat::RG;   break;
    case LOCAL_GL_RGB:             *out = webgl::UnsizedFormat::RGB;  break;
    case LOCAL_GL_RGBA:            *out = webgl::UnsizedFormat::RGBA; break;
    case LOCAL_GL_LUMINANCE:       *out = webgl::UnsizedFormat::L;    break;
    case LOCAL_GL_ALPHA:           *out = webgl::UnsizedFormat::A;    break;
    case LOCAL_GL_LUMINANCE_ALPHA: *out = webgl::UnsizedFormat::LA;   break;

    default:
        return false;
    }
~~~
---
~~~
ScopedUnpackReset::ScopedUnpackReset(WebGLContext* webgl)
    : ScopedGLWrapper<ScopedUnpackReset>(webgl->gl)
    , mWebGL(webgl)
{
    if (mWebGL->mPixelStore_UnpackAlignment != 4) mGL->fPixelStorei(LOCAL_GL_UNPACK_ALIGNMENT, 4);

    if (mWebGL->IsWebGL2()) {
        if (mWebGL->mPixelStore_UnpackRowLength   != 0) mGL->fPixelStorei(LOCAL_GL_UNPACK_ROW_LENGTH  , 0);
        if (mWebGL->mPixelStore_UnpackImageHeight != 0) mGL->fPixelStorei(LOCAL_GL_UNPACK_IMAGE_HEIGHT, 0);
        if (mWebGL->mPixelStore_UnpackSkipPixels  != 0) mGL->fPixelStorei(LOCAL_GL_UNPACK_SKIP_PIXELS , 0);
        if (mWebGL->mPixelStore_UnpackSkipRows    != 0) mGL->fPixelStorei(LOCAL_GL_UNPACK_SKIP_ROWS   , 0);
        if (mWebGL->mPixelStore_UnpackSkipImages  != 0) mGL->fPixelStorei(LOCAL_GL_UNPACK_SKIP_IMAGES , 0);

        if (mWebGL->mBoundPixelUnpackBuffer) mGL->fBindBuffer(LOCAL_GL_PIXEL_UNPACK_BUFFER, 0);
    }
}
~~~
---
~~~
#define FOR_EACH_ATTACHMENT(X)            \
    X(mDepthAttachment);                  \
    X(mStencilAttachment);                \
    X(mDepthStencilAttachment);           \
                                          \
    for (auto& cur : mColorAttachments) { \
        X(cur);                           \
    }

void
WebGLFramebuffer::DetachTexture(const char* funcName, const WebGLTexture* tex)
{
    const auto fnDetach = [&](WebGLFBAttachPoint& attach) {
        if (attach.Texture() == tex) {
            attach.Clear(funcName);
        }
    };

    FOR_EACH_ATTACHMENT(fnDetach)
}

void
WebGLFramebuffer::DetachRenderbuffer(const char* funcName, const WebGLRenderbuffer* rb)
{
    const auto fnDetach = [&](WebGLFBAttachPoint& attach) {
        if (attach.Renderbuffer() == rb) {
            attach.Clear(funcName);
        }
    };

    FOR_EACH_ATTACHMENT(fnDetach)
}
~~~
---
~~~
void
WebGLContext::UniformMatrixAxBfv(const char* funcName, uint8_t A, uint8_t B,
                                 WebGLUniformLocation* loc, const bool transpose,
                                 const Float32Arr& arr, GLuint elemOffset,
                                 GLuint elemCountOverride)
{

[...]

    static const decltype(&gl::GLContext::fUniformMatrix2fv) kFuncList[] = {
        &gl::GLContext::fUniformMatrix2fv,
        &gl::GLContext::fUniformMatrix2x3fv,
        &gl::GLContext::fUniformMatrix2x4fv,

        &gl::GLContext::fUniformMatrix3x2fv,
        &gl::GLContext::fUniformMatrix3fv,
        &gl::GLContext::fUniformMatrix3x4fv,

        &gl::GLContext::fUniformMatrix4x2fv,
        &gl::GLContext::fUniformMatrix4x3fv,
        &gl::GLContext::fUniformMatrix4fv
    };
    const auto func = kFuncList[3*(A-2) + (B-2)];

    MakeContextCurrent();
    (gl->*func)(loc->mLoc, numMatsToUpload, uploadTranspose, uploadBytes);
}
~~~
