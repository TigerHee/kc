import remoteEvent from '@tools/remoteEvent';
import { includes, size, split } from 'lodash';
import qs from 'query-string';

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  let getABFunc;
  try {
    remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
      getABFunc = sensors.fastFetchABTest;
    });
    if (getABFunc) {
      return getABFunc(_config);
    }
  } catch (e) {
    return Promise.resolve(_config.default_value);
  }
  return Promise.resolve(_config.default_value);
};

export const validateSpm = (spm) => {
  let validated = false;
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    validated = sensors.spm.validateSpm(spm);
  });
  return validated;
};

export const getPreSpmCode = () => {
  let code = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    code = sensors.spm.getPreSpmCode();
  });
  return code;
};

export const kcsensorsManualTrack = (trackingConfig, type = 'expose') => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    if (!trackingConfig) return;
    const { spm = [], data = {}, checkID = true } = trackingConfig || {};
    let { kc_siteid, kc_pageid } = trackingConfig;

    const spmModule = sensors?.spm;
    if (!kc_siteid) {
      kc_siteid = spmModule?.getSiteId?.();
    }
    if (!kc_pageid) {
      kc_pageid = spmModule?.getPageId?.();
    }

    if (checkID) {
      if (!kc_pageid || !validateSpm(spm)) return;
    }
    let exposeCfg = {
      ...data,
    };
    if (checkID) {
      exposeCfg = {
        spm_id: spmModule.compose(spm),
        site_id: kc_siteid,
        page_id: kc_pageid,
        pre_spm_id: getPreSpmCode(),
        ...exposeCfg,
      };
    }
    sensors.track(type, exposeCfg);
  });
};

// 获取query参数，兼容hash路由
const parseQuery = () => {
  if (typeof window !== 'undefined') {
    const { href } = window.location;
    if (href.indexOf('?') === -1) {
      return {};
    }
    const queryString = href.split('?')[1] || '';
    return qs.parse(queryString);
  }
  return {};
};

const getUrlSource = () => {
  const { spm } = parseQuery();
  if (spm && size(spm) > 0 && includes(spm, '.')) {
    const spmList = split(spm, '.');
    return spmList[1];
  }
};

/**
 * 登录/注册时或者页面来源，从哪个界面触发的登录/注册（便于统计流量）
 * 取值优先级如下
 *    组件传入的source -> url上面的source参数 -> 当前界面的page_id - 默认mainSet主站
 *    其中url带的source是其他二级域名跳转主站登录的情况 格式如下 /signin?spm=kcWeb.B2RewardsHub.CDiversion.1
 *
 * @param {*} config trackingConfig组件调用方传过来的source
 * @returns
 */
export const getTrackingSource = (config = {}) => {
  const { source } = config || {};
  let sdkPageID = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sdkPageID = sensors?.spm?.getPageId?.();
  });
  const urlSource = getUrlSource();
  return urlSource || source || sdkPageID || 'mainSet';
};
