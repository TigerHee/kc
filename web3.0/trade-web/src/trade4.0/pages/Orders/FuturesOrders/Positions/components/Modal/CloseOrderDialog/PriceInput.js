/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import { _t } from 'utils/lang';
import useContractSizeToFixed from
'@/pages/Orders/FuturesOrders/hooks/common/useContractSizeToFixed';
import NumberInput from '@/components/NumberInput';
import { Form } from '@kux/mui';

import validatorFunc from './validator';

const { FormItem } = Form;

const name = 'price';
const PriceInput = () => {
  const positionItem = useSelector((state) => state.futures_orders.positionItem, isEqual);
  const contract = useContractSizeToFixed(positionItem.symbol);

  const handleValidate = (rule, value) => {
    const message = validatorFunc(
      value,
      {
        max: contract.maxPrice,
        step: contract.tickSize,
      },
      {
        numericError: () => _t('input.tips.price', { tick: contract.tickSize }),
        rangeError: () =>
          _t('contract.price.check', {
            price: contract.maxPrice,
          }),
      },
    );
    if (message) {
      return Promise.reject(message());
    }
    return Promise.resolve();
  };

  return (
    <FormItem name={name} label={_t('trade.order.price')} rules={[{ validator: handleValidate }]}>
      <NumberInput
        size="xlarge"
        fullWidth
        variant="default"
        autoComplete="off"
        placeholder={_t('forward.input.tips.size', { multiplier: contract.tickSize })}
        step={contract.tickSize}
        suffix={<span>{contract.quoteCurrency || contract.settleCurrency}</span>}
      />
    </FormItem>
  );
};

export default React.memo(PriceInput);
