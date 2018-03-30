# Use GCC to PGO Clang

Clang is faster to compile than GCC, but It Is Said that GCC PGOs better than Clang.
So let's build a monster.

## Methodology

I'm building a DEBUG version of this cset:

~~~
commit 6fa252d9b66aa88294aeef1f97160411f2f6f85f
Merge: bd1a9cc986c6 1688c0df862d
Author: Ciure Andrei <aciure@mozilla.com>
Date:   Fri Mar 30 01:06:18 2018 +0300

    Merge inbound to mozilla-central. a=merge
~~~

All build times are for `./mach build` after running `./mach configure` untimed beforehand.

The machine is a 2xE5-2670, so 2*2*8=32 hardware threads at 2.60GHz base.
I'm running everything with the default of -j32.
GCC version: 7.3.1
LLVM version: 6.0.0 (system and built)

## Install GCC

There's no need to build GCC yourself.

## Clone and checkout

~~~
git clone https://git.llvm.org/git/llvm.git/
git checkout origin/release_60

cd llvm/tools
git clone https://git.llvm.org/git/clang.git/
git checkout origin/release_60

cd ../..
~~~


## Build with -fprofile-generate

~~~
cd llvm-obj-inst

prof="-fprofile-generate=`pwd`/fprofiles"
flags="-march=native -O3 $prof"
CFLAGS="$flags" CXXFLAGS="$flags" LDFLAGS="$prof" cmake -G Ninja -DCMAKE_BUILD_TYPE=Release ../llvm

cmake --build .
~~~

This takes a while even at -j32:

~~~
real    14m36.881s
user    433m33.101s
sys     17m14.185s
~~~


## Compile the thing you care about

We add these to our gecko .mozconfig:

~~~
export CC=/path/to/llvm-obj-inst/bin/clang
export CXX=/path/to/llvm-obj-inst/bin/clang++
ac_add_options --disable-warnings-as-errors
~~~

Optional:

~~~
ac_add_options --disable-tests
~~~

`./mach build`: 18m09s (+6m50s from non-pgo)


## Build with -fprofile-path

~~~
cd pgo-llvm

prof="-fprofile-use=`pwd`/fprofiles"
flags="-march=native -O3 $prof"
CFLAGS="$flags" CXXFLAGS="$flags" LDFLAGS="$prof" cmake -G Ninja -DCMAKE_BUILD_TYPE=Release ../llvm

cmake --build .
~~~

This was faster for me:

~~~
real    10m58.746s
user    327m20.485s
sys     14m47.751s
~~~


## Switch over!

~~~
export CC=/path/to/pgo-llvm/bin/clang
export CXX=/path/to/pgo-llvm/bin/clang++
ac_add_options --disable-warnings-as-errors
~~~

`./mach build`: 10m48s (-31s from baseline custom)
Note that at these times, linking dominates the build time. (about 5m alone)
It looks like lld defaults to using --threads, but we do spend most of the time pegging a
single core.
-30s isn't really worth it at 10m total, but might be more attractive if we could get link
time down.


## Establish baseline build times (optional)

### System binary (optional)

`./mach build`: 12m25s

### Build a custom non-pgo'd 'riced' build for comparison (optional)

~~~
flags='-march=native -O3'
CFLAGS="$flags" CXXFLAGS="$flags" cmake -G Ninja -DCMAKE_BUILD_TYPE=Release ../llvm
cmake --build .
~~~

`./mach build`: 11m19s (-1m06s from system binary)
