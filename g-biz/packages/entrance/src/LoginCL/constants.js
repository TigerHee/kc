/**
 * Owner: willen@kupotech.com
 */

import { PREFIX, NAMESPACE_MAPS } from '../common/constants';

// 登陆的步骤
export const LOGIN_STEP = {
  // 输入账号
  SIGN_IN_STEP_INPUT_ACCOUNT: 1,
  // 验证码校验
  SIGN_IN_STEP_VERIFY_ACCOUNT: 2,
  // 邮箱风控
  SIGN_IN_STEP_EMAIL_RISK: 3,
  // 三方注册 绑定流程
  SIGN_IN_STEP_BIND_THIRD_PARTY: 4,
  // 三方注册 极简注册
  SIGN_IN_STEP_THIRD_PARTY_SIMPLE: 5,
};

export const ACCOUNT_LOGIN_TAB_KEY = `${PREFIX}_ACCOUNT_LOGIN`;

export const ACCOUNT_KEY = {
  mobileCode: '$entrance.si.mc', // 手机号登录区号记录
  [ACCOUNT_LOGIN_TAB_KEY]: '$entrance.si.a', // 账号登录记录
};

export const NAMESPACE = NAMESPACE_MAPS.LOGIN;

// 风险标识
export const RISK_TAG = {
  LOGIN_RISK_SMS_VERIFY: {
    warnText: 'fBZ1R8WHZd7ct59pcxZSJy',
  },
  LOGIN_RISK_EMAIL_VERIFY: {},
};

export const LOGIN_BIZ_TYPE = 'LOGIN_V2';

export const BIZ = 'EMAIL_LOGIN';
