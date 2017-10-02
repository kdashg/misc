*(these will often apply to OpenGL as well)*

## Avoid invalidating FBOs' state
Almost any change to an FBO's state will invalidate its framebuffer
completeness.
Set up your hot framebuffers ahead of time.

## Delete objects eagerly
Don't wait for the GC/CC to realize objects are orphaned and destroy them.
Implementations track the liveness of objects, so 'deleting' them at the API level only
releases the handle that refers to the actual object. (conceptually releasing the handle's
ref-pointer to the object)
Only once the object is unused in the implementation is it actually freed.
For example, if you never want to access your shaders directly again, just delete their
handles after attaching them to a program.

## Flush when expecting results (like queries or rendering frame completion)
Flush tells the implementation to push all pending commands out for execution, not leaving
any around in a buffer, waiting for more commands to execute.

For example, it is possible for the following to never complete without context loss:
~~~
sync = glFenceSync(GL_SYNC_GPU_COMMANDS_COMPLETE, 0);
glClientWaitSync(sync, 0, GL_TIMEOUT_IGNORED);
~~~

WebGL doesn't have a SwapBuffers call by default, so a flush can help fill the gap, as
well.
