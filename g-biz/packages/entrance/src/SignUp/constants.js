/**
 * Owner: iron@kupotech.com
 */

import { NAMESPACE_MAPS } from '../common/constants';

export const SIGN_EMAIL_TAB_KEY = 'sign.email.tab';
export const SIGN_PHONE_TAB_KEY = 'sign.phone.tab';

export const EMAIL_BIZTYPE = 'EMAIL_REGISTER';
export const PHONE_BIZTYPE = 'PHONE_REGISTER';

export const NAMESPACE = NAMESPACE_MAPS.SIGNUP;

export const SIGNUP_STEP = {
  // 注册前必须签署的协议文件
  REGISTER_AGREEMENT: 0,
  // 输入账号
  REGISTER_STEP_SET_ACCOUNT: 1,
  // 验证码校验
  REGISTER_STEP_VERIFY_ACCOUNT: 2,
  // 绑定邮箱
  REGISTER_STEP_BIND_EMAIL: 3,
  // 设置密码
  REGISTER_STEP_SET_PASSWORD: 4,
};

export const SIGNUP_TYPE_CONFIG = {
  email: {
    validationType: 'EMAIL',
    recallAPI: 'postEmailRecall',
  },
  phone: {
    validationType: 'PHONE',
    recallAPI: 'postPhoneRecall',
  },
};

// 注册挽留弹窗
// 用户 ip 是英国、香港不展示挽留弹窗
export const SIGNUP_LEAVE_DIALOG_SPM = 'compliance.signup.leaveDialog.1';
export const SIGNUP_KYC_BENEFITS_SPM = 'compliance.signup.hiddenMktContent.1';
