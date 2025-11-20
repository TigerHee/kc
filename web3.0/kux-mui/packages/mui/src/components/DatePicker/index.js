/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useUpdateEffect from 'hooks/useUpdateEffect';
import useMergedState from 'hooks/useMergedState';
import useTheme from 'hooks/useTheme';
import Portal from 'components/Portal';
import { ContainerWrapper, DateWrapper, LabelContainer, LabelFieldSet, LabelLegend } from './kux';
import useCommonProps from './useCommonProps';
import useClassNames from './useClassNames';

function handlePlaceholder(placeholder, label, shrink) {
  if ((label && shrink) || !label) return placeholder;
}

const DatePicker = React.forwardRef(
  (
    {
      defaultValue,
      value,
      onChange,
      allowClear: propsAllowClear,
      placeholder,
      label,
      labelProps,
      disabled,
      error,
      size,
      width,
      className,
      style,
      picker,
      popupClassName,
      dropdownClassName,
      ...props
    },
    ref,
  ) => {
    const dropdownContainer = useRef(null);
    const theme = useTheme();
    const _classNames = useClassNames({ size, error, disabled });
    const [allowClear, setAllowClear] = useState(false);
    const [inFocus, setInFocus] = useState(false);
    const [innerValue, setInnerValue] = useMergedState(defaultValue, {
      value,
    });

    const shrink = inFocus || !!innerValue || labelProps.shrink;
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

    const handleChange = (newValue, formatString) => {
      setInnerValue(newValue);
      onChange?.(newValue, formatString);
    };

    useUpdateEffect(() => {
      if (!innerValue) {
        setAllowClear(false);
      }
    }, [innerValue]);

    const commonProps = useCommonProps({
      prefixCls: 'KuxPicker',
      value: innerValue,
      placeholder: _placeholder,
      ref,
      allowClear,
      onChange: handleChange,
      inFocus,
      picker,
      disabled,
      size,
      theme,
      getPopupContainer: () => dropdownContainer.current,
      ...props,
    });

    return (
      <ContainerWrapper
        onMouseOver={handleShowClear}
        onFocus={handleFocus}
        onBlur={() => setInFocus(false)}
        onMouseLeave={() => {
          setAllowClear(false);
        }}
        width={width}
        className={clsx(_classNames.root, className)}
        style={style}
      >
        <DateWrapper {...commonProps} />
        {label ? (
          <LabelContainer
            theme={theme}
            disabled={disabled}
            isFocus={inFocus}
            error={error}
            size={size}
            shrink={shrink}
            className={labelProps.className}
            style={labelProps.style}
          >
            {label}
          </LabelContainer>
        ) : null}

        <LabelFieldSet theme={theme} error={error} isFocus={inFocus}>
          <LabelLegend shrink={shrink} size={size} label={label}>
            {label}
          </LabelLegend>
        </LabelFieldSet>
        <Portal>
          <div
            ref={dropdownContainer}
            className={clsx('KuxDatePicker-Dropdown', popupClassName, dropdownClassName, {
              'KuxDatePicker-Dropdown-time': picker === 'time',
            })}
          />
        </Portal>
      </ContainerWrapper>
    );
  },
);

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  disabled: PropTypes.bool, // disabled input
  format: PropTypes.string, // format date
  error: PropTypes.bool, // error status
  defaultValue: PropTypes.object, // a moment instance
  value: PropTypes.object, // a moment instance
  placeholder: PropTypes.string, // input placeholder
  label: PropTypes.string, // set input label
  labelProps: PropTypes.object, // label props
  width: PropTypes.number, // input width
  onChange: PropTypes.func, // on date change
  onSelect: PropTypes.func, // on select date
  disabledDate: PropTypes.func, // provider all days and return true with some condition to disable it
  picker: PropTypes.oneOf(['time', 'date', 'week', 'month', 'year']), // the kind of panel
  allowClear: PropTypes.bool, // allow clear input
  direction: PropTypes.oneOf(['ltr', 'rtl']), // support RTL
  showToday: PropTypes.bool,
  popupClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
};

DatePicker.defaultProps = {
  size: 'medium',
  disabled: false,
  format: 'DD/MM/YYYY',
  error: false,
  defaultValue: undefined,
  width: undefined,
  labelProps: {
    shrink: true,
  },
  placeholder: '',
  label: '',
  picker: 'date',
  allowClear: true,
  direction: 'ltr',
  showToday: false,
};

export default DatePicker;
// 参考 rc-picker 4.3.0 API
