WebGLFeatureLevels = (function() {
    'use strict';

    function concatObj(a, b) {
        const ret = {};
        for (let k in a) {
            ret[k] = a[k];
        }
        for (let k in b) {
            ret[k] = b[k];
        }
        return ret;
    }

    const kLevels = {};
    kLevels[100] = {
        exts: [],
        limits: {},
    };
    kLevels[101] = {
        exts: [
            'ANGLE_instanced_arrays',
            'EXT_texture_filter_anisotropic',
            'OES_element_index_uint',
            'OES_standard_derivatives',
            'WEBGL_debug_renderer_info',
        ],
        limits: {
            MAX_CUBE_MAP_TEXTURE_SIZE: 4096,
            MAX_RENDERBUFFER_SIZE: 4096,
            MAX_TEXTURE_SIZE: 4096,
            MAX_VIEWPORT_DIMS: [4096, 4096],

            MAX_VERTEX_TEXTURE_IMAGE_UNITS: 4,
            MAX_TEXTURE_IMAGE_UNITS: 8,
            MAX_COMBINED_TEXTURE_IMAGE_UNITS: 8,

            MAX_VERTEX_ATTRIBS: 16,
            MAX_VARYING_VECTORS: 8,
            MAX_VERTEX_UNIFORM_VECTORS: 128,
            MAX_FRAGMENT_UNIFORM_VECTORS: 64,

            ALIASED_POINT_SIZE_RANGE: [1,100],
        },
    };
    kLevels[102] = {
        exts: kLevels[101].exts.concat([
            'EXT_frag_depth',
            'OES_texture_float',
            'OES_texture_float_linear',
            'OES_texture_half_float',
            'OES_texture_half_float_linear',
            //'OES_vertex_array_object', // no Edge
            'WEBGL_depth_texture',
        ]),
        limits: concatObj(kLevels[101].limits, {
            MAX_VERTEX_TEXTURE_IMAGE_UNITS: 8,
            ALIASED_POINT_SIZE_RANGE: [1,255],
        }),
    };
    kLevels[103] = {
        exts: kLevels[102].exts.concat([
            'EXT_blend_minmax', // no Edge
            'EXT_shader_texture_lod',
            'EXT_sRGB',
            'WEBGL_draw_buffers', // no Edge
        ]),
        limits: concatObj(kLevels[102].limits, {
            MAX_CUBE_MAP_TEXTURE_SIZE: 8192,
            MAX_RENDERBUFFER_SIZE: 8192,
            MAX_TEXTURE_SIZE: 8192,
            MAX_VIEWPORT_DIMS: [8192, 8192],

            MAX_VERTEX_TEXTURE_IMAGE_UNITS: 16,
            MAX_TEXTURE_IMAGE_UNITS: 16,
            MAX_COMBINED_TEXTURE_IMAGE_UNITS: 16,

            MAX_VERTEX_UNIFORM_VECTORS: 251,
            MAX_VARYING_VECTORS: 9,
            MAX_FRAGMENT_UNIFORM_VECTORS: 221,
        }),
    };
    kLevels[200] = {
        exts: [],
        limits: {},
    };
    kLevels[201] = {
        exts: [
            'EXT_color_buffer_float',
            'EXT_texture_filter_anisotropic',
            'OES_texture_float_linear',
            'WEBGL_debug_renderer_info',
        ],
        limits: {
            MAX_CUBE_MAP_TEXTURE_SIZE: 8192,
            MAX_RENDERBUFFER_SIZE: 8192,
            MAX_TEXTURE_SIZE: 8192,
            MAX_VIEWPORT_DIMS: [8192,8192],

            MAX_3D_TEXTURE_SIZE: 2048,
            MAX_ARRAY_TEXTURE_LAYERS: 256,

            ALIASED_POINT_SIZE_RANGE: [1,255],

            MAX_DRAW_BUFFERS: 4,
            MAX_SAMPLES: 4,
        },
    };

    function probeLevelFailures(gl, level) {
        const kLevel = kLevels[level];

        const supportedExts = gl.getSupportedExtensions();
        const extNames = kLevel.exts;
        const missingExts = extNames.filter(function(x) {
            return supportedExts.indexOf(x) == -1;
        });

        const missingLimits = {};
        for (let k in kLevel.limits) {
            const req = kLevel.limits[k];
            const has = gl.getParameter(gl[k]);

            let ok = true;
            if (req instanceof Array) {
                for (let i = 0; i < req.length; i++) {
                    ok &= has[i] >= req[i];
                }
            } else {
                ok &= has >= req;
            }
            if (ok)
                continue;

            missingLimits[k] = has;
        }

        if (!missingExts.length &&
            !Object.keys(missingLimits).length)
        {
            return null;
        }

        return {
            exts: missingExts,
            limits: missingLimits,
        };
    }

    function isLevelSupported(gl, level) {
        const failures = probeLevel(gl, level);
        if (!failures)
            return true;

        if (WebGLFeatureLevels.VERBOSE) {
            console.log('[webgl-feature-levels] Debug: Level ' + level + ' not supported:');
            failures.exts.forEach(function(x) {
                console.log('  Missing ext: ' + x);
            });
            Object.keys(failures.limits).forEach(function(k) {
                const has = failures.limits[k];
                const req = kLevels[level].limits[k];
                console.log('  Missing limit: ' + k + ' (requires ' + req + ', has ' + has + ')');
            });
        }
        return false;
    }

    function applyLevel(gl, level) {
        const extNames = kLevels[level].exts;
        extNames.forEach(function(x) {
            const ext = gl.getExtension(x);
            for (let k in ext) {
                gl[k] = ext[k];
            }
        });
    }

    WebGLRenderingContext.prototype.__featureLevel__ = 100;
    WebGLRenderingContext.prototype.getSupportedFeatureLevels = function() {
        const ret = [100];
        if (isLevelSupported(this, 101))
            ret.unshift(101);
        if (isLevelSupported(this, 102))
            ret.unshift(102);
        if (isLevelSupported(this, 103))
            ret.unshift(103);
        return ret;
    };

    WebGLRenderingContext.prototype.getFeatureLevel = function() {
        return this.__featureLevel__;
    };
    WebGLRenderingContext.prototype.setFeatureLevel = function(request) {
        const supported = this.getSupportedFeatureLevels();
        const cur = this.getFeatureLevel();
        if (!supported.includes(request)) {
            console.log('[webgl-feature-levels] Error: Request for unsupported feature'
                        + ' level: ' + request);
            return;
        }
        if (request <= cur) {
            console.log('[webgl-feature-levels] Error: Feature level already included:'
                        + ' ' + request);
            return;
        }
        applyLevel(this, request);
        this.__featureLevel__ = request;
    };

    if ('WebGL2RenderingContext' in window) {
        WebGL2RenderingContext.prototype.__featureLevel__ = 200;
        WebGL2RenderingContext.prototype.getSupportedFeatureLevels = function() {
            const ret = [200];
            if (isLevelSupported(this, 201))
                ret.unshift(201);
            return ret;
        };

        WebGL2RenderingContext.prototype.getFeatureLevel = WebGLRenderingContext.prototype.getFeatureLevel;
        WebGL2RenderingContext.prototype.setFeatureLevel = WebGLRenderingContext.prototype.setFeatureLevel;
    }

    return {
        VERBOSE: 0,
        kLevels: kLevels,
        probeLevelFailures: probeLevelFailures,
    };
})();
