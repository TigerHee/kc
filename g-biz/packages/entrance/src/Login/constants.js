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

// 输入账号登陆
export const ACCOUNT_LOGIN_STEP = {
  // 仅展示账号输入框
  LOGIN_IN_STEP_ONLY_ACCOUNT: 1,
  // 展示账号密码输入框
  LOGIN_IN_STEP_ACCOUNT_PASSWORD: 2,
};

// 三方注册分流 步骤
export const THIRD_PARTY_ACCOUNT_DIVERSION_STEP = {
  // 首页
  HOME: 0,
  // 创建新账户页面
  CREATE_NEW_ACCOUNT: 1,
  // 进入到绑定已有账号页面
  BIND_EXIST_ACCOUNT: 2,
  // 进入到已有账号登录绑定页面
  EXIST_ACCOUNT_LOGIN: 3,
  // 账号已经被绑定
  ACCOUNT_HAS_BOUND: 4,
};

export const THIRD_PARTY_LOGIN_DECISION = {
  // 三方账号直接登陆
  login: 1,
  // 三方换绑
  relink: 2,
};

export const SCAN_LOGIN_TAB_KEY = `${PREFIX}_SCAN_LOGIN`;
export const ACCOUNT_LOGIN_TAB_KEY = `${PREFIX}_ACCOUNT_LOGIN`;
export const SUB_ACCOUNT_LOGIN_TAB_KEY = `${PREFIX}_SUB_ACCOUNT_LOGIN`;

export const ACCOUNT_KEY = {
  mobileCode: '$entrance.si.mc', // 手机号登录区号记录
  [ACCOUNT_LOGIN_TAB_KEY]: '$entrance.si.a', // 账号登录记录
  [SUB_ACCOUNT_LOGIN_TAB_KEY]: '$entrance.si.sa', // 子账号登录记录
};

export const SCAN_AUTHORIZED = 'authorized'; // app已确认登录

export const SCAN_SCANNED = 'scanned'; // app已扫码

export const SCAN_EXPIRED = 'expired'; // 不存在或过期

export const SCAN_CANCELED = 'canceled'; // app取消登录

export const SCAN_RISK = 'hitRisk'; // 命中风控

export const NAMESPACE = NAMESPACE_MAPS.LOGIN;

// 风险标识
export const RISK_TAG = {
  LOGIN_RISK_SMS_VERIFY: {
    warnText: 'fBZ1R8WHZd7ct59pcxZSJy',
  },
  LOGIN_RISK_EMAIL_VERIFY: {},
};

export const THIRD_PARTY_LOGIN_PLATFORM = (_t) => ({
  TELEGRAM: {
    labelLocale: _t('6U26qBZVoZjJtxAcLCFEUZ'),
  },
  GOOGLE: {
    labelLocale: _t('mBDd5m2KVc4w4zJVn66tU2'),
  },
  APPLE: {
    labelLocale: _t('jmZP6BerHzJAi3TSYmogrZ'),
  },
});
export const THIRD_PARTY_LOGIN_TYPE = 'LOGIN';
export const LOGIN_BIZ_TYPE = 'LOGIN_V2';

export const BIZ = 'EMAIL_LOGIN';

// 拒绝签署协议，退出登陆时返回的页面
export const REFUSE_SIGN_TERM_JUMP_URL = '/';
