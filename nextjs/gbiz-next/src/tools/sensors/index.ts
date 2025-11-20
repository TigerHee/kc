import remoteEvent from 'tools/remoteEvent';
import { IS_TEST_ENV, _DEV_ } from '../env';

let sensors: any = null;

/**
 *
 * @param spmConfig
 * @param projectConfig
 * @param eventConfig ={
 *   page_view: true, // 是否开启全埋点 $pageview 事件
 *   web_page_leave: false, // 是否开启 web_page_leave 自定义事件
 * }
 * @returns
 */
export function init(spmConfig, projectConfig, eventConfig) {
  if (typeof window === 'undefined') return;
  sensors = require('@kc/sensors').default;
  try {
    sensors.init({
      env: IS_TEST_ENV || _DEV_ ? 'development' : 'production',
      abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
        IS_TEST_ENV || _DEV_ ? '36DBB03C8F0BA07957A1210633E218AA72F82017' : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
      }`,
      log: false,
    });
    sensors.registerProject(spmConfig, projectConfig, eventConfig);
    sensors.spmStorage.initSpmParam(window.location.href);
  } catch (e) {
    console.log('sensors init error:', e);
  }
}

// 手动注入 sensors 实例
export function setSensors(sensorsInstance) {
  sensors = sensorsInstance;
}

const initRemoteSensors = () => {
  if (typeof window === 'undefined') return;
  remoteEvent.on(remoteEvent.evts.GET_SENSORS, sendSensors => {
    if (typeof sendSensors === 'function') {
      sendSensors(sensors);
    }
  });
};

// 获取神策 ab 结果
export const getSensorsABResult = options => {
  const _config = options || {};
  let getABFunc;
  try {
    getABFunc = sensors.fastFetchABTest;
    if (getABFunc) {
      return getABFunc(_config);
    }
  } catch (e) {
    return Promise.resolve(_config.default_value);
  }
  return Promise.resolve(_config.default_value);
};

export const validateSpm = spm => {
  if (!sensors) return false;
  let validated = false;
  validated = sensors.spm.validateSpm(spm);
  return validated;
};

export const getPreSpmCode = () => {
  if (!sensors) return '';
  let code = '';
  code = sensors.spm.getPreSpmCode();
  return code;
};

export const kcsensorsManualTrack = (trackingConfig: Record<string, any>, type = 'expose') => {
  if (!trackingConfig || !sensors) return;
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
};

export const trackClick = (spm, data = {}) => {
  if (!sensors) return;
  sensors.trackClick(spm, data);
};

initRemoteSensors();
export function getSensors() { return sensors; } // 通过函数获取最新值

export default sensors;
