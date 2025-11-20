/**
 * Owner: willen@kupotech.com
 */
import Report from 'tools/ext/kc-report';

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key, eventLevelVariables) => {
  // console.log('--埋点--', key, eventLevelVariables);
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  // eslint-disable-next-line no-unused-expressions
  Report.logAction(key, 'click'); // @kc/report
};

/**
 * 获取携带相关属性的node节点
 *
 * @param {HTMLNode} node node节点
 * @param {string} attr 查询的属性
 */
export const getGaElement = (node, attr) => {
  if (!node || node.localName === 'body') return;
  const key = node.getAttribute(attr);
  if (key) {
    return key;
  }

  if (!node.parentNode) return;

  return getGaElement(node.parentNode, attr);
};
