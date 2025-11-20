/**
 * Owner: tiger@kupotech.com
 */
import remoteEvent from 'tools/remoteEvent';

// 神策sdk原生track方法
export const track = (eventType, options) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    sensors.track(eventType, options);
  });
};

// 需固定上报的参数格式,默认不需要传递kc_siteid，kc_pageid
// 调用神策sdk原生track方法，统一传递了spm_id，site_id等参数
// 默认上传曝光事件
export const saTrackForBiz = ({ saType = 'expose' }, spm = [], data = {}) => {
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    const spmModule = sensors.spm;
    const exposeCfg = {
      spm_id: spmModule.compose(spm),
      ...data,
    };
    track(saType, exposeCfg);
  });
};
