/**
 * Owner: clyne@kupotech.com
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { map, isEqual } from 'lodash';
import { multiply, dividedBy, minus, plus, toFixed, lessThanOrEqualTo } from 'utils/operation';
import { roundUpByStep, roundDownByStep } from 'helper';
import ButtonGroup, { Button } from '@/pages/OrderForm/FuturesFormNew/components/ButtonGroup';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';

import { PROFIT_RATES, LOSS_RATES, PROFIT_TYPE } from '../constants';

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
  const price = calcPrice({ percent, ...props });
  return lessThanOrEqualTo(price)(0);
};

// const eventHandle = evtEmitter.getEvent();

const SizeRate = ({ type, form }, ref) => {
  const positionItem = useSelector((state) => state.futures_orders.positionItem, isEqual);
  const contract = useGetSymbolInfo({ symbol: positionItem.symbol, tradeType: FUTURES });
  const { currentQty } = positionItem || {};

  const [rate, setRate] = useState(0);

  const rates = React.useMemo(() => {
    if (type === 'profit') {
      return PROFIT_RATES;
    } else {
      return LOSS_RATES;
    }
  }, [type]);

  const handleRateChange = (e, v) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    let percent = v;
    if (type !== PROFIT_TYPE) {
      percent = -v;
    }
    const ratePrice = calcPrice({ size: currentQty, percent, ...positionItem, ...contract });
    form.setFieldsValue({ [type]: ratePrice });
    setRate(v);
  };

  React.useImperativeHandle(ref, () => ({
    rateValue: rate,
    reset: () => {
      setRate(0);
    },
  }));

  return (
    <ButtonGroup value={rate} onChange={handleRateChange}>
      {map(rates, ({ value, label }) => (
        <Button
          key={value}
          value={value}
          type={type === PROFIT_TYPE ? 'primary' : 'secondary'}
          disabled={pctDisabled(type, value, { size: currentQty, ...positionItem, ...contract })}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default React.memo(React.forwardRef(SizeRate));
