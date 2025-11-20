import sensors from 'gbiz-next/sensors';
import { getReport } from 'gbiz-next/report';
import { IS_CLIENT_ENV, IS_PROD } from 'kc-next/env';
import { isIOS } from '@/helper';
import isMobile from '@/utils/isMobile';
import JsBridge from 'gbiz-next/bridge';
export { composeSpmAndSave, saveSpm2Storage } from './composeSpmAndSave';

type ManualTrackData = Record<string, any>;

export const manualTrack = (
  spm: string[] = [],
  data: ManualTrackData = {},
  type: string = 'expose',
): void => {
  const exposeCfg = {
    spm_id: sensors.spm.compose(spm),
    ...data,
  };

  sensors.track(type, exposeCfg);
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm: string[] = [], data: any = {}) => {
  if (!sensors) return;
  // kcsensors spm 模块
  window.requestIdleCallback(() => {
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    sensors.track(saType, exposeCfg);
  });
};

// 神策sdk- track方法
// 神策sdk原生track方法，详情参阅神策sdk文档
export const track = (eventType, options) => {
  sensors.track(eventType, options);
};

export const trackClick = (spm, data = {}) => {
  sensors.trackClick(spm, data);
};

export const kcsensorsManualExpose = (spm: any[] = [], data = {}, type = 'expose') => {
  // kcsensors spm 模块
  const exposeCfg = {
    spm_id: sensors.spm.compose(spm),
    ...data,
  };
  sensors.track(type, exposeCfg);
};

// 用于拼接spm参数
export const getPageId = () => {
  if (!sensors) return '';
  const spmModule = sensors.spm;
  const kc_pageid = spmModule.getPageId();
  return kc_pageid;
};

/**
 * 合并埋点动作
 * eventLevelVariables: 事件级别变量 eg: {ad_pop_id: '1', ad_pop_module: 'assets'}
 */
export const ga = async (key?: string) => {
  try {
    // console.log('--埋点--', key, eventLevelVariables);
    if (!key || !IS_CLIENT_ENV) return;
    if (typeof window !== 'undefined' && window._hmt && typeof window._hmt.push === 'function') {
      window._hmt.push(['_trackEvent', key, 'click']);
    }
    const report = await getReport();
    report?.logAction(key, 'click');
  }  catch (err) {
    console.log('ga error...', err);
  }
};

/**
 * 获取携带相关属性的node节点
 *
 * @param {HTMLNode} node node节点
 * @param {string} attr 查询的属性
 */
export const getGaElement = (node: HTMLElement, attr) => {
  if (!node || node.localName === 'body') return;
  const key = node.getAttribute(attr);
  if (key) {
    return key;
  }

  if (!node.parentNode) return;
  return getGaElement(node.parentNode as HTMLElement, attr);
};

// 上报接口耗时
export const trackRequest = (requestName, duration) => {
  if (!IS_PROD) {
    console.log(`${requestName} ${duration}`);
  }
  if (IS_CLIENT_ENV) {
    sensors.track('web_request_performance', {
      url: window.location.href,
      app_name: 'ucenter_web',
      request_name: requestName,
      request_duration: duration,
      platform: isMobile() ? (isIOS() ? 'ios' : 'android') : 'web',
      is_app: JsBridge.isApp(),
    });
  }
};
