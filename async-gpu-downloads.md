# Async downloads in blocking APIs

## Conceptually, we want to:

- Enqueue writes to a GPU-side buffer
- Download the result asynchronously
- Map and operate on the result only once it's ready, without stalling the pipeline

## Abstract approach

- Enqueue writes to a GPU-side buffer
- Enqueue a copy from that buffer to a CPU-side buffer
- Enqueue a fence to establish when the copy is complete
- Wait/poll for the fence to complete
- Map the CPU buffer that we copied into
  - Since the fence has been passed, this should be immediate
- ...
- Unmap

## OpenGL ES 3+ example class

~~~
class AsyncReadback {
   GLsizeiptr mSize;
   GLuint mBuffer;
   GLuint mFence;

public:
   AsyncReadback(GLenum srcTarget, GLintptr readOffset, GLsizeiptr size) {
      mSize = size;
      glGenBuffers(1, &mBuffer);
      glBindBuffer(GL_COPY_WRITE_BUFFER, mBuffer);
      glBufferData(GL_COPY_WRITE_BUFFER, size, nullptr, GL_STREAM_READ);
      glCopyBufferSubData(srcTarget, GL_COPY_WRITE_BUFFER, readOffset, 0, size);
      mFence = glFenceSync(GL_SYNC_GPU_COMMANDS_COMPLETE, 0);
      // NB: This isn't guaranteed to become signaled unless you glFlush! (or similar)
   }

   ~AsyncReadback() {
      glDeleteSync(mFence);
      glDeleteBuffers(1, &mBuffer);
   }

   const void* TryMap(GLenum target) {
      if (mFence) {
         GLenum status;
         glGetSynciv(mFence, GL_SYNC_STATUS, 1, nullptr, (GLint*)&status);
         if (status != GL_SIGNALED)
            return nullptr;
         glDeleteSync(mFence);
         mFence = 0;
      }
      glBindBuffer(target, mBuffer);
      return (const void*)glMapBufferRange(target, 0, mSize, GL_MAP_READ_BIT);
   }

   void Unmap(GLenum target) {
      glBindBuffer(target, mBuffer);
      glUnmapBuffer(target);
   }
};
~~~

## Takeaways

- Blocking APIs can support async behavior without callbacks or other sophisticated async mechanisms
- Making the copy explicit leads to predictable behavior
- This is the approach provided in extant native APIs
  - Some APIs do allow for synchronizing/stalling/blocking reads
    - This notably *does* includes WebGL (glReadPixels, glFinish) for historical reasons

### Notes

All references to GPU-side and CPU-side can be replaced by the more generic remote/non-mappable and local/mappable.
This approach is not non-UMA or discrete-GPU specific.
A multithreaded driver/implementation (especially a cross-process one) would benefit from this even on a UMA device.

In WebGL, we can warn when an app messes this up and incurs a pipeline stall.
This warning was implemented in Firefox in [bug 1425488](https://bugzilla.mozilla.org/show_bug.cgi?id=1425488).
