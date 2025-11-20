/**
 * Owner: jessie@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';

import { toPercent } from 'helper';
import { _t } from 'utils/lang';
import { FUTURES } from '@/meta/const';

import { useSymbolUnit, useTransformAmount } from '@/hooks/futures/useUnit';
import { namespace } from '@/pages/Chart/config';
import { getSymbolPositionsData } from '@/hooks/futures/useGetFuturesPositionsInfo';

export const useFuturesPositionLineData = ({ symbol }) => {
  const { unit } = useSymbolUnit({ symbol });
  const { quantityToBaseCurrency } = useTransformAmount({ tradeType: FUTURES, symbol });

  const position = getSymbolPositionsData({ symbol });

  const user = useSelector((state) => state.user.user);
  const extraToolConfig = useSelector((state) => state[namespace].extraToolConfig);

  const positionOrder = useMemo(() => {
    if (!user || !position || !position?.isOpen || !extraToolConfig.positions) {
      return null;
    }

    const transformAmount = quantityToBaseCurrency(position.currentQty);
    const text = `${position.unrealisedPnl > 0 ? '▲' : '▼'} ${position.unrealisedPnl}`;

    return {
      type: position.type,
      id: position.id,
      price: +position.avgEntryPrice,
      quantity: `${transformAmount}`,
      textTooltip: `${_t('position.pnl')} ${position.unrealisedPnl} (${toPercent(
        position.unrealisedRoePcnt,
      )}) / ${_t('assets.depositRecords.amount')} ${transformAmount} (${unit})`,
      text,
      // modifyTooltip: `Position Size (${unit})`,
      // closeTooltip: _t('iJEAADBXMQmhnNCKgopjxx'), Cancel Position
    };
  }, [user, position, extraToolConfig, quantityToBaseCurrency, unit]);

  return positionOrder;
};
