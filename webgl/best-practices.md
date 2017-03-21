*(these will often apply to OpenGL as well)*

### 'Delete' object handles eagerly
Allow eager freeing of resources by 'deleting' object handles as soon as they
are otherwise attached to GL.

~~~
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, ...);
gl.compileShader(vs);
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.deleteShader(vs); // Cedes control from DOM.
~~~

### Avoid invalidating FBOs' state
Almost any change to an FBO's state will invalidate its framebuffer
completeness.
Set up your hot framebuffers ahead of time.
