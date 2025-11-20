/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// CTA
// 创建页面图表
export const getCreatePageChart = ({ symbol, endTime }) => {
  return RobotHttp.get('/v1/futures/cta/create/param', { symbol, endTime });
};

// 当前委托页面图表
export const getOpenOrderPageChart = ({ taskId, endTime }) => {
  return RobotHttp.get('/v1/futures/cta/current/page', { taskId, endTime });
};

// 历史委托页面图表
export const getStopOrderPageChart = ({ taskId, endTime }) => {
  return RobotHttp.get('/v1/futures/cta/arbitrage-chart', { taskId, endTime });
};

// 计算最小投资
export const getMinInvest = ({ symbol, leverage, pullBack }) => {
  return RobotHttp.get('/v1/futures/cta/calculate/min-amount', { symbol, leverage, pullBack });
};
