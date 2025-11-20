/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useRef, useState } from 'react';
import { Input as VaexInput, Select, Box, useTheme, TextArea } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import _ from 'lodash';
import { styled } from '@kux/mui/lib/emotion';
import Wrapper from './wrapper';

const Input = styled(VaexInput)`
  margin-top: 10px;
`;

const addBefore = (
  <Select
    noStyle
    style={{
      width: '100px',
    }}
    options={[
      {
        value: 1,
        label: '选项1',
      },
      {
        value: 2,
        label: '选项2',
      },
    ]}
  />
);

const Doc = () => {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const ref = useRef(null);
  const theme = useTheme();
  return (
    <>
      <div style={{ marginTop: 100 }}>
        <Input
          label="Label Name"
          allowSearch
          placeholder="Search Coin"
          prefix={<ICSearchOutlined color={theme.colors.icon40} />}
          size="xlarge"
        />
      </div>
      <h2>No Label</h2>
      <Input
        allowClear
        placeholder="No Label 请输入"
        value={v2}
        onChange={(e) => {
          setV2(e.target.value);
        }}
        // addonBefore={addBefore}
        // addonAfter={<span>Action</span>}
        // prefix={<ICSearchOutlined size="16" />}
        suffix="Suffix"
        size="xlarge"
        variant={'filled'}
      />
      <h2>Label Bg</h2>
      {/* <Box width={340}>
        <TextArea
          placeholder="请输入"
          label="Label Name"
          // value="TD8Vh4RkiuLwHZJNqAHZebLr36TD8Vh4RkiuLwHZJNqAHZebLr36"
          addonAfter={
            <span style={{ color: '#32BB5E', fontWeight: 500, cursor: 'pointer' }}>粘贴</span>
          }
        />
      </Box>
      <h2>Multi Lines</h2>
      <Box width={340}>
        <TextArea
          placeholder="请输入"
          label="Label Name"
          // value="TD8Vh4RkiuLwHZJNqAHZebLr36TD8Vh4RkiuLwHZJNqAHZebLr36"
          addonAfter={
            <span style={{ color: '#32BB5E', fontWeight: 500, cursor: 'pointer' }}>粘贴</span>
          }
          allowClear
          // minRows={1}
          maxRows={3}
        />
      </Box> */}
      <h2>addonAfter</h2>
      <Input
        placeholder="请输入"
        value={v2}
        onChange={(e) => {
          setV2(e.target.value);
        }}
        addonBefore={addBefore}
        addonAfter={<span>Action</span>}
        prefix={<ICSearchOutlined size="16" color={theme.colors.icon40} />}
        suffix="Suffix"
        size="xlarge"
        label="Label Name"
        allowClear
      />
      <h2>基础使用</h2>
      <Input placeholder="Please enter password." size="xlarge" label="Label" />
      <Input placeholder="Please enter password." size="xlarge" label="Label Name" />
      <h2>禁用</h2>
      <Input placeholder="Please enter password." size="xlarge" label="Label Password" disabled />
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        defaultValue="Default Value"
        disabled
      />

      <br />
      <h2>Size</h2>
      <div style={{ margin: '20px 0' }}>Size: xsmall</div>
      <div style={{ width: 160 }}>
        <Input allowClear placeholder="Search" size="xsmall" label="Label Name" />
        <Input allowClear placeholder="Search" size="xsmall" />
      </div>
      <div style={{ margin: '20px 0' }}>Size: small</div>
      <Input placeholder="This is a small size." size="small" label="Label Name" />
      <Input placeholder="This is a small size." size="small" label="Label Password" />
      <div style={{ margin: '20px 0' }}>Size: medium</div>
      <Input placeholder="This is a medium size." size="medium" label="Label Name" />
      <Input placeholder="This is a medium size." size="medium" label="Label Password" />
      <div style={{ margin: '20px 0' }}>Size: large</div>
      <Input placeholder="Please enter name." size="large" label="Email" />
      <Input
        type="password"
        placeholder="Please enter password."
        size="large"
        label="Login Password"
        defaultValue="Default Value"
      />

      <div style={{ margin: '20px 0' }}>Size: xlarge</div>
      <Input allowClear placeholder="Please enter name." size="xlarge" label="Label Name" />
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        defaultValue="Default Value"
        allowClear
      />

      <h2>Error Status</h2>
      <Input placeholder="Please enter name." size="xlarge" label="Label Name" error />
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        error
        defaultValue="Default Value"
      />

      <h2>Label Animation Off</h2>
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        labelProps={{ shrink: true }}
      />
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        labelProps={{ shrink: true }}
        defaultValue="Default Value"
      />

      <h2>Password</h2>
      <Input
        height="60px"
        type="password"
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        labelProps={{ shrink: true }}
      />
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <>
        <Doc />
      </>
    </Wrapper>
  );
};
