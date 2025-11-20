/**
 * Owner: clyne@kupotech.com
 */
import React, { useCallback } from 'react';

import FormNumberItem from './FormNumberItem';

import {
  MARGIN_MODE_CROSS,
  QUANTITY_UNIT,
  _t,
  calcCrossOrderMargin,
  lessThan,
  toPow,
} from '../../../builtinCommon';
import {
  // getUserFee,
  useGetCurrenciesPrecision,
  baseCurrencyToQty,
  getUnit,
  getIMR,
  getFuturesTakerFee,
} from '../../../builtinHooks';
import { BTN_SELL } from '../../../config';
import { getCalculatorProps } from '../../../hooks/useCalculatorProps';
import { useGetSymbolInfo } from '../../../hooks/useGetData';
import { getPlaceholder } from '../../../utils';
import { FormItemLabel } from '../../commonStyle';
import { useMarginMode } from '../useCalcMarginMode';

const name = 'availableMargin';

const MarginField = ({ form }) => {
  const active = useMarginMode();
  const isCross = active === MARGIN_MODE_CROSS;
  const { symbol, symbolInfo } = useGetSymbolInfo();
  const { settleCurrency, isInverse, baseIncrement } = symbolInfo;
  const { shortPrecision: precision } = useGetCurrenciesPrecision(settleCurrency);
  const inputStep = toPow(precision).toString();
  const isQuantity = getUnit() === QUANTITY_UNIT || isInverse;
  const validator = useCallback(
    (__, value) => {
      // 空教研
      if (!value) {
        return Promise.reject(_t('input.margin.error'));
      }
      const { leverage, btnType } = getCalculatorProps();
      const { openPrice, openSize, availableMargin } = form.getFieldsValue();
      const IMR = getIMR({ symbol, leverage });
      // const { takerFeeRate } = getUserFee();
      const takerFeeRate = getFuturesTakerFee({ symbol });
      if (openPrice && openSize && availableMargin) {
        const cost = calcCrossOrderMargin({
          symbolInfo,
          price: openPrice,
          size: baseCurrencyToQty({ baseIncrement, amount: openSize, isQuantity }),
          IMR,
          takerFeeRate,
          side: btnType === BTN_SELL ? 'sell' : 'buy',
        });
        // 可用保证金＜成本 提示异常
        if (lessThan(availableMargin)(cost)) {
          return Promise.reject(_t('input.margin.error1'));
        }
      }
      // pass
      return Promise.resolve();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseIncrement, isQuantity, symbol, symbolInfo],
  );

  if (!isCross) {
    return null;
  }
  return (
    <FormNumberItem
      name={name}
      label={<FormItemLabel>{_t('available.margin')}</FormItemLabel>}
      validator={validator}
      unit={
        <>
          <span>{settleCurrency}</span>
        </>
      }
      placeholder={getPlaceholder(inputStep)}
      step={inputStep}
    />
  );
};

export default React.memo(MarginField);
