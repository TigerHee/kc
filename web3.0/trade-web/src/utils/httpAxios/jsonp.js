/**
 * Owner: borden@kupotech.com
 */
let count = 0;

function noop() {}

function jsonp(url, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }
  if (!opts) opts = {};
  const prefix = opts.prefix || '__jp';
  const id = opts.name || (prefix + (count += 1));

  const param = opts.param || 'callback';
  const timeout = opts.timeout != null ? opts.timeout : 60000;
  const enc = encodeURIComponent;
  const target = document.getElementsByTagName('script')[0] || document.head;

  let script;
  let timer;
  if (timeout) {
    timer = setTimeout(() => {
      cleanup();
    }, timeout);
  }

  function cleanup() {
    if (script.parentNode) script.parentNode.removeChild(script);
    window[id] = noop;
    if (timer) clearTimeout(timer);
  }

  function cancel() {
    if (window[id]) {
      cleanup();
    }
  }

  window[id] = (lang, data) => {
    cleanup();
    if (fn) fn(lang, data);
  };

  url += `${(~url.indexOf('?') ? '&' : '?') + param}=${enc(id)}`;
  url = url.replace('?&', '?');

  script = document.createElement('script');
  script.src = url;
  target.parentNode.insertBefore(script, target);

  return cancel;
}


export default jsonp;
