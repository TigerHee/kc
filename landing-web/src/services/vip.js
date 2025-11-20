/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

/**
 * 获取手续费和用户等级 代替queryUserVIPInfo 接口
 *
 * @param   {[type]}  symbol  [symbol description]
 *
 * @return  {[type]}          [return description]
 */
 export async function getFeeAndLevel({ symbol } = {}) {
  return pull('/kucoin-web-front/fee/getExchangeLevelAndFee', { symbol });
}