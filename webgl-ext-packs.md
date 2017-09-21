Sourced from [webglstats.com].

# WebGL 1

## WEBGL_extension_pack1_1
- blend_minmax: 88%/96% (99% w/o ie+edge)
- debug_renderer_info: 100%/100%
- element_index_uint: 100%/93% (88% Chrome Android)
- instance_arrays: 99%/92% (86% Chrome Android)
- lose_context: 100%/100% w/o ie+edge
- standard_derivatives: 100%/100%
- vertex_array_object: 100%/100% w/o ie+edge

### Maybes
- depth_texture: 90%/84%
  - 96% w/o ie
  - 71% android
  - 100% iOS
- draw_buffer: 67%/1%
  - Chrome Windows/macOS/Linux: 71%/95%/47%
  - Chromium Linux: 79%
  - Firefox Windows/macOS/Linux: 92%/99%/97%
  - Exists on Firefox Android (percentage unknown)
- frag_depth: 87%/0%
  - 92% w/o ie
  - 100% Firefox Desktop
  - 89% Chrome Desktop?
  - 0% both Chrome Android and Safari iOS
  - Exists on Firefox Android (percentage unknown)
- texture_filter_anisotropic: 99%/74% (only 52% Chrome Android)
- texture_float: 99%/75%
  - 53% Chrome Android
- texture_float_linear: 96%/60%
  - 26% Chrome Android
- texture_half_float: 93%/74%
  - 99% w/o ie
  - 53% Chrome Android
- texture_half_float_linear: 92%/73%
  - 98% w/o ie
  - 99% w/o ie+edge
  - 51% Chrome Android

# WebGL 2

## WEBGL_extension_pack2_1?

Likely not enough common extensions to be worth it.

- color_buffer_float: 100%/84%
  - 84% Chrome Android
- disjoint_timer_query: 92%/86%
- texture_filter_anisotropic: 99%/45%
  - 45% Chrome Android (?)
- texture_float_linear: 100%/40%
  - 40% Chrome Android (?)