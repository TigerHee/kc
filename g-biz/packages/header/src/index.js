/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import HeaderModel from './Header/model';
import CmsComsModel from './CmsComs/model';
import PWATipModel from './PWATip/model';
import { setPush } from './pushRouter';

const modelDict = {
  header: HeaderModel,
  cmsComs: CmsComsModel,
  pwaTip: PWATipModel,
};

export const httpTool = Http.create('@kc/header');

export const pushTool = { setPush };

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}
