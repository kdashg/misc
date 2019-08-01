# Misc Notes

## Debugging gecko

### Auto attach to process

Entrian Attach causes at least the following assert to be hit:
    MOZ_ASSERT(aPid == base::GetProcId(mChildProcessHandle));

## depot_tools

~~~
$ git cl upload
Credentials for the following hosts are required:
  -review
~~~

depot_tools is trying to infer the url of the review server and failing.
For me, this was because I originally created a local branch tracking my github repo.
This fixed it for me:

~~~
$ git config --unset branch.my_branch_name.remote
$ git config --unset branch.my_branch_name.merge
$ git config --unset branch.my_branch_name.base
$ git config --unset branch.my_branch_name.base-upstream
~~~

### `depot_tools.bat`

I have a `depot_tools.bat` script that creates a shell that's prepped for using depot_tools, instead of modifying global PATH/envvars.

~~~
@title depot_tools cmd
SET PATH=%PATH%C:\dev\depot_tools;
SET DEPOT_TOOLS_WIN_TOOLCHAIN=0
@cmd
~~~

In this shell, git-cl/gclient/gn/ninja/etc should Just Work.

## Git on Windows

You basically need Git Bash, even if you choose not to use that shell.
With another shell, you'll need to use `GIT_SSH_COMMAND=/bin/ssh git` in order to get ssh-agent to work.

You can hook python up to Git Bash, but it breaks everything (failing to TTY detect?) when starting the repl.
It works fine if you start it as `python -i` though.

## `apitrace`

### On MacOS

#### `dyld` issues trying to trace with `master`

In order to run on MacOS, I followed this comment:

https://github.com/apitrace/apitrace/issues/594#issuecomment-439684770

Specifically, use the `dyld-interpose` branch for tracing, but `master` for replaying.

#### New MacOS "dark mode" makes every other row in `qapitrace` invisible

`QT_QPA_PLATFORMTHEME=qt5ct qapitrace ...`

### With Firefox and E10S/multiprocess

`apitrace` (at least the `dyld` branch?) seems to follow forks well, but it doesn't flush background process trace files regularly. (it tries to flush only in response to events?)

The mega-hack I used was to add `flush();` to the end of `LocalWriter::endLeave()`.

Moving forward, I proposed a PR to add a FLUSH_EVERY_MS envvar:
https://github.com/apitrace/apitrace/pull/604

## GLES2 on Android?

I don't see a way to get ES2 if the device offers ES3.
The only thing I can think of is to manually search for EGLConfigs where either RENDERABLE_TYPE or CONFORMANT is missing the EGL_OPENGL_ES3_BIT bit.
However, I dumped the configs in Fennec, and they're all the same for those:

```
flags: 0x71
flags & CreateContextFlags::PREFER_ES3: 0
EGLConfig { id: 9, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 12, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 10, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 11, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 21, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 24, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 22, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 23, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 33, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 36, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 34, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 35, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
[...]
flags: 0x78
flags & CreateContextFlags::PREFER_ES3: 1
EGLConfig { id: 9, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 12, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 10, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 11, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 21, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 24, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 22, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 23, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 33, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 36, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 34, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
EGLConfig { id: 35, renderableType: 0x45 }
  caveat: 0x3038
  conformant: 0x45
```

ES3 can't natively support WebGL1's EXT_shader_texture_lod or WEBGL_draw_buffers, at least with present-day ANGLE.
(ANGLE doesn't presently offer translation of ESSL1 shaders to ESSL3)
And indeed, Chrome on Android doesn't offer support for these extensions on this ES3 device.

## WebGL

### Is a given page using WebGL?

Paste into web console:

```
function dumpCanvases() {
  for (const c of document.getElementsByTagName('canvas')) {
    const t = (() => {
      for (const t of ['2d', 'webgl', 'webgl2']) {
        if (c.getContext(t)) return t;
      }
      return 'unknown';
    })();
    console.log(`#${c.id}: ${c.width}x${c.height} ${t}`);
  }
};
dumpCanvases();
```


## Greasemonkey

This can be really useful for debugging sites in the wild, but it can be tricky to embed a debugging script with Greasemonkey. To make it easier, I wrote: https://jdashg.github.io/misc/greasemonkey-embed.html

For instance, WebGL-RR (https://raw.githubusercontent.com/jdashg/webgl-rr/master/webgl-rr.js) can be copy-pasted into the "Source" field, and the output can be easily copy+pasted into Greasemonkey.

## Arch Linux

Key issues with pacman? Reinstall archlinux-keyring separately: `pacman -S archlinux-keyring`

## Find and replace in files

`grep -lrE | xargs -l sed -i s#find#replacement#`

`grep`:
* `-l`: List files containing matches
* `-r`: Recurse into directories
* `-E`: "Extended" regex instead "basic" regex. Basic is missing support for +, for example.

`xargs`:
* `-l`: One invocation per stdin line (Technically `-L 1` is preferred by POSIX)
* `-n N`: Max of N stdin args per invocation
* `-P N`: Spawn P processes at a time. (default 1)

`sed`:
* `-i`: Operate in-place
* `s#find#replacement#`: Most people are used to s/foo/bar/, but sed thankfully lets you use a different separator

## Minimal Firefox subdir rebuilds

`./mach build install-manifests && ./mach build dom/canvas`
