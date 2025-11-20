/**
 * Owner: victor.ren@kupotech.com
 *
 * @description DatePicker component
 */

import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Picker from 'rc-picker';
import { Moment } from 'moment';
import { useCommonProps } from './hooks/use-common-props';
import { useMergedState } from '@/hooks/useMergedState';
import { useUpdateEffect } from './hooks/use-update-effect';
import { DatePickerProps } from './types';
import { getDatePickerClassNames } from './utils/class-names';
import { handlePlaceholder } from './utils/placeholder';
import './style.scss';

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      defaultValue,
      value,
      onChange,
      allowClear: propsAllowClear = true,
      placeholder = '',
      label = '',
      labelProps = { shrink: true },
      disabled = false,
      error = false,
      size = 'medium',
      width,
      className,
      style,
      picker = 'date',
      popupClassName,
      dropdownClassName,
      showToday = false,
      ...props
    },
    ref,
  ) => {
    const dropdownContainer = useRef<HTMLDivElement>(null);
    const [allowClear, setAllowClear] = useState(false);
    const [inFocus, setInFocus] = useState(false);
    const [innerValue, setInnerValue] = useMergedState<Moment | undefined>(defaultValue, {
      value,
    });

    const shrink = inFocus || !!innerValue || (labelProps.shrink ?? true);
    const _placeholder = handlePlaceholder(placeholder, label, shrink);

    const handleShowClear = useCallback(() => {
      if (propsAllowClear && innerValue) {
        setAllowClear(true);
      }
    }, [propsAllowClear, innerValue]);

    const handleFocus = useCallback(() => {
      setInFocus(true);
      handleShowClear();
    }, [handleShowClear]);

    const handleChange = (newValue: Moment | Moment[], formatString: string | string[]) => {
      const singleValue = Array.isArray(newValue) ? newValue[0] : newValue;
      setInnerValue(singleValue);
      const formatStr = Array.isArray(formatString) ? formatString[0] || '' : formatString;
      onChange?.(singleValue || null, formatStr);
    };

    useUpdateEffect(() => {
      if (!innerValue) {
        setAllowClear(false);
      }
    }, [innerValue]);

    const commonProps = useCommonProps({
      prefixCls: 'kux-picker',
      value: innerValue,
      placeholder: _placeholder,
      format: 'DD/MM/YYYY',
      allowClear,
      onChange: handleChange as any,
      inFocus,
      picker,
      disabled,
      size,
      getPopupContainer: () => dropdownContainer.current,
      showToday,
      ...props,
    });

    const classNames = getDatePickerClassNames({
      size,
      error,
      disabled,
      inFocus,
      shrink,
      className,
      labelProps,
      popupClassName,
      dropdownClassName,
      picker,
      allowClear,
    });

    return (
      <div
        ref={ref}
        onMouseOver={handleShowClear}
        onFocus={handleFocus}
        onBlur={() => setInFocus(false)}
        onMouseLeave={() => {
          setAllowClear(false);
        }}
        style={{ width, ...style }}
        className={classNames.container}
      >
        <Picker {...(commonProps as any)} className={classNames.wrapper} />
        
        {label ? (
          <label className={classNames.label} style={labelProps.style}>
            {label}
          </label>
        ) : null}

        <fieldset className={classNames.fieldset}>
          <legend className={classNames.legend}>
            {label}
          </legend>
        </fieldset>
        
        {createPortal(
          <div ref={dropdownContainer} className={classNames.dropdown} />,
          document.body
        )}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
