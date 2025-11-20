/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';
import { queryString } from 'Bot/helper';

// 获取配置的交易对列表Mike
export const getInverstSymbolLists = () => {
  return RobotHttp.get('/v1/aip/task/symbol');
};

// 获取定投当前委托的详情
export const getInverstOpenOrdersDetail = (taskId) => {
  return RobotHttp.get(`/v1/aip/task/current_detail?taskId=${taskId}`);
};

/**
 * 修改机器人参数
 */
export function updateBotParams(data) {
  return RobotHttp.post(`/v1/task/update/run_param?${queryString(data)}`);
}
// 获取收益目标时间
export const getprofitTargetDate = (symbol, profitTarget) => {
  return RobotHttp.get(
    `/v1/aip/task/goalAchievedTime?symbol=${symbol}&profitTarget=${profitTarget}`,
  );
};
// 获取最小投资
export const getMinInvest = (symbol) => {
  return RobotHttp.get('/v1/aip/task/minAmount', { symbol });
};
