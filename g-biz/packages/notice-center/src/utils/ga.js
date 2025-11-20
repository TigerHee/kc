/**
 * Owner: willen@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key) => {
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  // eslint-disable-next-line no-unused-expressions
  remoteEvent.emit(remoteEvent.evts.GET_REPORT, (Report) => {
    Report?.logAction(key, 'click');
  });
  // ReactGA.event({ category: key, action: 'click' }); // react-ga
};

/**
 * 新版本自定义点击埋点
 */
export const gaClickNew = async (key, obj) => {
  if (!key) return;
  const { siteid, pageid, modid, eleid, ...other } = obj || {};
  ga(key, {
    ...other,
    str1: siteid,
    str2: `${siteid}.${pageid}`,
    str3: `${siteid}.${pageid}.${modid}`,
    str4: `${siteid}.${pageid}.${modid}.${eleid}`,
  });
};

// 神策sdk，相关埋点方法
// 封装的kcsensors-trackClick(spm, data)
// 用于常规的点击上报
export const trackClick = (spm, data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sensors.trackClick(spm, data);
  });
};
