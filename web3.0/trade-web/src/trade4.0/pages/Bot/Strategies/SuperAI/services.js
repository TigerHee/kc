/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// 获取配置的交易对列表
export const getConfigSymbolLists = () => {
  return RobotHttp.get('/v1/symbol/query');
};

// 获取配置的ai 参数
export const getAIParams = (symbol) => {
  return RobotHttp.get('/v1/grid/task/ai/params', { symbol });
};
// 获取超级AI配置的参数
export const getSuperAIParams = (symbol) => {
  return RobotHttp.get(`/v1/spot-ai-grid/create-params?symbol=${symbol}`);
};

// 获取网格配置的交易对信息
export const getSymbolTickListsByType = (templateType) => {
  return RobotHttp.get('/v1/symbol/tick', { templateType });
};

// 获取网格已成交记录的匹配的买单详情
export const getMatchOrderDetailById = (orderIds, taskId) => {
  return RobotHttp.get('/v1/grid/task/order/detail', { orderIds, taskId });
};

// 获取网格手续费
export const getSymbolInfo = (type, symbol) => {
  return RobotHttp.get('/v1/grid/task/symbol/info', { type, symbol });
};
