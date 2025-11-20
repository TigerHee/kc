/**
 * Owner: garuda@kupotech.com
 * 选择 止盈止损类型的控件，这里有点特殊，选择类型时，需要止盈止损都一致，所以命名按照默认添加1的来
 */
import React from 'react';

import Form from '@mui/Form';

import { SELECT_OPTIONS } from './config';

import { styled } from '../../builtinCommon';
import { Select, dropStyle } from '../../builtinComponents';

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
const PriceType = ({ name, disabled }) => {
  const form = useFormInstance();
  const handleChange = React.useCallback(
    (value) => {
      if (!value) return;
      // 命名规则按照添加 1 来，比如 stopPriceType 跟 stopPriceType1
      if (name.match('1')) {
        form.setFieldsValue({ [name]: value });
        const stopPriceTypeName = name.replace('1', '');
        form.setFieldsValue({ [stopPriceTypeName]: value });
      } else {
        form.setFieldsValue({ [name]: value });
        form.setFieldsValue({ [`${name}1`]: value });
      }
    },
    [form, name],
  );

  return (
    <FormItem noStyle name={name} initialValue="TP">
      <Select
        disabled={disabled}
        onChange={handleChange}
        optionLabelProp="menuLabel"
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

export default React.memo(PriceType);
