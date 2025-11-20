/**
 * Owner: willen@kupotech.com
 */
import sensors from 'tools/ext/kc-sensors';

export const kcsensorsManualExpose = (spm = [], data = {}, type = 'expose') => {
  // kcsensors spm 模块
  const exposeCfg = {
    spm_id: sensors.spm.compose(spm),
    ...data,
  };
  sensors.track(type, exposeCfg);
};
