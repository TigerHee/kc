// 资金托管子账号绑定托管机构状态
export const OES_BOUND_TYPE = {
  // 已绑定
  alreadyBound: 1,
  // 未绑定
  notBound: 0,
  // 无法绑定，说明不是资金托管子账号
  unableToBound: -1,
};

// 本地缓存 key
export const STORAGE_KEY = {
  // 三方极简注册
  thirdPartySimpleSignup: 'third_party_simple_signup',
};
