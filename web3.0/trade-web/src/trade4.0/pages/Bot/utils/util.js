/**
 * Owner: mike@kupotech.com
 */
import memStorage from 'utils/memStorage';
import { addLangToPath } from 'utils/lang';
import { _t } from './lang';
import DialogRef from 'Bot/components/Common/DialogRef';
import { trackClick } from 'utils/ga';
import { formatNumber } from 'Bot/helper';
import Decimal from 'decimal.js';
import forEach from 'lodash/forEach';

/**
 * @description: 通过id判断是否是刚才创建的bot
 * @return {*}
 */
export const isJustCreateBot = (id) => {
  const taskIdCreateJustNow = memStorage.getItem('justCreate');
  const isJustCreated = +taskIdCreateJustNow === +id;
  return isJustCreated;
};

export const getAccountType = (coin) => {
  if (coin.currency === 'USDT') {
    return (
      {
        TRADE: _t('trade_tag'),
        CONTRACT: _t('future_tag'),
        ISOLATED: _t('margin_tag'),
      }[coin.accountType] || ''
    );
  }
  return '';
};

//   https://www.kucoin.net/zh-hans/trading-bot/spot/grid/BTC-USDT
//   https://www.kucoin.net/zh-hans/trading-bot/futures/grid/XBTUSDTM
//   https://www.kucoin.net/zh-hans/trading-bot/infinity/grid/BTC-USDT
//   https://www.kucoin.net/zh-hans/trading-bot/dca/BTC-USDT
//   https://www.kucoin.net/zh-hans/trading-bot/rebalance
//   https://www.kucoin.net/zh-hans/trading-bot/martingale/BTC-USDT

const oldVersionRoutePath = {
  1: '/spot/grid/BTC-USDT',
  2: '/dca/BTC-USDT',
  3: '/futures/grid/XBTUSDTM',
  4: '/rebalance',
  5: '/infinity/grid/BTC-USDT',
  7: '/martingale/BTC-USDT',
};

export const showNotice = (id, symbol) => {
  return DialogRef.info({
    title: _t(symbol ? '8JLKSPgWTbn27e67ATpaJg' : 'checkdetails'),
    content: _t(symbol ? 'uz356FJZnKCz3sutMQXA7J' : 'nAG4o5y4zHL2KDapcQ5daq'),
    cancelText: _t('cancel'),
    okText: _t('confirm'),
    onOk: () => {
      trackClick(['switchPopupClick', '1']);
      const path = oldVersionRoutePath[id] ?? oldVersionRoutePath['1'];
      let url = `${location.origin}/trading-bot${path}`;
      url = addLangToPath(url);
      window.open(url);
    },
    maskClosable: true,
    size: 'basic',
  });
};

export const getDealAvg = (list, pricePrecision) => {
  const pprice =
    list.dealFunds && list.dealSize
      ? formatNumber(
          Decimal(Decimal(list.dealFunds).toFixed(8))
            .div(list.dealSize)
            .toFixed(14, Decimal.ROUND_DOWN),
          pricePrecision,
        )
      : null;
  return pprice;
};

/**
 * @description: 分离买卖单
 * @param {object} data
 * @return {*}
 */
export const handleNum = (data) => {
  const buy = [];
  const sell = [];
  forEach(data.items, (el) => {
    if (el.side === 'buy') {
      buy.push(el);
    } else {
      sell.push(el);
    }
  });
  buy.sort((a, b) => +b.price - Number(a.price));
  sell.sort((a, b) => +a.price - Number(b.price));
  data.buyNum = buy.length;
  data.sellNum = sell.length;
  return [buy.length, sell.length];
};

/**
 * @description:  按时间分类去除相同的时间.相同时间会导致lightweightchart报错
 * @param {array} data
 * @param {array} filterKeys [time] | [buyTime, sellTime]
 * @return {*}
 */
export const uniqueByTime = (data = [], filterKeys = ['time']) => {
  const checker = {};
  const newData = [];
  function getKey(mfilterKeys, item) {
    const values = [];
    mfilterKeys.forEach((key) => {
      values.push(item[key]);
    });
    return values.join('_');
  }
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i];
    const key = getKey(filterKeys, item);
    if (!checker[key]) {
      checker[key] = true;
      newData.push(item);
    } else {
      // 之前存在相同的, 就丢弃该数据
    }
  }
  return newData;
};
