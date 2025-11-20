/**
 * Owner: iron@kupotech.com
 */
import uuid from 'uuid';
import md5 from 'md5';
// import ReactGA from 'react-ga';
import remoteEvent from '@tools/remoteEvent';

export const getAuthPayload = (APP_KEY, SEC_KEY) => {
  const random_str = uuid()
    .split('-')
    .join('');
  const timestamp = `${new Date().getTime()}`;

  const signature = md5(
    `appkey=${APP_KEY}&timestamp=${timestamp}&random_str=${random_str}&key=${SEC_KEY}`,
  );

  return {
    appkey: APP_KEY,
    random_str,
    signature,
    timestamp,
  };
};

// 获取页面是否可见
export const getDomVisible = () => {
  // 设置隐藏属性和改变可见属性的事件的名称
  let hidden;
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
  }

  if (document[hidden]) {
    return true;
  }
  return false;
};

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key, eventLevelVariables) => {
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  if (typeof window.gio === 'function') {
    window.gio('track', key, eventLevelVariables);
  }
  // eslint-disable-next-line no-unused-expressions
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (Report) => {
    Report?.logAction(key, 'click');
  });
  // ReactGA.event({ category: key, action: 'click' }); // react-ga
};

/**
 * spm [blockId (String), eleId (String)] 或者 [pageId (String), [blockId (String), eleId (String)]] spm 区块和元素
 * @typedef {[string, string] | [string, [string, string]]} SpmParams
 */

/**
 * 神策sdk，触发点击的埋点
 * 封装的kcsensors-trackClick(spm, data)
 * 用于常规的点击上报
 * @param {SpmParams} spm [blockId (String), eleId (String)] 或者 [pageId (String), [blockId (String), eleId (String)]] spm 区块和元素
 * @param {Object} data 事件携带的自定义参数
 */
export const trackClick = (spm, data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sensors.trackClick(spm, data);
  });
};
