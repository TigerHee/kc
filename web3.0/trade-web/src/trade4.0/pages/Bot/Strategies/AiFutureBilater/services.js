/**
 * Owner:andy.lei@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// 获取配置的ai 参数symbol, direction
export const getAIParams = (params) => {
  return RobotHttp.get('/v1/futures-ai/create-params', params);
};
// 设置止损比例
export function setStopLossPercent(data) {
  let url = `/v1/task/update/run_param?taskId=${data.taskId}`;
  if (typeof data.stopLossPercent !== 'undefined') {
    url += `&stopLossPercent=${data.stopLossPercent}`;
  }
  return RobotHttp.post(url);
}
// 批量获取网格配置的交易对信息
// 里面含有 精度， base quota信息
// allSymbol，1标识全部交易对，0标识可用交易对，缺省值为0
export const getSymbolTickLists = (params) => {
  return RobotHttp.get('/v1/symbol/futures/symbols', { ...params, templateId: 9 });
};

// 单个获取网格配置的交易对信息
export const getSymbolTickItem = (symbol) => {
  return RobotHttp.get('/v1/symbol/futures/symbol', {
    symbol,
    templateId: 9,
  });
};

// 已成交委托和当前委托
export const getStopAndOpenOrders = (params) => {
  return RobotHttp.get('/v1/w2w/orders', params);
};
// 查询仓位详情
export const getPositionDetails = (params) => {
  return RobotHttp.get('/v1/w2w/futures-position', params);
};

// 获取AI合约网格新用户交易对
export const getNewUserSymbol = () => {
  return RobotHttp.get('/v1/symbol/new-user/contract/default-symbols?templateType=9');
};

// 获取合约支持的所有交易对
export const getFutureSymbolList = () => {
  // return FutureHttp.get('/kumex-contract/contracts/active?preview=false', { TOAST_NO: true });
};
