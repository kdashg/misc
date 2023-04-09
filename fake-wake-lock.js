/*
Copyright and related rights waived via CC0:
https://creativecommons.org/publicdomain/zero/1.0/

By: Kelsey Gilbert
*/

'use strict';

if (!navigator.fakeWakeLock) {
   const TRACE = false;
   const WARN_ON_GC_EARLY = true;

   // The browser will hold its own wakelock if there's a video in the document
   // that:
   //   * is playing
   //   * has an audio track
   //   * (it may be hidden and muted)
   // So we take any arbitrary with-sound video, and resize it to 2x2, and trim
   // it to as few frames as possible:
   // ffmpeg.exe -i MOV_0714.mp4 -vf scale=2:2 -t 00:00:00.01 -crf 63 MOV_0714.2x2.1f.webm
   // Then we base64-encode the resulting file so we can embed it:
   // https://kdashg.github.io/misc/base64-embedding/toBase64.html
   // Then all that's left is to dress it up in a polyfill of the real wakeLock API.
   const MOV_0714_2X2_1F_WEBM = `\
data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84E\
IQoKEd2VibUKHgQRChYECGFOAZwEAAAAAAAV0EU2bdLpNu4tTq\
4QVSalmU6yBoU27i1OrhBZUrmtTrIHWTbuMU6uEElTDZ1OsggG\
fTbuMU6uEHFO7a1OsggVd7AEAAAAAAABZAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
AAVSalmsCrXsYMPQkBNgIxMYXZmNjAuNC4xMDFXQYxMYXZmNjA\
uNC4xMDFEiYhAQIAAAAAAABZUrmtAw64BAAAAAAAAWNeBAXPFi\
MwVWwqmQIAPnIEAIrWcg2VuZ4aFVl9WUDmDgQEj44OEAf0iiuC\
ssIECuoECmoECVLCBBFS6gQJVsJhVuoEGVbGBAVW7gQFVuYEBV\
beBAVW4gQKuAQAAAAAAAFnXgQJzxYiMJm8s4hYsPZyBACK1nIN\
lbmeGhkFfT1BVU1aqg2MuoFa7hATEtACDgQLhkZ+BArWIQOdwA\
AAAAABiZIEgY6KTT3B1c0hlYWQBAjgBgLsAAAAAABJUw2dBx3N\
zQI5jwIBnyJVFo4tNQUpPUl9CUkFORESHhG1wNDJnyJRFo41NS\
U5PUl9WRVJTSU9ORIeBMGfIn0WjkUNPTVBBVElCTEVfQlJBTkR\
TRIeIaXNvbW1wNDJnyJtFo5NDT00uQU5EUk9JRC5WRVJTSU9OR\
IeCMTFnyJlFo4dFTkNPREVSRIeMTGF2ZjYwLjQuMTAxc3NAmGP\
Ai2PFiMwVWwqmQIAPZ8idRaOMSEFORExFUl9OQU1FRIeLVmlkZ\
W9IYW5kbGVnyJtFo4lWRU5ET1JfSUREh4xbMF1bMF1bMF1bMF1\
nyKRFo4dFTkNPREVSRIeXTGF2YzYwLjkuMTAwIGxpYnZweC12c\
DlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjAzMzAwMDAwMAA\
Ac3NAlWPAi2PFiIwmbyziFiw9Z8idRaOMSEFORExFUl9OQU1FR\
IeLU291bmRIYW5kbGVnyJtFo4lWRU5ET1JfSUREh4xbMF1bMF1\
bMF1bMF1nyKFFo4dFTkNPREVSRIeUTGF2YzYwLjkuMTAwIGxpY\
m9wdXNnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjAyMDAwMDA\
wMAAAH0O2dUHr54EDoEHGoUG9ggAAAPx/MXOZ6Mo3HS0Oibvxy\
T1xSuYiBQm+ktA2GKfv/NEIgBLgSlX3DCWyf33T98ZPFFX6DVY\
mTnuxl1yy2CDoDF+1BiExXTk/cyqdb58Y5fJytgu//derMaJ8f\
/7Y931/DftW18GkFg4+uOtHv5soI0v7uT9fHaWhZr1whieoAIp\
OaO6ypv+t3DaeEPLGt6pG/DzZSEPIphmj5YPWk8JJfEFjrkB9A\
evIpw3VX4jRrliZnlb4yxvECvzV7fVmDcwgvXOOGdnVGaNgAAH\
CUosp/JlPYyurv3qU+Y7AL5SGDSvnwKuuy6u8EzuUYKYm1vC1G\
0qgKcYWHhGj3ii4YeFI7nCBbV2p0pSWimsLNWmQmi98nMk/6jn\
B+jUMcVZu/0CX+uWEQPwqqAujcsI2tj8W2oyDtY35pIUPTEEAR\
ji4mbVEZBHZrOtE96ENi3q57fzJ9LmZ/H1WrEyLrP1+nK7sAv9\
LAmqarefytyBdehUVKMhS/yq2rsTJn4enjmUfgzzZZV6+6771G\
+X3OcCVJAi8Qy5fmq4lwJbuPMsWlCSj0mFUAyB9a2J5q0RIZWq\
tW4Rcv3v3TAaI+Ia6yXWigzVn4KOdgf/9gIJJg0JAABAAFgA4J\
BwZcAAAICAAEb7wbwAcU7trkruQs4EAt4v3gQHxggNs8IIBzA=\
=`; // 1951 chars.

   const on_finalize = new FinalizationRegistry(fn => fn());

   // -

   function FakeWakeLock() {
      this.request = async function request(type) {
         type = type || 'screen';
         if (type != 'screen') throw type;
         // Skipping a ton of validation I don't care about...
         return new FakeWakeLockSentinel(type);
      };
   }

   // -

   let next_lock_id = 1;

   function FakeWakeLockSentinel(type) {
      const id = `FakeWakeLockSentinel#${next_lock_id}`;
      next_lock_id += 1;

      if (TRACE) {
         console.trace(`[${id}] acquired`);
      }

      let e_video = document.createElement('video');
      e_video.id = `${id}-video`;
      e_video.hidden = true; // Wild that Firefox doesn't care about this.
      e_video.muted = true;
      e_video.loop = true;
      e_video.src = MOV_0714_2X2_1F_WEBM;
      e_video.play(); // ignore the promise

      document.body.appendChild(e_video);

      function release_video(why) {
         why.defined;
         if (!e_video) return;

         const text = `[${id}] (releasing video via ${why})`;
         if (WARN_ON_GC_EARLY && why == 'gc') {
            console.warn(text, {WARN_ON_GC_EARLY});
         } else if (TRACE) {
            console.trace(text, {TRACE});
         }

         document.body.removeChild(e_video);
         e_video = null;
      }
      on_finalize.register(this, () => release_video('gc'));

      this.released = false;
      this.type = type;
      this.onrelease = undefined;

      // The browser has a form of promise pruning, where it can figure
      // out that there's no way to access something anymore.
      // The problem is that it's figuring out that we're not going to
      // call release(), so we get finalized before we call onrelease.
      // * The caller wants the screen to stay locked until the browser
      //   "randomly" releases the lock. (e.g. visibility change)
      // * We want to leave the screen locked until the caller's lock gets
      //   GC'd.
      // Maybe a better way than using onrelease, is for the caller to
      // just poll .released, or even manually call release() itself
      // periodically.
      // So that's the recommendation:
      async function wake_forever(refresh_every_n_seconds = 10) {
         while (true) {
            try {
               const lock = await navigator.wakeLock.request();
               await new Promise(go => {
                  setTimeout(go, refresh_every_n_seconds*1000);
               });
               await lock.release();
            } catch (e) {}
         }
      }


      this.release = async function release() {
         if (!this.released) {
            if (TRACE) {
               console.trace(`[${id}] released`);
            }
            release_video('release()');
            this.released = true;
            if (this.onrelease) {
               this.onrelease();
            }
         }
      };
   }

   // -

   navigator.fakeWakeLock = new FakeWakeLock();

   if (!navigator.wakeLock) {
      navigator.wakeLock = navigator.fakeWakeLock;
   }
}
