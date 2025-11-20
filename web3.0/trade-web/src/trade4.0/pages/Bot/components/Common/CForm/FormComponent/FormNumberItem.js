/**
 * Owner: mike@kupotech.com
 * 简单使用，携带 Tooltip 的 Number 组件的FormItem
 * TIPS: 可以将  helperText 设置成一个 function 函数，每次 onFocus 或者 onChange 时，会触发该函数，获取是否需要展示提示信息
 */
import React from 'react';
import clsx from 'clsx';
import { styled } from '@/style/emotion';
import FormItem from '../FormItem';
import NumberTooltipInput from './NumberTooltipInput';
import FormTooltip from './FormTooltip';
import { useActiveTooltipCheck } from './config';

export const FormItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .dropdown-value {
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    color: ${(props) => (props.disabled ? props.theme.colors.text20 : props.theme.colors.text)};
  }
`;

const FormNumberItem = ({
  name,
  label,
  validator,
  unit,
  placeholder,
  className,
  formProps,
  inputProps,
  disabled = false,
}) => {
  const isUseTooltipCheck = useActiveTooltipCheck();
  const rules = validator ? { rules: [{ validator }] } : {};
  return (
    <FormItemWrapper className={clsx('trade-form-item', className)} disabled={disabled}>
      {label || null}
      <FormTooltip name={name} />
      <FormItem
        noStyle={isUseTooltipCheck}
        name={name}
        {...rules}
        {...formProps}
      >
        <NumberTooltipInput
          name={name}
          placeholder={placeholder}
          unit={unit}
          disabled={disabled}
          {...inputProps}
        />
      </FormItem>
    </FormItemWrapper>
  );
};

export default React.memo(FormNumberItem);
