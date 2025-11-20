/**
 * Owner: jessie@kupotech.com
 */
import { useCallback, useRef } from 'react';
import { useTheme } from '@kux/mui';
import { isNil } from 'lodash';
import usePriceChangeColor from '@/hooks/usePriceChangeColor';
import { formatNumber } from '@/utils/format';
import { _t } from 'utils/lang';

// 历史成交点位
const useOrderHistory = ({ tvWidget }) => {
  const historyRef = useRef(null);

  const { colors } = useTheme();
  const priceChangeColor = usePriceChangeColor();

  // 移除
  const removeOrderHistory = useCallback(() => {
    if (historyRef.current) {
      historyRef.current.remove();
      historyRef.current = undefined;
    }
  }, []);

  // 创建
  const createOrderHistory = useCallback(
    (order) => {
      const chart = tvWidget?.chart();
      if (chart) {
        const { side, date, latestDealPrice, latestDealSize } = order;
        if ([date, latestDealPrice].some(isNil)) {
          return;
        }

        if (historyRef.current) {
          removeOrderHistory();
        }

        const direction = side?.toLowerCase();
        const sideText = side === 'buy' ? _t('orders.dirc.buy') : _t('orders.dirc.sell');
        let sideColor;
        if (direction === 'buy') {
          sideColor = priceChangeColor.up || colors.primary;
        } else {
          sideColor = priceChangeColor.down || colors.secondary;
        }

        const _size = formatNumber(latestDealSize);
        const _price = formatNumber(latestDealPrice);
        try {
          historyRef.current = chart
            .createExecutionShape()
            .setTooltip(`${sideText} ${_size} @${_price}`)
            .setArrowColor(sideColor)
            .setDirection(direction)
            .setTime(date)
            .setPrice(+latestDealPrice);
        } catch (error) {
          console.log(error, 'createExecutionShape error');
        }
      }
    },
    [tvWidget, priceChangeColor, colors, removeOrderHistory],
  );

  return {
    createOrderHistory,
    removeOrderHistory,
  };
};

export default useOrderHistory;
