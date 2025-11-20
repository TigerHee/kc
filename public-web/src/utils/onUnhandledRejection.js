/**
 * Owner: willen@kupotech.com
 */
/**
 * onUnhandledRejection
 * runtime: node/browser
 */

const onUnhandledRejection = (() => {
  return (cb) => {
    window.addEventListener('unhandledrejection', cb);
  };
})();

export default onUnhandledRejection;
