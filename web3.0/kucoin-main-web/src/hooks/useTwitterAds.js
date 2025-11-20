/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import loadScript from 'utils/loadScript';

export default () => {
  useEffect(() => {
    // 非SSG环境下才插入脚本
    if (navigator.userAgent.indexOf('SSG_ENV') > -1) {
      return;
    }
    loadScript('https://assets.staticimg.com/natasha/npm/twitter/ads_oct.js').then(() => {
      if (!window.twq) {
        const s = () => {
          if (s.exe) {
            s.exe.apply(s, arguments); // eslint-disable-line
          } else {
            // eslint-disable-next-line prefer-rest-params
            s.queue.push(arguments); // eslint-disable-line
          }
        };
        s.version = '1.1';
        s.queue = [];
        window.twq = s;
      }
      window.twq('init', 'o7808');
      window.twq('track', 'PageView');

      if (window.twttr) {
        window.twttr.conversion.trackPid('o7ehj', { tw_sale_amount: 0, tw_order_quantity: 0 });
      }
    });
  }, []);
};
