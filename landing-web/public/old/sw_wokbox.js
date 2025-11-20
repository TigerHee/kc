import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { includes } from 'lodash';

let cdnHost = 'https://assets.staticimg.com';

// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);

// 缓存策略
registerRoute(
  ({ url }) => {
    return includes(url.origin, cdnHost) || includes(url.pathname, cdnHost);
  },
  new StaleWhileRevalidate({
    cacheName: 'landing-web-cache',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })],
    fetchOptions: {
      mode: 'cors',
      credentials: 'omit',
    },
  }),
);
