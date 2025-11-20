import React, { useCallback, useRef, useImperativeHandle } from 'react';
import DatePicker from 'rmc-date-picker';
import moment from 'moment';
import { DatePickerProps } from '../types';
import { useMergedState } from '@/hooks/useMergedState';
import { formatPad } from '../utils/date-utils';
import InputContainer from './input-container';
import MobileDrawer from './mobile-drawer';

const MobileDatePicker = React.forwardRef<{ setInputValue: (value: any) => void }, DatePickerProps>(
  (
    {
      value,
      defaultValue = moment(),
      title = 'Select date',
      show = false,
      onClose = () => {},
      onCancel = () => {},
      onOk = () => {},
      onChange = () => {},
      format = 'YYYY/MM/DD',
      cancelText = 'Reset',
      okText = 'Confirm',
      drawerProps = {},
      minDate,
      maxDate,
      className,
      style,
      ...restProps
    },
    ref,
  ) => {
    const inputRef = useRef<{ setInputValue: (value: any) => void }>(null);
    const [innerValue, setInnerValue] = useMergedState<moment.Moment>(defaultValue, {
      value,
    });

    const changeValue = useCallback((date: Date) => {
      const momentDate = moment(date);
      setInnerValue(momentDate);
      onChange(momentDate);
      if (inputRef.current) {
        inputRef.current.setInputValue(momentDate);
      }
    }, [onChange, setInnerValue]);

    useImperativeHandle(ref, () => {
      return {
        setInputValue: (value: any) => {
          if (inputRef.current) {
            inputRef.current.setInputValue(value);
          }
        },
      };
    }, []);

    return (
      <MobileDrawer
        show={show}
        onClose={onClose}
        title={title}
        onOk={() => onOk(innerValue)}
        onCancel={onCancel}
        okText={okText}
        cancelText={cancelText}
        className={className}
        style={style}
        {...drawerProps}
      >
        <InputContainer
          value={innerValue}
          defaultValue={defaultValue}
          format={format}
          ref={inputRef}
        />
        <DatePicker
          className="kux-mobile-picker__date-picker"
          {...(innerValue && { date: innerValue.toDate() })}
          {...(defaultValue && { defaultDate: defaultValue.toDate() })}
          {...(minDate && { minDate: minDate.toDate() })}
          {...(maxDate && { maxDate: maxDate.toDate() })}
          onDateChange={changeValue}
          formatMonth={(m) => formatPad(m + 1)}
          formatDay={formatPad}
          {...restProps}
        />
      </MobileDrawer>
    );
  }
);

MobileDatePicker.displayName = 'MobileDatePicker';

export default MobileDatePicker; 