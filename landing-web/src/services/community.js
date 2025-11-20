/**
 * Owner: jesse.shao@kupotech.com
 */
import { pull } from 'utils/request';

// 获取社群配置
export async function getCommunityGroupConfig(params = {}) {
  return pull('/kucoin-config/community/group', params);
};
