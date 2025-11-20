/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import Decimal from 'decimal.js';
import { isEqual } from 'lodash';
import { styled } from '@/style/emotion';
import { _t } from 'utils/lang';
import { formatCurrency, quantityPlaceholder, formatNumber } from '@/utils/futures';
import { QUANTITY_UNIT } from '@/pages/Orders/FuturesOrders/config';
import { FUTURES } from '@/meta/const';
import { useUnit } from '@/hooks/futures/useUnit';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import NumberInput from '@/components/NumberInput';
import { Form } from '@kux/mui';
import SizeRate from './SizeRate';

import validatorFunc from './validator';
import { getDigit } from 'src/helper';

const { FormItem, useFormInstance } = Form;

const RateContent = styled.div`
  margin-top: 10px;
`;

const name = 'size';
const SizeInput = ({ rateRef, type }) => {
  const form = useFormInstance();
  const positionItem = useSelector((state) => state.futures_orders.positionItem, isEqual);
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

  const handleValidate = (rule, value) => {
    const fixed = getDigit(step);
    const message = validatorFunc(
      value,
      {
        max,
        step,
      },
      {
        numericError: () =>
          _t('order.multiplier', {
            multiplier:
              contract.isInverse || tradingUnit === QUANTITY_UNIT ? 1 : contract.multiplier,
          }),
        rangeError: () =>
          _t('contract.amount.check', {
            amount: formatNumber(max, {
              fixed,
              pointed: true,
              positive: true,
            }),
          }),
      },
    );
    if (message) {
      return Promise.reject(message());
    }
    return Promise.resolve();
  };

  const placeholder = React.useMemo(() => {
    let text = quantityPlaceholder(contract, _t);
    if (!contract.isInverse) {
      text = tradingUnit === QUANTITY_UNIT ? text : '0';
    }
    return text;
  }, [contract, tradingUnit]);

  return (
    <FormItem
      name={name}
      label={`${_t('assets.depositRecords.amount')} (${
        contract.isInverse || tradingUnit === QUANTITY_UNIT
          ? _t('global.unit')
          : formatCurrency(contract.baseCurrency)
      })`}
      rules={[{ validator: handleValidate }]}
    >
      <NumberInput
        size="xlarge"
        fullWidth
        variant="default"
        autoComplete="off"
        placeholder={placeholder}
        step={step}
        footer={
          <RateContent>
            <SizeRate form={form} ref={rateRef} type={type} />
          </RateContent>
        }
      />
    </FormItem>
  );
};

export default React.memo(SizeInput);
