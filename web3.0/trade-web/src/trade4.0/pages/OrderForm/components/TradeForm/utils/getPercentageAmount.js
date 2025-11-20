/*
 * @owner: borden@kupotech.com
 */
import { getPair } from '@/hooks/common/usePair';
import { getAvailableBalance } from '@/hooks/useAvailableBalance';
import { getOrderType } from '@/pages/OrderForm/hooks/useOrderType';
import { TRADE_SIDE_MAP } from '../../../config';
import { getAmountConfig } from '../hooks/useAmountConfig';
import getMaxAmount from './getMaxAmount';
import { Decimal, normalizeNumber, multiply } from 'src/helper';

const { ROUND_DOWN, ROUND_UP } = Decimal;

// side、price必传
export const getTotal = ({ side, price, base, orderType }) => {
  base = base || getPair().baseInfo.currency;
  const isBuy = side === TRADE_SIDE_MAP.buy.value;
  const { isMarket } = getOrderType(orderType);
  if (isMarket) {
    price = 1;
  }
  let total = 0;
  if (isBuy) {
    if (+price) {
      total = +getMaxAmount({ side, price });
    }
  } else {
    total = +getAvailableBalance({
      side,
      currency: base,
    }).maxAvailableBalance;
  }
  return total || 0;
};

// side、price、percent必传
const getPercentageAmount = ({ side, price, percent, base, orderType }) => {
  const total = getTotal({ side, base, price, orderType });
  const fixedRule = +percent >= 1 ? ROUND_DOWN : ROUND_UP;
  const { amountPrecision } = getAmountConfig({ side });
  return normalizeNumber(
    multiply(+percent, total).toFixed(),
    amountPrecision,
    fixedRule,
  );
};

export default getPercentageAmount;
