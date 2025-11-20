/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';

import { isEqual } from 'lodash';
import { useGetSymbolInfo, NumberInput, styled, fx } from '@/pages/Futures/import';
import { Divider, Form } from '@kux/mui';
import validatorFunc from './validator';
import { FUTURES } from 'src/trade4.0/meta/const';
import { namespace } from '../../../config';

const UnitSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text30') || fx.color(props, 'text40')}
`;

const { FormItem } = Form;

const PriceInput = ({ type, label, stopPriceType, slot, footer, rateRef }) => {
  const positionItem = useSelector((state) => state[namespace].positionItem, isEqual);
  const contract = useGetSymbolInfo({ symbol: positionItem.symbol, tradeType: FUTURES });
  const { indexPriceTickSize, tickSize, quoteCurrency, settleCurrency } = contract || {};

  const triggerValidate = (rule, value = '') => {
    if (value === '') {
      return Promise.resolve();
    }
    const message = validatorFunc(value, stopPriceType, type);
    // 选择控件有值，重置选择控件的值
    if (rateRef && rateRef.current && rateRef.current.rateValue > 0) {
      rateRef.current.reset();
    }
    if (message) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };

  return (
    <FormItem name={type} label={label} rules={[{ validator: triggerValidate }]}>
      <NumberInput
        size="xlarge"
        fullWidth
        variant="default"
        autoComplete="off"
        step={stopPriceType === 'TP' ? tickSize : indexPriceTickSize}
        suffix={
          <>
            <UnitSpan>{quoteCurrency || settleCurrency}</UnitSpan>
            <Divider type="vertical" />
            {slot}
          </>
        }
        footer={footer}
      />
    </FormItem>
  );
};

export default React.memo(PriceInput);
