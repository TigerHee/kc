/**
 * Owner: clyne@kupotech.com
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { map, isEqual } from 'lodash';
import { multiply, dividedBy, minus, plus, toFixed, lessThanOrEqualTo } from 'utils/operation';
import {
  roundUpByStep,
  roundDownByStep,
  ButtonGroup,
  FormButton as Button,
  useGetSymbolInfo,
  floadToPercent,
} from '@/pages/Futures/import';

import { PROFIT_RATES, LOSS_RATES, PROFIT_TYPE } from '../constants';
import { CROSS, namespace } from '../../../config';
import { calcCrossSLAndPLPrice } from '@/pages/Futures/calc';
import { FUTURES } from 'src/trade4.0/meta/const';
import { BIClick, POSITIONS, getSLAndSPPosType } from 'src/trade4.0/meta/futuresSensors/list';
import validator from './validator';

const calcPrice = ({
  posInit,
  posLoss,
  posCost,
  posMaint,
  posCross,
  percent,
  size,
  tickSize,
  isInverse,
  multiplier,
}) => {
  let round;
  if (size > 0) {
    round = percent > 0 ? roundDownByStep : roundUpByStep;
  }
  if (size < 0) {
    round = percent > 0 ? roundUpByStep : roundDownByStep;
  }
  let posStop = minus(plus(posInit)(posCross))(posLoss);
  if (percent < 0) {
    posStop = minus(posStop)(posMaint);
  }

  const roundPosValue = toFixed(plus(posCost)(multiply(posStop)(percent)))(8);
  const multiplierValue = multiply(size)(multiplier);

  let price = dividedBy(multiplierValue)(roundPosValue);

  if (!isInverse) {
    price = dividedBy(roundPosValue)(multiplierValue);
  }

  return round(price, tickSize).toString();
};

const pctDisabled = (type, pct, props) => {
  // 如果计算出来的结果小于等于0，disable掉百分比按钮
  let percent = pct;
  if (type === 'loss') {
    percent = -pct;
  }
  const price = props.isCross
    ? calcCrossSLAndPLPrice({
        position: props,
        symbolInfo: props,
        percent,
        stopType: type,
        stopPriceType: props.priceType,
      })
    : calcPrice({ percent, ...props });
  return lessThanOrEqualTo(price)(0);
};

// const eventHandle = evtEmitter.getEvt();

const SizeRate = ({ type, form, priceType }, ref) => {
  const positionItem = useSelector((state) => state[namespace].positionItem, isEqual);
  const contract = useGetSymbolInfo({ symbol: positionItem.symbol, tradeType: FUTURES });
  const { currentQty, marginMode } = positionItem || {};
  const sensorType = getSLAndSPPosType(positionItem, type);
  const isCross = marginMode === CROSS;

  const [rate, setRate] = useState(0);

  const rates = React.useMemo(() => {
    if (type === 'profit') {
      return PROFIT_RATES;
    } else {
      return LOSS_RATES;
    }
  }, [type]);

  const handleRateChange = (e, v) => {
    BIClick([POSITIONS.BLOCK_ID, POSITIONS.SL_SP_PERCENT], { type: `${sensorType}_${v}` });
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    let percent = v;
    if (type !== PROFIT_TYPE) {
      percent = -v;
    }
    const ratePrice = isCross
      ? calcCrossSLAndPLPrice({
          position: positionItem,
          symbolInfo: contract,
          percent,
          stopType: type,
          stopPriceType: priceType,
        })
      : calcPrice({ size: currentQty, percent, ...positionItem, ...contract });
    setRate(v);
    const msg = validator(ratePrice, priceType, type);
    form.setFields([{ name: type, value: ratePrice, errors: msg ? [msg] : [] }]);
  };

  React.useImperativeHandle(ref, () => ({
    rateValue: rate,
    reset: () => {
      setRate(0);
    },
  }));

  return (
    <ButtonGroup value={rate} onChange={handleRateChange}>
      {map(rates, ({ value }) => (
        <Button
          key={value}
          value={value}
          type={type === PROFIT_TYPE ? 'primary' : 'secondary'}
          disabled={pctDisabled(type, value, {
            priceType,
            isCross,
            size: currentQty,
            ...positionItem,
            ...contract,
          })}
        >
          {floadToPercent(value, { isPositive: false })}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default React.memo(React.forwardRef(SizeRate));
