/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import { extendModel } from '@utils';
import uniqueModel from '@tools/uniqueModel';
import g2faModel from './G2fa/model';
import securityVerifyModel from './SecurityVerify/model';
import authFormModel from './G2fa/AuthForm/model';
import securityHomeModel from './SecurityHome/model';
import setTradePwdModel from './SetTradePwd/model';
import updatePwdModel from './UpdatePwd/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, securityVerifyModel));
  uniqueModel(dva, extendModel(m, g2faModel));
  uniqueModel(dva, extendModel(m, authFormModel));
  uniqueModel(dva, extendModel(m, securityHomeModel));
  uniqueModel(dva, extendModel(m, setTradePwdModel));
  uniqueModel(dva, extendModel(m, updatePwdModel));
});

export { default as SecurityHome } from './SecurityHome';
export { default as UpdatePwd } from './UpdatePwd';
export { default as G2fa } from './G2fa';
export { default as LocaleProvider } from './components/LocaleProvider';
export { default as SecurityVerify } from './SecurityVerify';
export { default as SetTradePwdDrawer } from './SetTradePwdDrawer';
export { default as SetTradePwd } from './SetTradePwd';
