/**
 * Owner: garuda@kupotech.com
 * 计算器 Size Form input 控件
 */

import React from 'react';

import { map } from 'lodash';

import FormNumberItem from './FormNumberItem';
import SizeRate from './SizeRate';

import { QUANTITY_UNIT, abs, _t } from '../../../builtinCommon';

import { useGetSymbolInfo, useGetUnit } from '../../../hooks/useGetData';

import { FormItemLabel } from '../../commonStyle';
import useSizeFieldProps from '../../SizeField/useSizeFieldProps';
import { SIZE_RATES } from '../config';

const CalculatorSizeField = () => {
  const { tradingUnit } = useGetUnit();
  const { symbolInfo: contract } = useGetSymbolInfo();

  const {
    validator,
    unit,
    step,
    placeholder,
    addOrSubStep,
    helperText,
    handleChange,
  } = useSizeFieldProps({ name: 'openSize', simpleCheck: true });

  const rates = React.useMemo(() => {
    if (tradingUnit === QUANTITY_UNIT) {
      return SIZE_RATES;
    }
    // 如果不是以张为单位，则乘一个合约乘数
    if (contract.multiplier) {
      return map(SIZE_RATES, ({ value, label }) => ({
        value: value * abs(contract.multiplier),
        label: label * abs(contract.multiplier),
      }));
    }
    return SIZE_RATES;
  }, [contract, tradingUnit]);

  return (
    <FormNumberItem
      name={'openSize'}
      label={
        <FormItemLabel>
          <span className="label">{_t('calc.qty')}</span>
        </FormItemLabel>
      }
      validator={validator}
      unit={unit}
      step={step}
      placeholder={placeholder}
      inputProps={{
        addOrSubStep,
        helperText,
        onChange: handleChange,
      }}
      footer={<SizeRate name={'openSize'} rates={rates} formatLabel />}
    />
  );
};

export default React.memo(CalculatorSizeField);
