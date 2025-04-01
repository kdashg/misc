# `ssh-auto-lock.py`

> *For now only supports Windows, sorry!*

While left running, detects when your session/screen gets locked, and calls `ssh-add -D` to clear `ssh-agent`'s keys.

**Download: [ssh-auto-lock.py](https://kdashg.github.io/misc/ssh-auto-lock.py)**

**Source: [github.com/kdashg/misc/blob/tip/ssh-auto-lock.py](https://github.com/kdashg/misc/blob/tip/ssh-auto-lock.py)**

---

I use `ssh_config`'s `AddKeysToAgent yes` to automatically `ssh-add` them back in as-needed.

> *In the future, it might be cool to use `ssh-add -x` to lock/unlock the agent until user enters their/a password again.
But this is all I need.*

### Requires:
* `python`, e.g. `winget install python`

### Use:
In its own terminal/cmd window, run `py ssh-auto-lock.py`, and leave it running. That's it.
You can use `ctrl-c` in that window to close it.

### License: CC0
As of 2025-03-31: [https://creativecommons.org/public-domain/cc0/](https://creativecommons.org/public-domain/cc0/)

### Thanks:
* **[@grawity](https://superuser.com/users/1686/grawity)**, for [their answer to "Running python script on when user unlocks windows machine"](https://superuser.com/a/264973).
