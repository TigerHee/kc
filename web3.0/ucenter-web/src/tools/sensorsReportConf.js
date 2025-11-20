/**
 * Owner: willen@kupotech.com
 */
import { IS_TEST_ENV } from '../utils/env';
export const siteId = 'kcWeb';

export const pageIdMap = {
  '/account': 'B1Overview',
  '/account/kyc': 'B1CertificationHomepage',
  '/account/kyc/home': 'B1KYCPage',
  '/account/kyc/setup/country-of-issue': 'B1KYCPage',
  '/account/kyc/setup/identity-type': 'B1KYCPage',
  '/account/kyc/setup/method': 'B1KYCPage',
  '/account/kyc/setup/ocr': 'B1KYCPage',
  '/account/kyb/home': 'B1KYBPage',
  '/account/kyb/setup': 'B1KYBPage',
  '/account/kyb/certification': 'B1KYBPage',
  '/account/download': 'B1DownloadCenter',
  '/authorize-result': 'B1EmailAuthorizationTip',
  '/ucenter/signup': 'B1register',
  '/ucenter/signin': 'B1login',
  '/ucenter/reset-password': 'B1ForgetPassword',
  '/account/api/create': 'B1CreateAPI', // 创建/编辑API
  '/account/api/create/security': 'B1CreateAPISec', // 安全验证页面
  '/account/api/edit': 'B1edtiAPI', // 创建/编辑API
  '/account/api': 'B5AccountApi', // API管理
  '/utransfer': 'B1Utransfer',
  '/ucenter/reset-g2fa/:token': 'ResetGoogle',
  '/ucenter/rebind-phone/:token': 'ResetPhoneNumber',
  // 个人设置
  '/account/security': 'B1security',
  '/account/security/ForgetWP': 'ForgetWP',
  '/account/security/deleteAccount': 'B1deleteAccount',
  '/account/security/phone': 'B1ModifyPhone',
  '/account/security/email': 'B1ModifyEmail',
  '/account/security/unbind-phone': 'B1UnbindPhone',
  '/account/security/unbind-email': 'B1UnbindEmail',
  '/account/security/protect': 'B1WithdrawPwd',
  '/account/security/passkey': 'B1Passkey',
  '/account/security/score': 'B1security_score',
  '/account/kyc/institutional-kyc': 'B1KYBVerifiyProcess',
  '/account/kyc/tax': 'KYCINDIAPAN',
  '/account/kyc/update': 'kyc_update',
  // 用户迁移
  '/account/transfer': 'B1AccountTransfer',
  // 法国荷兰用户清退
  '/account/guidance-zbx': 'B1RemovalNoticePage',
};

export const sensorsConfig = {
  env: _DEV_ || IS_TEST_ENV ? 'development' : 'production',
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    _DEV_ || IS_TEST_ENV
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
  log: true,
  // log: true, // 需要在 dev 环境查看上报log的话，就要把这里设置为 true
  sdk_url: 'https://assets.staticimg.com/natasha/npm/sensorsdata/sensorsdata.min.js',
};
