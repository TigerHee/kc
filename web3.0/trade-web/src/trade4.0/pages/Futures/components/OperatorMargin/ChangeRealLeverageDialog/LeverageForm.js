/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆-表单
 */
import React, { useCallback, useEffect, useMemo } from 'react';

import { debounce } from 'lodash';

import { _t } from 'utils/lang';
import {
  greaterThan,
  lessThan,
  plus,
  minus,
  lessThanOrEqualTo,
  greaterThanOrEqualTo,
} from 'utils/operation';

import { ICSubOutlined, ICPlusOutlined } from '@kux/icons';
import Form from '@mui/Form';

import NumberTextField from '@/components/NumberInput';
import { styled } from '@/style/emotion';

import { trackClick } from 'src/utils/ga';
import { ADJUST_LEVERAGE } from '@/meta/futuresSensors/withdraw';


import { validateLeverage } from '../utils';

const FormBox = styled.div`
  display: flex;
  align-items: center;
  width: 260px;
  justify-content: space-between;
  margin: 0 auto;
  fieldset {
    display: none;
  }
  .KuxForm-itemHelp {
    display: none;
  }
  input {
    display: block;
    height: auto;
    flex: unset;
    text-align: center;
  }
  .KuxInput-suffix {
    position: absolute;
    /* @noflip */
    right: 0;
    margin: 0;
    top: -2px;
  }
  .KuxInput-root {
    background: transparent;
  }
  .KuxInput-suffix,
  input {
    font-size: 36px;
    font-weight: 600;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.primary};
  }
  .KuxInput-root {
    padding: 0 20px;
  }
  .KuxForm-form {
    width: 188px;
    padding: 0;
  }
  .KuxDivider-root {
    display: none;
  }
`;

const ButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.cover4};
  > svg {
    color: ${(props) => (props.disabled ? props.theme.colors.cover16 : props.theme.colors.icon)};
  }
`;

const { FormItem, useForm, useWatch } = Form;

const LeverageForm = ({
  onLeverageChange,
  minLeverage,
  maxLeverage,
  leverage,
  disabled,
  onError,
}) => {
  const [form] = useForm();

  const inputValue = useWatch('inputLev', form);

  useEffect(() => {
    form.setFieldsValue({ inputLev: leverage });
    handleCheckError();
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leverage]);

  const minDisabled = useMemo(() => {
    return disabled || lessThanOrEqualTo(inputValue || 0)(minLeverage);
  }, [disabled, inputValue, minLeverage]);

  const maxDisabled = useMemo(() => {
    return disabled || greaterThanOrEqualTo(inputValue || 0)(maxLeverage);
  }, [disabled, inputValue, maxLeverage]);

  // 监听 error 消息
  const handleCheckError = useCallback(
    debounce(() => {
      const inputError = form.getFieldError('inputLev');
      if (inputError && inputError.length) {
        onError(inputError[0]);
      } else {
        onError(false);
      }
      // 不需要监听 form
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 16),
    [],
  );

  const onValuesChange = useCallback(
    ({ inputLev }) => {
      const changeValue = +inputLev;
      handleCheckError();
      if (lessThan(changeValue)(minLeverage)) {
        return;
      }
      if (greaterThan(changeValue)(maxLeverage)) {
        return;
      }
      onLeverageChange(inputLev);
    },
    // 不监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCheckError, maxLeverage, minLeverage, onLeverageChange],
  );

  const handleCheckLeverage = useCallback(
    (rule, value) => {
      return validateLeverage({ _t, value, minLeverage, maxLeverage });
    },
    [maxLeverage, minLeverage],
  );

  const handlePlusLeverage = useCallback(() => {
    if (maxDisabled) {
      return;
    }
    const plusLeverage = plus(leverage)(1).toFixed(2);
    onLeverageChange && onLeverageChange(plusLeverage);
    // 埋点
    trackClick([ADJUST_LEVERAGE, '2']);
  }, [leverage, maxDisabled, onLeverageChange]);

  const handleMinusLeverage = useCallback(() => {
    if (minDisabled) {
      return;
    }
    const minusLeverage = minus(leverage)(1).toFixed(2);
    onLeverageChange && onLeverageChange(minusLeverage);
    // 埋点
    trackClick([ADJUST_LEVERAGE, '3']);
  }, [leverage, minDisabled, onLeverageChange]);

  // input focus 埋点
  const handleInputFocus = useCallback(() => {
    trackClick([ADJUST_LEVERAGE, '1']);
  }, []);

  return (
    <>
      <FormBox>
        <ButtonIcon disabled={minDisabled} onClick={handleMinusLeverage}>
          <ICSubOutlined />
        </ButtonIcon>
        <Form form={form} onValuesChange={onValuesChange}>
          <FormItem name={'inputLev'} label={null} rules={[{ validator: handleCheckLeverage }]}>
            <NumberTextField
              onFocus={handleInputFocus}
              size="xlarge"
              autoComplete="off"
              step={0.01}
              suffix={<>x</>}
              disabled={disabled}
            />
          </FormItem>
        </Form>
        <ButtonIcon disabled={maxDisabled} onClick={handlePlusLeverage}>
          <ICPlusOutlined />
        </ButtonIcon>
      </FormBox>
    </>
  );
};

export default React.memo(LeverageForm);
