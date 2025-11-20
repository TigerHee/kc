/**
 * Owner: iron@kupotech.com
 */
import '@packages/entrance/src/common/httpInterceptors';
import { syncRCode } from '@packages/entrance/src/common/tools';
import {
  Login as OriLogin,
  LoginCL as OriLoginCL,
  LoginDrawer as OriLoginDrawer,
  LoginNoLayout as OriLoginNoLayout,
  SignUp as OriSignUp,
  Signup4KuMEXDrawer as OriSignup4KuMEXDrawer,
  SignUpDrawer as OriSignUpDrawer,
  SignUpNoLayout as OriSignUpNoLayout,
  SignupPageLayout as OriSignupPageLayout,
  ForgetPwd as OriForgetPwd,
  ForgetPwdDrawer as OriForgetPwdDrawer,
  Guide as OriGuide,
  ModalForbid as OriModalForbid,
  VoiceCode as OriVoiceCode,
  HumanCaptcha as OriHumanCaptcha,
  NewVoiceCode as OriNewVoiceCode,
  EmailUnavailableModal as OriEmailUnavailableModal,
  SwitchMultiTypeModal as OriSwitchMultiTypeModal,
  UpdatePwdTipDialog as OriUpdatePwdTipDialog,
} from '@packages/entrance/src/componentsBundle';
import withI18nReady from '@hooks/withI18nReady';
// rcode同步
syncRCode();

export const Login = withI18nReady(OriLogin, 'entrance');
export const LoginCL = withI18nReady(OriLoginCL, 'entrance');
export const LoginDrawer = withI18nReady(OriLoginDrawer, 'entrance');
export const LoginNoLayout = withI18nReady(OriLoginNoLayout, 'entrance');
export const SignUp = withI18nReady(OriSignUp, 'entrance');
export const Signup4KuMEXDrawer = withI18nReady(OriSignup4KuMEXDrawer, 'entrance');
export const SignUpDrawer = withI18nReady(OriSignUpDrawer, 'entrance');
export const SignUpNoLayout = withI18nReady(OriSignUpNoLayout, 'entrance');
export const SignupPageLayout = withI18nReady(OriSignupPageLayout, 'entrance');
export const ForgetPwd = withI18nReady(OriForgetPwd, 'entrance');
export const ForgetPwdDrawer = withI18nReady(OriForgetPwdDrawer, 'entrance');
export const Guide = withI18nReady(OriGuide, 'entrance');
export const ModalForbid = withI18nReady(OriModalForbid, 'entrance');
export const VoiceCode = withI18nReady(OriVoiceCode, 'entrance');
export const HumanCaptcha = withI18nReady(OriHumanCaptcha, 'entrance');
export const NewVoiceCode = withI18nReady(OriNewVoiceCode, 'entrance');
export const EmailUnavailableModal = withI18nReady(OriEmailUnavailableModal, 'entrance');
export const SwitchMultiTypeModal = withI18nReady(OriSwitchMultiTypeModal, 'entrance');
export const UpdatePwdTipDialog = withI18nReady(OriUpdatePwdTipDialog, 'entrance');
