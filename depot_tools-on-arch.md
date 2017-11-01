## `python` Considered Harmful

Arch uses python->python3, not python2.
This is fine according to PEP 394, but naturally not everyone is compliant.

## gn

We can use the correct python with `gn` with `gn --script-executable=python2`.
Theoretically this can go in the .gn file also, but since the official python.org Windows
packages are presently incompatible PEP 394, it's not a slam-dunk.

## depot_tools

Issue:
https://bugs.chromium.org/p/chromium/issues/detail?id=777069

Potential cset:
https://chromium-review.googlesource.com/c/chromium/tools/depot_tools/+/746142
