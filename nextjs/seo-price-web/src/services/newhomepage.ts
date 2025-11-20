/**
 * Owner: willen@kupotech.com
 */

import { pull as originPull } from 'gbiz-next/request';

const pull = originPull;

/**
 * 获取k线数据
 */
export const getKLineData = (params) => {
  return pull('/order-book/candles', params);
};
