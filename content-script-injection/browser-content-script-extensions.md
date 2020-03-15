# Temporary Browser Extensions via Content Scripts

## Example `manifest.json`

An example:
```
{
   "manifest_version": 2,
   "name": "untitled",
   "version": "0.5",

   "content_scripts": [
      {
        "matches": ["https://*/*", "http://*/*", "file://*/*"],
        "js": ["my-content-script.js"],
        "run_at": "document_start",
        "all_frames": true
      }
   ]
}
```

## Loading in Firefox

1. Go to `about:debugging`
2. Select your running instance of the browser by clicking "This Nightly"
  * Or if you have and want to use another instance (e.g. on your phone) you can
    select that instead
3. Under "Temporary Extensions", click "Load Temporary Add-on..."
4. Select `path/to/ext/manifest.json` file

There's a "Reload" button for when you changed anything (including included
files) in the extension.

## Loading in Chrome

1. Go to `chrome://extensions`
2. Enable "Developer mode" if not yet enabled
3. "Load unpacked"
4. Select `path/to/ext/` **directory**

Chrome is a little pickier than Firefox. For example, Chrome won't load an
extension if there's a `__pycache__` directory in the extension directory.
Extension directories for Chrome need to be "clean".

# Interacting with webpages

Content scripts will be run before anything in the page has loaded.
This is *before* any other (non-extension) script runs in the page.
However, content-scripts can't communicate with scripts in webpages.
(and importantly for security, vice-versa)

If you want to interact with the webpage, you'll need to inject scripts into the host page's DOM.

## Loading external files breaks early script execution

Incurring even hidden microtask breaks (such as doing synchronous XHR!)
will cause any code after the break to execute late.

Load `manifest.json` for "Content Script Injection Test" and load `test.html` to
see this `console.log` output:
```
begin content-script.js                                    content-script.js:1:9
begin injected_inline_text                                         test.html:1:9
request.open                                              content-script.js:22:9
begin test.html <head><script>                                     test.html:6:9
begin test.html <body><script>                                    test.html:11:9
test.html: window.content_script_secret undefined                 test.html:12:9
test.html: window.did_inject_src undefined                        test.html:13:9
test.html: window.did_inject_text undefined                       test.html:14:9
begin injected-src.js                                        injected-src.js:1:9
request.send                                              content-script.js:24:9
begin injected-text.js                                             test.html:1:9
test.html delayed: window.content_script_secret undefined        test.html:17:12
test.html delayed: window.did_inject_src true                    test.html:18:12
test.html delayed: window.did_inject_text true                   test.html:19:12
```

## Production Examples

* <https://github.com/jdashg/canvas-rr>
* <https://github.com/jdashg/webgl-1on2>
