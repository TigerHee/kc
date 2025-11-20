/**
 * Owner: melon@kupotech.com
 */
import { isNil, toString } from 'lodash-es';
import Decimal from 'decimal.js';
import { useCurrencyStore } from '@/store/currency';
import { useMarketStore } from '@/store/market';
import multiplyFloor from '@/tools/math/multiplyFloor';

/**
 * 根据汇率获取涨跌额 并且格式化精度
 * // 大于1，展示2位小数；
  // =1，展示1；
  // <1，没有超过8位精度，有几位展示几位；
  // <1，超过8位精度，展示<0.00000001；
 * @returns
 */
const useGrowth = () => {
  const currency = useCurrencyStore((state) => state.currency);
  const currencyRate = useCurrencyStore((state) => state.rates[currency]);
  const prices = useCurrencyStore((state) => state.prices);
  const symbolsInfoMap = useMarketStore((state) => state.symbolsInfoMap);

  /**
   * @description 高精度乘法
   * @param a
   * @param b
   * @returns {string|*}
   */
  const multiply = (a, b) => {
    if (!a || !b) {
      return 0;
    }
    if (+b === 0) {
      // FIXME b === 0 时，Decimal.js 计算为 Infinity，这里按 0 来返回吧。。。
      return 0;
    }
    return new Decimal(a).mul(b).toNumber();
  };
  const handlePrice = (price) => {
    return price.slice(0, 1) + (price.slice(1, 2) === '0' ? '' : price.slice(1, 2));
  };
  /**
   * 小数位截取保留 precision 位 默认截取8位小数
   * @param {*} price 数据
   * @param {*} precision 保留小数位
   * @returns
   * 示例
   * in price = 1.123456789 precision = 8
   * out 1.12345678
   */
  const highPrecisionSlice = (price, precision = 8) => {
    if (isNil(price)) return price;
    const priceStr = toString(price);
    const hasDecimal = priceStr.indexOf('.') > 0;
    if (!hasDecimal) return price;
    const decimalCount = priceStr.split('.')[1].length;
    return decimalCount > precision
      ? priceStr.split('.')[0] + '.' + priceStr.split('.')[1].slice(0, precision)
      : priceStr;
  };
  /**
   * 根据汇率获取币种价格 不带精度格式化
   * @param {} param0
   * @returns
   * in price = 92.37 symbol=BTC-USDT needTransfer = true, 此时汇率为 1.00080000
   * out 92.443896
   */
  const getNoFormattedPriceWithRate = ({ price, symbol, needTransfer = true }) => {
    const baseCoin = symbol?.split('-')[1];
    const baseCoinRate = prices ? prices[baseCoin] : null;
    if (!price || !+price) return price;
    let resultPrice;
    if (baseCoinRate) {
      const calculatedPrice = needTransfer
        ? multiply(baseCoinRate, price)
        : multiply(currencyRate, price);
      resultPrice = calculatedPrice;
    } else {
      resultPrice = price;
    }
    return resultPrice;
  };

  /**
   * 根据汇率获取币种价格 精度格式化
   * 计算后的结果绝对值 < 0.00000001 直接返回 < 0.00000001
   * 整数位大于1，小数点后取2位，末位去0。否则按照默认精度 如果默认精度 > 8 位就截取8位
   * @param {} param0
   * @returns
   * in price = 1000 symbol=BTC-USDT needTransfer = true, 此时汇率为 1.00080000
   * out 1000.8
   */
  const getPriceWithRate = ({ price, symbol, needHandlePrice, needTransfer = true }) => {
    const baseCoin = symbol?.split('-')[1];
    const baseCoinRate = prices ? prices[baseCoin] : null;
    if (!price || !+price) return price;
    let resultPrice;
    if (baseCoinRate) {
      const calculatedPrice = needTransfer
        ? multiply(baseCoinRate, price)
        : multiply(currencyRate, price);
      if (Math.abs(calculatedPrice * 1) < 0.00000001 && Math.abs(calculatedPrice * 1) !== 0) {
        return calculatedPrice;
      }
      const precision = symbolsInfoMap[symbol]?.precision || 2;
      let target = needTransfer
        ? multiplyFloor(baseCoinRate, price, precision)
        : multiplyFloor(currencyRate, price, precision);

      if (needHandlePrice) {
        // 整数位大于1，小数点后取2位，末位去0。否则按照默认精度 如果默认精度 > 8 位就截取8位
        let newPrice = !(Math.abs(price * 1) < 1) ? (target + '').split('.')[1] : '';
        target = newPrice
          ? (target + '').split('.')[0] + '.' + handlePrice(newPrice)
          : highPrecisionSlice(target, 8);
      }
      resultPrice = target;
    } else {
      resultPrice = price;
    }

    return resultPrice;
  };

  // 根据汇率获取币种价格 精度格式化
  const getFormattedPriceWithPrecision = ({
    price,
    symbol,
    needHandlePrice,
    needTransfer = true,
  }) => {
    const finalPrice = getPriceWithRate({ price, symbol, needHandlePrice, needTransfer });
    let resultPrice;
    // < 0.00000001 展示 <0.00000001；
    if (Math.abs(finalPrice * 1) < 0.00000001 && Math.abs(finalPrice * 1) !== 0) {
      resultPrice = `<0.00000001`;
    } else {
      resultPrice = finalPrice;
    }

    return resultPrice;
  };
  return {
    getPriceWithRate,
    getFormattedPriceWithPrecision,
    handlePrice,
    highPrecisionSlice,
    getNoFormattedPriceWithRate,
  };
};

export default useGrowth;
