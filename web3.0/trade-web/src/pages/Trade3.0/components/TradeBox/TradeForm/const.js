/**
 * Owner: borden@kupotech.com
 */
import { addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';
import Decimal from 'decimal.js/decimal';

const { MAINSITE_HOST } = siteCfg;

// 时间策略
export const timeStrategyOptions = [
  {
    key: 'GTC',
    label: 'Good Till Cancelled',
  },
  {
    key: 'GTT',
    label: 'Good Till Time',
  },
  {
    key: 'IOC',
    label: 'Imediate Or Cancel',
  },
  {
    key: 'FOK',
    label: 'Fill Or Kill',
  },
];

// 交易类型
export const TRADE_TYPES = {
  CUSTOMPRISE: 'customPrise', // 限价交易
  MARKETPRISE: 'marketPrise', // 市价交易
  TRIGGERPRISE: 'triggerPrise', // 止盈止损（限价止损）
  MARKETTRIGGERPRICE: 'marketTriggerPrice', // 市价止损
};
// 交易类型国际化key
export const TRADES_LANG = {
  customPrise: 'trd.type.limit.o',
  triggerPrise: 'trd.type.stop.limit.s',
  marketPrise: 'trd.type.market.o',
  marketTriggerPrice: 'trd.type.stop.market.s',
};

// 市价交易类型
export const MARKET_TRADES = {
  marketPrise: 1,
  marketTriggerPrice: 1,
};

export const TRADE_DIRECTION = {
  BUY: 'buy',
  SELL: 'sell',
};

// 手续费跳转链接
export const LearnMoreFeeLinks = {
  zh_CN: () => addLangToPath(`${MAINSITE_HOST}/news/fee`),
  en_US: () => addLangToPath(`${MAINSITE_HOST}/news/en-fee`),
  default: () => addLangToPath(`${MAINSITE_HOST}/news/en-fee`),
};

// 借贷类型
export const BORROW_TYPE = {
  auto: 'auto',
  manual: 'manual',
};

export const isTriggerTrade = (TrType) => {
  return /triggerpri(s|c)e/i.test(TrType);
};

/**
 * 1. 如果是全仓杠杆 && 市价
 * 2. 24 小时之类不重复提示
 * 3. 如果是买入 卖盘最低价 > 1.1标价
 * 4. 如果是卖出 标价 > 1.1 买盘最高价
 * @param {*} side sell | buy
 * @param {*} targetPrice - 标记价格
 * @param {*} lowestSellPrice - 卖盘最低价格
 * @param {*} highestBuyPrice - 买盘最高价格
 * @returns
 */
export const shouldOpenOrderTips = ({
  side,
  targetPrice,
  lowestSellPrice,
  highestBuyPrice,
  percent,
}) => {
  try {
    const per = new Decimal(1).plus(percent);

    if (side === TRADE_DIRECTION.BUY) {
      return new Decimal(lowestSellPrice).gt(Decimal.mul(per, targetPrice));
    }

    if (side === TRADE_DIRECTION.SELL) {
      return new Decimal(targetPrice).gt(Decimal.mul(per, highestBuyPrice));
    }
    return false;
  } catch (error) {
    return false;
  }
};
