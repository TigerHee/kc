/**
 * Owner: willen@kupotech.com
 */

export default (src: string, opts: any = {}) => {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = opts.type || 'text/javascript';
    script.charset = opts.charset || 'utf8';
    script.async = 'async' in opts ? !!opts.async : true;
    script.src = src;

    if (opts.text) {
      script.text = '' + opts.text;
    }
    if (opts.integrity) {
      script.integrity = '' + opts.integrity;
    }
    if (opts.crossOrigin) {
      script.crossOrigin = '' + opts.crossOrigin;
    }

    script.onload = function () {
      resolve(script);
    };
    script.onerror = function () {
      reject(new Error(`Script load error: ${src}`));
    };

    head.appendChild(script);
  });
};
