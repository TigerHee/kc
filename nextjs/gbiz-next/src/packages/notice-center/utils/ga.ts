/**
 * Owner: willen@kupotech.com
 */
import { getReport } from 'tools/report';

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async key => {
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  const Report = await getReport();
  Report?.logAction(key, 'click');
};

/**
 * 新版本自定义点击埋点
 */
export const gaClickNew = async (key, obj) => {
  if (!key) return;
  const { siteid, pageid, modid, eleid, ...other } = obj || {};
  ga(key);
};
