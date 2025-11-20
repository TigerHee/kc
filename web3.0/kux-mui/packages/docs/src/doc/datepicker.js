/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import { DatePicker, Row, Col, Divider, Select } from '@kux/mui';
import { styled } from '@kux/mui/lib/emotion';
import moment from 'moment';
// import en_US from '@kux/mui/lib/config/locale/picker/ar_AE';
import Wrapper from './wrapper';

const WrapperDatePicker = styled.div`
  position: relative;
  .MUI-DatePicker-Dropdown {
    top: -300px !important;
    left: 0 !important;
  }
`;

const DatePickerDoc = () => {
  const [value, setValue] = useState(moment());
  const [open, setOpen] = useState(false);
  const pickerRef = useRef({});

  const onSelect = (newValue) => {
    console.log('Select:', moment(newValue).format('YYYY-MM-DD HH:mm:ss'));
  };

  const onChange = (newValue) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const handleOpen = (v) => {
    if (v === 3) {
      setOpen(true);
    }
  };

  const month = moment().get('month');

  const commonProps = {
    onSelect,
    onChange,
    placeholder: 'DD/MM/YYYY',
    value: moment('2017/08/03'),
    label: 'With Label',
    // defaultValue: moment('2022-02-09'),
    allowClear: true,
    disabled: false,
    disabledDate: (date) => {
      if (month + 1 === moment(date).get('month') && moment(date).get('date') < 6) {
        return true;
      }
    },
  };

  return (
    <>
      <h3>不同尺寸(size)</h3>
      <Divider />
      <Row>
        <Col>
          <p>small:</p>
          <DatePicker
            width={300}
            label={'这是一个测试small'}
            size="small"
            value={value}
            onChange={setValue}
            popupClassName="_custom_popupClassName_0"
            dropdownClassName="_custom_popupClassName_0"
            disabledDate={(date) => {
              if (moment(date).get('date') < 20) {
                return true;
              }
            }}
          />

          <br />
          <DatePicker
            label={'DatePicker'}
            size="medium"
            width={300}
            picker="time"
            format="HH:mm:ss"
            placeholder="HH:mm:ss"
            allowClear
            onChange={(time) => console.log('time:', time)}
            popupClassName="_custom_popupClassName_1"
            dropdownClassName="_custom_popupClassName_1"
            labelProps={{ shrink: false }}
          />
          <br />
          <DatePicker
            label={'这是一个测'}
            size="large"
            width={300}
            picker="time"
            format="HH:mm:ss"
            placeholder="HH:mm:ss"
            allowClear
            onChange={(time) => console.log('time:', time)}
            popupClassName="_custom_popupClassName_2"
            dropdownClassName="_custom_popupClassName_2"
            labelProps={{ shrink: false }}
          />
          <br />
          <DatePicker
            label={'这是一个测试xlarge测试'}
            size="xlarge"
            width={300}
            picker="time"
            format="HH:mm:ss"
            placeholder="HH:mm:ss"
            allowClear
            defaultValue={moment()}
            onChange={(time) => console.log('time:', time)}
            popupClassName="_custom_popupClassName_3"
            dropdownClassName="_custom_popupClassName_3"
          />
        </Col>
        {/*<Col>*/}
        {/*  <p>medium:</p>*/}
        {/*  <DatePicker {...commonProps} size="medium" />*/}
        {/*</Col>*/}
        {/*<Col>*/}
        {/*  <p>large:</p>*/}
        {/*  <DatePicker {...commonProps} size="large" />*/}
        {/*</Col>*/}
        {/*<Col>*/}
        {/*  <p>xlarge:</p>*/}
        {/*  <DatePicker {...commonProps} size="xlarge" />*/}
        {/*</Col>*/}
      </Row>

      {/*<h3>showTime</h3>*/}
      {/*<Divider />*/}
      {/*<Row gutter={200}>*/}
      {/*  <Col>*/}
      {/*    <DatePicker {...commonProps} showTime />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<h3>禁用</h3>*/}
      {/*<Divider />*/}
      {/*<Row gutter={200}>*/}
      {/*  <Col>*/}
      {/*    <DatePicker {...commonProps} disabled />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<h3>allowClear</h3>*/}
      {/*<Divider />*/}
      {/*<Row gutter={200}>*/}
      {/*  <Col>*/}
      {/*    <DatePicker {...commonProps} allowClear />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<h3>不同选择模式(picker)</h3>*/}
      {/*<Divider />*/}
      {/*<Row gutter={200}>*/}
      {/*  <Col>*/}
      {/*    <p>year:</p>*/}
      {/*    <DatePicker {...commonProps} picker="year" placeholder="Select Year" />*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    <p>month:</p>*/}
      {/*    <DatePicker {...commonProps} picker="month" placeholder="Select Month" />*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    <p>time:</p>*/}
      {/*    <DatePicker {...commonProps} picker="time" placeholder="Select Time" />*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    <p>quarter:</p>*/}
      {/*    <DatePicker {...commonProps} picker="quarter" placeholder="Select Quarter" />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<h3>自定义格式(format)</h3>*/}
      {/*<Divider />*/}
      {/*<Row gutter={200}>*/}
      {/*  <Col>*/}
      {/*    <p>YYYY-MM-DD:</p>*/}
      {/*    <DatePicker {...commonProps} format="YYYY-MM-DD" />*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    <p>YY-MM-DD:</p>*/}
      {/*    <DatePicker {...commonProps} format="YY-MM-DD" />*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      {/*<WrapperDatePicker ref={pickerRef} style={{ position: 'relative' }}>*/}
      {/*  <p>Picker Panel</p>*/}
      {/*  <Select*/}
      {/*    options={[*/}
      {/*      { label: '选项1', value: 1, title: '选项1', disabled: true },*/}
      {/*      { label: '选项2', value: 2, title: '选项2' },*/}
      {/*      { label: '选项3', value: 3, title: '选项3' },*/}
      {/*    ]}*/}
      {/*    onChange={handleOpen}*/}
      {/*  />*/}
      {/*  <div style={{ position: 'absolute', right: -1000 }}>*/}
      {/*    <DatePicker*/}
      {/*      {...commonProps}*/}
      {/*      open={open}*/}
      {/*      format="YY-MM-DD"*/}
      {/*      onChange={() => setOpen(false)}*/}
      {/*      getPopupContainer={() => pickerRef.current}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</WrapperDatePicker>*/}
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <DatePickerDoc />
    </Wrapper>
  );
};
