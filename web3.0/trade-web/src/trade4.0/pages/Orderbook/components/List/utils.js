/*
 * owner: Clyne@kupotech.com
 */
import {
  ORDER_BOOK_BUY,
  ORDER_BOOK_SELL,
  namespace,
  defaultSellAndBuy,
} from '@/pages/Orderbook/config';
import {
  minus,
  lessThanOrEqualTo,
  lessThan,
  dividedBy,
  multiply,
  plus,
  abs,
} from 'utils/operation';
import { roundByStep } from '@/utils/format';
import { reverse, findIndex } from 'lodash';
import { getStore } from 'utils/createApp';
import { FUTURES } from 'src/trade4.0/meta/const';
import { getUnit } from 'src/trade4.0/hooks/futures/useUnit';
import { getSymbolInfo } from 'src/trade4.0/hooks/common/useSymbol';
import { getTradeType } from 'src/trade4.0/hooks/common/useTradeType';

// 卖盘，买卖盘价格（大到小） - 订单price < 精度(currentDepth）的第一个index，且差值不能不大于
// 买盘，买卖盘价格（大到小） - 订单price <= 0 的第一个index

export const getIndexs = ({ data, prices, type, currentDepth }) => {
  const indexs = [];
  for (let i = 0; i < prices.length; i++) {
    // 订单价格
    const orderPrice = prices[i];
    for (let j = 0; j < data.length; j++) {
      // 买卖盘价格
      const [orderBookPrice] = data[j];
      const diff = abs(minus(orderBookPrice)(orderPrice));
      // 买盘
      if (type === ORDER_BOOK_BUY && lessThanOrEqualTo(minus(orderBookPrice)(orderPrice))(0)) {
        indexs.push(j);
        break;
        // 卖盘
      } else if (
        type === ORDER_BOOK_SELL &&
        lessThan(minus(orderBookPrice)(orderPrice))(currentDepth) &&
        lessThanOrEqualTo(diff)(currentDepth)
      ) {
        indexs.push(j);
        break;
      }
    }
  }
  return indexs;
};

// 计算平均价格
export const getAvaragePrice = ({ type, hoverIndex, currentSymbol, isCombineSell }) => {
  try {
    // 初始状态
    if (hoverIndex === undefined || type === '') {
      return '';
    }
    const { currentDepth } = getStore().getState()[namespace];
    const { volume, volumeValue, total } = getVolume({
      hoverIndex,
      currentSymbol,
      type,
      isFormat: false,
      isCombineSell,
    });
    const _avaragePrice = roundByStep(dividedBy(volumeValue)(total), {
      step: currentDepth,
    }).toString();
    return {
      avaragePrice: _avaragePrice,
      volume,
    };
  } catch (e) {
    console.log(e);
  }
};

export const getVolume = ({ currentSymbol, type, hoverIndex, isFormat = true, isCombineSell }) => {
  const defaultData = {
    volumeValue: '0',
    volume: '0',
  };
  try {
    let _data = getStore().getState()[namespace].data || {};
    _data = (_data[currentSymbol] || defaultSellAndBuy)[type];
    // 获取原始数据
    let originData = [].concat(_data);
    let dataIndex = Number(hoverIndex);
    // 忽略掉
    if (dataIndex === -1) {
      return defaultData;
    }
    if (type === ORDER_BOOK_SELL && !isCombineSell) {
      originData = reverse(originData);
      dataIndex = originData.length - dataIndex - 1;
    }

    // 累加， 平均价格等于累计交易量 / 总数
    let volume = '0';
    // 合约融合，交易量是计价币种作为单位，对于合约单位为张的时候，需要对amount， total做处理，需要转换为计价币种单位
    // 计价币种单位数量 = amount（张） *  multiplier(合约乘数，即baseIncrement)
    // 现货为1
    let multiplier = 1;
    const tradeType = getTradeType();
    const { baseIncrement, isInverse } = getSymbolInfo({ tradeType, symbol: currentSymbol });
    if (tradeType === FUTURES) {
      multiplier = baseIncrement;
    }
    for (let i = 0; i <= dataIndex; i++) {
      const [price, amount, total] = originData[i];
      // 正向合约, 现货
      if (!isInverse) {
        volume = plus(volume)(multiply(price)(multiply(amount)(multiplier)));
        // 反向合约
      } else {
        volume = plus(volume)(multiply(dividedBy(1)(price))(multiply(amount)(abs(multiplier))));
      }

      if (dataIndex === i) {
        return {
          volumeValue: volume.toString(),
          volume: volume.toString(),
          // 这里的total对张做处理，计算平均均价的时候会用到
          total: multiply(total)(multiplier).toString(),
        };
      }
    }
    return defaultData;
  } catch (e) {
    console.log(e);
    return defaultData;
  }
};

// 根据价格获取hoverIndex（用于深度图）
export const getHoverIndexByPrice = ({ currentSymbol, price, isSell }) => {
  // 获取原始数据
  let _data = getStore().getState()[namespace].data || {};
  _data = _data[currentSymbol] || defaultSellAndBuy;
  const { sell, buy } = {
    sell: [].concat(_data.sell),
    buy: [].concat(_data.buy),
  };

  // const maxBuyPrice = buy[0][0];
  // 判断是价格处于买盘or卖盘, 小于等于最大买价，为买盘，否则为卖盘
  // const isBuy = lessThanOrEqualTo(price)(maxBuyPrice);
  const originData = isSell ? sell : buy;
  const index = findIndex(originData, ([_price]) => price === _price);
  return { index, dataKey: isSell ? ORDER_BOOK_SELL : ORDER_BOOK_BUY };
};
