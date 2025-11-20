import withI18nReady from 'adaptor/tools/withI18nReady';
import {
  ForgetPwd as ForgetPwdOri,
  Login as LoginOri,
  LoginCL as LoginCLOri,
  LoginDrawer as LoginDrawerOri,
  LoginNoLayout as LoginNoLayoutOri,
  SignupPageLayout as SignupPageLayoutOri,
  NewVoiceCode as NewVoiceCodeOri,
  PhoneAreaSelector as PhoneAreaSelectorOri,
  EmailVerifyInput as EmailVerifyInputOri,
  SMSVerifyInput as SMSVerifyInputOri,
  GFAVerifyInput as GFAVerifyInputOri,
  EmailInput as EmailInputOri,
  PasswordInput as PasswordInputOri,
  AccountInput as AccountInputOri,
  AccountInputWithDrawer as AccountInputWithDrawerOri,
  UpdatePwdTipDialog as UpdatePwdTipDialogOri,
  SwitchMultiTypeModal as SwitchMultiTypeModalOri
} from 'packages/entrance/src/index';

export const Login = withI18nReady(LoginOri, 'entrance');
export const LoginCL = withI18nReady(LoginCLOri, 'entrance');
export const LoginDrawer = withI18nReady(LoginDrawerOri, 'entrance');
export const AccountInput = withI18nReady(AccountInputOri, 'entrance');
export const AccountInputWithDrawer = withI18nReady(AccountInputWithDrawerOri, 'entrance');
export const LoginNoLayout = withI18nReady(LoginNoLayoutOri, 'entrance');
export const SignupPageLayout = withI18nReady(SignupPageLayoutOri, 'entrance');
export const NewVoiceCode = withI18nReady(NewVoiceCodeOri, 'entrance');
export const PhoneAreaSelector = withI18nReady(PhoneAreaSelectorOri, 'entrance');
export const EmailVerifyInput = withI18nReady(EmailVerifyInputOri, 'entrance');
export const SMSVerifyInput = withI18nReady(SMSVerifyInputOri, 'entrance');
export const GFAVerifyInput = withI18nReady(GFAVerifyInputOri, 'entrance');
export const EmailInput = withI18nReady(EmailInputOri, 'entrance');
export const PasswordInput = withI18nReady(PasswordInputOri, 'entrance');
export const ForgetPwd = withI18nReady(ForgetPwdOri, 'entrance');
export const UpdatePwdTipDialog = withI18nReady(UpdatePwdTipDialogOri, 'entrance');
export const SwitchMultiTypeModal = withI18nReady(SwitchMultiTypeModalOri, 'entrance');
