/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import FooterModel from './Footer/model';
import CmsComsModel from './CmsComs/model';
import { replaceHost } from './common/tools';

const modelDict = {
  footer: FooterModel,
  cmsComs: CmsComsModel,
};

export const httpTool = Http.create('@kc/footer');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}

export { replaceHost };
