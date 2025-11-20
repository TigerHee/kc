/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

/**
 * 获取排行榜过滤条件
 */
export function getCriteria() {
  return RobotHttp.get(`/v1/task/common/rank-criteria`);
}

/**
 * 获取排行币种维度数据
 */
export function getCoinRank(rankTitle) {
  return RobotHttp.get(`/v1/currency-rank`, { rankTitle });
}

/**
 * 获取排行策略维度数据
 */
export function getStrategyRank(data) {
  return RobotHttp.post(`/v1/task/common/rank`, data);
}
