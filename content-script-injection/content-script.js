console.log('begin content-script.js');
window.content_script_secret = 42;
const injected_src_url = browser.runtime.getURL('injected-src.js');
const injected_text_url = browser.runtime.getURL('injected-text.js');

// -

const injected_inline_text = document.createElement('script');
injected_inline_text.textContent = `console.log('begin injected_inline_text');`;
document.documentElement.appendChild(injected_inline_text);

// -

const injected_src = document.createElement('script');
injected_src.src = injected_src_url;
document.documentElement.appendChild(injected_src);

// -

const request = new XMLHttpRequest();
request.open('GET', injected_text_url, false);  // `false` makes the request synchronous
console.log('request.open');
request.send(null);
console.log('request.send');

const injected_text = document.createElement('script');
injected_text.textContent = request.responseText;
document.documentElement.appendChild(injected_text);
