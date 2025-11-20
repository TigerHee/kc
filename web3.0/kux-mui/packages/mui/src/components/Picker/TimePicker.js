import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Picker from 'rmc-picker';
import MultiPicker from 'rmc-picker/es/MultiPicker';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import map from 'lodash-es/map';
import { fullHours, fullMinutes, fullSeconds, formatPad } from 'utils/dateUtils';
import moment from 'moment';
import { DateWrapper, Footer, InputLine, Input } from './kux';

const columns = [fullHours, fullMinutes, fullSeconds];

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
    <InputLine className="KuxMTimePicker-input">
      <Input theme={theme} active className="KuxMTimePicker-inputInner">
        {date}
      </Input>
    </InputLine>
  );
});

function InnerPicker({ onChange, value, defaultValue, format, ...restProps }) {
  const [innerValue, setInnerValue] = useState(defaultValue);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  const handleValue = (date) => {
    const now = date ? moment(date) : moment();
    return [now.hours(), now.minutes(), now.seconds()];
  };

  const handleChange = (date) => {
    const now = moment();
    now
      .hour(date[0])
      .minute(date[1])
      .second(date[2]);
    setInnerValue(now);
    onChange(now);
  };

  return (
    <MultiPicker
      {...restProps}
      selectedValue={handleValue(innerValue)}
      onValueChange={handleChange}
      className="KuxMTimePicker"
    >
      {map(columns, (column, idx) => (
        <Picker key={idx}>
          {map(column, (item, index) => (
            <Picker.Item value={item} key={index}>
              {formatPad(item)}
            </Picker.Item>
          ))}
        </Picker>
      ))}
    </MultiPicker>
  );
}

const MTimePicker = React.forwardRef(
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
      onChange,
      onValueChange,
      format,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const inputRef = useRef(null);

    const changeValue = (date) => {
      onChange(date);
      if (inputRef.current) {
        inputRef.current.setInputValue(date);
      }
    };

    return (
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
          value={value}
          defaultValue={defaultValue}
          ref={inputRef}
          format={format}
        />
        <InnerPicker
          onChange={changeValue}
          value={value}
          defaultValue={defaultValue}
          format={format}
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
    );
  },
);

MTimePicker.displayName = 'MTimePicker';

MTimePicker.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  value: PropTypes.object,
  onOk: PropTypes.func,
  title: PropTypes.node,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  cancelButtonProps: PropTypes.object,
  okButtonProps: PropTypes.object,
  footerProps: PropTypes.object,
  drawerProps: PropTypes.object,
  format: PropTypes.string,
};

MTimePicker.defaultProps = {
  show: false,
  defaultValue: moment(),
  onClose: () => {},
  onCancel: () => {},
  onOk: () => {},
  onChange: () => {},
  title: 'Select Time',
  cancelText: 'Reset',
  okText: 'Confirm',
  cancelButtonProps: {},
  okButtonProps: {},
  footerProps: {},
  drawerProps: {},
  format: 'HH:mm:ss',
};

export default MTimePicker;
