/**
 * Owner: clyne@kupotech.com
 */
import React, { useMemo } from 'react';
import { useSelector } from 'dva';
import { isEqual } from 'lodash';
import {
  fx,
  styled,
  useI18n,
  formatNumber,
  getDigit,
  useGetSymbolInfo,
  useGetPositionCalcData,
} from '@/pages/Futures/import';
import {
  stopLossLevOperator,
  stopPercentOperator,
  forwardStopPercentOperator,
  stopLossTipOperator,
  minus,
  abs,
} from 'utils/operation';
import { Form } from '@kux/mui';
import { CROSS, namespace } from '../../../config';
import { FUTURES } from 'src/trade4.0/meta/const';

const WarningTips = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  ${(props) => fx.color(props, 'complementary')}
`;
const { useWatch } = Form;
const SLPTipsInfo = ({ type, form }) => {
  const { _t } = useI18n();
  const {
    symbol,
    currentQty,
    liquidationPrice: liquidPrice,
    posCost,
    posInit,
    posMaint,
    posMargin,
    marginMode,
  } = useSelector((state) => state[namespace].positionItem, isEqual);
  const { liquidationPrice = liquidPrice } = useGetPositionCalcData(symbol);
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { indexPriceTickSize, multiplier, isInverse } = contract || {};
  const stopPrice = useWatch(type, form);
  const stopTipShow = useMemo(() => {
    let stopPercent;
    if (!stopPrice || marginMode === CROSS) {
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
  }, [
    stopPrice,
    marginMode,
    isInverse,
    posCost,
    posInit,
    posMargin,
    posMaint,
    currentQty,
    multiplier,
  ]);

  const diffPrice = useMemo(() => {
    if (!stopPrice) return;
    const digit = getDigit(indexPriceTickSize);

    return formatNumber(abs(minus(liquidationPrice)(stopPrice)), { fixed: digit });
  }, [stopPrice, indexPriceTickSize, liquidationPrice]);

  return stopTipShow ? (
    <WarningTips>{_t('position.stopLoss.diffPrice.warning', { num: diffPrice })}</WarningTips>
  ) : null;
};

export default SLPTipsInfo;
