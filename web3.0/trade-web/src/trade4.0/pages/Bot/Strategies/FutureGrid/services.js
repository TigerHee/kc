/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp, FuturesHttp } from 'Bot/utils/request';
// 获取配置的交易对列表
export const getConfigSymbolLists = () => {
  return RobotHttp.get('/v1/symbol/query');
};

// 获取配置的ai 参数symbol, direction
export const getAIParams = (params) => {
  return RobotHttp.get('/v1/futures/grid/aiParam', params);
};

// 获取网格已成交记录的匹配的买单详情
export const getMatchOrderDetailById = (orderId) => {
  return RobotHttp.get('/v1/futures/grid/order/detail', { orderId });
};

// 获取网格手续费
export const getSymbolInfo = (type, symbol) => {
  return RobotHttp.get('/v1/grid/task/symbol/info', { type, symbol });
};

// 获取限制
export const getInitBlowUpPrice = (params) => {
  return RobotHttp.get('/v1/futures/grid/initBlowUpPrice', params);
};

// 获取限制  所有参数毕传
export const getCalcParams = (params) => {
  return RobotHttp.get('/v1/futures/grid/calculateParams', {
    ...params,
    TOAST_NO: true, // 不需要toast提示
  });
};

// 批量获取网格配置的交易对信息
// 里面含有 精度， base quota信息
// allSymbol，1标识全部交易对，0标识可用交易对，缺省值为0
export const getSymbolTickLists = (params) => {
  return RobotHttp.get('/v1/symbol/futures/symbols', params);
};

// 单个获取网格配置的交易对信息
export const getSymbolTickItem = (symbol) => {
  return RobotHttp.get('/v1/symbol/futures/symbol', { symbol });
};
// 单个获取合约网格配置的交易对信息 里面含有最高最低价格
export const getFuturesSymbolTickItem = (symbol) => {
  return FuturesHttp.get(`/kumex-trade/market/${symbol}`);
};

// 获取合约网格人数比列
export const getLongShortRatio = (symbol) => {
  return RobotHttp.get('/v1/futures/grid/position/longShort', { symbol });
};

// 当前委托
export const getOpenOrders = (params) => {
  return RobotHttp.get('/v1/futures/grid/active/order', params);
};

// 已成交委托
export const getStopOrders = (params) => {
  return RobotHttp.get('/v1/futures/grid/done/order', params);
};

// 计算爆仓价格
export const getCalcBlowUpPrice = (params) => {
  return RobotHttp.get('/v1/futures/grid/calculateRunningBlowUpPrice', params);
};

// 增加保证金
export const addDeposit = ({ taskId, amount }) => {
  return RobotHttp.post(
    `/v1/futures/grid/add/deposit?taskId=${taskId}&amount=${amount}`,
  );
};

// 查看合约是否支持某个交易对  暂时没用
export const checkSupportSymbol = (symbol) => {
  return RobotHttp.get('/v1/futures/grid/support/symbol', { symbol });
};

// 获取个人最大的杠杆倍数
export const getMaxLeverage = (symbol) => {
  return RobotHttp.get('/v1/futures/grid/max/leverage', { symbol });
};

// 获取合约网格新用户交易对
export const getNewUserSymbol = () => {
  return RobotHttp.get('/v1/symbol/new-user/contract/default-symbols');
};

// 获取合约币种列表
export const getAllSymbolTick = () => {
  return RobotHttp.get('/professional/web/futures/symbols');
};

// 热门
export const getHotSymbols = (symbol) => {
  return RobotHttp.get('/v1/symbol/template/top-symbols?templateId=3');
};

// 合约交易对自选
export const postFavorite = (symbol) => {
  return FuturesHttp.post('/ucenter/contract/collect', { symbol }, 'isForm');
};

// 获取所有合约交易对信息
// 里面含有 精度， base quota信息
// allSymbol，1标识全部交易对，0标识可用交易对，缺省值为0
export const getFutureAllSymbols = (params) => {
  return RobotHttp.get('/v1/symbol/futures/symbols', params);
};
