/**
 * Owner: clyne@kupotech.com
 */

import { getPosition } from '@/hooks/futures/usePosition';
import { formatCurrency } from '@/utils/futures';
import { calcValue } from '@/pages/Futures/calc';
import { getMarkPrice } from '@/hooks/futures/useMarket';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { plus, abs } from 'utils/operation';
import { MARGIN_MODE_CROSS } from '@/meta/futures';
import { FUTURES } from '../../import';

export const getFormatPosData = ({ positionMap, posOrderMap }) => {
  const allPosValueMap = {};

  getPosition({
    condition: (item) => {
      const {
        isTrialFunds,
        marginMode,
        currentQty,
        isOpen,
        symbol,
        settleCurrency,
        markPrice: MP,
      } = item;
      if (!isTrialFunds && isOpen) {
        posOrderMap[symbol] = 1;
        positionMap[symbol] = item;
        // 全仓，累加仓位全仓价值
        if (marginMode === MARGIN_MODE_CROSS) {
          const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
          const currency = formatCurrency(settleCurrency);
          const markPrice = getMarkPrice(symbol) || MP;
          allPosValueMap[currency] = plus(allPosValueMap[currency] || '0')(
            abs(
              calcValue({
                symbolInfo,
                qty: currentQty,
                price: markPrice,
              }),
            ).toString(),
          );
        }
      }
    },
  });
  return { allPosValueMap };
};
