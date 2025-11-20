import React, { useCallback, useRef, useState, useEffect } from 'react';
import DatePicker from 'rmc-date-picker';
import moment, { Moment } from 'moment';
import { ExtraHeaderItem, RangePickerProps } from '../types';
import { formatPad, sortDate } from '../utils/date-utils';
import InputContainer from './input-container';
import ExtraHeader from './extra-header';
import MobileDrawer from './mobile-drawer';
import { extraActionMap } from '@/config';

const MobileRangePicker: React.FC<RangePickerProps> = ({
  value,
  defaultValue = [moment(), moment()],
  title = 'Select date',
  show = false,
  onClose = () => {},
  onCancel = () => {},
  onOk = () => {},
  onChange = () => {},
  format = 'YYYY/MM/DD',
  cancelText = 'Reset',
  okText = 'Confirm',
  className,
  style,
  drawerProps = {},
  renderExtraHeader = extraActionMap as ExtraHeaderItem[],
  use12Hours = false,
  minDate = [],
  maxDate = [],
  ...restProps
}) => {
  const inputRef = useRef<{ setInputValue: (value: any) => void }>(null);
  const [currentInput, setCurrentInput] = useState(0);
  const [innerValue, setInnerValue] = useState<[moment.Moment, moment.Moment]>(defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(sortDate(value) as [moment.Moment, moment.Moment]);
    }
  }, [value, setInnerValue]);

  const changeValue = useCallback(
    (date: Date) => {
      const fullDate = [...innerValue];
      fullDate[currentInput] = moment(date);
      const sortedDate = sortDate(fullDate) as [moment.Moment, moment.Moment];
      setInnerValue(sortedDate);
      if (inputRef.current) {
        inputRef.current.setInputValue(sortedDate);
      }
    },
    [innerValue, currentInput, setInnerValue],
  );

  const handleChangeExtra = useCallback(
    (date: [moment.Moment, moment.Moment]) => {
      const sortedDate = sortDate(date) as [moment.Moment, moment.Moment];
      setInnerValue(sortedDate);
      onChange(sortedDate);
      if (inputRef.current) {
        inputRef.current.setInputValue(sortedDate);
      }
      onClose && onClose();
    },
    [onChange, onClose, setInnerValue],
  );

  const handleOnOk = useCallback(() => {
    if (onOk) {
      onOk(innerValue);
    }
    onChange(innerValue);
  }, [onOk, onChange, innerValue]);

  const getDate = (date: Moment[]) => {
    return moment(date[currentInput]).toDate();
  };

  const getMinLimit = () => {
    const currentDate = minDate[currentInput];
    if (!currentDate) return moment('1900/01/01 00:00:00').toDate();
    return getDate(minDate);
  };

  const getMaxLimit = () => {
    const currentDate = maxDate[currentInput];
    if (!currentDate) return moment('2199/01/01 00:00:00').toDate();
    return getDate(maxDate);
  };

  return (
    <MobileDrawer
      show={show}
      onClose={onClose}
      title={title}
      onOk={handleOnOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      className={className}
      style={style}
      {...drawerProps}
    >
      <ExtraHeader
        renderExtraHeader={renderExtraHeader}
        onChange={handleChangeExtra}
        format={format}
      />
      <InputContainer
        value={innerValue}
        defaultValue={defaultValue}
        format={format}
        currentInput={currentInput}
        onInputChange={setCurrentInput}
        ref={inputRef}
      />
      <DatePicker
        className="kux-mobile-picker__range-picker"
        date={getDate(innerValue)}
        onDateChange={changeValue}
        formatMonth={(m) => formatPad(m + 1)}
        formatDay={formatPad}
        minDate={getMinLimit()}
        maxDate={getMaxLimit()}
        use12Hours={use12Hours}
        {...restProps}
      />
    </MobileDrawer>
  );
};

MobileRangePicker.displayName = 'MobileRangePicker';

export default MobileRangePicker;
