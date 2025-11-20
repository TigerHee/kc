/**
 * Owner: clyne@kupotech.com
 */
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { _t } from 'utils/lang';
import {
  stopLossLevOperator,
  stopPercentOperator,
  forwardStopPercentOperator,
  stopLossTipOperator,
  minus,
  abs,
} from 'utils/operation';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { getDigit } from 'helper';
import { formatNumber } from '@/utils/futures';
import { styled, Form } from '@kux/mui';
import { fx } from 'src/trade4.0/style/emotion';

const WarningTips = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  ${props => fx.color(props, 'complementary')}
`;
const { useWatch } = Form;
const SLPTipsInfo = ({ type, form }) => {
  const {
    symbol,
    currentQty,
    liquidationPrice,
    posCost,
    posInit,
    posMaint,
    posMargin,
  } = useSelector((state) => state.futures_orders.positionItem, isEqual);
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { tickSize, multiplier, isInverse } = contract || {};
  const stopPrice = useWatch(type, form);
  const stopTipShow = useMemo(() => {
    let stopPercent;
    if (!stopPrice) {
      return false;
    }
    if (!isInverse) {
      stopPercent = forwardStopPercentOperator({
        stopPrice,
        posCost,
        posMargin,
        posMaint,
        currentQty,
        multiplier,
      });
    } else {
      stopPercent = stopPercentOperator({
        stopPrice,
        posCost,
        posMargin,
        posMaint,
        currentQty,
        multiplier,
      });
    }
    const lev = stopLossLevOperator({ posCost, posInit });

    const num = stopLossTipOperator({ stopPercent, lev });

    if (num <= 0.5 && num > 0) {
      return true;
    }
    return false;
  }, [stopPrice, posCost, posInit, posMargin, posMaint, currentQty, multiplier, isInverse]);

  const diffPrice = useMemo(() => {
    if (!stopPrice) return;
    const digit = getDigit(tickSize);

    return formatNumber(abs(minus(liquidationPrice)(stopPrice)), { fixed: digit });
  }, [stopPrice, tickSize, liquidationPrice]);

  return stopTipShow ? (
    <WarningTips>{_t('position.stopLoss.diffPrice.warning', { num: diffPrice })}</WarningTips>
  ) : null;
};

export default SLPTipsInfo;
