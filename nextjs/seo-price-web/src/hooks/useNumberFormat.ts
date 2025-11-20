/**
 * Owner: melon@kupotech.com
 */

import { useCurrencyStore } from "@/store/currency";


const useNumberFormat = () => {
  const prices = useCurrencyStore((state) => state.prices);

  /*
小数转百分比
in '-0.0625'
out '-6.25%'
*/
  const decimalToPercentage = (data) => {
    try {
      if (data === 0 || +data === 0) return '0%';
      if (!data) return '--';
      if (isNaN(+data)) return '--';
      const pon = +data > 0 ? '+' : '';
      return pon + (+data * 100).toFixed(2) + '%';
    } catch (error) {
      return '--';
    }
  };

  /**
   * 币种价格格式化
   * @param {*} price 价格
   * @param {*} symbol 交易对 例如 BTC-USDT
   * @param {*} idx 币种index
   * @returns 价格
   */
  const priceNumberFormat = (price, symbol, idx = 0) => {
    try {
      if (!price) return price;

      const baseCoin = symbol.split('-')[idx];
      const priceNum = Math.abs(+price);
      const baseCoinRate = prices ? prices[baseCoin] : null;
      let result;
      if (baseCoinRate) {
        result = Number(baseCoinRate) * priceNum; // 多次高精度计算的bug
      } else {
        result = priceNum;
      }
      return result;
    } catch (error) {
      const priceNum = Math.abs(price);
      return priceNum;
    }
  };
  return {
    decimalToPercentage,
    priceNumberFormat,
  };
};
export default useNumberFormat;
