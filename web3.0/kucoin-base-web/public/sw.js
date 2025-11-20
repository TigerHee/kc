/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// 引入ravenjs 以及 上报的初始化
importScripts('https://assets.staticimg.com/natasha/npm/ravenjs/3.26.4/raven.min.js');
importScripts('https://assets.staticimg.com/natasha/npm/sw-reporter/1.0.4/sw-reporter.min.js');

// workbox.setConfig({modulePathPrefix: "workbox-v3.6.3"});
// importScripts('/workbox-sw.js');

self.addEventListener('install', (event) => {
  console.log('----install-----', event);
  // The promise that skipWaiting() returns can be safely ignored.
  event.waitUntil(
    new Promise((resolve) => {
      resolve();
      // _precacheFiles(self.__precacheManifest, () => {
      //   resolve();
      // });
    }).then(() => {
      self.skipWaiting();
    }),
  );

  // new Promise(resolve => {
  //   _precacheFiles(self.__precacheManifest, resolve);
  // });
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});
SWReport.init(self, Raven);
self.addEventListener('fetch', (event) => {
  // 只对请求监听，不做返回处理
  if (SWReport.isAvalibleHost(event)) {
    SWReport.checkFetchReport && SWReport.checkFetchReport(event);
  }
});
