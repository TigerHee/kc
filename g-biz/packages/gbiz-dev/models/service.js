/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';

const { get } = Http.create('@kc/kyc');

export const queryUserInfo = () => get('/ucenter/user-info');
