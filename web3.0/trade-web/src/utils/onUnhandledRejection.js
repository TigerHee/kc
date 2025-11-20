/**
 * Owner: borden@kupotech.com
 */
/**
 * onUnhandledRejection
 */

const onUnhandledRejection = (() => {
  return (cb) => {
    self.addEventListener('unhandledrejection', cb);
  };
})();

module.exports = onUnhandledRejection;
