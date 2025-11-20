/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import LoginModel from './Login/model';
import SignModel from './SignUp/model';
import ForgetPwdModel from './ForgetPwd/model';
import './common/httpInterceptors';
// import queryPersistence from './common/queryPersistence';

const modelDict = {
  login: LoginModel,
  signUp: SignModel,
  forgetPwd: ForgetPwdModel,
};

export const httpTool = Http.create('@kc/entrance');

export function getModels(key) {
  if (typeof key === 'string') {
    return modelDict[key];
  }

  return Object.keys(modelDict).map((modelKey) => modelDict[modelKey]);
}

// export function formatUtmAndRcodeUrl(url) {
//   return queryPersistence.formatUrlWithStore(url);
// }

// export { queryPersistence };
