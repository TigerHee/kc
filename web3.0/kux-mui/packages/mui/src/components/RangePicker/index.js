/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useTheme from 'hooks/useTheme';
import useMergedState from 'hooks/useMergedState';
import Portal from 'components/Portal';
import map from 'lodash-es/map';
import { extraActionMap } from 'config/dateConfig';
import moment from 'moment';
import {
  ContainerWrapper,
  DateWrapper,
  ExtraFooter,
  ExtraItem,
  LabelFieldSet,
  LabelLegend,
  LabelContainer,
} from './kux';
import useCommonProps from './useCommonProps';
import useClassNames from './useClassNames';

function handlePlaceholder(placeholder, label, shrink) {
  if ((label && shrink) || !label) return placeholder;
}

const RangePicker = React.forwardRef(
  (
    {
      defaultValue,
      value,
      onChange,
      disabled,
      placeholder,
      label,
      labelProps,
      error,
      size,
      className,
      style,
      width,
      renderExtraFooter,
      defaultExtraFooterLocale,
      format,
      popupClassName,
      dropdownClassName,
      separator,
      onPanelChange,
      onOpenChange,
      open,
      ...props
    },
    ref,
  ) => {
    const dropdownContainer = useRef(null);
    const theme = useTheme();
    const [innerValue, setInnerValue] = useMergedState(defaultValue, {
      value,
    });
    const [inFocus, setInFocus] = useState(false);
    const [showExtraFooter, setShowExtraFooter] = useState(true);
    const _classNames = useClassNames({ size, disabled, error });
    const [innerOpen, setInnerOpen] = useState(false);

    const shrink = inFocus || !!innerValue || labelProps.shrink;
    const _placeholder = handlePlaceholder(placeholder, label, shrink);
    const _separator = label && !shrink ? null : separator;

    const handleChange = (newValue, formatString) => {
      setInnerValue(newValue);
      onChange?.(newValue, formatString);
    };

    const handleInnerOpenChange = (opened) => {
      setInnerOpen(opened);
      onOpenChange && onOpenChange(opened);
      if (!opened) {
        setShowExtraFooter(true);
      }
    };

    const handleExtraChange = (range) => {
      handleChange(
        range,
        map(range, (ran) => moment(ran).format(format)),
      );
      handleInnerOpenChange(false);
    };

    useEffect(() => {
      setInnerOpen(open);
    }, [open]);

    const commonProps = useCommonProps({
      ...props,
      open: innerOpen,
      separator: _separator,
      placeholder: _placeholder,
      prefixCls: 'KuxPicker',
      format,
      disabled,
      value: innerValue,
      ref,
      onChange: handleChange,
      inFocus,
      theme,
      size,
      onOpenChange: handleInnerOpenChange,
      onPanelChange: (bool, panel) => {
        if (panel[0] !== 'date' || panel[1] !== 'date') {
          setShowExtraFooter(false);
          return;
        }
        setShowExtraFooter(true);
        onPanelChange && onPanelChange(bool, panel);
      },
      getPopupContainer: () => dropdownContainer.current,
      renderExtraFooter: () =>
        renderExtraFooter && showExtraFooter ? (
          React.isValidElement(renderExtraFooter) ? (
            renderExtraFooter
          ) : (
            <ExtraFooter className="KuxExtraFooter">
              {map(renderExtraFooter, (item) => (
                <ExtraItem
                  key={item.code}
                  theme={theme}
                  onClick={() => handleExtraChange(item.range)}
                  className={clsx('KuxExtraFooter-item', { selected: item.selected })}
                >
                  {item.label}
                </ExtraItem>
              ))}
            </ExtraFooter>
          )
        ) : null,
    });

    return (
      <ContainerWrapper
        theme={theme}
        style={style}
        className={clsx(_classNames.root, className)}
        onFocus={() => setInFocus(true)}
        onBlur={() => setInFocus(false)}
        width={width}
        size={size}
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
            className={clsx('KuxRangePicker-Dropdown', popupClassName, dropdownClassName)}
          />
        </Portal>
      </ContainerWrapper>
    );
  },
);

RangePicker.displayName = 'RangePicker';

RangePicker.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  disabled: PropTypes.bool, // disabled input
  format: PropTypes.string, // format date
  error: PropTypes.bool, // error status
  defaultValue: PropTypes.array, // an array of moment instance
  value: PropTypes.array, // an array of moment instance
  placeholder: PropTypes.string, // input placeholder
  label: PropTypes.string, // set input label
  labelProps: PropTypes.object, // label props
  onChange: PropTypes.func, // on date change
  separator: PropTypes.string, // the separator of input
  width: PropTypes.number, // input width
  disabledDate: PropTypes.func, // provider all days and return true with some condition to disable it
  defaultPickerValue: PropTypes.array,
  renderExtraFooter: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  popupClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
};

RangePicker.defaultProps = {
  size: 'medium',
  disabled: false,
  format: 'DD/MM/YYYY',
  error: false,
  defaultValue: undefined,
  separator: '-',
  renderExtraFooter: extraActionMap,
  labelProps: {
    shrink: true,
  },
  label: '',
};

RangePicker.extraActionMap = extraActionMap;

export default RangePicker;

// 参考 rc-picker 4.3.0 API
