import { useEffect } from 'react';
import loadScript from 'tools/loadScript';

export default function useTwitterAds() {
  useEffect(() => {
    loadScript(
      'https://assets.staticimg.com/natasha/npm/twitter/ads_oct.js'
    ).then(() => {
      if (!window.twq) {
        const s: any = function () {
          if (s.exe) {
            s.exe.apply(s, arguments); // eslint-disable-line
          } else {
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
        window.twttr.conversion.trackPid('o7ehj', {
          tw_sale_amount: 0,
          tw_order_quantity: 0,
        });
      }
    });
  }, []);
}
