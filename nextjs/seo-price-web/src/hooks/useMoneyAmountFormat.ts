/**
 * Owner: melon@kupotech.com
 */
import { useCoinDetailStore } from '@/store/coinDetail';
import { useCurrencyStore } from '@/store/currency';
import formatNumber from '@/tools/formatNumber';
import { divide } from '@/tools/math';
import multiplyFloor from '@/tools/math/multiplyFloor';
import { numberFormat } from '@kux/mui-next/utils';
import { bootConfig } from 'kc-next/boot';

const formateOptions = { maximumFractionDigits: 2 };
const useMoneyAmountFormat = () => {
  const { currency, prices, rates } = useCurrencyStore((state) => state);
  const rate = useCoinDetailStore(s => s.coinInfo.rating);

  // 按照汇率格式化金额
  const getMoneyWithRate = ({ value, needTransfer = true, lang }) => {
    const _rate = rate || prices[bootConfig._BASE_CURRENCY_];
    const currencyRate = rates[currency];

    const handleMarkCap = (data, rate) => {
      if (!rate || !data) return data;
      let target = needTransfer
        ? Number(multiplyFloor(rate, data, 2)) * 1
        : Number(multiplyFloor(currencyRate, data, 2));

      let markCap;

      if (target < 1000000) {
        markCap = numberFormat({ number: Math.floor(target), options: formateOptions, lang }); // 小于1000000的数字需要增加千分位展示
        return markCap;
      }
      if (target < 10 ** 9) {
        markCap = divide(target, 1000000, 2);
        return numberFormat({ number: markCap, options: formateOptions, lang }) + 'M';
      }
      if (target < 10 ** 12) {
        markCap = divide(target, 10 ** 9, 2);
        return numberFormat({ number: markCap, options: formateOptions, lang }) + 'B';
      }
      if (target < 10 ** 15) {
        markCap = divide(target, 10 ** 12, 2);
        return numberFormat({ number: markCap, options: formateOptions, lang }) + 'T';
      }
      markCap = divide(target, 10 ** 15, 2);
      return numberFormat({ number: markCap, options: formateOptions, lang }) + 'P';
    };
    return value ? handleMarkCap(value, _rate) : '--';
  };
  // 大位数格式化
  const getLargeDigit = ({ value }) => {
    const handleMarkCap = (target) => {
      let markCap;
      if (target < 10 ** 9) {
        markCap = Math.floor(target);
        return formatNumber(markCap);
      }
      if (target < 10 ** 12) {
        markCap = divide(target, 10 ** 9, 2);
        return markCap + 'B';
      }
      if (target < 10 ** 15) {
        markCap = divide(target, 10 ** 12, 2);
        return markCap + 'T';
      }
      markCap = divide(target, 10 ** 15, 2);
      return markCap + 'P';
    };
    return value ? handleMarkCap(value) : '--';
  };
  return {
    getMoneyWithRate,
    getLargeDigit,
  };
};

export default useMoneyAmountFormat;
