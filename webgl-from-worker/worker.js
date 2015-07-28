'use strict';

// Basically RPC.

var kIsWorker = !(self instanceof Window);
if (kIsWorker) {
    self.onmessage = function(e) {
        var pair = e.data;
        var funcName = pair[0];
        var args = pair[1];

        var func = self[funcName];
        if (func === undefined)
            throw 'Bad funcName: ' + funcName;

        func.apply(self, args);
    };
}

////////////////////

var kVertShaderSource = [
    'attribute vec3 aPos;',
    'attribute vec4 aColor;',
    '',
    'varying vec4 vColor;',
    '',
    'void main(void) {',
    '    gl_PointSize = 64.0;',
    '    gl_Position = vec4(aPos, 1.0);',
    '    vColor = aColor;',
    '}',
].join('\n');

var kFragShaderSource = [
    'precision mediump float;',
    '',
    'varying vec4 vColor;',
    '',
    'void main(void) {',
    '    gl_FragColor = vColor;',
    '}',
].join('\n');

////////////////////

var g_gl;
var g_prog;

////////////////////

function BuildProgram(gl, vertSource, fragSource) {
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, kVertShaderSource);
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, kFragShaderSource);
    gl.compileShader(fs);

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);

    gl.linkProgram(prog);

    var success = gl.getProgramParameter(prog, gl.LINK_STATUS);
    if (success)
        return prog;

    console.log('Error linking program: ' + gl.getProgramInfoLog(prog));
    console.log('\nVert shader log: ' + gl.getShaderInfoLog(vs));
    console.log('\nFrag shader log: ' + gl.getShaderInfoLog(fs));
    return null;
}


function DrawPoint(gl, prog, pos3, color4) {
  gl.vertexAttrib3fv(prog.aPos, pos3);
  gl.vertexAttrib4fv(prog.aColor, color4);

  gl.drawArrays(gl.POINTS, 0, 1);
}

////////////////////

function InitCanvas(canvas) {
    var gl = canvas.getContext('webgl');
    if (!gl)
        throw 'Failed to get a webgl context.';

    var prog = BuildProgram(gl, kVertShaderSource, kFragShaderSource);
    if (!prog)
        throw 'BuildProgram failed.';

    prog.aPos = gl.getAttribLocation(prog, "aPos");
    prog.aColor = gl.getAttribLocation(prog, "aColor");

    g_gl = gl;
    g_prog = prog;
}

function RenderFrame(blueNormX, blueNormY) {
    var gl = g_gl;
    var prog = g_prog;

    var bgColor = kIsWorker ? [0.0, 0.3, 0.0]
                            : [0.3, 0.0, 0.0];
    gl.clearColor(bgColor[0], bgColor[1], bgColor[2], 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(prog);
    gl.disableVertexAttribArray(prog.aPos);
    gl.disableVertexAttribArray(prog.aColor);

    DrawPoint(gl, prog, [-0.1, -0.1, -0.1], [1.0, 0.0, 0.0, 1.0]);
    DrawPoint(gl, prog, [ 0.1,  0.1,  0.1], [0.0, 1.0, 0.0, 1.0]);

    var blueClipX = 2.0*blueNormX - 1.0;
    var blueClipY = -(2.0*blueNormY - 1.0); // Browser is origin-top-left, we're origin-bottom-left.

    DrawPoint(gl, prog, [blueClipX, blueClipY, 0.0], [0.0, 0.0, 1.0, 1.0]);

    if ('commit' in gl)
        gl.commit();
}
