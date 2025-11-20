/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// CTA
// 创建页面图表
export const getCreatePageChart = symbol => {
  return RobotHttp.get('/v1/cta/create/param', { symbol });
};

// 当前委托页面图表
export const getOpenOrderPageChart = ({ taskId, endTime }) => {
  return RobotHttp.get('/v1/cta/current/page', { taskId, endTime });
};

// 历史委托页面图表
export const getStopOrderPageChart = ({ taskId, endTime }) => {
  return RobotHttp.get('/v1/cta/arbitrage-chart', { taskId, endTime });
};
