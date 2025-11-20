/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */


// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://assets3.staticimg.com/workbox-cdn/release/5.1.3/workbox-sw.js');
workbox.setConfig({ modulePathPrefix: 'https://assets3.staticimg.com/workbox-cdn/release/5.1.3' });
// workbox.setConfig({modulePathPrefix: "workbox-v3.6.3"});
// importScripts('/workbox-sw.js');

console.log('hello sw');
// wait
async function sleep(delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const cacheNameVersion = '__name__version__';
const projectName = '__project_name__';
const publicCDN = '__public_cdn__';

let _cacheStore = null;

 // 存放cacheKey
 self.__precacheManifestMap = {};

async function getCacheStore() {
  if (_cacheStore) {
    return _cacheStore;
  } else {
    _cacheStore = await caches.open(cacheNameVersion);
    return _cacheStore;
  }
}
if (workbox) {
  // workbox.setConfig({
  //   debug: true,
  // });
  console.log('Yay! Workbox is loaded 🎉');
  // This will trigger the importScripts() for workbox.strategies and its dependencies:
  const { precaching } = workbox;

  const { PrecacheController } = precaching;


  // 修改根路由url
  (self.__precacheManifest || []).forEach((prMan) => {
    if (/index\.html/.test(prMan.url)) {
      prMan.url = '/';
    }

    self.__precacheManifestMap[prMan.url] = `${prMan.url }?__WB_REVISION__=${prMan.revision}`;
  });
  const precacheController = new PrecacheController(`${cacheNameVersion}`);

  console.log('current version ', cacheNameVersion);
  // return;

  /**
   * 串联式缓存文件，避免并发上线导致页面切换路由卡顿
   */
  // eslint-disable-next-line no-inner-declarations
  async function _precacheFiles(_cacheList, resolve, limit = 1) {
    const _toCache = _cacheList.slice(0, limit);
    const _left = _cacheList.slice(limit);
    if (_toCache.length && _toCache[0]) {
      // precache(_toCache)
      precacheController.addToCacheList(_toCache || []);
      await precacheController.install();
      // await sleep(1000);
      if (_left.length && _left[0]) {
        await _precacheFiles(_left, resolve, limit);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  }

  self.addEventListener('install', (event) => {
    // The promise that skipWaiting() returns can be safely ignored.
    event.waitUntil(
      new Promise((resolve) => {
        _precacheFiles(self.__precacheManifest, () => {
          resolve();
        });
      }).then(() => {
        self.skipWaiting();
      })
      ,
    );

    // new Promise(resolve => {
    //   _precacheFiles(self.__precacheManifest, resolve);
    // });
    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
  });

  self.addEventListener('activate', (event) => {
    // 清除上个版本的cache
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (projectName && cacheName.indexOf(projectName) > -1 &&
              cacheName !== cacheNameVersion) {
            console.log('try to del cache', cacheName);
            caches.delete(cacheName);
          }
        });
      }).then(() => {
       return precacheController.activate();
      }));
    // event.waitUntil(precacheController.activate());
  });

  self.addEventListener('message', (evt) => {
    // 交换执行权
    if (evt.data === 'SKIP_WAITING') {
      self.skipWaiting();
    } else {
      const { type, payload } = evt.data;
      // 检查到新版本，更新缓存，reload；
      if (type === 'appVersionUpdate') {
        const cacheKey = self.__precacheManifestMap['/'] || '/';
        if (cacheKey) {
          // caches.delete('m_site').then(()=> {
          //   self.clients.get(evt.source.id).then(function(client) {
          //     client.postMessage('appUpdateReload');
          //   });
          // })
        }
      }
      // console.log('received msg', evt.data);
    }
  });

  const routesRegexp = new RegExp(publicCDN.replace(/(:|\/|\.)/g, '\\$1'));

  self.addEventListener('fetch', (event) => {
    if (!routesRegexp.test(event.request.url)) {
      return event;
    }

    // 因为是文件不管参数
    const _url = event.request.url.replace(/\?.*/, '');
    // 为适应测试环境host 为/_cdn 的情况
    const cacheKey = self.__precacheManifestMap[_url] ||
                     self.__precacheManifestMap[_url.replace(location.origin, '')] ||
                     _url;
    // 如果不存在cacheKey
    if (!cacheKey) {
      return event;
    }
    event.respondWith(getCacheStore().then((cache) => {
      if (!cache || !cache.match) {
        return fetch(event.request);
      }
      return cache.match(cacheKey).then((res) => {
        if (res) {
          return res;
        }
        return fetch(event.request);
      });
    }));

    // // flag-start
    //   routing.registerRoute(
    //     new RegExp('__static__prefix__regexp__'),
    //     new strategies.CacheFirst({
    //       cacheName: cacheNameVersion,
    //     }),
    //   );
    // // flag-end

    // 只匹配网站路由，全部指向 / ， 进行 离线应用缓存
    // routing.registerRoute(
    //   // eslint-disable-next-line no-shadow
    //   ({ url, event }) => {
    //     return (
    //       !url.pathname.match(/_api/) &&
    //       url.host.match(/(localhost|(trade\.kucoin))/gi) &&
    //       event.request.destination === 'document' &&
    //       !url.pathname.match(/\./) &&
    //       url.origin === location.origin
    //     );
    //   },
    //   // eslint-disable-next-line no-shadow
    //   async ({ event }) => {
    //     // network first;
    //     try {
    //       // const response = await fetch(event.request);
    //       event.respondWith(
    //         fetch(event.request).then(
    //           (res) => {
    //             return res;
    //           },
    //           (err) => {
    //             let cacheKey = precacheController.getCacheKeyForURL(event.request.url);
    //             if (!cacheKey) {
    //               cacheKey = precacheController.getCacheKeyForURL('/');
    //             }
    //             return caches.match(cacheKey).then(res => res, () => {
    //               return fetch(event.request);
    //             });
    //           },
    //         ),
    //       );
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   },
    // );
  });
  // workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
} else {
  console.log('Boo! Workbox didn\'t load 😬');
}
