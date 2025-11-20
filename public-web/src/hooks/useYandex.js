/**
 * Owner: willen@kupotech.com
 */
import { useEffect } from 'react';
import loadScript from 'utils/loadScript';

export default () => {
  useEffect(() => {
    loadScript('https://assets.staticimg.com/natasha/npm/yandex/metrica-watch-tag.min.js').then(
      () => {
        window.ym =
          window.ym ||
          function ym(...args) {
            (window.ym.a = window.ym.a || []).push(args);
          };
        window.ym.l = 1 * new Date();
        window.ym(84577030, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      },
    );
  }, []);
};
