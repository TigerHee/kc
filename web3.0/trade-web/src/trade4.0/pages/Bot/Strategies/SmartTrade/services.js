/**
 * Owner: mike@kupotech.com
 */
import { RobotHttp } from 'Bot/utils/request';

// 获取网格已成交记录的匹配的买单详情
export const getMatchOrderDetailById = (orderId) => {
  return RobotHttp.get('/v1/futures/grid/order/detail', { orderId });
};

// H5获取网格配置的交易对信息
export const getSymbolTickListsByType = (templateType) => {
  return RobotHttp.get('/v1/symbol/tick', { templateType });
};

// /v1/position/change/before 首次持仓\修改调仓策略确认(返回待确认调仓策略)
export const toOrderSure = (data) => {
  return RobotHttp.post('/v1/position/change/before', data);
};

// 调仓方式
export const getAjustWay = () => {
  return RobotHttp.get('/v1/position/method/list');
};

// 获取多币种的使用比例
export const getOtherCoinsRatio = (data) => {
  return RobotHttp.post('/v1/position/investment/calculate', data);
};

// 获取持仓币种
export const getHoldCoins = (coins) => {
  return RobotHttp.get('/v1/position/currency/list', { codes: coins });
};

// 当前详情
export const getOpenOrders = (taskId) => {
  return RobotHttp.get('/v1/position/detail', { taskId });
};

// 已成交委托
export const getStopOrders = (taskId, isChanged) => {
  const params = { taskId };
  if (typeof isChanged !== 'undefined') {
    params.isChanged = isChanged;
  }
  return RobotHttp.get('/v1/position/change/list', params);
};
// 机器人参数
export const getBotParams = (taskId) => {
  return RobotHttp.get('/v1/task/run_params', { taskId });
};
// 获取止盈止损
export const getStopProfitLossConfig = (taskId) => {
  return RobotHttp.get('/v1/task/user/task/find', { taskId });
};

// 修改机器人参数
export const UpdateBotParams = (data) => {
  return RobotHttp.post('/v1/position/update', data);
};

// 获取详情中的历史收益
// /v1/profit/curve?taskId=123&interval=DAILY/WEEKLY/MONTHLY
export const getProfitCurve = (params) => {
  return RobotHttp.get('/v1/profit/curve/with-btc', params);
};
export const getProfitCurveNoBtc = (params) => {
  return RobotHttp.get('/v1/profit/curve', params);
};

// 调仓具体详情
// /v1/position/change/orders?taskId=1&changeId=1
export const getAjustDetail = (params) => {
  return RobotHttp.get('/v1/position/change/orders', params);
};

// 按照市值计算
// http://10.254.1.249:10240/v1/currency/percent?currencyPercentType=MARKET_CAP&currencies=BTC,KCS
export const getMartketCap = (currencies) => {
  return RobotHttp.get(
    `/v1/currency/percent?currencyPercentType=MARKET_CAP&currencies=${currencies}`,
  );
};
// http://10.254.1.249:10240/v1/currency/percent?currencyPercentType=AVERAGE&currencies=BTC,KCS
export const getAverage = (currencies) => {
  return RobotHttp.get(
    `/v1/currency/percent?currencyPercentType=AVERAGE&currencies=${currencies}`,
  );
};

export const getLayoutCoin = (type, currencies) => {
  return RobotHttp.get(
    `/v1/currency/percent?currencyPercentType=${type}&currencies=${currencies}`,
  );
};
// 投资组合
export const getInvestCompose = () => {
  return RobotHttp.get('/v1/position/template/list');
};
// 手动调仓记录
export const getAjustRecord = (taskId) => {
  return RobotHttp.get('/v1/position/open/update/list', { taskId });
};

// 获取账户资产列表
export const getAssetsLists = () => {
  return RobotHttp.get('/v1/account/list', { onlyPosition: true });
};

// 获取持仓创建的交易对
export const getCreateSymbolLists = () => {
  return RobotHttp.get('/professional/web/position/currency/list');
};
// 获取一键导入资产后的百分比
export const getInverstPercent = (data) => {
  return RobotHttp.post('/v1/position/targets/calculate', data);
};

/**
 * 转入转出记录
 */
export const fundTransfers = (taskId) => {
  return RobotHttp.post('/v1/position/update/list', {
    taskId,
    types: [2, 3, 4],
  });
};

// 获取新币
export const getNewSymbols = () => {
  return RobotHttp.get('/professional/web/position/new/currency');
};

// 获取热币
export const getHotSymbols = () => {
  return RobotHttp.get('/professional/web/position/hot/currency');
};
