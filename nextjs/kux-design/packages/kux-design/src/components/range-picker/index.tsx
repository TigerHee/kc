/**
 * Owner: victor.ren@kupotech.com
 *
 * @description RangePicker component
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RangePicker as RcRangePicker } from 'rc-picker';
import { Moment } from 'moment';
import { useCommonProps } from './hooks/use-common-props';
import { useMergedState } from '@/hooks/useMergedState';
import { extraActionMap } from '@/config';
import { RangePickerProps } from './types';
import { getRangePickerClassNames } from './utils/class-names';
import { handlePlaceholder } from './utils/placeholder';
import { renderExtraFooter } from './utils/render-extra-footer';
import { useUpdateEffect } from './hooks/use-update-effect';
import './style.scss';

const RangePicker = React.forwardRef<HTMLDivElement, RangePickerProps>(
  (
    {
      defaultValue,
      value,
      onChange,
      disabled = false,
      placeholder = ['', ''],
      label = '',
      allowClear: propsAllowClear = true,
      labelProps = { shrink: true },
      error = false,
      size = 'medium',
      className,
      style,
      width,
      renderExtraFooter: renderExtraFooterProp = extraActionMap,
      defaultExtraFooterLocale,
      format = 'DD/MM/YYYY',
      popupClassName,
      dropdownClassName,
      separator = '-',
      onPanelChange,
      onOpenChange,
      open,
      defaultPickerValue,
      ...props
    },
    ref,
  ) => {
    const dropdownContainer = useRef<HTMLDivElement>(null);
    const [allowClear, setAllowClear] = useState(false);
    const [innerValue, setInnerValue] = useMergedState<[Moment, Moment] | undefined>(defaultValue, {
      value,
    });
    const [inFocus, setInFocus] = useState(false);
    const [showExtraFooter, setShowExtraFooter] = useState(true);
    const [innerOpen, setInnerOpen] = useState(false);

    const shrink = inFocus || !!innerValue || (labelProps.shrink ?? true);
    const _placeholder = handlePlaceholder(placeholder, label, shrink);
    const _separator = label && !shrink ? null : separator;

    const handleShowClear = useCallback(() => {
      if (propsAllowClear && innerValue) {
        setAllowClear(true);
      }
    }, [propsAllowClear, innerValue]);

    const handleChange = (newValue: [Moment, Moment] | null, formatString: [string, string]) => {
      setInnerValue(newValue || undefined);
      onChange?.(newValue, formatString);
    };

    const handleInnerOpenChange = (opened: boolean) => {
      setInnerOpen(opened);
      onOpenChange?.(opened);
      if (!opened) {
        setShowExtraFooter(true);
      }
    };

    const handleExtraChange = (range: [Moment, Moment]) => {
      handleChange(
        range,
        [range[0].format(format), range[1].format(format)],
      );
      handleInnerOpenChange(false);
    };

    useEffect(() => {
      if (open !== undefined) {
        setInnerOpen(open);
      }
    }, [open]);

    const commonProps = useCommonProps({
      ...props,
      allowClear,
      open: innerOpen,
      separator: _separator || undefined,
      placeholder: _placeholder,
      prefixCls: 'kux-picker',
      format,
      disabled,
      value: innerValue,
      onChange: handleChange as any,
      inFocus,
      size,
      defaultPickerValue,
      onOpenChange: handleInnerOpenChange,
      onPanelChange: (bool, panel) => {
        if (panel[0] !== 'date' || panel[1] !== 'date') {
          setShowExtraFooter(false);
          return;
        }
        setShowExtraFooter(true);
        onPanelChange?.(bool, panel);
      },
      getPopupContainer: () => dropdownContainer.current,
      renderExtraFooter: () => renderExtraFooter({
        renderExtraFooter: renderExtraFooterProp,
        showExtraFooter,
        onExtraChange: handleExtraChange,
      }),
    });

    useUpdateEffect(() => {
      if (!innerValue) {
        setAllowClear(false);
      }
    }, [innerValue]);

    const classNames = getRangePickerClassNames({
      size,
      error,
      disabled,
      inFocus,
      shrink,
      className,
      labelProps,
      popupClassName,
      dropdownClassName,
      allowClear,
    });

    return (
      <div
        ref={ref}
        style={{ width, ...style }}
        className={classNames.container}
        onFocus={() => setInFocus(true)}
        onBlur={() => setInFocus(false)}
        onMouseOver={handleShowClear}
        onMouseLeave={() => {
          setAllowClear(false);
        }}
      >
        <RcRangePicker {...(commonProps as any)} className={classNames.wrapper} />
        
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

RangePicker.displayName = 'RangePicker';

// 添加静态属性
(RangePicker as any).extraActionMap = extraActionMap;

export default RangePicker;
