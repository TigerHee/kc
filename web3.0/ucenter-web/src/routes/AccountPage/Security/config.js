/**
 * Owner: willen@kupotech.com
 */
// 忘记交易密码，不同安全校验的埋点
export const FORGET_TRADE_PW_BLOCKIDS = new Map([
  [[['my_email']], 'SecurityVerfication1'],
  [[['my_sms']], 'SecurityVerfication2'],
  [[['my_sms', 'google_2fa']], 'SecurityVerfication3'],
  [[['my_email', 'google_2fa']], 'SecurityVerfication4'],
  [[['my_sms', 'my_email']], 'SecurityVerfication5'],
  [[['my_sms', 'my_email', 'google_2fa']], 'SecurityVerfication6'],
]);
