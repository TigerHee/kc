/*
 * @owner: borden@kupotech.com
 * @desc: 按base币种数量下市价买单的校验函数
 */
import { _t } from 'src/utils/lang';
import { track } from 'src/utils/ga';
import { greaterThan } from 'src/utils/operation';
import { getPair } from '@/hooks/common/usePair';
import { add, multiply, divide } from 'src/helper';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getFee } from '@/pages/OrderForm/hooks/useFee';
import { isMinStep, formatNumber } from '@/utils/format';
import { getStateFromStore } from '@/utils/stateGetter';
import { getSymbolConfig } from '@/hooks/common/useSymbol';
import { getAvailableBalance } from '@/hooks/useAvailableBalance';
import { namespace as orderbookNamespace } from '@/pages/Orderbook/config';

const side = 'buy';

const markeyBuyByQuantityValidator = ({ value, symbol, tradeType }) => {
  const { baseInfo, quoteInfo } = getPair(symbol);
  const { baseMinSize, baseMaxSize, baseIncrement, basePrecision } = getSymbolConfig(symbol);

  const { currency: quote } = quoteInfo;
  const { currency, currencyName } = baseInfo;
  const { getTradeResult } = TRADE_TYPES_CONFIG[tradeType] || {};
  const tradeResultForSensors = {
    trade_type: side,
    trade_pair: symbol,
    trade_currency: currency,
  };

  // 精度校验
  if (!isMinStep(value, baseIncrement || 1)) {
    return Promise.reject(
      _t('trd.form.step.amount.mode.err', {
        amount: baseIncrement,
      }),
    );
  }

  // 最小值校验
  if (greaterThan(baseMinSize)(value)) {
    if (getTradeResult) {
      track(
        'spot_trade_TradingRange_intercept',
        getTradeResult(tradeResultForSensors),
      );
    }
    return Promise.reject(
      _t('trd.form.amount.min', {
        coin: currencyName,
        amount: formatNumber(baseMinSize),
      }),
    );
  }

  const { feeRateForCalc } = getFee(symbol);
  const { lastPrice } = getStateFromStore((state) => state[orderbookNamespace]);
  const { maxAvailableBalance } = getAvailableBalance({
    side,
    symbol,
    tradeType,
    currency: quote,
  });
  let maxSize;
  try {
    maxSize = divide(
      maxAvailableBalance,
      multiply(add(1, feeRateForCalc || 0), lastPrice),
    ).toFixed();
    maxSize = greaterThan(baseMaxSize)(maxSize) ? maxSize : baseMaxSize;
  } catch (e) {
    maxSize = baseMaxSize;
  }
  // 最大值校验
  if (isFinite(maxSize) && greaterThan(value)(maxSize)) {
    if (getTradeResult) {
      track(
        'spot_trade_InsufficientBalance_intercept',
        getTradeResult(tradeResultForSensors),
      );
    }
    return Promise.reject(
      _t('trd.form.amount.max', {
        coin: currencyName,
        amount: formatNumber(maxSize, { fixed: basePrecision }),
      }),
    );
  }

  return Promise.resolve();
};

export default markeyBuyByQuantityValidator;
