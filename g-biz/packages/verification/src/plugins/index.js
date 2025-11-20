/**
 * Owner: vijay.zhou@kupotech.com
 */
import * as email from './email';
import * as sms from './sms';
import * as g2fa from './g2fa';
import * as withdrawPassword from './withdraw-password';
import * as passkey from './passkey';

const PLUGIN_LIST = [passkey, email, sms, g2fa, withdrawPassword];

const get = (field) => {
  return PLUGIN_LIST.find((p) => p.field === field);
};

const has = (field) => {
  return PLUGIN_LIST.some((p) => p.field === field);
};

export default { get, has };
