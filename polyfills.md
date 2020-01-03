## JS

### `window.setImmediate`

```
(function() {
   if (window.setImmediate) return;

   let next_id = 1;
   let func_by_id = {};
   const KEY = 'window.setImmediate';
   function handler(e) {
      if (e.data !== KEY) return;
      e.stopImmediatePropagation();

      for (const func of Object.values(func_by_id)) {
         (async function() {
            func();
         })();
      }
      func_by_id = {};
   }
   window.addEventListener('message', handler, true);

   window.setImmediate = function(func) {
      const id = next_id;
      next_id += 1;
      func_by_id[id] = func;
      window.postMessage(KEY, '*');
      return id;
   };

   window.clearImmediate = function(id) {
      func_by_id[id] = undefined;
   };
})();

function next_event_loop() {
   return new Promise((res, rej) => {
      setImmediate(() => {
         res();
      });
   });
}
```
