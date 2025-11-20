/**
 * Owner: charles.yang@kupotech.com
 */
import {
  floadToPercent,
  QUANTITY_UNIT,
  roundDownByStep,
  useGetSymbolInfo,
  useUnit,
} from '@/pages/Futures/import';
import { styled } from '@kux/mui';
import Slider from '@mui/RadioSlider';
import Decimal from 'decimal.js';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { FUTURES } from 'src/trade4.0/meta/const';
import { BIClick, getClosePosType, POSITIONS } from 'src/trade4.0/meta/futuresSensors/list';
import { multiply } from 'src/utils/operation';
import { namespace } from '../../config';
import { emit } from './utils';

const Wrapper = styled.div`
  .rc-slider {
    height: 30px !important;
    margin-top: -6px;
    margin-bottom: 40px !important;
  }
  .rc-slider-mark {
    top: 38px !important;
  }
`;

export const qtyMarks = {
  0: floadToPercent(0, { isPositive: false }),
  0.25: floadToPercent(0.25, { isPositive: false }),
  0.5: floadToPercent(0.5, { isPositive: false }),
  0.75: floadToPercent(0.75, { isPositive: false }),
  1: floadToPercent(1, { isPositive: false }),
};

const SizeRate = ({ form }, ref) => {
  const positionItem = useSelector((state) => state[namespace].positionItem);
  const contract = useGetSymbolInfo({ symbol: positionItem.symbol, tradeType: FUTURES });
  const type = useSelector((state) => state[namespace].liquidationType);
  const sensorType = getClosePosType(positionItem, type);
  const tradingUnit = useUnit();

  const step = React.useMemo(() => {
    if (contract.isInverse) {
      return contract.lotSize;
    }
    return tradingUnit === QUANTITY_UNIT ? contract.lotSize : contract.multiplier;
  }, [contract.lotSize, contract.multiplier, tradingUnit, contract.isInverse]);

  const max = React.useMemo(() => {
    if (contract.isInverse) {
      return Math.abs(positionItem.currentQty);
    }
    return Math.abs(
      tradingUnit === QUANTITY_UNIT
        ? positionItem.currentQty
        : Decimal(positionItem.currentQty).mul(contract.multiplier).toNumber(),
    );
  }, [positionItem.currentQty, contract.multiplier, tradingUnit, contract.isInverse]);

  const [rate, setRate] = useState(1); // default value 值为 100%

  const handleRateChange = useCallback(
    (v) => {
      BIClick([POSITIONS.BLOCK_ID, POSITIONS.CLOSE_POS_RATE], { type: `${sensorType}_${v}` });
      // if (e && e.preventDefault) {
      //   e.preventDefault();
      //   e.stopPropagation();
      // }
      let size = max;
      if (v === 1) {
        size = `${size}`;
      } else {
        size = roundDownByStep(multiply(size)(v).toString(), step).toFixed();
      }
      form.setFieldsValue({ size });
      setRate(v);
      setTimeout(() => {
        emit();
      });
    },
    // form 不需要监听
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [max, sensorType, step],
  );

  React.useImperativeHandle(ref, () => ({
    rateValue: rate,
    reset: () => {
      setRate(0);
    },
    onRateChange: handleRateChange,
  }));

  const format = useCallback((v) => floadToPercent(v, { isPositive: false }), []);

  return (
    <Wrapper>
      <Slider
        marks={qtyMarks}
        min={0}
        max={1}
        value={rate === undefined ? 0 : rate}
        step={0.01}
        onChange={handleRateChange}
        tipFormatter={format}
      />
    </Wrapper>
  );
};

export default React.memo(React.forwardRef(SizeRate));
