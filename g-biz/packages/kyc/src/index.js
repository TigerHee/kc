/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import PersonalInfoFormModel from './components/PersonalInfoForm/model';
import './common/httpInterceptors';

const modelDict = {
  personalInfoForm: PersonalInfoFormModel,
};

export const httpTool = Http.create('@kc/kyc');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}
