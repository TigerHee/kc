/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

const infinityGridType = 5;

// 获取配置的交易对列表
export const getConfigSymbolLists = () => {
  return RobotHttp.get('/v1/symbol/query');
};

// 获取网格配置的交易对信息
export const getSymbolTickListsByType = (templateType) => {
  return RobotHttp.get('/v1/symbol/tick', { templateType });
};

// 获取网格已成交记录的匹配的买单详情
export const getMatchOrderDetailById = (params) => {
  return RobotHttp.get('/v1/grid/task/match-order/detail', params);
};

// 获取网格手续费
export const getSymbolInfo = (symbol) => {
  return RobotHttp.get('/v1/grid/task/symbol/info', {
    type: infinityGridType,
    symbol,
  });
};

// 修改区间价格
export const updateRange = (data) => {
  return RobotHttp.post('/v1/infinity/grid/update/region', data);
};

// 获取U本位换算
export const getQuotaTransform = (taskId) => {
  return RobotHttp.get('/v1/task/base/profit', { taskId });
};

// 获取追加投资额的最小值
export const getAppendMinInvestment = (symbol) => {
  return RobotHttp.get('/v1/infinity/grid/min/append/investment', { symbol });
};
// 追加投资额
export const appendInvestment = (data) => {
  return RobotHttp.post('/v1/infinity/grid/append/investment', data);
};

// infinityGrid
// 获取配置的ai 参数
export const getAIParams = (symbol) => {
  return RobotHttp.get('/v1/infinity/grid/ai/params', {
    symbol,
    templateType: infinityGridType,
  });
};
// 获取无限网格币种列表
export const getAllSymbolTick = () => {
  return RobotHttp.get('/professional/web/tick', {
    templateType: infinityGridType,
  });
};
// 获取无限网格热门交易对
export const getHotSymbols = () => {
  return RobotHttp.get('/v1/symbol/template/top-symbols', {
    templateId: infinityGridType,
  });
};

// 获取无限网格启动创建的必须参数
export const getCreateInfo = (symbol) => {
  return RobotHttp.get('/professional/web/init/infinity-params', {
    templateType: infinityGridType,
    symbol,
  });
};
