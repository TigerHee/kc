/**
 * Owner: iron@kupotech.com
 */
import { compose, validateSpm } from './spm';

export default (spmParams, params) => {
  // 校验 spmParams, 非法参数不进行上报
  if (validateSpm(spmParams)) {
    window.sensors.track('page_click', {
      spm_id: compose(spmParams),
      ...params,
    });
  }
};
