/**
 * Owner: jesse.shao@kupotech.com
 */
import { kcsensorsClick } from 'utils/ga';
import { KcSensorsLogin } from 'utils/kcsensors';
// 神策埋点, 默认方法
export const sensors = {
  trackClick: kcsensorsClick,
  login: KcSensorsLogin,
  // spm: sa.spm,
  // sa,
};

export const getSpm = async () => {
  return import('@kc/sensors').then(res => {
    const sensors = res?.default || res;
    return sensors.spm;
  }) 
};