/**
 * Owner: charles.yang@kupotech.com
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Decimal from 'decimal.js';
import { floadToPercent } from '@/utils/format';
import { roundDownByStep } from 'helper';
import ButtonGroup, { Button } from '@/pages/OrderForm/FuturesFormNew/components/ButtonGroup';
import { FUTURES } from '@/meta/const';
import { useUnit } from '@/hooks/futures/useUnit';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';

const Rates = [
  {
    value: 0.25,
    label: floadToPercent(0.25, { isPositive: false }),
  },
  {
    value: 0.5,
    label: floadToPercent(0.5, { isPositive: false }),
  },
  {
    value: 0.75,
    label: floadToPercent(0.75, { isPositive: false }),
  },
  {
    value: 1,
    label: floadToPercent(1, { isPositive: false }),
  },
];

const SizeRate = ({ type, form }, ref) => {
  const positionItem = useSelector((state) => state.futures_orders.positionItem);
  const contract = useGetSymbolInfo({ symbol: positionItem.symbol, tradeType: FUTURES });

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

  const [rate, setRate] = useState(0);

  const handleRateChange = (e, v) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    let size = max;
    if (v === 1) {
      size = `${size}`;
    } else {
      size = roundDownByStep(size * v, step).toFixed();
    }
    form.setFieldsValue({ size });
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
      {_.map(Rates, ({ value, label }) => (
        <Button key={value} value={value}>
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default React.memo(React.forwardRef(SizeRate));
