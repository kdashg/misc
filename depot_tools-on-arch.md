## `python` Considered Harmful

Arch uses python->python3, not python2.
This is fine according to PEP 394, but naturally not everyone is compliant.

## gn

We can use the correct python with `gn` with `gn --script-executable=python2`.
Theoretically this can go in the .gn file also, but since the official python.org Windows
packages are presently incompatible PEP 394, it's not a slam-dunk.

### clang missing libtinfo.so.5
Arch uses ncurses-6, so we don't have this lib from ncurses-5.
We can't use system clang yet, because (at least) ANGLE wants clang-6, and only clang-5
has been released.

You will need:
https://aur.archlinux.org/packages/libtinfo5/

## depot_tools

Issue:
https://bugs.chromium.org/p/chromium/issues/detail?id=777069

Potential cset:
https://chromium-review.googlesource.com/c/chromium/tools/depot_tools/+/746142
