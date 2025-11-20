export enum RENDER_TYPE {
  PAGE = 'page',
  DIALOG = 'dialog',
}

export enum METHODS {
  /** 邮箱验证码 */
  EMAIL = 'EMV',
  /** 短信验证码 */
  SMS = 'SMS',
  /** google验证码 */
  GOOGLE_2FA = 'GAV',
  /** 登陆密码 */
  LOGIN_PASSWORD = 'SI',
  /** 交易密码 */
  WITHDRAW_PASSWORD = 'TP',
  /** passkey */
  PASSKEY = 'PK'
}

export const TEXT_METHOD_ORDER: Record<METHODS, number> = {
  [METHODS.PASSKEY]: 0,
  [METHODS.LOGIN_PASSWORD]: 1,
  [METHODS.WITHDRAW_PASSWORD]: 2,
  [METHODS.SMS]: 3,
  [METHODS.EMAIL]: 4,
  [METHODS.GOOGLE_2FA]: 5,
};

/**
 * 响应错误码集合
 * - 只记录前端需要匹配的
 */
export enum ERROR_CODE {
  /** 风控拒绝 */
  RISK_REJECTION = '40016',
  /** 撮合方案超时 */
  MATCHING_TIMEOUT = '40017',
  /** 引导用户到安全页绑定验证方式 */
  GO_TO_SECURITY = '50005',
  /** 引导到主账号 */
  GO_TO_MAIN_ACCOUNT = '500017',
  /** 兜底用 */
  FORBIDDEN = '',
};

export enum SCENE {
  INIT = 'INIT',
  PASSKEY = 'PASSKEY',
  PASSKEY_SUPPLEMENT = 'PASSKEY_SUPPLEMENT',
  OTP = 'OTP',
  ERROR_40016 = 'ERROR_40016',
  ERROR_40017 = 'ERROR_40017',
  ERROR_50005 = 'ERROR_50005',
  ERROR_500017 = 'ERROR_500017',
  ERROR_DEFAULT = 'ERROR_DEFAULT',
}

/**
 * 验证码消息通道枚举
 * @url https://k-devdoc.atlassian.net/wiki/spaces/techshare/pages/583435495/API#%E5%8F%91%E9%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%E6%8E%A5%E5%8F%A3
 */
export enum SEND_CHANNELS {
  /** 短信 */
  SMS = 'MY_SMS',
  /** 邮箱 */
  EMAIL = 'MY_EMV',
  /** 语音 */
  VOICE = 'MY_VOICE',
};

export interface SecVerifyResponse {
  headers: {
    'X-VALIDATION-TOKEN': string;
    'ORIGIN-APP-SESSION-ID'?: string;
    'ORIGIN-APP-TOKEN-SM'?: string;
  };
  data: {
    isNeedLiveVerify: boolean;
    isNeedSelfService: boolean;
  }
}
