/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Picker } from '@kux/mui';
import moment from 'moment';
import Wrapper from './wrapper';

export default () => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showRange, setShowRange] = useState(false);
  const [date, setDate] = useState(moment('2017/02/27 15:01:01'));
  const [time, setTime] = useState(moment());
  const [range, setRange] = useState([moment('2017/02/31 15:01:01'), moment()]);

  console.log('time:', moment(range[0]).format('YYYY/MM/DD HH:mm:ss'), moment(range[1]).format('YYYY/MM/DD HH:mm:ss'));
  // console.log('date:', date.format('YYYY/MM/DD'));
  // console.log('time:', time);

  // useEffect(() => {
  //   setInterval(() => {
  //     setRange(v => [moment(v[0].add(1, 'months')), v[1]]);
  //   }, 1500)
  // }, []);

  return (
    <Wrapper>
      {/* <div style={{ width: 375 }}> */}
      {/* <Button onClick={() => setShowRange(true)}>RangePicker</Button> */}
      {/* <MRangePicker
          title="MRangePicker"
          show={showRange}
          onCancel={() => console.log('cancel')}
          onOk={() => console.log('ok')}
          onClose={() => setShowRange(false)}
          onChange={date => console.log(date)}
        />
      </div> */}

      {/* <div style={{ width: 375 }}>
        <Button onClick={() => setShowDate(true)}>DatePicker</Button>
        <MDatePicker
          title="MDatePicker"
          show={showDate}
          onCancel={() => console.log('cancel')}
          onOk={() => console.log('ok')}
          onClose={() => setShowDate(false)}
          onChange={date => console.log(date)}
        />
      </div> */}

      {/* <div style={{ width: 375 }}>
        <Button onClick={() => setShowTime(true)}>TimePicker</Button>
        <MTimePicker
          title="MTimePicker"
          show={showTime}
          onCancel={() => console.log('cancel')}
          onOk={() => console.log('ok')}
          onClose={() => setShowTime(false)}
          onChange={date => console.log(date)}
        />
      </div> */}
      <Button onClick={() => setShowDate(true)}>DatePicker</Button>
      <Button onClick={() => setShowTime(true)}>TimePicker</Button>
      <Button onClick={() => setShowRange(true)}>RangePicker</Button>
      <Picker.DatePicker
        value={date}
        format="YYYY-MM-DD" // YYYY/MM/DD
        defaultValue={moment()}
        cancelText="Reset"
        okText="Confirm"
        show={showDate}
        onClose={() => setShowDate(false)}
        title="DatePicker"
        onOk={() => console.log('on ok event')}
        onCancel={() => console.log('on cancel event')}
        minDate={moment().subtract(10, 'years').subtract(10, 'months')}
        maxDate={moment().add(1, 'years')}
        // minDate={minDate}
        // onDateChange={(date) => console.log('date change:', date)}
        onChange={setDate}
      />
      <Picker.TimePicker
         value={time}
         defaultValue={moment()}
         cancelText="Reset"
         okText="Confirm"
         show={showTime}
         onClose={() => setShowTime(false)}
         title="TimePicker"
         onOk={() => console.log('on ok event')}
         onCancel={() => console.log('on cancel event')}
         onChange={setTime}
      />
      <Picker.RangePicker
         value={range}
         defaultValue={range}
         cancelText="Reset"
         okText="Confirm"
         show={showRange}
         onClose={() => setShowRange(false)}
         title="RangePicker"
         onOk={() => console.log('on ok event')}
         onCancel={() => console.log('on cancel event')}
         onChange={setRange}
         minDate={["2017-01-12", "2050-01-12"]}
         maxDate={["2030-01-12", "2080-01-12"]}
      />
    </Wrapper>
  );
};
