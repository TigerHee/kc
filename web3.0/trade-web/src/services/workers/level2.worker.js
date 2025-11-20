/**
 * Owner: borden@kupotech.com
 */
import Decimal from 'decimal.js/decimal';
import { ab2str, str2ab, checkTransferables } from 'utils/convert';
import {
  find,
  arrayMap,
  forEach,
  reduce,
} from './a.tiny.lodash';
import { MESSAGE } from './level2.const';

// 仅用于买卖盘深度合并用的精度
const maxDecimalsPrecision = 10;

const createDecimals = (decimalPrecision) => {
  const decimals = [];
  while (decimalPrecision > 0) {
    decimals.push({
      length: decimalPrecision,
      group: Math.pow(10, maxDecimalsPrecision - decimalPrecision),
    });
    decimalPrecision -= 1;
  }

  return decimals;
};

const numberFixed = (v, decimal, round = Decimal.ROUND_DOWN) => {
  const numberV = +v;
  if (typeof numberV !== 'number' || v === undefined) {
    return v;
  }
  if (numberV === 0) {
    return '0';
  }
  const stringV = v.toString(); // 防止数值超过最大范围，导致转换不准确
  return new Decimal(stringV).toFixed(decimal, round);
};

// const decimals = [
//   { group: 10, length: 7 },
//   { group: 100, length: 6 },
//   { group: 1000, length: 5 },
//   { group: 10000, length: 4 },
//   { group: 100000, length: 3 },
//   { group: 1000000, length: 2 },
//   { group: 10000000, length: 1 },
// ];
// 如果要修改合并深度，请修改  config -> maxDecimalsPrecision;
// 如果精度处理逻辑变更，需同步更改下src/pages/Trade3.0/components/OrderDriven/OpenOrdersList.js里的精度处理函数
const decimals = createDecimals(maxDecimalsPrecision - 1);
// 全量数据处理合并深度
const groupOrders = (group, orders, precision, type = 'sell') => {
  // 遍历数组先处理精度
  let priceDecimal;
  let bit;
  const round = type === 'sell' ? Decimal.ROUND_UP : Decimal.ROUND_DOWN;
  const maxGroup = decimals[decimals.length - 1].group * 10;
  if (group > maxGroup) {
    bit = group / maxGroup;
  } else if (group === maxGroup) {
    priceDecimal = 0;
  } else {
    const decimal = find(decimals, item => item.group === group);
    priceDecimal = decimal ? decimal.length : precision;
  }
  const _fixPrice = (price) => {
    if (bit) {
      return numberFixed(price / bit, 0, round) * bit;
    }
    return numberFixed(price, priceDecimal, round);
  };
  // 排序
  let sortFunc;
  if (type === 'sell') {
    sortFunc = (a, b) => a[0] - b[0];
  } else {
    sortFunc = (a, b) => b[0] - a[0];
  }

  const sortArr = arrayMap(orders, ([price, size]) => {
    return [_fixPrice(price), size];
  });

  sortArr
    // .filter(item => item[0] > 0)
    .sort(sortFunc);
  return sortArr;
};


// BTC-USDT
// [price, amount] =>
//   [price: USDT/BTC, amount: BTC, sum(amount): BTC, sum(price*amount): USDT]

// data 已排序，数据从左往右累加
const reduceSeries = (data, coinPrecision, pairPrecision) => {
  let index = 0;
  const _data = reduce(data, (result, _item) => {
    const last = result[index - 1];
    if (last) {
      _item.push((last[2] / 1) + (_item[1] / 1));
      _item.push((last[3] / 1) + ((_item[0] / 1) * (_item[1] / 1)));
    } else {
      _item.push(_item[1] / 1);
      _item.push((_item[0] / 1) * (_item[1] / 1));
    }
    _item[0] /= 1;
    _item[1] /= 1;
    index += 1;

    result.push(_item);
    return result;
  }, []);

  for (let i = _data.length - 1; i >= 0; i--) {
    _data[i] = arrayMap(_data[i], (item, j) => {
      const p = (j === 1 || j === 2) ?
        coinPrecision : pairPrecision;
      let value = 0;
      if (j === 3) {
        value = (+item.toFixed(p) === 0 && item !== 0) ?
        new Decimal(item).toFixed(30) : item.toFixed(p);
      } else {
        value = item.toFixed(p);
      }
      return value;
    });
  }
  return _data;
};

const formatDepth = (arr) => {
  return arrayMap(arr, (item) => {
    return arrayMap(item, v => (v / 1));
  });
};

/** level2 数据整理 */
const listOrders = (data, type) => {
  let _data = data;
  if (type === 'sell') {
    _data = [...data].reverse();
  }

  return arrayMap(_data, (item, i) => {
    return {
      type,
      index: i,
      bigger: i > 0 ? _data[i - 1][0] : null,
      key: `${type}_${item[0]}`,
      price: item[0],
      amount: (item[1] / 1),
      amountReduce: (item[2] / 1),
      volumeReduce: item[3],
    };
  });
};

/**
 * 计算市价单限额
 * 返回：[量, 额]
 */
const reducePriceLimitAmount = (data, priceLimitRate, type) => {
  if (!data || !data.length || !(+priceLimitRate)) {
    return [0, 0, 0];
  }
  const len = data.length;
  let _curAmount = 0;
  let _reduceAmount = 0;
  let _limitPrice = 0;
  if (type === 'sell') {
    // 卖盘，价格进来是正序
    const limitPrice = new Decimal(data[0][0]).mul(Decimal.add(1, +priceLimitRate)).toFixed();
    _limitPrice = +limitPrice;
    for (let i = 0; i < len; i++) {
      if (+data[i][0] <= +limitPrice) {
        // const _amount = new Decimal(data[i][1]).mul(data[i][0]).toFixed();
        // _reduceAmount += (_amount / 1);
        _reduceAmount += ((data[i][1] / 1) * (data[i][0] / 1));
        _curAmount += (data[i][1] / 1);
      } else {
        break;
      }
    }
  } else {
    // 买盘，价格进来是倒序
    const limitPrice = new Decimal(data[0][0]).mul(Decimal.sub(1, +priceLimitRate)).toFixed();
    _limitPrice = +limitPrice;
    for (let i = 0; i < len; i++) {
      if (+data[i][0] >= +limitPrice) {
        // const _amount = new Decimal(data[i][1]).mul(data[i][0]).toFixed();
        // _reduceAmount += (_amount / 1);
        _reduceAmount += ((data[i][1] / 1) * (data[i][0] / 1));
        _curAmount += (data[i][1] / 1);
      } else {
        break;
      }
    }
  }
  return [_curAmount, _reduceAmount, _limitPrice];
};

const level2DepthCalc = (group, asks, bids,
  groupPrecision, coinPrecision, pairPrecision, priceLimitRate,
) => {
  const sellOrders = groupOrders(group, asks, groupPrecision, 'sell'); // 正序
  const buyOrders = groupOrders(group, bids, groupPrecision, 'buy'); // 倒序
  const reduceAsksDepth = reduceSeries(sellOrders.slice(0, 100), coinPrecision, pairPrecision);
  const reduceBidsDepth = reduceSeries(buyOrders.slice(0, 100), coinPrecision, pairPrecision);
  const listAsksDepth = listOrders(reduceAsksDepth, 'sell');
  const listBidsDepth = listOrders(reduceBidsDepth, 'buy');

  // 最大价格
  const maxPrice = sellOrders.length > 0 ? sellOrders[sellOrders.length - 1][0] : 0;

  // priceLimitRate
  const [askLimitAmount, askLimitReduceAmount, askLimitPrice] = reducePriceLimitAmount(
    sellOrders, priceLimitRate, 'sell',
  );
  const [bidLimitAmount, bidLimitReduceAmount, bidLimitPrice] = reducePriceLimitAmount(
    buyOrders, priceLimitRate, 'buy',
  );

  return {
    workerSuccess: true,
    maxPrice,
    listAsksDepth,
    listBidsDepth,
    askLimitAmount,
    askLimitReduceAmount,
    askLimitPrice,
    bidLimitAmount,
    bidLimitReduceAmount,
    bidLimitPrice,
  };
};

const transferables = checkTransferables(self);

const sendMessage = (msg) => {
  // console.log(JSON.stringify(msg).length / 1024, 'kb');
  if (!transferables) {
    self.postMessage(JSON.stringify(msg));
  } else {
    const sendAb = str2ab(JSON.stringify(msg));
    self.postMessage(sendAb, [sendAb]);
  }
};

self.onmessage = (e) => {
  let data;
  const edata = e.data;
  if (transferables) {
    try {
      data = JSON.parse(ab2str(edata));
    } catch (err) {
      console.error(err);
    }
  } else {
    data = JSON.parse(edata);
  }

  if (typeof data === 'string' && data === MESSAGE.PING) {
    // 回应开启
    console.log('worker recive ping, post pong');
    sendMessage(MESSAGE.PONG);
  } else
  if (typeof data === 'object' && data.calc) {
    // 计算并返回
    // console.log('worker calc');
    const result = level2DepthCalc(...data.args);
    sendMessage(result);
  }
};
