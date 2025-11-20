import { IS_CLIENT_ENV } from 'kc-next/env';

interface IOptions {
  text: string;
  integrity: string;
  crossOrigin: string;
  charset: string;
  type: string;
}

export default (src: string, opts: Partial<IOptions> = {}) => {
  return new Promise((resolve, reject) => {
    if (!IS_CLIENT_ENV) {
      return reject(
        new Error('loadScript can only be used in client environment')
      );
    }
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
