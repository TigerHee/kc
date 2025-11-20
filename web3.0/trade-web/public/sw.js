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
  // 修改根路由url
  (self.__precacheManifest || []).forEach((prMan) => {
    if (/index\.html/.test(prMan.url)) {
      prMan.url = '/';
    }

    self.__precacheManifestMap[prMan.url] = `${prMan.url }?__WB_REVISION__=${prMan.revision}`;
  });

  console.log('current version ', cacheNameVersion);
  // return;


  self.addEventListener('install', (event) => {
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
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
                     '';
    // 如果不存在cacheKey
    if (!cacheKey) {
      return event;
    }
    const _optQuery = (event.request.url.indexOf('?') > -1 ? '&t=' : '?t=') + cacheNameVersion;
    const _swUrl = event.request.url + _optQuery;

    // 这里使用request.url去发请求，避免被浏览器因request.type = opaque 自动解压，导致缓存体积变大
    event.respondWith(getCacheStore().then((cache) => {
      if (!cache || !cache.match) {
        const corsRequest = new Request(_swUrl, {
          mode: 'cors',
          referrerPolicy: 'strict-origin-when-cross-origin',
        });
        return fetch(corsRequest);
      }
      return cache.match(cacheKey).then((res) => {
        if (res) {
          return res;
        }
        const corsRequest = new Request(_swUrl, {
          mode: 'cors',
          referrerPolicy: 'strict-origin-when-cross-origin',
        });
        return fetch(corsRequest).then((response) => {
          cache.put(cacheKey, response.clone());
          return response.clone();
        });
      });
    }));
  });
  // workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
} else {
  console.log('Boo! Workbox didn\'t load 😬');
}
