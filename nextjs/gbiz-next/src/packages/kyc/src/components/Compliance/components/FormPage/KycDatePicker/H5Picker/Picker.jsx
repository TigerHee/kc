/**
 * Owner: tiger@kupotech.com
 */
/* eslint-disable no-restricted-imports */
import React, { useImperativeHandle, useMemo, useRef, useState, useEffect } from 'react';
import DatePicker from 'rmc-date-picker';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTheme } from '@kux/mui';
import { DateWrapper, InputLine, InputLineContent, Footer } from './kux';

const formatPad = (time) => String(time).padStart(2, '0');

const InputContainer = React.forwardRef(({ theme, value, defaultValue, format }, ref) => {
  const [innerValue, setInnerValue] = useState(defaultValue);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const date = useMemo(() => {
    return moment(innerValue).format(format);
  }, [format, innerValue]);

  useImperativeHandle(ref, () => {
    return {
      setInputValue: setInnerValue,
    };
  });

  return (
    <InputLine className="KuxMDatePicker-input">
      <InputLineContent theme={theme} active className="KuxMDatePicker-inputInner">
        {date}
      </InputLineContent>
    </InputLine>
  );
});

const MDatePicker = React.forwardRef(
  (
    {
      value,
      defaultValue,
      title,
      show,
      onClose,
      drawerProps,
      cancelButtonProps,
      okButtonProps,
      footerProps,
      onCancel,
      onOk,
      okText,
      cancelText,
      format,
      onChange,
      minDate,
      maxDate,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const inputRef = useRef(null);

    const changeValue = (date) => {
      onChange(moment(date));
      if (inputRef.current) {
        inputRef.current.setInputValue(date);
      }
    };

    return (
      <>
        <DateWrapper
          title={title}
          show={show}
          anchor="bottom"
          onClose={onClose}
          ref={ref}
          back={false}
          headerBorder={false}
          {...drawerProps}
        >
          <InputContainer
            theme={theme}
            format={format}
            value={value}
            defaultValue={defaultValue}
            ref={inputRef}
          />
          <DatePicker
            className="KuxMDatePicker"
            {...(value && { date: moment(value).toDate() })}
            {...(defaultValue && { defaultDate: moment(defaultValue).toDate() })}
            {...(minDate && { minDate: moment(minDate).toDate() })}
            {...(maxDate && { maxDate: moment(maxDate).toDate() })}
            onDateChange={changeValue}
            formatMonth={(m) => formatPad(m + 1)}
            formatDay={formatPad}
            {...restProps}
          />
          <Footer
            border={false}
            centeredButton
            cancelButtonProps={{
              size: 'basic',
              variant: 'contained',
              ...cancelButtonProps,
            }}
            okButtonProps={{
              size: 'basic',
              ...okButtonProps,
            }}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            cancelText={cancelText}
            theme={theme}
            {...footerProps}
          />
        </DateWrapper>
      </>
    );
  },
);

MDatePicker.displayName = 'MDatePicker';

MDatePicker.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  value: PropTypes.object,
  onOk: PropTypes.func,
  title: PropTypes.node,
  format: PropTypes.string,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  cancelButtonProps: PropTypes.object,
  okButtonProps: PropTypes.object,
  footerProps: PropTypes.object,
  drawerProps: PropTypes.object,
  mode: PropTypes.oneOf(['date']), // currently only allowed date
  use24Hours: PropTypes.bool,
  use12Hours: PropTypes.bool,
};

MDatePicker.defaultProps = {
  show: false,
  defaultValue: moment(),
  onClose: () => {},
  onCancel: () => {},
  onOk: () => {},
  onChange: () => {},
  title: 'Select date',
  format: 'YYYY/MM/DD',
  cancelText: 'Reset',
  okText: 'Confirm',
  cancelButtonProps: {},
  okButtonProps: {},
  footerProps: {},
  drawerProps: {},
  mode: 'date',
  use24Hours: true,
  use12Hours: false,
};

export default MDatePicker;
