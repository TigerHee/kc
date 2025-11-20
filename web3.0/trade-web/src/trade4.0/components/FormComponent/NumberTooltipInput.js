/**
 * Owner: garuda@kupotech.com
 * 封装一个携带事件触发的 NumberInput
 * 内置 onFocus / onChange 操作
 */

import React, { useCallback, useRef } from 'react';

import { debounce } from 'lodash';

import Form from '@mui/Form';

import NumberInput from '@/components/NumberInput';

import { useSetTooltip } from './config';

const { useFormInstance } = Form;

const NumberTooltipInput = ({ name, onFocus, onBlur, onChange, helperText, ...other }) => {
  const form = useFormInstance();
  const { onSetTooltipClose, onSetTooltipTitle } = useSetTooltip();
  const blur = useRef(null);

  // 移除焦点，直接 无脑设置成 false
  const handleBlur = useCallback(() => {
    onSetTooltipClose(name);
    onBlur && onBlur();
    blur.current = false;
  }, [name, onBlur, onSetTooltipClose]);

  // 设置 tooltip message, 开启 200ms 的防抖
  const handleSetTooltip = useCallback(
    debounce((value) => {
      // 判断是否传入 helperText，传入则设置 helperText 的值
      if (typeof helperText === 'function') {
        const message = helperText(value);
        if (message) {
          onSetTooltipTitle({ name, message });
        } else {
          onSetTooltipClose(name);
        }
      } else if (helperText) {
        onSetTooltipTitle({ name, message: helperText });
      } else {
        const error = form.getFieldError(name);
        console.log('handle get error --->', error);
        if (error.length) {
          onSetTooltipTitle({ name, message: error[0] });
        } else {
          onSetTooltipClose(name);
        }
      }
    }, 200),
    [onSetTooltipTitle, onSetTooltipClose, helperText, name],
  );

  // onFocus 时，设置一次 tooltip
  const handleFocus = useCallback(() => {
    const currentValue = form.getFieldValue(name);
    handleSetTooltip(currentValue);
    onFocus && onFocus();
    blur.current = true;
    // 不需要监听 form
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSetTooltip, name, onFocus]);

  const handleChange = useCallback(
    (v) => {
      if (blur?.current) {
        handleSetTooltip(v);
      }
      onChange && onChange(v);
    },
    [handleSetTooltip, onChange],
  );

  return (
    <NumberInput
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      autoComplete="off"
      fullWidth
      strictReg
      {...other}
    />
  );
};

export default React.memo(NumberTooltipInput);
