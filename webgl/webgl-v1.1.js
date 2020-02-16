(() => {
   // WebGL 1 has universal support for the following:
   // * ANGLE_instanced_arrays
   // * EXT_blend_minmax
   // * OES_element_index_uint
   // * OES_standard_derivatives
   // * OES_vertex_array_object
   // * WEBGL_debug_renderer_info
   // * WEBGL_lose_context
   // Include this library to modify WebGL 1.0 into 1.1 by including these extensions.

   if (WebGLRenderingContext.prototype.drawArraysInstanced) return;

   // -

   let prev = WebGLRenderingContext.prototype.getParameter;
   WebGLRenderingContext.prototype.getParameter = function(pname) {
      if (pname == this.VERSION)
         return 'WebGL 1.1';

      if (pname == this.SHADING_LANGUAGE_VERSION)
         return 'WebGL GLSL ES 1.1';

      return prev.apply(this, arguments);
   }

   const SHADER_PREAMBLE = `
#extension GL_OES_standard_derivatives : enable
#line 1
`;

   prev = WebGLRenderingContext.prototype.shaderSource;
   WebGLRenderingContext.prototype.shaderSource = function(shader, source) {
      const modified = SHADER_PREAMBLE + source;
      return prev.call(this, shader, modified);
   }

   // These need to indirect through the current context's valid extensions, since context
   // loss detaches/invalidates all extensions. (except for WEBGL_lose_context)

   WebGLRenderingContext.prototype.drawArraysInstanced = function() {
      this._ANGLE_instanced_arrays.drawArraysInstancedANGLE(...arguments);
   }
   WebGLRenderingContext.prototype.drawElementsInstanced = function() {
      this._ANGLE_instanced_arrays.drawElementsInstancedANGLE(...arguments);
   }
   WebGLRenderingContext.prototype.vertexAttribDivisor = function() {
      this._ANGLE_instanced_arrays.vertexAttribDivisorANGLE(...arguments);
   }

   WebGLRenderingContext.prototype.createVertexArray = function() {
      return this._OES_vertex_array_object.createVertexArrayOES(...arguments);
   }
   WebGLRenderingContext.prototype.deleteVertexArray = function() {
      this._OES_vertex_array_object.deleteVertexArrayOES(...arguments);
   }
   WebGLRenderingContext.prototype.isVertexArray = function() {
      return this._OES_vertex_array_object.isVertexArrayOES(...arguments);
   }
   WebGLRenderingContext.prototype.bindVertexArray = function() {
      this._OES_vertex_array_object.bindVertexArrayOES(...arguments);
   }

   // Handle these the same way, even though this extension isn't lost.
   WebGLRenderingContext.prototype.loseContext = function() {
      this._WEBGL_lose_context.loseContext(...arguments);
   }
   WebGLRenderingContext.prototype.restoreContext = function() {
      this._WEBGL_lose_context.restoreContext(...arguments);
   }

   function init_exts(gl) {
      const reset_exts = () => {
         let ext;

         ext = gl._ANGLE_instanced_arrays = gl.getExtension('ANGLE_instanced_arrays');
         gl.VERTEX_ATTRIB_ARRAY_DIVISOR = ext.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE;

         // -

         ext = gl.getExtension('EXT_blend_minmax');
         gl.MIN = ext.MIN_EXT;
         gl.MAX = ext.MAX_EXT;

         // -

         gl.getExtension('OES_element_index_uint');

         // -

         ext = gl.getExtension('OES_standard_derivatives');
         gl.FRAGMENT_SHADER_DERIVATIVE_HINT = ext.FRAGMENT_SHADER_DERIVATIVE_HINT_OES;

         // -

         ext = gl._OES_vertex_array_object = gl.getExtension('OES_vertex_array_object');
         gl.VERTEX_ARRAY_BINDING = ext.VERTEX_ARRAY_BINDING;

         // -

         ext = gl.getExtension('WEBGL_debug_renderer_info');
         gl.UNMASKED_VENDOR = ext.UNMASKED_VENDOR_WEBGL;
         gl.UNMASKED_RENDERER = ext.UNMASKED_RENDERER_WEBGL;

         // -

         gl._WEBGL_lose_context = gl.getExtension('WEBGL_lose_context');
      };
      reset_exts();
      gl.canvas.addEventListener('webglcontextrestored', reset_exts);
   };

   prev = HTMLCanvasElement.prototype.getContext;
   HTMLCanvasElement.prototype.getContext = function() {
      const ret = prev.apply(this, arguments);

      if (ret instanceof WebGLRenderingContext && !ret._WEBGL_lose_context) {
         init_exts(ret);
      }

      return ret;
   }
})();
