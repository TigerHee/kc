/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// 获取配置的交易对列表
export const getConfigSymbolLists = () => {
  return RobotHttp.get('/v1/symbol/query');
};

// 获取配置的ai 参数symbol, direction
export const getAIParams = (params) => {
  return RobotHttp.get('/v1/margin-grid/ai-param', params);
};

// 获取网格已成交记录的匹配的买单详情
export const getMatchOrderDetailById = (orderId) => {
  return RobotHttp.get('/v1/futures/grid/order/detail', { orderId });
};

// 获取网格手续费
export const getSymbolInfo = (type, symbol) => {
  return RobotHttp.get('/v1/grid/task/symbol/info', { type, symbol });
};

// 获取限制  所有参数毕传
export const getCalcParams = (params) => {
  return RobotHttp.get('/v1/margin-grid/custom-param/calculate', {
    ...params,
    TOAST_NO: true, // 不需要toast提示
  });
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
  return RobotHttp.get('v1/futures/grid/calculateRunningBlowUpPrice', params);
};

// 增加保证金
export const addDeposit = ({ taskId, amount }) => {
  return RobotHttp.post(`/v1/margin-grid/add/deposit`, { taskId, amount });
};

// 获取杠杆网格新用户交易对
export const getNewUserSymbol = () => {
  return RobotHttp.get('/v1/symbol/new-user/default-symbols');
};

// 获取杠杆网格热门交易对
export const getHotSymbols = (params) => {
  return RobotHttp.get('/v1/symbol/template/top-symbols?templateId=10');
};

// /////////////////////
// 获取当前运行中机器人的仓位
export const getPosition = (taskId) => {
  return RobotHttp.get('/v2/task/position', { taskId });
};

// 查询当前委托列表、已成交委托列表
export const getOpenAndHistoryOrder = (taskId) => {
  // const data = {
  //   activeOrders: null,
  //   hisOrders: [
  //     {
  //       orderId: '649869b00314330001333852',
  //       symbol: 'BTC-USDT',
  //       type: 'limit',
  //       side: 'buy',
  //       price: '0.11222000000000000000',
  //       size: '260.00000000000000000000',
  //       funds: '29.17720000000000000000',
  //       status: null,
  //       dealFunds: '29.17720000000000000000',
  //       dealSize: '260.00000000000000000000',
  //       fee: '0.01750632000000000000',
  //       feeCurrency: 'USDT',
  //       profit: null,
  //       orderCreatedAt: 1687710129000,
  //       orderUpdatedAt: 1688027235275
  //     }
  //   ]
  // };
  // return Promise.resolve({ data });
  return RobotHttp.get('/v2/task/orders', { taskId });
};

export const getMatchOrder = ({ taskId, orderId }) => {
  return RobotHttp.get('/v2/task/his-order', { taskId, orderId });
};
