/**
 * Owner: willen@kupotech.com
 */
// 安全记录类型
export const SECURITY_LOG_TYPE = {
  UPDATE_WITHDRAW_PASSWORD: 'trade.code.modify',
  ADD_WITHDRAW_PASSWORD: 'trade.code.setting',
  REST_WITHDRAW_PASSWORD: 'trade.code.forget',
  ADD_API: 'api.create',
  UPDATE_API: 'modify.api',
  BIND_EMAIL: 'email.bind',
  UPDATE_EMAIL: 'email.verify.new',
  BIND_PHONE: 'phone.bind',
  UPDATE_PHONE: 'phone.bind.new',
  ADD_TWOFA: 'set.g2fa',
  UPDATE_TWOFA: 'change.g2fa',
  REST_TWOFA: 'g2fa.unvaliable',
  UPDATE_PASSWORD: 'password.change',
  FREEZE_USER: 'freeze.account',
  UNFREEZE_USER: 'account.unfreeze',
  TRUST_DEVICE: 'trust.device',
  REGISTER_PASSKEY: 'f3b51a734bd64000a7ec',
  UPDATE_PASSKEY: 'fb28655e8f844000abc8',
  DELETE_PASSKEY: '4d1580a9eb984000a3fa',
  AUTH_PASSKEY: 'd820ab09d42a4000a98e',
};
