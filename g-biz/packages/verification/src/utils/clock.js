/**
 * Owner: vijay.zhou@kupotech.com
 */
const requestAnimationFrame =
  window.requestAnimationFrame ??
  ((fn) => {
    return setTimeout(fn, 16.6);
  });
const cancelAnimationFrame =
  window.cancelAnimationFrame ??
  ((id) => {
    return clearTimeout(id);
  });

const SECOND_UNIT = 1000;

/** 等一帧，16ms */
export const nextTick = () =>
  new Promise((resolve) => {
    const raf = requestAnimationFrame(() => {
      cancelAnimationFrame(raf);
      resolve();
    });
  });

/** 等一秒 */
export const nextSecond = async () => {
  const start = Date.now();
  while (Date.now() - start < SECOND_UNIT) {
    // eslint-disable-next-line no-await-in-loop
    await nextTick();
  }
};
