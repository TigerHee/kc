/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import clsx from 'clsx';

import Form from '@mui/Form';

import { styled } from '../../../builtinCommon';
import { NumberInput } from '../../../builtinComponents';

const { FormItem } = Form;

const EndBox = styled.div`
  display: flex;
  align-items: center;
  padding-right: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    padding: 0 8px 0 4px;
  }
`;

const FormItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .KuxInput-root {
    padding-right: 8px;
  }
  .KuxInput-label {
    > div {
      font-size: 16px;
      margin: 0;
      color: inherit;
    }
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
    <FormItemWrapper className={clsx('trade-form-item', className)}>
      <FormItem
        // noStyle
        name={name}
        rules={[
          {
            validator: validator || null,
          },
        ]}
        label={label}
        {...formProps}
      >
        <NumberInput
          name={name}
          placeholder={placeholder}
          unit={<EndBox>{unit}</EndBox>}
          step={step || 1}
          useTool={useTool}
          disabled={disabled}
          autoComplete="off"
          fullWidth
          footer={footer}
          variant="default"
          size="large"
          labelProps={{ shrink: true }}
          strictReg
          {...inputProps}
        />
      </FormItem>
    </FormItemWrapper>
  );
};

export default React.memo(FormNumberItem);
