/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'gbiz-next/request';


/**
 *  新币榜，涨幅榜新接口，来源于机会发现
 *  接口文档：
 *  http://10.232.70.99:10240/swagger-ui/#/%E5%8F%91%E7%8E%B0%E4%B8%93%E5%8C%BA%20-%20SPL%E6%8E%A5%E5%8F%A3/getSplUsingGET
 */
export async function getCoinList(params) {
  return pull(`/discover-front/spl`, params);
}
