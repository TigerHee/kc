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


/**
 * 从卡券中心获取改用户手中的抵扣券
 *
 * @param page  pageNo  string
 * @param pageSize  string
 * @param pageType  string
 * @param currency  string
 */
export async function queryCouponFromConponCenter(params) {
  return pull('/growth-reward-core/coupon/list', params);
}
