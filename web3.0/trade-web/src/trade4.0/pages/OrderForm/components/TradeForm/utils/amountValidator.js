/*
 * @owner: borden@kupotech.com
 */
import { isNil, min } from 'lodash';
import { _t } from 'src/utils/lang';
import { track } from 'src/utils/ga';
import { getPair } from '@/hooks/common/usePair';
import { getSymbolConfig } from '@/hooks/common/useSymbol';
import { getTradeType } from '@/hooks/common/useTradeType';
import { isMinStep, formatNumber } from '@/utils/format';
import { getStateFromStore } from '@/utils/stateGetter';
import { calcMaxVolume } from '@/pages/OrderForm/utils';
import { getOrderType } from '@/pages/OrderForm/hooks/useOrderType';
import { MARGIN_ORDER_MODE_ENUM } from '@/pages/OrderForm/config';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getAmountConfig } from '../hooks/useAmountConfig';
import { getMarginOrderModeType } from '@/hooks/useMarginOrderModeType';
import marketBuyByQuantityValidator from './marketBuyByQuantityValidator';
import getMaxAmount from './getMaxAmount';

const { AUTO_BORROW, AUTO_BORROW_AND_REPAY } = MARGIN_ORDER_MODE_ENUM;

// 提示分类
const tipsMap = {
  amountMin: 'trd.form.amount.min',
  amountMax: 'trd.form.amount.max',
  amountMaxLimit: 'trd.form.amount.max.limit',
  quoteMin: 'trd.form.quote.min',
  quoteMax: 'trd.form.quote.max',
  quoteMaxLimit: 'trd.form.quote.max.limit',
};

const amountValidator = ({
  side,
  price,
  value,
  symbol, // 默认当前交易对
  orderType, // 默认当前orderType
  tradeType, // 默认当前tradeType
  currency, // 默认根据side、orderType获取下单币种
  byQuantity, // 数量框是否输入的是 ‘数量’ 而不是 ‘金额’, 此字段只在市价买单的时候有用，默认false
}) => {
  const { isLogin } = getStateFromStore((state) => state.user);
  const { unitDict } = getStateFromStore((state) => state.symbols);
  if (isNil(value) || !isLogin) {
    return Promise.resolve();
  }
  if (!side) {
    return Promise.resolve();
  }
  const isBuy = side === 'buy';
  tradeType = tradeType || getTradeType();
  // 下单委托类型，customPrise，marketPrise，ocoPrise... 详见src/trade4.0/pages/OrderForm/config.js
  const { isMarket, isTrigger, orderType: formOrderType } = getOrderType(orderType);
  const isMarketBuy = isMarket && isBuy;

  // 如果是按数量下市价买单，则走其单独的数量校验函数
  if (isMarketBuy && byQuantity) {
    return marketBuyByQuantityValidator({
      value, symbol, tradeType,
    });
  }

  value = +value;
  const { baseInfo, quoteInfo } = getPair(symbol);
  const { quoteMinSize } = getSymbolConfig(symbol);

  const { currentMarginOrderMode } = getMarginOrderModeType({ side, tradeType });
  const { amountMin, amountMax, amountIncrement } = getAmountConfig({
    side,
    symbol,
    orderType,
  });
  const isAutoBorrorMode = [AUTO_BORROW, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode);
  const { currency: base, currencyName: baseName } = baseInfo;
  const { currency: quote, currencyName: quoteName } = quoteInfo;
  const unitValue = unitDict[quote] || '';

  if (isMarket) {
    price = 1;
  }

  let tipKey = isMarketBuy
    ? 'trd.form.step.quote.mode.err'
    : 'trd.form.step.amount.mode.err';
  // 精度校验
  if (!isMinStep(value, amountIncrement || 1)) {
    return Promise.reject(
      _t(tipKey, {
        amount: amountIncrement,
      }),
    );
  }
  const maxVolume = calcMaxVolume(quoteMinSize, unitValue);
  const coinName = isMarketBuy ? quoteName : baseName;
  const minValue = isMarketBuy ? maxVolume : amountMin;
  const { getTradeResult } = TRADE_TYPES_CONFIG[tradeType] || {};
  const tradeResultForSensors = {
    trade_type: side,
    trade_pair: symbol,
    trade_currency: base,
  };
  // 最小值校验
  if (value < minValue) {
    tipKey = isMarketBuy ? 'quoteMin' : 'amountMin';
    if (getTradeResult) {
      track(
        'spot_trade_TradingRange_intercept',
        getTradeResult(tradeResultForSensors),
      );
    }
    return Promise.reject(
      _t(tipsMap[tipKey], {
        amount: formatNumber(minValue),
        coin: coinName,
      }),
    );
  }
  if (isBuy && !+price) {
    return Promise.resolve();
  }
  let realMaxAmount = 0;
  const isOcoPriseOrTsoPrise = formOrderType === 'tsoPrise' || formOrderType === 'ocoPrise';
  const isUseMaxAmountConfig = (isTrigger || isOcoPriseOrTsoPrise) && !isAutoBorrorMode; // oco 和 跟踪委托 也不校验 base 数量
  if (!isUseMaxAmountConfig) {
    realMaxAmount = +getMaxAmount({
      side,
      price,
      symbol,
      currency,
      orderType,
      tradeType,
    });
  }
  const _max = isUseMaxAmountConfig ? amountMax : min([realMaxAmount, amountMax]);
  // 最大值校验
  if (value > _max) {
    const isOverLimit = isUseMaxAmountConfig || realMaxAmount > +amountMax;
    if (!isMarketBuy) {
      tipKey = isOverLimit ? 'amountMaxLimit' : 'amountMax';
    } else {
      tipKey = isOverLimit ? 'quoteMaxLimit' : 'quoteMax';
    }
    if (getTradeResult) {
      track(
        'spot_trade_InsufficientBalance_intercept',
        getTradeResult(tradeResultForSensors),
      );
    }
    return Promise.reject(
      _t(tipsMap[tipKey], {
        amount: formatNumber(`${_max}`),
        coin: coinName,
      }),
    );
  }
  return Promise.resolve();
};

export default amountValidator;
