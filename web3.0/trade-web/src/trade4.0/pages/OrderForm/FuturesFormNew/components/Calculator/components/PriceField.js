/**
 * Owner: garuda@kupotech.com
 * 计算器 Price Form 控件
 */
import React from 'react';

import FormNumberItem from './FormNumberItem';

import { _t } from '../../../builtinCommon';
import { getPlaceholder } from '../../../utils';

import { FormItemLabel } from '../../commonStyle';
import usePriceFieldProps from '../../PriceField/usePriceFieldProps';

const textMap = {
  openPrice: 'trade.positionsOrders.entryPrice',
  closePrice: 'calc.tab.closePrise',
};

const PriceField = ({ name, showLast }) => {
  const { validator, symbolInfo, handleChangePrice } = usePriceFieldProps({
    name,
  });
  return (
    <FormNumberItem
      name={name}
      label={<FormItemLabel>{_t(textMap[name])}</FormItemLabel>}
      validator={validator}
      unit={
        <>
          {showLast ? <a onClick={handleChangePrice}>{_t('trade.input.last')}</a> : null}
          <span>{symbolInfo.quoteCurrency}</span>
        </>
      }
      placeholder={getPlaceholder(symbolInfo.tickSize)}
      step={symbolInfo.tickSize || 1}
    />
  );
};

export default React.memo(PriceField);
