/**
 * Owner: iron@kupotech.com
 */
// 基本配置
import merge from 'lodash/merge';
import {
  SERVER_URL_SIT_HTTPS,
  HEAT_MAP_ON,
  HEAT_MAP_OFF,
  ENV_PROD,
  SERVER_URL_PROD,
  SDK_URL_PROD,
  SDK_URL_SIT,
  ABSDK_URL,
  ABSDK_URL_SIT,
  SDK_MANIFEST_MAP,
} from './consts';
import { isApp } from './utils';
import lazyInit from './lazyInit';

let abtestInstance = null;

let abQueue = [];

function loadAbTest(src, onLoad, onError) {
  const script = document.createElement('script');
  const head = document.head || document.getElementsByTagName('head')[0];
  script.async = true;
  script.src = src;
  script.setAttribute('charset', 'UTF-8');
  script.onload = onLoad;
  script.onerror = onError;
  if (SDK_MANIFEST_MAP[src]) {
    script.integrity = SDK_MANIFEST_MAP[src];
    script.crossOrigin = 'anonymous';
  }
  head.appendChild(script);
}

export const fastFetchABTest = (config) => {
  return new Promise((resolve) => {
    if (!abtestInstance) {
      // 如果不存在 abtestInstance，将 resolve 放到队列中
      abQueue.push([config, resolve]);
    } else {
      abtestInstance.fastFetchABTest({
        ...config,
        callback(result) {
          resolve(result);
        },
      });
    }
  });
};

export default function init({
  env, // 除非设置成 'production' 否则server_url都走测试, 设置成 'development' 开启 log, 也可以通过 log 配置关闭
  send_url = null, // send_url 用于修改数据发送地址，覆盖默认地址
  abtest_url = null, // ab 测试分流地址，传入开启abtest
  web_click = false, // 是否开启 $WebClick 事件
  web_stay = false, // 是否开启 $WebStay 事件
  log = true, // 当 env 为 'development' 并且不需要 log 数据信息的时候，配置此选项为false
  spa = true, // 是否为单页，url改变自动采集 $pageview 事件
  ...sdkConfig
}) {
  let serverUrl = SERVER_URL_SIT_HTTPS;
  if (env === ENV_PROD) {
    serverUrl = SERVER_URL_PROD;
  }
  if (typeof proxy_url === 'string') {
    serverUrl = send_url;
  }
  const sdk_url = env === ENV_PROD ? SDK_URL_PROD : SDK_URL_SIT;
  lazyInit(
    merge(
      {
        sdk_url,
        name: 'sensors',
        server_url: serverUrl,
        send_type: 'beacon',
        show_log: log && env === 'development',
        is_track_single_page: spa,
        is_track_device_id: true,
        heatmap: {
          clickmap: web_click ? HEAT_MAP_ON : HEAT_MAP_OFF,
          scroll_notice_map: web_stay ? HEAT_MAP_ON : HEAT_MAP_OFF,
        },
        app_js_bridge: isApp(),
      },
      sdkConfig,
    ),
    function onLoad() {
      if (abtest_url) {
        const abTestSdk = env === ENV_PROD ? ABSDK_URL : ABSDK_URL_SIT;

        loadAbTest(
          abTestSdk,
          function onABLoad() {
            abtestInstance = window.sensors.use('SensorsABTest', {
              url: abtest_url,
              multilink: false, // 目前用不到多链实验
            });

            abQueue.forEach((ab) => {
              const [config, resolve] = ab;
              abtestInstance.fastFetchABTest({
                ...config,
                callback(result) {
                  resolve(result);
                },
              });
            });
            // 原本 abQueue 会置为 null 进行释放，但发现有从 facebook 过来的场景 abQueue 在遍历的时候就为 null 了（考虑为特殊 webview）
            // 这里综合考虑还是将 abQueue 都重置为 []，以保证类型一致性
            abQueue = [];
          },
          function onError() {
            // 资源加载错误，不继续加载 abtestsdk 直接 resolve ab 测试队列
            abQueue.forEach((ab) => {
              const [, resolve] = ab;
              resolve();
            });

            abQueue = [];
          },
        );
      }
    },
    function onError() {
      // 资源加载错误，不继续加载 abtestsdk 直接 resolve ab 测试队列
      abQueue.forEach((ab) => {
        const [, resolve] = ab;
        resolve();
      });

      abQueue = [];
    },
  );

  return window.sensors;
}
