/**
 * Owner: garuda@kupotech.com
 * requestAnimationFrame polyfill
 */

/** Detect raf support */
const SUPPORT_RAF = (() => {
  let support = false;
  try {
    const vendors = ['moz', 'webkit'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
      window.cancelAnimationFrame =
        window[`${vendors[x]}CancelAnimationFrame`] ||
        window[`${vendors[x]}CancelRequestAnimationFrame`];
    }

    support =
      !!window.requestAnimationFrame &&
      !!window.cancelAnimationFrame &&
      !/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent);
  } catch (e) {
    support = false;
  }
  return support;
})();

// requestAnimationFrame polyfill
let lastTime = 0;
const polyfillRAF = (callback) => {
  const currTime = Date.now();
  const timeToCall = Math.max(lastTime + 16, currTime);
  const id = window.setTimeout(() => {
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};

export const requestAnimationPolyfill = SUPPORT_RAF ? window.requestAnimationFrame : polyfillRAF;
export const cancelRequestAnimationPolyfill = SUPPORT_RAF
  ? window.cancelAnimationFrame
  : window.clearTimeout;
