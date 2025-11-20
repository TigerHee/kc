/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回所有合约交易对信息
 */

/**
 * 将XBT转换为BTC
 */
export const formatCurrency = (currency) => {
  if (currency === 'XBT') {
    return 'BTC';
  }
  return currency;
};
