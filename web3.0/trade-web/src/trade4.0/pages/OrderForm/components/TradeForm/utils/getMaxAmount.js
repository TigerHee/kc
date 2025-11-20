/*
 * @owner: borden@kupotech.com
 */
import { divide, multiply, normalizeNumber, add } from 'src/helper';
import { getAvailableBalance } from '@/hooks/useAvailableBalance';
import { getFee } from '@/pages/OrderForm/hooks/useFee';
import { getOrderType } from '@/pages/OrderForm/hooks/useOrderType';
import { getOrderCurrency } from '@/pages/OrderForm/hooks/useOrderCurrency';
import { TRADE_SIDE_MAP } from '@/pages/OrderForm/config';
import { getAmountConfig } from '../hooks/useAmountConfig';

const getMaxAmount = ({
  side,
  price,
  symbol, // 默认当前交易对
  currency, // 默认根据side、orderType获取下单币种
  orderType, // 默认当前orderType
  tradeType, // 默认当前tradeType
}) => {
  const { feeRateForCalc } = getFee(symbol);
  const { isMarket } = getOrderType(orderType);
  const { amountPrecision } = getAmountConfig({ side, symbol, orderType });
  currency = currency || getOrderCurrency({ side, symbol }).currency;
  const { maxAvailableBalance } = getAvailableBalance({
    side,
    symbol,
    currency,
    tradeType,
  });

  if (isMarket) {
    price = 1;
  }
  const isBuy = side === TRADE_SIDE_MAP.buy.value;

  let ret = 0;
  if (isBuy) {
    if (price > 0) {
      ret = normalizeNumber(
        divide(
          maxAvailableBalance,
          multiply(add(1, feeRateForCalc || 0), +price),
        ),
        amountPrecision,
      );
    }
  } else {
    ret = maxAvailableBalance;
  }
  return ret;
};

export default getMaxAmount;
