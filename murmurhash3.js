MurmurHash3_x86_32 = (() => {
  function SHR32(x, n) {
    x >>= 1;
    x &= 0x7fffffff;
    x >>= n-1;
    return x;
  }

  function ROTL32(x, r) {
    return (x << r) | SHR32(x, (32 - r));
  }

  function MUL32(a,b) { return Math.imul(a,b); }

  function fmix32(h) {
    h ^= SHR32(h, 16);
    h = MUL32(h,0x85ebca6b);
    h ^= SHR32(h, 13);
    h = MUL32(h,0xc2b2ae35);
    h ^= SHR32(h, 16);

    return h;
  }

  return function(data, seed=0) {
    if (typeof data == 'string') {
      const te = new TextEncoder();
      data = te.encode(data).buffer;
    }
    if (!(data instanceof ArrayBuffer)) throw new Error("Bad `data` type.");
    const len = data.byteLength;
    const nblocks = (len / 4)|0;

    let h1 = seed|0;

    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    //----------
    // body

    const blocks = new Uint32Array(data, 0, nblocks);

    for (let k1 of blocks)
    {
      k1 = MUL32(k1,c1);
      k1 = ROTL32(k1,15);
      k1 = MUL32(k1,c2);

      h1 ^= k1;
      h1 = ROTL32(h1,13);
      h1 = (MUL32(h1,5)+0xe6546b64)|0;
    }

    //----------
    // tail

    const tail = new Uint8Array(data, nblocks*4);

    let k1 = 0;

    if (tail.length >= 3) { k1 ^= tail[2] << 16; }
    if (tail.length >= 2) { k1 ^= tail[1] << 8; }
    if (tail.length >= 1) {
      k1 ^= tail[0];
      k1 = MUL32(k1,c1);
      k1 = ROTL32(k1,15);
      k1 = MUL32(k1,c2);
      h1 ^= k1;
    }

    //----------
    // finalization

    h1 ^= len;

    h1 = fmix32(h1);

    if (h1 < 0) {
      h1 += 0x100000000; // Back to [0,UINT32_MAX].
    }
    return h1;
  } ;
})();
