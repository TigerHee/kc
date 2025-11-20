/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-22 15:03:48
 * @FilePath: /trade-web/src/initial.js
 * @Description: 初始化
 */
/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import kcsensorsConf from './utils/kcsensorsConf';
import { siteCfg } from 'config';
import { addLangToPath, LANG_DOMAIN, determineBasenameFromUrl } from './utils/lang';
import './utils/sentry';
import './utils/bindRemoteEvents';
import 'common/utils/socketProcess';

import { initQueryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

require('utils/svgSeoOptimization');

// TIPS: 初始化一下 localeBasename
determineBasenameFromUrl();

window._KC_LOCALE_DATA = {};
window._KC_PAGE_LANG_LOADER = function _KC_PAGE_LANG_LOADER() { };

// 语言子路径项目的域名；
window.LANG_DOMAIN = LANG_DOMAIN;

// 神策埋点
kcsensorsConf();
// move to worker
// 推送设置
// const { navigator } = window;
// const isChrome = (/chrome/i).test(navigator.userAgent || '');
// const useSlowFlush = (/safari|firefox/i).test(navigator.userAgent || '') && !isChrome;
/** ws debug output */
// window._x_ws_debug = ws.debug;
// window._x_ws_qps = ws.toggleShowQps;
// ws.setDelay(100);
// ws.setHost(_API_HOST_);

// 统计topic
const _tj = {};
let _open = false;
const topicTj = (_topic, _subject, len = 1) => {
  if (!_open) {
    return;
  }

  const topic = `${_topic}-${_subject}`;
  if (_tj[topic]) {
    const now = Date.now();
    const {
      lastTs,
      count,
    } = _tj[topic];

    const speed = (1000 * len) / (now - lastTs); // x peer s

    _tj[topic] = {
      speed,
      lastTs: now,
      count: count + len,
    };
  } else {
    _tj[topic] = {
      lastTs: Date.now(),
      count: len,
      speed: 0,
    };
  }
};
window._x_tj_open = () => { _open = true; };
window._x_tj = () => _.map(_tj, ({ count, speed }, topic) => {
  return [topic, count, speed];
});
window._x_topicTj = topicTj;

const origins = [];
Object.entries(siteCfg).forEach(([key, val]) => {
  if (!key.startsWith('API')) {
    origins.push(val);
  }
});

// window.open()链接带上url参数
const windowOpen = window.open;
window.open = (url = '', ...rest) => {
    if (!url) {
        return windowOpen(url, ...rest);
    }
    const urlWithLang = addLangToPath(url);
    return windowOpen(urlWithLang, ...rest);
};

// saveQueryParam2SessionStorage
initQueryPersistence();
