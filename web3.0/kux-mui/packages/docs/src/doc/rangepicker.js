/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { RangePicker, Select } from '@kux/mui';
import moment from 'moment';
import Wrapper from './wrapper';

const month = moment().get('month');

const RangePickerDoc = () => {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);

  const onSelect = (newValue) => {
    console.log('Select:', newValue);
  };

  const onChange = (newValue, formatString) => {
    console.log('Changes:', formatString);
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const handleOpen = (v) => {
    if (v === 'custom') {
      setOpen(true);
    }
  };

  const commonProps = {
    value,
    onSelect,
    onChange,
    placeholder: ['DD/MM/YYYY', 'DD/MM/YYYY'],
    style: {
      marginBottom: 6,
    },
    // disabled: true,
    allowClear: true,
    disabledDate: (date) => {
      if (month === moment(date).get('month') && moment(date).get('date') < 10) {
        return true;
      }
    },
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: 24 }}>
        <p>Base Picker:</p>
        <div style={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
          <p>common:</p>
          {/* <RangePicker {...commonProps} size="medium" /> */}
          <RangePicker
           disabledDate={(date) => {
            if (moment(date).get('date') < 10) {
              return true;
            }
          }}
           placeholder="YYYY/MM/DD" format="YYYY/MM/DD"  label="Small Picker" size="small" labelProps={{ shrink: false }} value={value} onChange={setValue} popupClassName={"popupClassName"} />
          <br />
          <RangePicker placeholder="YYYY/MM/DD" format="YYYY/MM/DD"  label="Medium Picker" size="medium" labelProps={{ shrink: false }} value={value} onChange={setValue} popupClassName={"popupClassName"} />
          <br />
          <RangePicker placeholder="YYYY/MM/DD" format="YYYY/MM/DD"  label="Large Picker" size="large" labelProps={{ shrink: false }} value={value} onChange={setValue} popupClassName={"popupClassName"} />
          <br />
          <RangePicker label="Xlarge Picker" size="xlarge" placeholder="YYYY/MM/DD" format="YYYY/MM/DD"  labelProps={{ shrink: true }} value={value} onChange={setValue} popupClassName={"popupClassName"} />
          {/*<p>active:</p>*/}
          {/*<RangePicker {...commonProps} value={value} />*/}
          {/*<p>disabled:</p>*/}
          {/*<RangePicker {...commonProps} disabled />*/}
        </div>
      </div>
      {/*<div>*/}
      {/*  <p>Size:</p>*/}
      {/*  <div style={{ display: 'flex', flexDirection: 'column' }}>*/}
      {/*    <p>small:</p>*/}
      {/*    <RangePicker {...commonProps} size="small" />*/}
      {/*    <p>medium:</p>*/}
      {/*    <RangePicker {...commonProps} size="medium" />*/}
      {/*    <p>large:</p>*/}
      {/*    <RangePicker {...commonProps} size="large" />*/}
      {/*    <p>xlarge:</p>*/}
      {/*    <RangePicker {...commonProps} size="xlarge" />*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <RangePickerDoc />
    </Wrapper>
  );
};
