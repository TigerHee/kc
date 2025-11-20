import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import DatePicker from 'rmc-date-picker';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import moment from 'moment';
import { formatPad } from 'utils/dateUtils';
import { ICArrowRight2Outlined } from '@kux/icons';
import map from 'lodash-es/map';
import { extraActionMap } from 'config/dateConfig';
import { DateWrapper, Footer, InputLine, Input, ArrowWrapper } from './kux';
import ExtraHeader from './ExtraHeader';

const InputContainer = React.forwardRef(
  ({ theme, value, format, currentInput, onInputChange }, ref) => {
    const [innerValue, setInnerValue] = useState(value);

    useEffect(() => {
      setInnerValue(value);
    }, [value]);

    const date = useMemo(() => {
      return map(innerValue, (currentValue) => moment(currentValue).format(format));
    }, [format, innerValue]);

    useImperativeHandle(ref, () => {
      return {
        setInputValue: setInnerValue,
      };
    });

    return (
      <InputLine className="KuxMRangePicker-input">
        <Input
          theme={theme}
          active={currentInput === 0}
          className="KuxMRangePicker-inputInner"
          onClick={() => onInputChange(0)}
        >
          {date[0]}
        </Input>
        <ArrowWrapper>
          <ICArrowRight2Outlined size={16} color={theme.colors.icon60} />
        </ArrowWrapper>
        <Input
          theme={theme}
          active={currentInput === 1}
          className="KuxMRangePicker-inputInner"
          onClick={() => onInputChange(1)}
        >
          {date[1]}
        </Input>
      </InputLine>
    );
  },
);

const sortDate = (dateArray) => {
  if (!dateArray.length || dateArray.length !== 2) return dateArray;
  const _dateArray = [...dateArray];
  return _dateArray.sort((a, b) => a.valueOf() - b.valueOf());
};

const MRangePicker = React.forwardRef(
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
      renderExtraHeader,
      minDate,
      maxDate,
      ...restProps
    },
    ref,
  ) => {
    const theme = useTheme();
    const inputRef = useRef(null);
    const [currentInput, setCurrentInput] = useState(0);
    const [innerValue, setInnerValue] = useState(defaultValue);

    useEffect(() => {
      if (value !== undefined) {
        setInnerValue(sortDate(value));
      }
    }, [value]);

    const changeValue = (date) => {
      const fullDate = [...innerValue];
      fullDate[currentInput] = moment(date);
      const sortedDate = sortDate(fullDate);
      setInnerValue(sortedDate);
      if (inputRef.current) {
        inputRef.current.setInputValue(sortedDate);
      }
    };

    const handleChangeExtra = (date) => {
      const sortedDate = sortDate(date);
      setInnerValue(sortedDate);
      onChange(sortedDate);
      if (inputRef.current) {
        inputRef.current.setInputValue(sortedDate);
      }
      onClose && onClose();
    };

    const handleOnOk = async () => {
      if (onOk) {
        await onOk();
      }
      onChange(innerValue);
    };

    const getDate = (date) => {
      return moment(date[currentInput]).toDate();
    };

    const getMinLimit = () => {
      return minDate[currentInput] ? getDate(minDate) : moment('1900/01/01 00:00:00').toDate();
    };

    const getMaxLimit = () => {
      return maxDate[currentInput] ? getDate(maxDate) : moment('2199/01/01 00:00:00').toDate();
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
        <ExtraHeader
          renderExtraHeader={renderExtraHeader}
          onChange={handleChangeExtra}
          format={format}
        />
        <InputContainer
          theme={theme}
          format={format}
          value={innerValue}
          currentInput={currentInput}
          onInputChange={setCurrentInput}
          ref={inputRef}
        />
        <DatePicker
          className="KuxMRangePicker"
          date={getDate(innerValue)}
          onDateChange={changeValue}
          formatMonth={(m) => formatPad(m + 1)}
          formatDay={formatPad}
          minDate={getMinLimit()}
          maxDate={getMaxLimit()}
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
          onOk={handleOnOk}
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

MRangePicker.displayName = 'MRangePicker';

MRangePicker.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.array,
  value: PropTypes.array,
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
  renderExtraHeader: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  minDate: PropTypes.array,
  maxDate: PropTypes.array,
};

MRangePicker.defaultProps = {
  show: false,
  defaultValue: [moment(), moment()],
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
  renderExtraHeader: extraActionMap,
  minDate: [],
  maxDate: [],
};

MRangePicker.extraActionMap = extraActionMap;

export default MRangePicker;
