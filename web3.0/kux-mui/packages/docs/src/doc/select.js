/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Select as VaexSelect, Radio } from '@kux/mui';
import { styled } from '@kux/mui/lib/emotion';
import { ICArrowUpOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const Select = styled(VaexSelect)`
  margin-top: 10px;
  :global {
    .dropdownContainer {
      width: 100px;
    }
  }
`;

export default () => {
  const [val1, setVal1] = useState('');
  const [size, setSize] = useState('xlarge');

  return (
    <Wrapper>
      <div style={{ width: '100%', height: '100%', minHeight: '100vh' }}>
        <Radio.Group onChange={(e) => setSize(e.target.value)} value={size}>
          <Radio value="small">Small</Radio>
          <Radio value="medium">Medium</Radio>
          <Radio value="large">Large</Radio>
          <Radio value="xlarge">Xlarge</Radio>
        </Radio.Group>
        <div>
          <h2>基础用法</h2>
          <Select
            loading={true}
            label="Label Search"
            allowSearch
            searchIcon={false}
            emptyContent
            searchPlaceholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />
          <Select
            label="With Label"
            allowSearch
            allowClear
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              {
                label: () => {
                  return <div>ABCDEF</div>;
                },
                value: 2,
                title: '选项2',
              },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />
          <Select
            allowSearch
            allowClear
            emptyContent
            placeholder="Icon No Label Search"
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            error={true}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />
          <Select
            allowClear
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
            label="Old Name"
          />

          <Select
            label="Label NoSearch"
            allowClear
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />

          <Select
            label="Shrink Label"
            labelProps={{ shrink: true }}
            allowClear={false}
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />

          <Select
            label="No Dropdown Icon"
            labelProps={{ shrink: true }}
            dropdownIcon={<ICArrowUpOutlined size={16} />}
            //            allowClear
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项111111111111111这是一个测试Label1', value: 1, title: '选项1', disabled: true },
              { label: '选项111111111111112这是一个测试Label2', value: 2, title: '选项2' },
              { label: '选项111111111111111这是一个测试Label3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
          />

          <Select
            allowClear
            label="Disabled"
            labelProps={{ shrink: true }}
            emptyContent
            placeholder="This is a search placeholder."
            size={size}
            options={[
              { label: '选项1', value: 1, title: '选项1', disabled: true },
              { label: '选项2', value: 2, title: '选项2' },
              { label: '选项3', value: 3, title: '选项3' },
            ]}
            value={val1}
            onChange={setVal1}
            onFocus={() => {
              console.log('onFocus');
            }}
            onBlur={() => {
              console.log('onBlur');
            }}
            disabled={true}
          />

          <div>
            <Select
              noStyle
              defaultValue={1}
              matchWidth={false}
              options={[
                { label: '选项1', value: 1, title: '选项1', disabled: true },
                { label: '选项2选项2', value: 2, title: '选项2选项2' },
                { label: '选项3选项3选项3', value: 3, title: '选项3选项3选项3' },
              ]}
              classNames={{
                dropdownContainer: '_custom_dropdownContainer_',
              }}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
