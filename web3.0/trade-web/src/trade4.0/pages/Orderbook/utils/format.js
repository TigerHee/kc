/*
 * owner: Clyne@kupotech.com
 */
// import { get, find, forEach, reverse, reduce, slice, last, first } from 'lodash';
import { reverse, reduce, last, first, maxBy, forEach } from 'lodash';
import { dataSize } from '../config';
import { multiply, plus, greaterThanOrEqualTo, greaterThan } from 'utils/operation';
import { toNonExponential, formatNumber } from '@/utils/format';
import { Decimal, getPrecisionFromIncrement } from 'helper';
import { FUTURES } from '@//meta/const';
import { getSymbolInfo } from '@//hooks/common/useSymbol';

// 获取请求，socket订阅的precision参数，这里的设计有点奇葩，
// 0.01返回2，1返回0，100，返回-2,
// TODO 但是现货的设计，不能支持0.5，5，15这样的，做合约的同学记得注意，这里设计有点缺陷
export const getRequestPrecision = (currenctDepth) => {
  // >= 1, 找0的个数, 取负数
  if (greaterThan(currenctDepth)(1)) {
    try {
      return -`${currenctDepth}`.split('').filter((a) => a === '0').length;
    } catch (e) {
      console.log(e, 'getRequestPrecision fail');
      return 0;
    }
  } else {
    const a = getPrecisionFromIncrement(currenctDepth);
    return a;
  }
};

export const getDepthConfigsByTickSize = (tickSize, tradeType) => {
  const ret = [];
  // 合约融合，非合约走远来的逻辑
  if (tradeType !== FUTURES) {
    // 现货杠杆逻辑
    let acount = 0;
    while (acount <= 3) {
      const value = toNonExponential(multiply(Math.pow(10, acount))(tickSize)).toString();
      ret.push({
        label: formatNumber(value),
        value,
      });
      // 只显示4档现货
      if (acount === 3) {
        break;
      }
      acount += 1;
    }
    // 合约逻辑
  } else {
    const arr = [1, 5, 10, 25, 50, 100, 500];
    forEach(arr, (v) => {
      const value = toNonExponential(multiply(v)(tickSize)).toString();
      ret.push({ value, label: formatNumber(value) });
    });
  }

  return { depthConfig: ret, firstItem: ret[0].value };
};

const makeDepthData = (list, dpMode, depth) => {
  if (!list || !list.length || !depth) return list;

  let item = null;
  return list.reduce((result, current, index, collection) => {
    const [price, size] = current;
    // eslint-disable-next-line
    const mergedPrice = Decimal(price).div(depth).toDP(0, dpMode).mul(depth).toNumber();

    if (item == null) {
      item = [mergedPrice, size];
    } else if (item[0] !== mergedPrice) {
      result.push(item);
      item = [mergedPrice, size];
    } else {
      item[1] += size;
    }

    if (index === collection.length - 1) {
      result.push(item);
    }

    return result;
  }, []);
};

// 格式化买卖盘数据，买卖盘排序 -> total累加
export const formatData = ({ data, symbol, tradeType, currentDepth }) => {
  const { baseIncrement } = getSymbolInfo({ tradeType, symbol });
  const { asks: _asks = [], bids: _bids = [] } = data;
  const asks = _asks || [];
  const bids = _bids || [];
  if (tradeType === FUTURES) {
    const oriData = {
      sell: asks.sort((a, b) => a[0] - b[0]),
      buy: bids.sort((a, b) => b[0] - a[0]),
    };
    return {
      sell: sellFormat(makeDepthData(oriData.sell, Decimal.ROUND_UP, currentDepth)),
      buy: buyFormat(makeDepthData(oriData.buy, Decimal.ROUND_DOWN, currentDepth)),
    };
  } else {
    // 小于amount精度的不显示, 最大size限制，排序处理
    const originSell = asks
      .filter(([, size]) => {
        return greaterThanOrEqualTo(size)(baseIncrement);
      })
      .slice(0, dataSize)
      .sort((a, b) => a[0] - b[0]);
    const originBuy = bids
      .filter(([, size]) => {
        return greaterThanOrEqualTo(size)(baseIncrement);
      })
      .slice(0, dataSize)
      .sort((a, b) => b[0] - a[0]);

    return {
      sell: sellFormat(originSell),
      buy: buyFormat(originBuy),
    };
  }
};

// 卖盘累加
export const sellFormat = (sellData) => {
  return reverse(
    reduce(
      sellData,
      (sum, n) => {
        const [price, size] = n;
        const item = [`${price}`, `${size}`, size];
        const sumLast = last(sum);
        if (sumLast) {
          item[2] = Number(plus(item[2])(sumLast[2]).toString());
        }

        sum.push(item);
        return sum;
      },
      [],
    ),
  );
};

// 买盘累加
export const buyFormat = (buyData) => {
  return reduce(
    buyData,
    (sum, n) => {
      const [price, size] = n;
      const item = [`${price}`, `${size}`, size];
      const sumLast = last(sum);
      if (sumLast) {
        item[2] = Number(plus(item[2])(sumLast[2]).toString());
      }

      sum.push(item);
      return sum;
    },
    [],
  );
};

// 获取最大累加值
export const getMaxSum = ({ sell, buy }) => {
  const sellOrder = first(sell);
  const buyOrder = last(buy);
  return Math.max(sellOrder && sellOrder[2], buyOrder && buyOrder[2]);
};

// 现货杠杆逻辑，获取买卖盘中，各个amount最大值
export const getMaxTotal = (data) => {
  const ret = maxBy(data, (item) => item[1]) || [];
  return ret[1] || 0;
};
