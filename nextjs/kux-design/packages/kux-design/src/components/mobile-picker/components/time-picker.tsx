import React, { useCallback, useRef } from 'react';
import Picker from 'rmc-picker';
import MultiPicker from 'rmc-picker/es/MultiPicker';
import moment from 'moment';
import { TimePickerProps } from '../types';
import { useMergedState } from '@/hooks/useMergedState';
import { formatPad } from '../utils/date-utils';
import { timeColumns, handleTimeValue, handleTimeChange } from '../utils/picker-utils';
import InputContainer from './input-container';
import MobileDrawer from './mobile-drawer';

interface InnerPickerProps {
  onChange: (date: moment.Moment) => void;
  value?: moment.Moment;
  defaultValue?: moment.Moment;
  format?: string;
}

const InnerPicker: React.FC<InnerPickerProps> = ({
  onChange,
  value,
  defaultValue,
  format,
  ...restProps
}) => {
  const [innerValue, setInnerValue] = useMergedState<moment.Moment>(defaultValue || moment(), {
    value,
  });

  const handleValue = (date: moment.Moment) => {
    return handleTimeValue(date);
  };

  const handleChange = (dateArray: number[]) => {
    const newDate = handleTimeChange(dateArray);
    setInnerValue(newDate);
    onChange(newDate);
  };

  return (
    <MultiPicker
      {...restProps}
      selectedValue={handleValue(innerValue)}
      onValueChange={handleChange}
      className="kux-mobile-picker__time-picker"
    >
      {timeColumns.map((column, idx) => (
        <Picker key={idx}>
          {column.map((item, index) => (
            <Picker.Item value={item} key={index}>
              {formatPad(item)}
            </Picker.Item>
          ))}
        </Picker>
      ))}
    </MultiPicker>
  );
};

const MobileTimePicker: React.FC<TimePickerProps> = ({
  value,
  defaultValue = moment(),
  title = 'Select Time',
  show = false,
  onClose = () => {},
  onCancel = () => {},
  onOk = () => {},
  onChange = () => {},
  onValueChange = () => {},
  format = 'HH:mm:ss',
  cancelText = 'Reset',
  okText = 'Confirm',
  className,
  style,
  drawerProps = {},
  ...restProps
}) => {
  const inputRef = useRef<{ setInputValue: (value: any) => void }>(null);
  const [innerValue, setInnerValue] = useMergedState<moment.Moment>(defaultValue, {
    value,
  });

  const changeValue = useCallback(
    (date: moment.Moment) => {
      setInnerValue(date);
      onChange(date);
      onValueChange(date);
      if (inputRef.current) {
        inputRef.current.setInputValue(date);
      }
    },
    [onChange, onValueChange, setInnerValue],
  );

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
      <InnerPicker
        onChange={changeValue}
        value={innerValue}
        defaultValue={defaultValue}
        format={format}
        {...restProps}
      />
    </MobileDrawer>
  );
};

MobileTimePicker.displayName = 'MobileTimePicker';

export default MobileTimePicker;
