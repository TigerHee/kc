/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { get } from 'lodash';
import { updateQueryStringParameter } from './formatUrlWithLang';

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量
 */
export const ga = async (key, eventLevelVariables) => {
  if (!key) return;
  // console.log('-------->', key);
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  window._KC_REPORT_ && window._KC_REPORT_.logAction(key, 'click'); // @kc/report
  // ReactGA.event({ category: key, action: 'click' }); // react-ga
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
  } else {
    if (!node.parentNode) return;
    return getGaElement(node.parentNode, attr);
  }
};

export const kcsensorsClick = (spm, data = {}) => {
  import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    try {
      sensors.trackClick(spm, data);
    } catch (e) {
      console.log(e);
    }
  })
};

export const kcsensorsManualExpose = ({ type = 'expose' }, spm = [], data = {}) => {
  import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    try {
      sensors.track(type, exposeCfg);
    } catch (e) {
      console.log(e);
    }
  })
};

// 用于拼接spm参数
export const compose = (...rest) => {
  return import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    const { compose: _compose = () => '' } = sensors.spm || {};
    const spmModule = sensors.spm;
    const kc_siteid = spmModule.getSiteId();
    const kc_pageid = spmModule.getPageId();
    if (!kc_siteid || !kc_pageid) return '';
    return _compose(...rest);
  })
};

// 向query参数中添加spm
export const addSpmIntoQuery = async (url, spms) => {
  if (!spms) return url;
  const spm = await compose(spms);
  if (!spm) return url;
  return updateQueryStringParameter(url, 'spm', spm);
};

export const getPageId = () => {
  return import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    let sdkPageID = '';
    const _getPageID = get(sensors, 'spm.getPageId');
    if (typeof _getPageID === 'function') {
      sdkPageID = _getPageID();
    }
    return sdkPageID;
  })
};

// 神策sdk- track方法
// 神策sdk原生track方法，详情参阅神策sdk文档
export const track = (eventType, options) => {
  import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    try {
      sensors.track(eventType, options);
    } catch (e) {
      console.log(e)
    }
  });
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm = [], data = {}) => {
  import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    // kcsensors spm 模块
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    try {
      sensors.track(saType, exposeCfg);
    } catch (e) {
      console.log(e);
    }
  });
};

// IntersectionObserver配置
const intersectionObserverConfig = {};
const exposeContext = React.createContext({
  instance: import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    return sensors.observeExpose(intersectionObserverConfig)
  }),
});

/**
 *
 * @param {*} ref useRef实例
 * @param {{spm: ['blockId', 'locationId'], any: any}} getTrackParams 传入func， func返回事件上报需要的业务参数(obj)
 */
export const useExpose = (ref, getTrackParams) => {
  const { instance } = React.useContext(exposeContext);
  // 可能存在无useCallback传入getTrackParams的情况，故getTrackParams不追踪
  const getTrackParamsWrapper = React.useRef(getTrackParams);
  getTrackParamsWrapper.current = getTrackParams;
  React.useEffect(() => {
    let callback = null;
    const init = async () => {
      if (!instance.then) return;
      const _instance = await instance;
      if (typeof _instance === 'function') {
        callback = _instance((ref && ref.current) || ref, getTrackParamsWrapper.current);
      }
    };
    init();
    return () => {
      if (typeof callback === 'function') {
        callback();
      }
    }
  }, [ref]);
};
