/**
 * Owner: garuda@kupotech.com
 */

import config from 'config';
import { guid } from 'helper';
import { post, postJson, pull } from 'utils/request';

const { siteCfg } = config;
const futuresHost = siteCfg['API_HOST.FUTURES'];

const KUMEX_WEB_FRONT = `${futuresHost}/web-front`;
const KM_CONTRACT = `${futuresHost}/kumex-contract`;
const KM_MARKET = `${futuresHost}/kumex-market`;
const KM_INDEX = `${futuresHost}/kumex-index`;
const KM_POSITION = `${futuresHost}/kumex-position`;
const KM_TRADE = `${futuresHost}/kumex-trade`;
const KM_PROMOTION = `${futuresHost}/kumex-promotion`;
const KM_UCENTER = `${futuresHost}/ucenter`;
const KM_WEBFRONT = `${futuresHost}/web-front`;
const KM_SNAPSHOT = `${futuresHost}/kumex-snapshot`;
const KM_FUTURES_MARKET = `${futuresHost}/futures-market`;
const KM_FUTURES_TRADE = `${futuresHost}/futures-trade-proxy`;
// const KM_FUTURES_TRADE = `${futuresHost}/kumex-trade`;
const KM_ASSEMBLE = `${futuresHost}/service-assemble`;
const KM_NEW_MARKET = `${futuresHost}/futures-market-proxy`;
const KM_TRIAL = `${futuresHost}/kumex-trial`;
const KM_POSITION_PROXY = `${futuresHost}/futures-position-proxy`;

// 获取合约交易对
export const getFuturesSymbols = ({ preview = false } = {}) => {
  return pull(`${KM_CONTRACT}/contracts/active`, { preview });
};

// 所有合约默认采用 includeNotFirstOpened = true
export const getFuturesSymbolsAll = ({ includeNotFirstOpened = true } = {}) => {
  return pull(`${KM_CONTRACT}/contracts`, { includeNotFirstOpened });
};

/**
 * 获取合约最近成交
 */
export const getFuturesRecentTrade = (symbol) => {
  return pull(`${KM_NEW_MARKET}/v1/trade/txRecordHis`, { symbol });
};

/**
 * 获取买卖盘
 */
export const getFuturesOrderBook = async (params) => {
  // console.log('====futures orderbook params', params);
  return pull(`${KM_NEW_MARKET}/v3/level2/snapshot`, params);
  // return orderbookMock;
};

/**
 * 获取合约标价格，指数价格
 */
export const getFuturesLPAndMP = ({ symbol }) => {
  return pull(`${KM_INDEX}/mark-price/${symbol}/current`);
};

// 获取强平价格
export const getLiquidationPrice = (params) => {
  return pull(`${KM_POSITION}/position/liqdAndRuptPrice`, params);
};

// 获取用户费率
export const getUserFee = (params) => {
  return pull(`${KM_TRADE}/configs/getUserFee`, params);
};

// 获取当前使用的抵扣券
export const getCurrentUserCoupon = (params) => {
  return pull(`${KM_PROMOTION}/deduction/coupon/getCanUseCouponForSymbol`, params);
};

// 获取合约用户设置
export const getContractUserConfig = () => {
  return pull(`${KM_CONTRACT}/contracts/user-config`);
};

// 保存合约用户设置
export const postContractUserConfig = (params) => {
  return post(`${KM_CONTRACT}/contracts/user-config`, params);
};

// 获取用户最大杠杆
export const getUserMaxLeverage = (params) => {
  return pull(`${KM_TRADE}/configs/getUserMaxLeverage`, params);
};

// 下单
export const postCreateOrder = (params) => {
  return post(`${KM_TRADE}/orders`, { ...params, channel: 'WEB' });
};

// 用户的偏好设置
export const setUserBasicConfig = (data) => {
  return post(`${KM_UCENTER}/basic-config`, data);
};

// 获取合约的 user info
export const getFuturesUserInfo = () => {
  return pull(`${KM_UCENTER}/kumex-user-info`);
};

// 请求用户 vip
export const getUserVIPInfo = () => {
  return pull(`/ucenter/user-vip-info`);
};

// 请求分享 referralCode
export const getBaseShareInfo = () => {
  return pull(`/promotion/v1/invitation/share-to-friends`);
};

// 获取合约 l3 资产
export const pullTotalEquityL3 = (params) => {
  return pull(`${KM_WEBFRONT}/account/total-equity-l3-new`, params);
};

// 获取用户风险限额
export const getUserRiskLimit = (params) => {
  return pull(`${KM_TRADE}/configs/getUserRiskLimit`, params);
};

// 获取合约风险限额配置
export const getRiskLimits = (params) => {
  return pull(`${KM_CONTRACT}/contractRiskLimit/${params}`);
};

// 设置用户风险限额
export const postChangeRiskLimit = (params) => {
  const { symbol, ...other } = params;
  return post(`${KM_POSITION}/position/change-risklimit-level?symbol=${symbol}`, {
    ...other,
  });
};

export const setNoticePreferences = (data) => {
  return postJson(`${KM_UCENTER}/user-config`, data);
};

// 获取某一个仓位的具体信息
export const getSymbolDetail = (params) => {
  return pull(`${KM_POSITION}/position?symbol=${params}`);
};
/**
 * @description 获取合约明细
 * @param symbol
 */
export const getContractDetail = ({ symbol }) => {
  return pull(`${KUMEX_WEB_FRONT}/contracts/${symbol}`);
};

/**
 * 订单列表-获取合约仓位列表
 */
export const pullPositions = (params) => {
  console.log('====get position', params);
  // return new Promise((resolve) => {
  //   const mockData = {
  //     success: true,
  //     code: '200',
  //     msg: 'success',
  //     retry: false,
  //     data: [
  //       {
  //         id: '200000000000295565',
  //         symbol: 'XBTUSDTM',
  //         autoDeposit: false,
  //         marginMode: 'CROSS',
  //         delevPercentage: 0.46,
  //         leverage: 10,
  //         currentQty: 1,
  //         isOpen: true,
  //         markPrice: 70114.4,
  //         avgEntryPrice: 70000,
  //         liquidationPrice: 11,
  //         settleCurrency: 'USDT',
  //         isInverse: true,
  //       },
  //     ],
  //   };
  //   resolve(mockData);
  // });
  return pull(`${KUMEX_WEB_FRONT}/positions`, params);
};

// 获取乱斗活动
export const getCurrentBrawl = (params) => {
  return pull(`${KM_PROMOTION}/brawl-stars/clubs`, params);
};

export const isBattle = (params) => {
  return pull(`${KM_PROMOTION}/brawl-stars/battles/processing`, params);
};

// // 查询用户平仓订单
// export const getCloseOrder = () => {
//   return pull(`${KM_FUTURES_TRADE}/orders`, { fromReduce: true, status: 'active' });
// };

// 查询当前用户成交历史
export const getFills = (params) => {
  return pull(`${KUMEX_WEB_FRONT}/fills`, { ...params, isUseOffset: true });
};

// 查询当前用户订单信息只查历史
export const getDoneOrders = (params) => {
  return pull(`${KUMEX_WEB_FRONT}/orders`, { ...params, status: 'done', isUseOffset: true });
};

// 获取用户的盈亏记录
export const getProfitHistory = (params) => {
  // return pull(`${KM_SNAPSHOT}/realised-pnls`, params);
  return pull(`${KM_SNAPSHOT}/query-realised-pnls`, { ...params, isUseOffset: true });
};

// 撤销全部条件委托
export const cancelAllStopOrders = (params) => {
  return post(`${KM_WEBFRONT}/stopOrders/cancel`, params);
};

// 查询当前用户条件订单快照
export const getStopOrders = (params) => {
  return pull(`${KM_WEBFRONT}/stopOrders`, {
    ...params,
    trialOffset: 0,
    offset: 0,
    isUseOffset: true,
  });
};

// 查询当前用户活跃订单快照
export const getActiveOrders = (params) => {
  const payload = {
    ...params,
    trialOffset: 0,
    offset: 0,
    status: 'active',
    pageSize: 150,
    isUseOffset: true,
  };
  return pull(`${KM_WEBFRONT}/orders`, payload);
};

// 撤销订单
export const cancelOrder = (orderId) => {
  return post(`${KM_TRADE}/orders/cancel/${orderId}`);
};

/**
 * 体验金撤单
 */
export const cancelTrialOrder = (orderId) => {
  return post(`${KM_TRIAL}/orders/cancel/${orderId}`);
};

// 撤销全部订单
export const cancelAllOrders = (params) => {
  return post(`${KM_WEBFRONT}/orders/cancel`, params);
};

// 获取平仓详情
export const getCloseDetail = (params) => {
  return pull(`${KM_SNAPSHOT}/close-realised-pnl-detail`, params);
};

// 追加保证金
export const appendMargin = (data) => {
  const { symbol, ...others } = data;
  return post(`${KM_POSITION}/position/margin/deposit-margin?symbol=${symbol}`, {
    bizNo: guid(24, 16),
    ...others,
  });
};

/**
 * 体验金追加保证金
 **/
export const trialFundAppendMargin = (data) => {
  return post(`${KM_TRIAL}/position/margin/deposit-margin`, {
    bizNo: guid(24, 16),
    ...data,
  });
};

// 创建平仓订单
export const createCloseOrder = (data) => {
  return post(`${KM_TRADE}/orders`, {
    ...data,
    fromReduce: true,
    closeOrder: true,
    channel: 'WEB',
  });
};

/**
 * 创建体验金平仓订单
 */
export const trialFundCreateCloseOrder = (data) => {
  return post(`${KM_TRIAL}/orders`, {
    ...data,
    fromReduce: true,
    closeOrder: true,
    channel: 'WEB',
  });
};

export const createPartailCloseOrder = (data) => {
  return post(`${KM_TRADE}/orders`, {
    ...data,
    fromReduce: true,
    closeOnly: true,
    channel: 'WEB',
  });
};

/**
 * 创建体验金减仓订单
 */
export const trialFundCreatePartailCloseOrder = (data) => {
  return post(`${KM_TRIAL}/orders`, {
    ...data,
    fromReduce: true,
    closeOnly: true,
    channel: 'WEB',
  });
};

// 同意风险协议
export async function agreeRisk(params) {
  return post('/ucenter/agree-risk-agreement', params);
}

// 同意用户协议
export async function agreeUser(params) {
  return post('/ucenter/agree-user-agreement', params);
}

/**
 *@description 开通合约交易
 */
export async function openUserContract() {
  return post('/ucenter/open-contract');
}

export function postGetOpenFuturesBonus() {
  return post(`${KM_PROMOTION}/trialFunds/receive-open-contract-rewards`);
}

export function getOpenFuturesIsBonus(param) {
  return pull(`${KM_PROMOTION}/trialFunds/check-open-contract-rewards`, param);
}

/**
 * @description 获取用户开通状态
 */
export async function getOpenStatus() {
  return pull('/ucenter/is-open', { type: 'CONTRACT' });
}

// 创建止盈止损单
export const createStopOrderFromShortcut = (params) => {
  return post(`${KM_TRADE}/updateStopOrdersFromShortcut`, { ...params, channel: 'WEB' });
};

/**
 * 体验金创建止盈止损单
 */
export const trialFundCreateStopOrderFromShortcut = (params) => {
  return post(`${KM_TRIAL}/updateStopOrdersFromShortcut`, { ...params, channel: 'WEB' });
};

// 获取推荐合约列表
export const getRecommendedList = () => {
  return pull(`${KM_ASSEMBLE}/contract/recommended-list`);
};

// 获取所有合约的涨跌幅和最新成交价接口
export const getMarketList = () => {
  return pull(`${KM_TRADE}/market/list`);
};

// 设置自动追加保证金状态
export const updateMarginAutoAppend = (symbol, data) => {
  return post(`${KM_POSITION}/position/margin/auto-deposit-status?symbol=${symbol}`, data);
};

/**
 * 自动追加体验金保证金
 */
export const updateTrialFundMarginAutoAppend = (data) => {
  return post(`${KM_TRIAL}/position/margin/auto-deposit-status`, data);
};

// 获取最佳买一卖一
export const getBestTicker = (param) => {
  return pull(`${KM_MARKET}/v1/ticker`, param);
};

// 获取体验金明细
export const getTrialFundDetail = (params) => {
  return pull(`${KM_TRIAL}/trial/getUserTrialCouponList`, params);
};

// 体验金下单
export const postCreateTrialFundOrder = (params) => {
  return post(`${KM_TRIAL}/orders`, { ...params, channel: 'WEB' });
};

// 体验金最大杠杆
export const getTrialFundUserMaxLeverage = (params) => {
  return pull(`${KM_TRIAL}/trial/getMaxLeverage`, params);
};

/**
 * @description 查询体验金详情
 */
export const getTrialDetail = (code) => {
  return pull(`${KM_TRIAL}/trial/getUserTrialCouponById`, { code });
};

// 查询用户最大可提
export const getMaxWithdrawMargin = (params) => {
  return pull(`${KM_POSITION_PROXY}/margin/maxWithdrawMargin`, params);
};

// 提取保证金
export const postOperatorMargin = (params) => {
  return post(`${KM_POSITION_PROXY}/margin/withdrawMargin`, params);
};

// 追加保证金
export const postAppendMargin = (params) => {
  const { symbol, ...others } = params;
  return post(`${KM_POSITION}/position/margin/deposit-margin?symbol=${symbol}`, {
    bizNo: guid(24, 16),
    ...others,
  });
};

// 查询用户是否可用
export const getWithdrawAvailable = (params) => {
  return pull(`${KM_POSITION_PROXY}/feature/available`, params);
};

/**
 * pnlAlert 设置开关
 */
export const setPnlAlert = (params) => {
  console.log('=====pnl switch set', params);
  return post(`${KM_SNAPSHOT}/user-pnl-notice/switch/set`, params);
};

/**
 * pnlAlert 获取开关
 */
export const getPnlAlert = (params) => {
  console.log('=====get pnl pnl alert config', params);
  return pull(`${KM_SNAPSHOT}/user-pnl-notice/switch/get`, params);
};

/**
 * pnlAlert 列表
 */
export const getPnlAlertList = (params) => {
  console.log('=====get pnl pnl alert list', params);
  return pull(`${KM_SNAPSHOT}/user-pnl-notice/rules/get`, params);
};

/**
 * pnl form 设置
 */
export const setPnlAlertDetail = (params) => {
  const { symbol, id = '', unrealisedRoePcnt } = params;
  console.log('=====set pnl alert detail', params);
  return post(`${KM_SNAPSHOT}/user-pnl-notice/rules/create`, params);
};

/**
 * get pnl alert config list
 */
export const asyncPnlAlert = (params) => {
  console.log('=====async pnl alert', params);
  return post(`${KM_SNAPSHOT}/user-pnl-notice/sync`, params);
};

/**
 * 删除pnl alert配置
 */
export const deletePnlAlertConfig = (params) => {
  console.log('=====delete pnl alert', params);
  return post(`${KM_SNAPSHOT}/user-pnl-notice/rules/delete`, params);
};

/**
 * 合约全仓灰度接口
 */
export const getCrossGrayScale = (params) => {
  return pull(`${KM_CONTRACT}/contract/cross/gray`, params);
};

// 查询保证金仓位模式（全仓/逐仓）
export const getMarginModes = (params) => {
  return pull(`${KM_POSITION_PROXY}/position/queryMarginMode`, params);
};

// 设置保证金仓位模式
export const postMarginModeChange = (params) => {
  return postJson(`${KM_POSITION_PROXY}/position/changeMarginMode`, params);
};

// 获取新的最大可用杠杆
export const getV2UserMaxLeverage = (params) => {
  return pull(`${KM_FUTURES_TRADE}/configs/getCrossUserMaxLeverage`, params);
};

// 获取全仓杠杆列表
export const getCrossUserLeverage = (params) => {
  return pull(`${KM_FUTURES_TRADE}/configs/getCrossUserLeverage`, params);
};

// 设置全仓杠杆
export const postCrossUserLeverage = (params) => {
  return postJson(`${KM_FUTURES_TRADE}/configs/changeCrossUserLeverage`, params);
};

/**
 * 订单calc
 */
export const getCrossCalcData = (params) => {
  return pull(`${KM_FUTURES_TRADE}/activeOrderStatistics`, params);
};

// 获取用户 kyc
export async function getUserKyc(params) {
  return pull('/otc/user/kycInfo', params);
}

// 获取平仓历史的分享详情
export const getPnlShareDetail = (params) => {
  // return new Promise((res) => {
  //   res({
  //     success: true,
  //     code: '200',
  //     msg: 'success',
  //     retry: false,
  //     data: { profitRate: -0.5773, openPrice: 67001.0, closePrice: 74736.5402758 },
  //   });
  // });
  return pull(`${KM_SNAPSHOT}/position-pnl/profit-rate`, params);
};

// 获取税费
export const getTaxFee = (params) => {
  // return new Promise((res) => {
  //   console.log('pull getTaxFee --->', params);
  //   res({
  //     success: true,
  //     code: '200',
  //     msg: 'success',
  //     retry: false,
  //     data: {
  //       feeTaxRate: '0.075',
  //     },
  //   });
  // });
  return pull(`${KM_FUTURES_TRADE}/user-tax-fee`, params);
};

// 获取批量切换列表
export const getSwitchMarginModes = (params) => {
  return pull(`${KM_POSITION_PROXY}/position/getSwitchableContracts`, params);
};
