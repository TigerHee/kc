/**
 * Owner: borden@kupotech.com
 */

export const UNAUTH = 'UNAUTH';

// 安全检测失败
export const CHECK_SECURITY_FAILED = 'CHECK_SECURITY_FAILED';

// 钱包系统重启会导致这个 CODE
export const BALANCE_SYSTEM_ERROR = 'SYSTEM_ERROR';

// 撤销全部委托不完全会返回这个 CODE
export const ORDER_SYSTEM_ERROR = 'SYSTEM_ERROR';

export const CHECK_LOGIN_SECURITY_FAILED = 'CHECK_LOGIN_SECURITY_FAILED';

export const CHECK_WITHDRAW_STATUS = {
  INIT: 0,
  SUCCESS: 1,
  TIMEOUT: 2,
  OTHER: 3,
};
// 账户被冻结
export const ACCOUNT_FROZEN = '4111';
// 安全验证超时
export const SECURITY_EXPIRED = '40006';
// 安全验证检测到token登录失效
export const LOGIN_INVALID = '280001';

export const NO_UPGRADE = '4113';

// session 过期
export const LOGIN_401 = '401';

// 存储storage中语言数据的key的前缀
export const KUCOIN_LANG_KEY = 'kucoinv2';

// WITHOUT_QUERY_PARAM:不应该出现在url-query参数中的参数。
export const WITHOUT_QUERY_PARAM = ['rcode', 'utm_source', 'utm_campaign', 'utm_medium'];
