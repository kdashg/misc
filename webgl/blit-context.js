(function() {
    'use strict';

    function rectToDevicePixels(x, gl) {
        x[0] *= gl.drawingBufferWidth / gl.canvas.width;
        x[1] *= gl.drawingBufferHeight / gl.canvas.height;
        x[2] *= gl.drawingBufferWidth / gl.canvas.width;
        x[3] *= gl.drawingBufferHeight / gl.canvas.height;

        x[1] = gl.drawingBufferHeight - (x[1] + x[3]); // flip y
    }

    function linkProgramSources(gl, vertSource, fragSource) {
        const prog = gl.createProgram();

        function attachShaderSource(type, glsl) {
            glsl = glsl.trim() + '\n';

            const shader = gl.createShader(type);
            gl.shaderSource(shader, glsl);
            gl.compileShader(shader);
            gl.attachShader(prog, shader);
            return shader;
        }
        const vs = attachShaderSource(gl.VERTEX_SHADER, vertSource);
        const fs = attachShaderSource(gl.FRAGMENT_SHADER, fragSource);

        gl.linkProgram(prog);

        const success = gl.getProgramParameter(prog, gl.LINK_STATUS);
        if (!success) {
            console.log('Error linking program: ' + gl.getProgramInfoLog(prog));
            console.log('\nVert shader log: ' + gl.getShaderInfoLog(vs));
            console.log('\nFrag shader log: ' + gl.getShaderInfoLog(fs));
            return null;
        }
        gl.deleteShader(vs);
        gl.deleteShader(fs);

        let count = gl.getProgramParameter(prog, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveAttrib(prog, i);
            prog[info.name] = gl.getAttribLocation(prog, info.name);
        }
        count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveUniform(prog, i);
            prog[info.name] = gl.getUniformLocation(prog, info.name);
        }
        return prog;
    }

    const kBlitVS = [
        'attribute vec2 aVert;',
        'varying vec2 vTexCoord;',
        '',
        'void main() {',
        '    vTexCoord = aVert;',
        '    gl_Position = vec4(aVert * 2.0 - 1.0, 0.0, 1.0);',
        '}',
    ].join('\n');
    const kBlitFS = [
        'precision mediump float;',
        '',
        'uniform sampler2D uTex;',
        'varying vec2 vTexCoord;',
        '',
        'void main() {',
        '    gl_FragColor = texture2D(uTex, vTexCoord);',
        '}',
    ].join('\n');

    window.BlitRenderingContext = function(gl) {
        this.gl = gl;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // Make DOM uploads origin-bottom-left.
        const attribs = gl.getContextAttributes();
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, gl.premultiplyAlpha);

        const vertData = [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ];

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.blitProg = linkProgramSources(gl, kBlitVS, kBlitFS);
        gl.useProgram(gl.blitProg);
        gl.uniform1i(gl.blitProg.uTex, 0);

        gl.defaultTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, gl.defaultTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    window.BlitRenderingContext.prototype.blit = function(src, destOffset, destSize) {
        destOffset = destOffset || [0,0];
        destSize = destSize || [src.width, src.height];

        const gl = this.gl;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

        const rect = [destOffset[0], destOffset[1], destSize[0], destSize[1]];
        rectToDevicePixels(rect, gl);

        gl.viewport(rect[0], rect[1], rect[2], rect[3]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    window.BlitRenderingContext.prototype.clear = function(r,g,b,a, rect) {
        a = a || 1.0;
        const gl = this.gl;
        gl.clearColor(r,g,b,a);
        if (rect) {
            gl.enable(gl.SCISSOR_TEST);
            const deviceRect = [rect[0], rect[1], rect[2], rect[3]];
            rectToDevicePixels(deviceRect, gl);
            gl.scissor(deviceRect[0], deviceRect[1], deviceRect[2], deviceRect[3]);
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (rect) {
            gl.disable(gl.SCISSOR_TEST);
        }
    };

    const fnGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, attribs) {
        if (type !== 'blit')
            return fnGetContext.apply(this, [type, attribs]);

        attribs = attribs || {};
        attribs.premultiplyAlpha = attribs.premultiplyAlpha || true;
        attribs.antialias = attribs.antialias || false;
        attribs.depth = attribs.depth || false;
        const gl = fnGetContext.apply(this, ['experimental-webgl', attribs]);
        if (!gl || gl.brc)
            return null;

        gl.brc = new BlitRenderingContext(gl);
        return gl.brc;
    }
})();
