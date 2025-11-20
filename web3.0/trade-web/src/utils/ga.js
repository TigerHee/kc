/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect } from 'react';
// import ReactGA from 'react-ga';
import { updateQueryStringParameter } from './getMainsiteLink';
import { addLangToPath } from 'utils/lang';
import { siteId } from 'utils/kcsensorsConf';
import { _IS_TEST_ENV_ } from 'src/utils/env';

/**
 * 合并埋点动作
 */
export const ga = (key) => {
  if (!key) return;
  if (window._hmt && typeof window._hmt.push === 'function') {
    window._hmt.push(['_trackEvent', key, 'click']);
  }
  // eslint-disable-next-line no-unused-expressions
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

const makeSpmId = (params) => {
  return `${siteId}.${params.join('.')}`;
};

// /**
//  * @description: 新交易大厅的组件埋点，不使用下面的trackClick，因为它不能把getPageIdMap中没有注册的页面名字传递过去。暂时废弃，通过添加全局参数 "isABNew":true 来区分新老交易大厅埋点
//  * @param {*} spm [ blockId, locationId = '1']
//  * @param {*} param  data
//  * @return {*}
//  */
// export const trackClickWithPageId = (spm, data = {}) => {
//   if (window.$KcSensors) {
//     const [blockId, locationId] = spm;
//     let pageId;

//     if (isABNew()) {
//       pageId = 'B5trading_New';
//     } else {
//       pageId = 'B5trading';
//     }

//     // eslint-disable-next-line no-unused-expressions
//     window.$KcSensors &&
//       window.$KcSensors.track(
//         ...[
//           'page_click',
//           {
//             spm_id: makeSpmId([pageId, blockId, locationId]),
//             ...data,
//           },
//         ],
//       );
//   }
// };

// 神策sdk，相关埋点方法
// 封装的kcsensors-trackClick(spm, data)
// 用于常规的点击上报
export const trackClick = (spm, data = {}) => {
  try {
    if (window.$KcSensors) {
      window.$KcSensors.trackClick(spm, data);
    }
  } catch (e) {
    console.error(e);
  }
};

// 返回空方法，避免$KcSensors拿不到
function doNothing() {}
const noop = () => {
  return doNothing;
};

// 封装的kcsensors-observeExpose(options)
// 用于常规的曝光上报
// IntersectionObserver配置
const intersectionObserverConfig = {};

const exposeContext = React.createContext({
  instance: window.$KcSensors && window.$KcSensors.observeExpose(intersectionObserverConfig),
});

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
  }, [instance, ref]);
};

// 高阶-，用于inject注入 observeExpose实例，没主动完成Observe方法调用，只是提供实例prop
export const injectExpose = (WrappedComponent) => (props) => {
  const exposeProps = {};
  const { instance } = React.useContext(exposeContext);
  if (instance) {
    exposeProps.trackObserve = instance;
  } else {
    exposeProps.trackObserve = noop;
  }
  return <WrappedComponent {...props} {...exposeProps} />;
};

// 神策sdk- track方法
// 神策sdk原生track方法，详情参阅神策sdk文档
export const track = (eventType, options) => {
  if (window.$KcSensors) {
    window.$KcSensors.track(eventType, options);
  }
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm = [], data = {}) => {
  if (!window.$KcSensors) return;
  // kcsensors spm 模块
  const spmModule = window.$KcSensors.spm;
  const exposeCfg = {
    spm_id: spmModule.compose(spm),
    ...data,
  };
  track(saType, exposeCfg);
};

/**
 * 曝光埋点方法
 * @param {string[] | string} spm
 * @param {Record<any, any>} [data]
 */
export const gaExpose = (spm, data) => {
  try {
    const spmArr = Array.isArray(spm) ? spm : spm ? [spm, '1'] : [];
    saTrackForBiz({}, spmArr, data);
  } catch (err) {
    console.warn(err);
  }
};

/**
 * 曝光埋点Hooks
 * @param {string[] | string} spm
 * @param {{
 *  data?: Record<any, any>,
 *  allowExpose?: () => boolean
 * }} [conf]
 */
export const useGaExpose = (spm, conf) => {
  const { data, allowExpose } = conf || {};
  useEffect(() => {
    try {
      if (typeof allowExpose === 'function') {
        if (allowExpose()) {
          gaExpose(spm, data);
        }
      } else {
        gaExpose(spm, data);
      }
    } catch (error) {
      if (_DEV_ || _IS_TEST_ENV_) {
        console.error(error);
      }
    }
  }, [spm, data, allowExpose]);
};
/**
 * 点击埋点
 * @param {string[] | string} spm
 * @param {Record<any, any>} [data]
 */
export const gaClick = (spm, data) => {
  try {
    const spmArr = Array.isArray(spm) ? spm : spm ? [spm, '1'] : [];
    trackClick(spmArr, data);
  } catch (err) {
    console.warn(err);
  }
};

// 用于获取神策匿名ID
export const getAnonymousID = () => {
  if (window.$KcSensors) {
    return window.$KcSensors.getAnonymousID();
  }
  return '';
};

// 用于拼接spm参数
export const compose = (...rest) => {
  if (!window.$KcSensors) return '';
  const { compose: _compose = () => '' } = window.$KcSensors.spm || {};
  return _compose(...rest);
};
// 向query参数中添加spm
export const addSpmIntoQuery = (url, spms) => {
  const spm = compose(spms);
  return updateQueryStringParameter(url, 'spm', spm);
};

// saveSpmQueryParam2SessionStorage
export const saveSpm2Storage = (url, spm) => {
  if (window.$KcSensors && window.$KcSensors.spmStorage) {
    let _href = url;
    if (_href.startsWith('/')) {
      _href = `${window.location.origin}${_href}`;
    }
    _href = addLangToPath(_href);
    window.$KcSensors.spmStorage.saveSpm2SessionStorage(_href, spm);
  }
};

export const composeSpmAndSave = (url, spms) => {
  if (!spms) return;
  const spm = compose(spms);
  if (!spm) return;
  saveSpm2Storage(url, spm);
};

export const getSavedSpm = () => {
  const kcSensors = window.$KcSensors;
  if (kcSensors && kcSensors.spmStorage) {
    return kcSensors.spmStorage.getSavedSpm();
  }
};

/**
 * 自定义事件
 * @param {*} trackConfig -> { spmId, data, checkId }
 * @param {*} type
 */
export const trackCustomEvent = (trackConfig = {}, type = 'page_click') => {
  const { spmId = [], data = {}, checkId } = trackConfig;
  let makeSpm = spmId;
  let makeData = { ...data };
  if (checkId) {
    if (typeof makeSpm === 'string') {
      makeSpm = ['B5trading_New', makeSpm, '1'];
    }
    makeData = {
      ...makeData,
      spm_id: makeSpmId(makeSpm),
    };
  }
  console.log(type, makeData, "makeData123");
  track(type, makeData);
};
