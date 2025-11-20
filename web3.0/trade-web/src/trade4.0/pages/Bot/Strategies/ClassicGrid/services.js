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

// 修改区间价格
export const updateRange = (data) => {
  return RobotHttp.post('/v1/grid/task/update/region', data);
};

// 获取U本位换算
export const getQuotaTransform = (taskId) => {
  return RobotHttp.get('/v1/task/base/profit', { taskId });
};

// 获取追加投资额的最小值
export const getAppendMinInvestment = (symbol) => {
  return RobotHttp.get('/v1/grid/task/min/append/investment', { symbol });
};
// 追加投资额
export const appendInvestment = (data) => {
  return RobotHttp.post('/v1/grid/task/append/investment', data);
};

// 获取现货网格新用户交易对
export const getNewUserSymbol = () => {
  return RobotHttp.get('/v1/symbol/new-user/default-symbols');
};

// 扩展区间获取需追加多少钱
export const getExtendAddAmount = (data) => {
  return RobotHttp.post('/v1/spot-grid/extend-region/amount', data);
};
// 执行扩展区间
export const doExtend = (data) => {
  return RobotHttp.post('/v1/spot-grid/extend-region/exec', data);
};
// 获取现货网格热门交易对
export const getHotSymbols = () => {
  return RobotHttp.get('/v1/symbol/template/top-symbols');
};

// 获取现货网格历史回测
export const getBackTestData = (params) => {
  return RobotHttp.get('/backtest/ai-param/get', params);
};

// 暂停机器人
export const pauseBot = (taskId) => {
  return RobotHttp.post('/v1/task/pend', { taskId });
};
//  直接重启/通过修改区间重启机器人
export const restartBot = (data) => {
  return RobotHttp.post('/v1/task/restart', data);
};
// 获取重启机器人是买入还是卖出数量
export const getRestartParams = (taskId) => {
  return RobotHttp.get('/v1/task/restart/params', { taskId });
};
// 获取修改参数导致入场价格变化的历史列表
export const getUpdateEntryPriceLists = (taskId) => {
  return RobotHttp.get('/v1/task/common/entryPrice/list', { taskId });
};
// 获取现货网格启动创建的必须参数
export const getSpotCreateInfo = ({ symbolCode, taskId }) => {
  return RobotHttp.get('/professional/web/init/grid-params', {
    templateType: 1,
    symbol: symbolCode,
    taskId,
  });
};
