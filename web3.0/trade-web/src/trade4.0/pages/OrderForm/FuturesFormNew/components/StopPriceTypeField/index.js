/**
 * Owner: garuda@kupotech.com
 * 条件单触发类型选择 TP/MP/IP
 */
import React, { useEffect } from 'react';

import Form from '@mui/Form';

import { SELECT_OPTIONS, DEFAULT_VALUE } from './config';

import { toNonExponential, styled, toDP, getDigit } from '../../builtinCommon';
import { Select, dropStyle } from '../../builtinComponents';

import { getSymbolInfo, getTriggerPrice } from '../../hooks/useGetData';

const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    padding: 0;
  `,
  Icon: styled(dropStyle.Icon)`
    padding-left: 4px;
  `,
  List: styled(dropStyle.List)`
    transform: translate3d(0, 12px, 0px);
    & .dropdown-item {
      min-width: unset;
      &:hover {
        background-color: ${(props) => props.theme.colors.cover4};
      }
      padding: 11px 12px;
      font-size: 14px;
      color: ${(props) => props.theme.colors.text};
    }
    & .active-dropdown-item {
      color: ${(props) => props.theme.colors.primary};
    }
  `,
};

const { FormItem, useFormInstance } = Form;
const StopPriceTypeField = ({ name, stopPriceName, priceName, disabled }) => {
  const form = useFormInstance();
  const handleChange = React.useCallback(
    (value) => {
      if (!value) return;
      const { lastPrice, markPrice, indexPrice } = getTriggerPrice();

      const priceForType = {
        TP: lastPrice,
        MP: markPrice,
        IP: indexPrice,
      };

      const standPrice = priceForType[value];
      const { symbolInfo } = getSymbolInfo();

      form.setFieldsValue({
        [priceName]: toNonExponential(toDP(standPrice)(getDigit(symbolInfo?.tickSize))),
      });
      form.setFieldsValue({ [stopPriceName]: toNonExponential(standPrice) });
    },
    // 屏蔽 form 方法
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [priceName, stopPriceName],
  );

  // 初始化的时候，赋值一次
  useEffect(() => {
    handleChange(DEFAULT_VALUE);
  }, [handleChange]);

  return (
    <FormItem noStyle name={name} initialValue={DEFAULT_VALUE}>
      <Select
        disabled={disabled}
        onChange={handleChange}
        configs={SELECT_OPTIONS}
        disablePortal={false}
        extendStyle={DropdownExtend}
        renderLabel={(v) => {
          return `(${v})`;
        }}
      />
    </FormItem>
  );
};

export default React.memo(StopPriceTypeField);
