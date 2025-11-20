/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Checkbox, Box } from '@kux/mui';
import Wrapper from './wrapper';

const CheckboxGroup = Checkbox.Group;

const CheckboxDoc = () => {
  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
  ];
  return (
    <Box>
      {/* <Box width={300}>
        <Checkbox
          checked={false}
          indeterminate
        >
          Checkbox
        </Checkbox>
      </Box> */}
      <Box width={300}>
        <Checkbox
          checkOptions={{
            type: 1, // 1黑色 2 灰色
            checkedType: 1 // 1黑色 2 绿色
          }}
        >
          Checkbox
        </Checkbox>
        <Checkbox
          checkOptions={{
            type: 1, // 1黑色 2 灰色
            checkedType: 2 // 1黑色 2 绿色
          }}
        >
          Checkbox
        </Checkbox>
        <Checkbox
          checkOptions={{
            type: 2, // 1黑色 2 灰色
            checkedType: 1 // 1黑色 2 绿色
          }}
        >
          Checkbox
        </Checkbox>
        <Checkbox
          checkOptions={{
            type: 2, // 1黑色 2 灰色
            checkedType: 2 // 1黑色 2 绿色
          }}
        >
          Checkbox
        </Checkbox>
      </Box>
      <Box>
        <CheckboxGroup
          defaultValue={['Pear']}
          options={options}
          size="large"
        />
      </Box>

      <Box width={300}>
        <CheckboxGroup
          defaultValue={['Pear']}
          options={options}
          size="basic"
        />
      </Box>

      <Box width={300}>
        <CheckboxGroup
          defaultValue={['Pear']}
          options={options}
          size="small"
        />
      </Box>

    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <CheckboxDoc />
    </Wrapper>
  );
};
