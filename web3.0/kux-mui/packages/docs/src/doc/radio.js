/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Radio, Divider } from '@kux/mui';
import Wrapper from './wrapper';

const RadioGroup = Radio.Group;

const RadioDoc = () => {
  const [value, setValue] = React.useState(1);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <Radio>Option B</Radio>
      <RadioGroup value={value} onChange={handleChange} size="small">
        <Radio disabled value={1}>
          Option A
        </Radio>
        <Radio value={2}>Option B</Radio>
        <Radio value={3}>Option C</Radio>
      </RadioGroup>
      <Divider>--------------</Divider>
      <RadioGroup
        radioType="button"
        options={[
          { label: 'Apple', value: 'Apple' },
          { label: 'Pear', value: 'Pear' },
          { label: 'Orange', value: 'Orange' },
        ]}
      />
      <Divider>--------------</Divider>
      <RadioGroup value={value} onChange={handleChange} size="small">
        <Radio.Button disabled value={1}>
          Option A
        </Radio.Button>
        <Radio.Button value={2}>Option B</Radio.Button>
        <Radio.Button value={3}>Option C</Radio.Button>
      </RadioGroup>
      <Divider>--------------</Divider>
      <RadioGroup value={value} onChange={handleChange} size="middle">
        <Radio.Button value={1}>Option A</Radio.Button>
        <Radio.Button value={2}>Option B</Radio.Button>
        <Radio.Button value={3}>Option C</Radio.Button>
      </RadioGroup>
      <Divider>--------------</Divider>
      <RadioGroup value={value} onChange={handleChange} size="large">
        <Radio.Button value={1}>Option A</Radio.Button>
        <Radio.Button value={2}>Option B</Radio.Button>
        <Radio.Button value={3}>Option C</Radio.Button>
      </RadioGroup>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <RadioDoc />
    </Wrapper>
  );
};
