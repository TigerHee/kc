/**
 * Owner: willen@kupotech.com
 */
import sensors from 'tools/ext/kc-sensors';
import { track } from './track';

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
