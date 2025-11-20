/**
 * Owner: iron@kupotech.com
 */
export const PREFIX = '$security';
export const PASSWORD_KEY = 'PASSWORD';
export const GOOGLE2FA_KEY = 'GOOGLE2FA';
export const EMAIL_KEY = 'EMAIL';

export const SECURITY_SEC_PATH = {
  [PASSWORD_KEY]: 'updatePwd',
  [GOOGLE2FA_KEY]: 'g2fa',
};

export const OPEN_G2FA_LOCAL_TIME = `${PREFIX}_open_g2fa_time`;
export const UPDATE_G2FA_LOCAL_TIME = `${PREFIX}_update_g2fa_time`;

// 安全校验成功
export const VERIFY_SUCCESS = 'EVETN_VERIFY_SUCCESS';
// 安全校验退出
export const VERIFY_QUIT = 'EVENT_VERIFY_QUIT';
// 需要校验的类型
export const VER_EMAIL = 'MY_EMAIL';
export const VER_SMS = 'MY_SMS';
export const VER_G2FA = 'GOOGLE_2FA';
export const VER_PASSWORD = 'WITHDRAW_PASSWORD';
// 验证码错误
export const VALIDATE_ERROR = '40007';
