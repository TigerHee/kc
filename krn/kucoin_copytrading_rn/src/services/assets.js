import {pull} from 'utils/request';

const ACCOUNT_FRONT = '/account-front';
const prefix = '/payment';

/** 获取小额资产兑换KCS配置 */
export const fetchSmallExchangeConfig = (params = {}) => {
  return pull(`${ACCOUNT_FRONT}/small-exchange/config`, params);
};

/**
 * 查询用户交易 现货账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryTradeAccount(baseAmount, baseCurrency) {
  return pull(
    `${ACCOUNT_FRONT}/v2/query/trade-account?baseAmount=${
      baseAmount || 0
    }&baseCurrency=${baseCurrency || 'BTC'}`,
  );
}

/**
 * 获取用户清退文案
 * @returns promise
 */
export async function getRestrictedInfo() {
  return pull(`${prefix}/asset/user/restricted/info`);
}

/**
 * 查询用户储蓄 资金账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryMainAccount(baseAmount, baseCurrency) {
  return pull(
    `${ACCOUNT_FRONT}/query/main-account?baseAmount=${
      baseAmount || 0
    }&baseCurrency=${baseCurrency || 'BTC'}`,
  );
}
