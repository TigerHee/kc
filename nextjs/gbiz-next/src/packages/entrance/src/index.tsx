import Login, { LoginDrawer, LoginNoLayout, AccountInput, AccountInputWithDrawer } from './Login';
import { type ILoginProps, type IAccountInputProps, type IAccountInputWithDrawerProps } from './Login';
import LoginCL from './LoginCL';
import { default as ForgetPwd, type IForgetPwdProps  } from './ForgetPwd';
import NewVoiceCode, { type IVoiceCodeProps } from './components/NewVoiceCode';
import PhoneAreaSelector, { type IPhoneAreaSelectorProps } from './components/PhoneAreaSelector';
import EmailVerifyInput, { type Props as IEmailVerifyInputProps } from './components/ValidateFormV2/Email';
import SMSVerifyInput, { type Props as ISMSVerifyInputProps } from './components/ValidateFormV2/SMS';
import GFAVerifyInput, { type Props as IGFAVerifyInputProps } from './components/ValidateFormV2/GFA';
import EmailInput, { type IEmailInputProps } from './components/EmailInput'
import PasswordInput, { type IPasswordInputProps } from './components/PasswordInput'
import { SignupPageLayout, SignUpNoLayout, type ISignupProps } from './Signup';
import ModalForbid from './components/ModalForbid'
import UpdatePwdTipDialog, { type IUpdatePwdTipDialogProps } from './components/UpdatePwdTipDialog'
import SwitchMultiTypeModal, { type ISwitchMultiTypeModalProps } from './components/SwitchMultiTypeModal'
import './common/httpInterceptors';

export {
  Login,
  LoginDrawer,
  LoginNoLayout,
  AccountInput,
  AccountInputWithDrawer,
  SignupPageLayout,
  SignUpNoLayout,
  LoginCL,
  NewVoiceCode,
  PhoneAreaSelector,
  EmailVerifyInput,
  SMSVerifyInput,
  GFAVerifyInput,
  EmailInput,
  PasswordInput,
  ForgetPwd,
  ModalForbid,
  UpdatePwdTipDialog,
  SwitchMultiTypeModal,
};

export type {
  ILoginProps,
  IAccountInputProps,
  IAccountInputWithDrawerProps,
  IVoiceCodeProps,
  IPhoneAreaSelectorProps,
  IEmailVerifyInputProps,
  ISMSVerifyInputProps,
  IGFAVerifyInputProps,
  IEmailInputProps,
  IPasswordInputProps,
  ISignupProps,
  IForgetPwdProps,
  IUpdatePwdTipDialogProps,
  ISwitchMultiTypeModalProps
}

