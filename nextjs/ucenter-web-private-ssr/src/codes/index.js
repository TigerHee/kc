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
// userInfo中的冻结状态
export const FROZEN_STATUS = 3;
// 账户被冻结
export const ACCOUNT_FROZEN = '4111';
// 安全验证超时
export const SECURITY_EXPIRED = '40006';
// 安全验证检测到token登录失效
export const LOGIN_INVALID = '280001';

export const NO_UPGRADE = '4113';

// 用户碰撞检测
export const CONFLICT = '500009';

// session 过期
export const LOGIN_401 = '401';
