/**
 * Owner: vijay.zhou@kupotech.com
 */
import * as email from './email';
import * as sms from './sms';
import * as g2fa from './g2fa';
import * as withdrawPassword from './withdraw-password';
import * as passkey from './passkey';
import * as loginPassword from './login-password';

export const PLUGIN_LIST: any[] = [passkey, email, sms, g2fa, withdrawPassword, loginPassword];

const get = (field: string) => {
  return PLUGIN_LIST.find((p) => p.field === field);
};

const has = (field: string) => {
  return PLUGIN_LIST.some((p) => p.field === field);
};

export default { get, has };
