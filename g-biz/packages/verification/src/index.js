/**
 * Owner: vikay.zhou@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';

const modelDict = {};

export { default as SecurityVerifyForm } from './components/SecurityVerifyForm';
export { default as SecurityVerifyModal } from './components/SecurityVerifyModal';
export { default as checkAvailable } from './utils/checkAvailable';

export const httpTool = Http.create('@kc/verification');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}
