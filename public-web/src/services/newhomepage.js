/**
 * Owner: willen@kupotech.com
 */

import { pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

/**
 * 获取k线数据
 */
export const getKLineData = (params) => {
  return pull('/order-book/candles', params);
};

// 福利中心-新客任务-任务配置信息
export const getKuRewardsNewcomerConfig = (params = {}) => {
  return pull(`/platform-reward/newcomer/config`, params);
};
