/**
 * Owner: clyne@kupotech.com
 */
import { post as postForm, pull } from 'tools/request';

/**
 * @description 近期成交历史
 * @param symbol
 */

const KUMEX_GATE_WAY = '/_api_kumex';

export const getRecentHistory = ({ symbol }) => {
  return pull(KUMEX_GATE_WAY + '/kumex-market/v1/trade/history', { symbol });
};

/**
 * @description 交易市场level2数据： 买卖盘全量
 * @param symbol
 */
export const pullLevel2 = ({ symbol }) => {
  return pull(KUMEX_GATE_WAY + '/kumex-market/v1/level2/snapshot', { symbol });
};

export const pullBestPrice = (params) => {
  return pull(KUMEX_GATE_WAY + '/kumex-market/l2/best/price', params);
};

export const pullLevel2Range = ({ symbol, start, end }) => {
  return pull(KUMEX_GATE_WAY + '/kumex-market/v1/level2/message/query', {
    symbol,
    start,
    end,
  });
};

// 查询标记价格
export const pullMarkPrice = (symbol) => {
  return pull(KUMEX_GATE_WAY + `/kumex-index/mark-price/${symbol}/current`);
};

// 查询最新成交价
export const pullLastPrice = (symbol) => {
  return pull(KUMEX_GATE_WAY + '/kumex-market/match/trade/last', { symbol });
};

// 查询单个合约24小时涨跌幅度
export const pullPriceChgPct = ({ symbol }) => {
  return pull(KUMEX_GATE_WAY + `/kumex-trade/market/${symbol}`);
};

export const pullAllVolume = () => {
  return pull(KUMEX_GATE_WAY + '/kumex-trade/market/all');
};

/**
 * @description 查询最近的资金费率
 */
export const getFundingRate = ({ symbol }) => {
  return pull(KUMEX_GATE_WAY + `/kumex-index/funding-rate/${symbol}/current`);
};

export const getTimePoint = ({ symbol }) => {
  return pull(KUMEX_GATE_WAY + `/kumex-index/funding-rate/${symbol}/nearest-time-point`);
};

export const getUserFee = (params) => {
  return pull(KUMEX_GATE_WAY + '/kumex-trade/configs/getUserFee', params);
};

export const getUserMaxLeverage = (params) => {
  return pull(KUMEX_GATE_WAY + '/kumex-trade/configs/getUserMaxLeverage', params);
};

// 获取所有合约的涨跌幅和最新成交价接口
export const getMarketList = () => {
  return pull(KUMEX_GATE_WAY + '/kumex-trade/market/list');
};
// 获取推荐合约列表
export const getRecommendedList = () => {
  return pull(KUMEX_GATE_WAY + '/service-assemble/contract/recommended-list');
};

export const getContractUserConfig = () => {
  return pull(KUMEX_GATE_WAY + '/kumex-contract/contracts/user-config');
};

export const postContractUserConfig = (params) => {
  return postForm(KUMEX_GATE_WAY + '/kumex-contract/contracts/user-config', params);
};
// 自选页推荐合约列表
export const getRecommendFavorList = () => {
  return pull(KUMEX_GATE_WAY + '/service-assemble/favor-market-list');
};

// 获取当前使用的抵扣券
export const getCurrentUserCoupon = () => {
  return pull(KUMEX_GATE_WAY + '/kumex-promotion/deduction/coupon/getOneCurrentUseCoupon');
};

// 获取合约风险限额配置
export const getRiskLimits = (params) => {
  return pull(KUMEX_GATE_WAY + `/kumex-contract/contractRiskLimit/${params}`);
};
// 获取用户风险限额
export const getUserRiskLimit = (params) => {
  return pull(KUMEX_GATE_WAY + '/kumex-trade/configs/getUserRiskLimit', params);
};
// 设置用户风险限额
export const postChangeRiskLimit = (params) => {
  const { symbol, ...other } = params;
  return postForm(
    KUMEX_GATE_WAY + `/kumex-position/position/change-risklimit-level?symbol=${symbol}`,
    {
      ...other,
    },
  );
};
