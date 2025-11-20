/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import forgetPwdModel from './ForgetPwd/model';
import loginModel from './Login/model';
import signupModel from './SignUp/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, forgetPwdModel));
  uniqueModel(dva, extendModel(m, loginModel));
  uniqueModel(dva, extendModel(m, signupModel));
});

export { default as Login, LoginDrawer, LoginNoLayout } from './Login';
export { default as LoginCL } from './LoginCL';
export {
  default as SignUp,
  Signup4KuMEXDrawer,
  SignUpDrawer,
  SignUpNoLayout,
  SignupPageLayout,
} from './SignUp/index';
export { default as ForgetPwd, ForgetPwdDrawer } from './ForgetPwd';
export { default as LocaleProvider } from './components/LocaleProvider';
export { default as Guide } from './Guide';
export { default as ModalForbid } from './Tips/modalForbid';
export { default as VoiceCode } from './components/voiceCode';
export { default as HumanCaptcha } from './components/HumanCaptcha';
export { default as NewVoiceCode } from './components/NewVoiceCode';
export { default as EmailUnavailableModal } from './components/EmailUnavailableModal';
export { default as SwitchMultiTypeModal } from './components/SwitchMultiTypeModal';
export { default as UpdatePwdTipDialog } from './components/UpdatePwdTipDialog';
