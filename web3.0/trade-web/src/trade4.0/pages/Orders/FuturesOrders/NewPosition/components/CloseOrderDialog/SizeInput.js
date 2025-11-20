/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import Decimal from 'decimal.js';
import { isEqual } from 'lodash';
import { Form } from '@kux/mui';
import {
  styled,
  NumberInput,
  useI18n,
  useUnit,
  useGetSymbolInfo,
  formatCurrency,
  QUANTITY_UNIT,
  quantityPlaceholder,
  formatNumber,
  getDigit,
} from '@/pages/Futures/import';
import SizeRate from './SizeRate';

import validatorFunc from './validator';
import { FUTURES } from 'src/trade4.0/meta/const';
import { namespace } from '../../config';

const { FormItem, useFormInstance } = Form;

const RateContent = styled.div``;

const name = 'size';
const SizeInput = ({ rateRef, type }) => {
  const { _t } = useI18n();
  const form = useFormInstance();
  const positionItem = useSelector((state) => state[namespace].positionItem, isEqual);
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
  }, [_t, contract, tradingUnit]);

  return (
    <div className="form-size">
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
        />
      </FormItem>
      <RateContent>
        <SizeRate form={form} ref={rateRef} type={type} />
      </RateContent>
    </div>
  );
};

export default React.memo(SizeInput);
