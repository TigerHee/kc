/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import SecurityHomeModel from './SecurityHome/model';
import UpdatePwdModel from './UpdatePwd/model';
import G2faModel from './G2fa/model';
import authFormModel from './G2fa/AuthForm/model';
import securityVerifyModel from './SecurityVerify/model';
import setTradePwdModel from './SetTradePwd/model';

const modelDict = {
  securityHome: SecurityHomeModel,
  updatePwd: UpdatePwdModel,
  g2fa: G2faModel,
  g2faAuthForm: authFormModel,
  verify: securityVerifyModel,
  setTradePwd: setTradePwdModel,
};

export { default as withVerify } from './SecurityVerify/withVerify';
export { default as useVerify } from './SecurityVerify/useVerify';

export const httpTool = Http.create('@kc/security');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}
