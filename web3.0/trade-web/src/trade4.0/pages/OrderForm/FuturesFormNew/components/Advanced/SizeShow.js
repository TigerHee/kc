/**
 * Owner: garuda@kupotech.com
 */
import React, { useEffect, useMemo, useCallback } from 'react';

import Form from '@mui/Form';

import { IconLabel } from './commonStyle';

import {
  QUANTITY_UNIT,
  styled,
  multiply,
  lessThan,
  equals,
  greaterThan,
  _t,
  CURRENCY_UNIT,
  thousandPointed,
} from '../../builtinCommon';
import { FormNumberItem } from '../../builtinComponents';

import { USDS_MIN_VALUE } from '../../config';
import { useGetSymbolInfo, useGetUnit, useGetYSmall } from '../../hooks/useGetData';
import useGetUSDsUnit, { getConvertSize } from '../../hooks/useGetUSDsUnit';
import { getPlaceholder } from '../../utils';

const SizeShowWrapper = styled(FormNumberItem)`
  // margin: 2px 0 0 !important;
`;

const { useFormInstance } = Form;
const SizeShow = ({ name, price = 0, size = 0 }) => {
  const form = useFormInstance();
  const { symbolInfo: contract } = useGetSymbolInfo();
  const { tradingUnit, chooseUSDsUnit, unit } = useGetUSDsUnit();
  const { unit: _unit } = useGetUnit();
  const isYScreenSM = useGetYSmall();

  const isQuantity = tradingUnit === QUANTITY_UNIT;

  const step = useMemo(() => {
    if (contract.isInverse) {
      return contract.lotSize;
    }
    if (chooseUSDsUnit) {
      return USDS_MIN_VALUE;
    }
    return isQuantity ? contract.lotSize : contract.multiplier;
  }, [contract, chooseUSDsUnit, isQuantity]);

  const minValue = useMemo(() => {
    if (contract.isInverse) {
      return 1;
    }
    if (chooseUSDsUnit) {
      return multiply(multiply(1)(contract.multiplier))(price);
    }
    return isQuantity ? 1 : contract.multiplier;
  }, [isQuantity, contract, price, chooseUSDsUnit]);

  const showUnit = useMemo(() => (chooseUSDsUnit ? contract?.settleCurrency : _unit), [
    _unit,
    chooseUSDsUnit,
    contract,
  ]);

  useEffect(() => {
    form.setFieldsValue({ [name]: '0' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, tradingUnit]);

  // 校验显示单位是否大于Size
  const validator = useCallback(
    (__, value) => {
      let checkSize = size || 0;
      let checkValue = value || 0;
      if (value == null || value === '') {
        return Promise.reject(_t('input.tips.size'));
      }
      if (chooseUSDsUnit && !contract.isInverse) {
        checkSize = getConvertSize({
          size: checkSize,
          price,
          multiplier: contract.multiplier,
          tradingUnit,
          chooseUSDsUnit,
          isInverse: contract.isInverse,
        });
        checkValue = getConvertSize({
          size: checkValue,
          price,
          multiplier: contract.multiplier,
          tradingUnit,
          chooseUSDsUnit,
          isInverse: contract.isInverse,
        });
      }
      // 如果 value 跟 size 有值，校验的 value 没值，需要提示
      if (+value && +size && equals(checkValue)(0)) {
        return Promise.reject(
          _t('futures.amount.must.larger', { amount: minValue, currency: showUnit }),
        );
      }
      if (checkValue) {
        const min = multiply(checkSize)(0.05);
        if (lessThan(checkValue)(min) && !equals(checkValue)(0)) {
          return Promise.reject(_t('visibleSize.validator.min'));
        }

        if (greaterThan(checkValue)(checkSize)) {
          return Promise.reject(_t('visibleSize.validator.max'));
        }
        // 如果是正向合约，并且数量为 currency，校验是否满足乘数规则
        if (
          !contract.isInverse &&
          tradingUnit === CURRENCY_UNIT &&
          contract.multiplier > 1 &&
          !chooseUSDsUnit
        ) {
          if (value % contract.multiplier !== 0) {
            return Promise.reject(
              _t('order.multiplier', {
                multiplier: thousandPointed(contract.multiplier),
              }),
            );
          }
        }
      }
      return Promise.resolve();
    },
    [
      showUnit,
      chooseUSDsUnit,
      contract.isInverse,
      contract.multiplier,
      minValue,
      price,
      size,
      tradingUnit,
    ],
  );

  return (
    <SizeShowWrapper
      name={name}
      label={
        <IconLabel>
          <span>{_t('trade.order.displayQty')}</span>
        </IconLabel>
      }
      initialValue="0"
      unit={unit}
      validator={validator}
      placeholder={getPlaceholder(step)}
      step={step}
      useTool={false}
      inputProps={{
        size: isYScreenSM ? 'small' : 'medium',
      }}
    />
  );
};

export default React.memo(SizeShow);
