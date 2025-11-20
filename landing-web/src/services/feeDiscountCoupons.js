/**
 * Owner: solarxia@kupotech.com
 */
import { pull } from 'utils/request';

/**
 * 获取现货抵扣券
 *
 * @param symbol    string
 */
export async function queryUsableCoupon({ symbol }) {
  return pull('/trade-marketing/usable-coupons', { symbol });
}
