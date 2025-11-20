/**
 * Owner: iron@kupotech.com
 */
import { get } from '@tools/request';

// 获取邀请折扣
export function getInviteDiscount(param) {
  return get('/promotion/invitation/ratio', param);
}
