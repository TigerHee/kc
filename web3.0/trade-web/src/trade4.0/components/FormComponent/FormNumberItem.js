/**
 * Owner: garuda@kupotech.com
 * 简单使用，携带 Tooltip 的 Number 组件的FormItem
 * TIPS: 可以将  helperText 设置成一个 function 函数，每次 onFocus 或者 onChange 时，会触发该函数，获取是否需要展示提示信息
 */
import React from 'react';
import clsx from 'clsx';

import { styled } from '@/style/emotion';
import Form from '@mui/Form';
import NumberTooltipInput from './NumberTooltipInput';
import FormTooltip from './FormTooltip';

const { FormItem } = Form;

const EndBox = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  font-size: ${(props) => (props.size === 'small' ? '12px' : '14px')};
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    padding: ${(props) => (props.size === 'small' ? '0 4px 0' : '0 8px 0 4px')};
  }
`;

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
  step,
  validator,
  unit,
  placeholder,
  className,
  footer,
  formProps,
  inputProps,
  useTool = true,
  disabled = false,
}) => {
  return (
    <FormItemWrapper className={clsx('trade-form-item', className)} disabled={disabled}>
      {label || null}
      <FormTooltip name={name} />
      <FormItem
        noStyle
        name={name}
        rules={[
          {
            validator: validator || null,
          },
        ]}
        {...formProps}
      >
        <NumberTooltipInput
          name={name}
          placeholder={placeholder}
          unit={
            <EndBox className="end-box" size={inputProps?.size}>
              {unit}
            </EndBox>
          }
          step={step || 1}
          useTool={useTool}
          disabled={disabled}
          {...inputProps}
        />
      </FormItem>
      {footer || null}
    </FormItemWrapper>
  );
};

export default React.memo(FormNumberItem);
