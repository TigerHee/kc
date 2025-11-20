/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import { get } from 'lodash';

import Form from '@mui/Form';

import MarginField from './MarginField';
import PriceField from './PriceField';
import SizeField from './SizeField';
import SubmitButton from './SubmitButton';

import {
  MARGIN_MODE_CROSS,
  QUANTITY_UNIT,
  evtEmitter,
  getDigit,
  getStore,
  multiply,
  calcMMR,
  trackClick,
  START_CALC,
  SENSORS_MARGIN_TYPE,
  MARGIN_MODE_ISOLATED,
} from '../../../builtinCommon';
import { FormWrapper } from '../../../builtinComponents';
import {
  getUnit,
  baseCurrencyToQty,
  qtyToBaseCurrency,
  getFuturesCrossConfigForSymbol,
} from '../../../builtinHooks';
import { BTN_SELL } from '../../../config';
import { getCalculatorProps } from '../../../hooks/useCalculatorProps';
// import { getFeeRate } from '../../../hooks/useGetData';
import { EVENT_NAME } from '../config';
import { useReset } from '../useReset';
import {
  calcCalculatorLiquidPrice,
  calcCalculatorLiquidValue,
  calcLiquidationPrice,
} from '../utils';

const event = evtEmitter.getEvt('futures-calculator');

const LiquidationTab = () => {
  const [form] = Form.useForm();
  useReset(form);

  const handleSubmit = useCallback(() => {
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitFinish = useCallback((values) => {
    const { openSize } = values;
    const { btnType, leverage, symbolInfo } = getCalculatorProps();
    const { symbol, maxLeverage, isInverse, indexPriceTickSize, baseIncrement } = symbolInfo;
    const globalState = getStore().getState();
    const marginMode = get(globalState, 'futuresForm.calcMarginModel');
    const isCross = marginMode === MARGIN_MODE_CROSS;
    const fixed = getDigit(indexPriceTickSize);
    const isQuantity = getUnit() === QUANTITY_UNIT || isInverse;
    const isCurrency = getUnit() !== QUANTITY_UNIT || isInverse;
    const openQtySize = baseCurrencyToQty({ baseIncrement, amount: openSize, isQuantity });
    const openCurrencySize = qtyToBaseCurrency({
      baseIncrement,
      amount: openSize,
      isQuantity: isCurrency,
      isFutures: true,
    });
    const side = btnType === BTN_SELL ? -1 : 1;
    const params = {
      ...values,
      openQtySize: multiply(side)(openQtySize).toString(),
      leverage,
      btnType,
    };
    let calcPrice;
    if (isCross) {
      const { m, mmrLimit, mmrLevConstant } = getFuturesCrossConfigForSymbol({ symbol });
      const MMR = calcMMR({ maxLev: mmrLevConstant, m, mmrLimit, posOrderQty: openCurrencySize });
      const liquidValue = calcCalculatorLiquidValue({
        data: params,
        symbolInfo,
        MMR,
      });
      calcPrice = calcCalculatorLiquidPrice({
        liquidValue,
        params,
        symbolInfo,
        fixed,
      });
    } else {
      calcPrice = calcLiquidationPrice(symbolInfo, params, fixed);
    }

    event.emit(EVENT_NAME, { ...values, liquidationPrice: calcPrice, marginMode, fixed });

    // 埋点
    trackClick([START_CALC, '1'], {
      calculateType: 'LiqPrice',
      marginType: SENSORS_MARGIN_TYPE[marginMode] || 'isolated',
    });
  }, []);

  return (
    <FormWrapper form={form} onSubmit={handleSubmitFinish} eventName={EVENT_NAME}>
      <PriceField name="openPrice" showLast />
      <MarginField form={form} />
      <SizeField />
      <SubmitButton onSubmit={handleSubmit} />
    </FormWrapper>
  );
};

export default React.memo(LiquidationTab);
