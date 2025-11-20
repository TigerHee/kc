/**
 * Owner: willen@kupotech.com
 */
export default (src, opts = {}) => {
  return new Promise((resolve, reject) => {
    // const head = document.head || document.getElementsByTagName('head')[0];
    const body = document.head || document.getElementsByTagName('body')[0];
    const script = document.createElement('script');
    script.type = opts.type || 'text/javascript';
    script.charset = opts.charset || 'utf8';
    script.async = 'async' in opts ? !!opts.async : true;
    script.src = src;

    if (opts.attrs) {
      script.setAttributes(opts.attrs);
    }

    if (opts.text) {
      script.text = '' + opts.text;
    }

    script.onload = function () {
      resolve(script);
    };
    script.onerror = function () {
      reject(new Error(`Script load error: ${src}`));
    };

    body.appendChild(script);
  });
};
