import {pull} from 'utils/request';

//获取用户信息
export const queryUserInfo = () => pull('/ucenter/user-info');

/**
 * 获取法币汇率
 *
 * @param base    string 法币币种 如：USD
 * @param targets string
 */
export async function getRates(base = 'USD', targets = '') {
  return pull('/currency/rates', {base, targets});
}

/**
 * 获取交易所实时的币种对法币的价格
 *
 * @param base    string 法币币种 如：USD
 * @param targets string 数字货币币种，用于过滤数据， 如：BTC,KCS,ETH，参数只返回这三项的数据
 */
export async function getPrices(base = 'USD', targets = '') {
  return pull('/currency/v2/prices', {base, targets});
}

// 获取kyc3交易限制提示信息
export const getKyc3TradeLimitInfo = params => {
  return pull('/user-dismiss/dismiss/notice/passive', params);
};

/**
 * 查询用户交易账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export const queryTradeAccount = (baseAmount, baseCurrency) => {
  return pull(
    `/account-front/query/trade-account?baseAmount=${
      baseAmount || 0
    }&baseCurrency=${baseCurrency || 'BTC'}`,
  );
};
