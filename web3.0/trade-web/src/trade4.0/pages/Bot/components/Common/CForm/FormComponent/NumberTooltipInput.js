/**
 * Owner: mike@kupotech.com
 */

import React, { useMemo, useCallback } from 'react';
import Form from '../Form';
import InputNumber from 'Bot/components/Common/InputNumber';
import { useSetTooltip, useActiveTooltipCheck } from './config';

const { useFormInstance } = Form;
/**
 * @description:
 * @param {*} name
 * @param {*} placeholder
 * @param {array} other
 * @return {*}
 */
const NumberTooltipInput = ({ name, placeholder, ...other }) => {
  const form = useFormInstance();
  const { onSetTooltipClose, onSetTooltipTitle } = useSetTooltip();
  const isUseTooltipCheck = useActiveTooltipCheck();
  // 组件库那边提供的error
  const error = other.error;
  useMemo(() => {
    if (!isUseTooltipCheck) return;
    if (error) {
      const errors = form.getFieldError(name);
      if (errors.length) {
        onSetTooltipTitle({ name, message: errors[0] });
      }
    } else {
      onSetTooltipClose(name);
    }
  }, [error]);

  const focusHandler = useCallback(() => {
    // 只要获得焦点，就取消为空校验，关闭tooltip
    form.validateFields(null, { triggerName: 'onChange' }).catch(err => {
      // 校验有发现当前input有错误，那么就不关闭
      const currentInputHasErr = err.errorFields?.some(el => el.name[0] === name);
      onSetTooltipClose(currentInputHasErr ? { exclude: [name] } : []);
    });
  }, []);

  const blurHandler = useCallback(() => {
    onSetTooltipClose([]);
  }, []);

  const label = !isUseTooltipCheck ? placeholder : null;
  const variant = isUseTooltipCheck ? undefined : 'default';
  return (
    <InputNumber
      onFocus={focusHandler}
      onBlur={blurHandler}
      autoComplete="off"
      fullWidth
      placeholder={placeholder}
      {...other}
      label={label}
      variant={variant}
    />
  );
};

export default React.memo(NumberTooltipInput);
