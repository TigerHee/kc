/**
 * Owner: vijay.zhou@kupotech.com
 */
export const NAMESPACE = '$securityV2';

/**
 * 验证方式对应提交到后端的字段枚举，定义看文档
 * @url https://k-devdoc.atlassian.net/wiki/spaces/FKER/pages/555877684/security_modification
 */
export const METHODS = {
  /** 邮箱验证码 */
  EMAIL: 'EMV',
  /** 短信验证码 */
  SMS: 'SMS',
  /** google验证码 */
  GOOGLE_2FA: 'GAV',
  /** 登陆密码 */
  LOGIN_PASSWORD: 'SI',
  /** 交易密码 */
  WITHDRAW_PASSWORD: 'TP',
  /** passkey */
  PASSKEY: 'PK',
};

/**
 * 文本类验证方式的排列顺序
 */
export const TEXT_METHOD_ORDER = {
  [METHODS.LOGIN_PASSWORD]: 0,
  [METHODS.WITHDRAW_PASSWORD]: 1,
  [METHODS.SMS]: 2,
  [METHODS.EMAIL]: 3,
  [METHODS.GOOGLE_2FA]: 4,
};

/**
 * 验证码消息通道枚举
 * @url https://k-devdoc.atlassian.net/wiki/spaces/techshare/pages/583435495/API#%E5%8F%91%E9%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%E6%8E%A5%E5%8F%A3
 */
export const SEND_CHANNELS = {
  /** 短信 */
  SMS: 'MY_SMS',
  /** 邮箱 */
  EMAIL: 'MY_EMV',
  /** 语音 */
  VOICE: 'MY_VOICE',
};

/**
 * 响应错误码集合
 * - 只记录前端需要匹配的
 */
export const ERROR_CODE = {
  /** 风控拒绝 */
  RISK_REJECTION: '40016',
  /** 撮合方案超时 */
  MATCHING_TIMEOUT: '40017',
  /** 引导用户到安全页绑定验证方式 */
  GO_TO_SECURITY: '50005',
  /** 兜底用 */
  FORBIDDEN: '',
};
