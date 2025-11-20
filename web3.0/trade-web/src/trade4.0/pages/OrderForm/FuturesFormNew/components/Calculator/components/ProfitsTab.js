/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import Form from '@mui/Form';

import PriceField from './PriceField';
import SizeField from './SizeField';
import SubmitButton from './SubmitButton';

import {
  lessThan,
  abs,
  multiply,
  evtEmitter,
  trackClick,
  START_CALC,
  MARGIN_MODE_ISOLATED,
} from '../../../builtinCommon';

import { getCalculatorProps } from '../../../hooks/useCalculatorProps';
import { EVENT_NAME } from '../config';
import { useReset } from '../useReset';
import { calcCostMargin, calcProfit, calcProfitRate } from '../utils';

const event = evtEmitter.getEvt('futures-calculator');
const ProfitsTab = () => {
  const [form] = Form.useForm();
  useReset(form);

  const handleSubmit = useCallback(() => {
    form.submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitFinish = useCallback((values) => {
    const {
      btnType,
      leverage,
      tradingUnit,
      symbolInfo: contract,
      shortPrecision,
    } = getCalculatorProps();
    const params = { ...values, leverage, btnType, tradingUnit };
    let fixed = 2;
    if (shortPrecision) {
      fixed = Number(shortPrecision);
    }
    const posInit = calcCostMargin(contract, params);
    let pnl = calcProfit(contract, params);
    let profitRate = calcProfitRate(pnl, posInit, 4);

    // 收益亏损不能超过成本，当收益＜0，且abs(收益)＞成本时，收益 = -1*成本， 收益率 -100%
    if (lessThan(pnl)(0) && lessThan(posInit)(abs(pnl))) {
      pnl = multiply(-1)(posInit);
      profitRate = '-100';
    }

    event.emit(EVENT_NAME, { ...values, cost: posInit, profit: pnl, profitRate, fixed });
    // 埋点
    trackClick([START_CALC, '1'], {
      calculateType: 'Profit',
      marginType: 'isolated',
    });
  }, []);

  return (
    <Form form={form} onFinish={handleSubmitFinish}>
      <PriceField name="openPrice" showLast />
      <PriceField name="closePrice" />
      <SizeField />
      <SubmitButton onSubmit={handleSubmit} />
    </Form>
  );
};

export default React.memo(ProfitsTab);
