/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

// 获取邀请折扣
export function getDiscount(param) {
  return pull('/promotion/invitation/ratio', param);
}
