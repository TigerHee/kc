/**
 * Owner: iron@kupotech.com
 */
export function setPush(_push) {
  const push =
    _push ||
    ((path) => {
      window.location.href = path;
    });
  window.noticePushTo = push;
}
