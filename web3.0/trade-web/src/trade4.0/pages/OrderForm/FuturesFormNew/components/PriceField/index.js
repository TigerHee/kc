/**
 * Owner: garuda@kupotech.com
 * Price Form 控件
 */
import React from 'react';

import usePriceFieldProps from './usePriceFieldProps';

import { _t } from '../../builtinCommon';
import { FormNumberItem } from '../../builtinComponents';
import { useGetYSmall } from '../../hooks/useGetData';
import { getPlaceholder } from '../../utils';

const noop = () => {};
const PriceField = ({
  name,
  label,
  step,
  showLast,
  validator: propsValidator,
  onPriceChange = noop,
  ShowYSmall,
}) => {
  const isYScreenSM = useGetYSmall();

  const { isLogin, validator, symbolInfo, handleChangePrice } = usePriceFieldProps({
    name,
    onPriceChange,
  });

  return (
    <FormNumberItem
      name={name}
      label={isYScreenSM ? null : label}
      validator={isLogin ? propsValidator || validator : null}
      unit={
        <>
          {isYScreenSM ? <div className="small-tool">{ShowYSmall}</div> : null}
          {showLast ? <a onClick={handleChangePrice}>{_t('trade.input.last')}</a> : null}
          <span>{symbolInfo.quoteCurrency}</span>
        </>
      }
      placeholder={getPlaceholder(symbolInfo.tickSize)}
      step={step || symbolInfo.tickSize || 1}
      inputProps={{
        size: isYScreenSM ? 'small' : 'medium',
      }}
    />
  );
};

export default React.memo(PriceField);
