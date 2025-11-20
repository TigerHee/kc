/**
 * Owner: willen@kupotech.com
 */
import { get } from 'lodash';
import sensors from 'tools/ext/kc-sensors';

export const getPageId = () => {
  let sdkPageID = '';
  if (!sensors) return '';
  const _getPageID = get(sensors, 'spm.getPageId');
  if (typeof _getPageID === 'function') {
    sdkPageID = _getPageID();
  }
  return sdkPageID;
};
