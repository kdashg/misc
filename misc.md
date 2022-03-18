# Misc Notes

## `gdb` Auto-Attach to All Child Processes

### `.gdbinit`

```
set detach-on-fork off
set print inferior-events on
set schedule-multiple on
set non-stop on
set mi-async on

set pagination off

set auto-solib-add off
handle SIGSYS noprint nostop pass
```

This is enough to have gdb attach to all forks and continue!

I do disable eager symbol loading via `auto-solib-add off` because it's very slow for Gecko. (It can take minutes extra to start)
You will need to use `share xul` to load symbols for xul manually, once you hit your crash.
If you want to break on symbol breakpoints, you probably have to remove this line.

Gecko also generates a lot of SIGSYS that it expects to be able to handle, but by default gdb intercepts these and panics, so we tell it to `noprint nostop pass`.

### Example usage

```
Assertion failure: !isSome(), at /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/include/mozilla/Maybe.h:863
#01: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x944c842]
#02: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0xd98ed48]
#03: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0xd12af62]
#04: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0xd12a5d6]
#05: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0xd04746b]
#06: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0xd88fcf7]
#07: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x131ad145]
#08: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x131999c0]
#09: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x1319a17f]
#10: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x13199f42]
#11: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x1318d568]
#12: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x131823bd]
#13: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x13199b8a]
#14: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x1319a17f]
#15: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x13199f42]
#16: ???[/home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so +0x13f849cd]
#17: ??? (???:???)
Reading symbols from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/firefox...
[Child 64335, Main Thread] WARNING: NS_ENSURE_TRUE(mRequest) failed: file /home/jgilbert/dev/mozilla/gecko1/netwerk/base/nsBaseChannel.cpp:928
Reading symbols from /usr/lib/debug/.build-id/4f/c5fc33f4429136a494c640b113d76f610e4abc.debug...

Thread 9.1 "Web Content" received signal SIGSEGV, Segmentation fault.
0x00007fffe4908852 in ?? () from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so
```

This tells us that Thread 9.1 ($inferior.$thread) crashed, so switch to it:

```
(gdb) thread 9.1
[Switching to thread 9.1 (Thread 0x7ffff78e5780 (LWP 64392))]
#0  0x00007fffe4908852 in ?? () from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libxul.so
```

Voila!

```
(gdb) bt 5
#0  0x00007fffe4908852 in mozilla::Maybe<std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > >::emplace<std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > >(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> >&&) (this=Reading symbols from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libsoftokn3.so...
Reading symbols from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libfreeblpriv3.so...
Reading symbols from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libmozavutil.so...
Reading symbols from /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/bin/libmozavcodec.so...
0x7fffffff4ea8, aArgs=...) at /home/jgilbert/dev/mozilla/gecko1/obj-x86_64-pc-linux-gnu/dist/include/mozilla/Maybe.h:863
#1  0x00007fffe8e4ad48 in mozilla::ClientWebGLContext::TexImage(unsigned char, unsigned int, int, unsigned int, mozilla::avec3<int> const&, mozilla::avec3<int> const&, int, mozilla::webgl::PackingInfo const&, mozilla::TexImageSource const&) const (this=0x7fffdab7e880, funcDims=2 '\002', imageTarget=3553, level=0, respecFormat=36975, offset=..., isize=..., border=0, pi=..., src=...) at /home/jgilbert/dev/mozilla/gecko1/dom/canvas/ClientWebGLContext.cpp:4050
#2  0x00007fffe85e6f62 in mozilla::ClientWebGLContext::TexImage2D<mozilla::dom::HTMLVideoElement>(unsigned int, int, unsigned int, int, int, int, unsigned int, unsigned int, mozilla::dom::HTMLVideoElement const&, mozilla::ErrorResult&) const (this=0x7fffdab7e880, target=3553, level=0, internalFormat=36975, width=0, height=0, border=0, unpackFormat=36249, unpackType=33640, anySrc=..., out_error=...) at /home/jgilbert/dev/mozilla/gecko1/dom/canvas/ClientWebGLContext.h:1514
#3  0x00007fffe85e65d6 in mozilla::ClientWebGLContext::TexImage2D<mozilla::dom::HTMLVideoElement>(unsigned int, int, unsigned int, unsigned int, unsigned int, mozilla::dom::HTMLVideoElement const&, mozilla::ErrorResult&) const (this=0x7fffdab7e880, target=3553, level=0, internalFormat=36975, unpackFormat=36249, unpackType=33640, anySrc=..., out_error=...) at /home/jgilbert/dev/mozilla/gecko1/dom/canvas/ClientWebGLContext.h:1718
#4  0x00007fffe850346b in mozilla::dom::WebGL2RenderingContext_Binding::texImage2D(JSContext*, JS::Handle<JSObject*>, void*, JSJitMethodCallArgs const&) (cx_=0x7fffd922f000, obj=..., void_self=0x7fffdab7e880, args=...) at WebGL2RenderingContextBinding.cpp:2100
(More stack frames follow...)
```

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

In my profile file, I conditionally run this for mozilla-build-only like so:
```bash
if [ -n $MOZILLABUILD ]
then
  echo "Using mozilla-build's ssh for git"
  export GIT_SSH_COMMAND=/bin/ssh
fi
```

You can also try to hook python up to Git Bash, but it breaks everything (failing to TTY detect?) when starting the repl.
It works fine if you start it as `python -i` though.

## My full `.bash_profile`
```bash
cd /c/dev
export VISUAL=vim
if [ -n $MOZILLABUILD ]
then
  echo "Using mozilla-build's ssh for git"
  export GIT_SSH_COMMAND=/bin/ssh
fi

export PATH="$PATH:/c/Program Files/nodejs"

eval `ssh-agent`
ssh-add ~/.ssh/jdashg-4096.priv
```

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
