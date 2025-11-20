/**
 * Owner: willen@kupotech.com
 */
import { get } from 'lodash';
import React from 'react';
import Report from 'tools/ext/kc-report';
import sensors from 'tools/ext/kc-sensors';
import { updateQueryStringParameter } from './formatUrlWithLang';

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
  sensors.trackClick(spm, data);
};

// 封装的kcsensors-observeExpose(options)
// 用于常规的曝光上报
export const exposeContext = React.createContext();

// 神策sdk- track方法
// 神策sdk原生track方法，详情参阅神策sdk文档
export const track = (eventType, options) => {
  sensors.track(eventType, options);
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm = [], data = {}) => {
  if (!sensors) return;
  // kcsensors spm 模块
  window.requestIdleCallback(() => {
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    track(saType, exposeCfg);
  });
};

// 用于获取神策匿名ID
export const getAnonymousID = () => {
  if (sensors) {
    return sensors.getAnonymousID();
  }
  return '';
};

// 用于拼接spm参数
export const compose = (...rest) => {
  if (!sensors) return '';
  const { compose: _compose = () => '' } = sensors.spm || {};
  const spmModule = sensors.spm;
  const kc_siteid = spmModule.getSiteId();
  const kc_pageid = spmModule.getPageId();
  if (!kc_siteid || !kc_pageid) return '';
  return _compose(...rest);
};
// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms) => {
  if (!spms) return url;
  const spm = compose(spms);
  if (!spm) return url;
  return updateQueryStringParameter(url, 'spm', spm);
};

export const getPageId = () => {
  let sdkPageID = '';
  if (!sensors) return '';
  const _getPageID = get(sensors, 'spm.getPageId');
  if (typeof _getPageID === 'function') {
    sdkPageID = _getPageID();
  }
  return sdkPageID;
};

/**
 *
 * @param {*} ref useRef实例
 * @param {*} getTrackParams
 */
export const useExpose = (ref, getTrackParams) => {
  const { instance } = React.useContext(exposeContext);
  // 可能存在无useMemo传入getTrackParams的情况，故getTrackParams不追踪
  const getTrackParamsWrapper = React.useRef(getTrackParams);
  React.useEffect(() => {
    if (instance) {
      return instance((ref && ref.current) || ref, getTrackParamsWrapper.current);
    }
  }, [ref]);
};
