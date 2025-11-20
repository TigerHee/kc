/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'react-redux';

import { isEqual } from 'lodash';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import NumberInput from '@/components/NumberInput';
import { styled } from '@kux/mui/emotion';
import { Divider, Form } from '@kux/mui';
import validatorFunc from './validator';
import { fx } from 'src/trade4.0/style/emotion';

const UnitSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  ${(props) => fx.color(props, 'text30') || fx.color(props, 'text40')}
`;

const { FormItem } = Form;

const PriceInput = ({ type, label, stopPriceType, slot, footer, rateRef }) => {
  const positionItem = useSelector((state) => state.futures_orders.positionItem, isEqual);
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
