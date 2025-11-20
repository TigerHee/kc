/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useRef, useState } from 'react';
import { Select, Box, debounce, TextArea } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import _ from 'lodash';
import { styled } from '@kux/mui/lib/emotion';
import Wrapper from './wrapper';

const Input = styled(TextArea)`
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
  return (
    <>
      <h2>Multi Lines</h2>
      <Box width={340}>
        <TextArea
          placeholder="请输入"
          label="Label Name"
          // value="TD8Vh4RkiuLwHZJNqAHZebLr36TD8Vh4RkiuLwHZJNqAHZebLr36"
          addonAfter={
            <span style={{ color: '#01BC8D', fontWeight: 500, cursor: 'pointer' }}>粘贴</span>
          }
          allowClear
        />
      </Box>
      <h2>addonAfter</h2>
      <Input
        placeholder="请输入"
        value={v2}
        onChange={(e) => {
          console.log(ref.current);
          setV2(e.target.value);
        }}
        addonBefore={addBefore}
        addonAfter={<span>Action</span>}
        prefix={<ICSearchOutlined size="16" />}
        suffix="Suffix"
        size="xlarge"
        label="Label Name"
        textareaProps={{
          id: "this is a test id for textarea"
        }}
      />
      <h2>基础使用</h2>
      <Input placeholder="Please enter password." size="xlarge" />
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
      <div style={{ margin: '20px 0' }}>Size: small</div>
      <Input placeholder="This is a small size." size="small" label="Label Name" />
      <Input placeholder="This is a small size." size="small" label="Label Password" />
      <div style={{ margin: '20px 0' }}>Size: middle</div>
      <Input placeholder="This is a middle size." size="middle" label="Label Name" />
      <Input placeholder="This is a middle size." size="middle" label="Label Password" />
      <div style={{ margin: '20px 0' }}>Size: large</div>
      <Input placeholder="Please enter name." size="large" label="Label Name" />
      <Input
        placeholder="Please enter password."
        size="large"
        label="Label Password"
        defaultValue="Default Value"
      />

      <div style={{ margin: '20px 0' }}>Size: xlarge</div>
      <Input placeholder="Please enter name." size="xlarge" label="Label Name" />
      <Input
        placeholder="Please enter password."
        size="xlarge"
        label="Label Password"
        defaultValue="Default Value"
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
    </>
  );
};

const Doc2 = ({ delay = 400 }) => {
  const [search, setSearch] = React.useState('');

  const sendReq = React.useCallback(() => {}, [search]);

  const handleInput = (e) => {
    console.log(e, 'handleInput');
    const inputValue = e?.target?.value;
    setSearch(inputValue);
    sendReq(inputValue);
  };

  const debounced = debounce(handleInput, delay);

  return (
    <Box width={200} mt={{ sm: 12, md: 24, lg: 24 }}>
      <Input
        prefix={<ICSearchOutlined size="20" />}
        placeholder={search}
        value={search}
        onChange={debounced}
        size="xlarge"
      />
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <>
        <Doc2 />
        <Doc />
      </>
    </Wrapper>
  );
};
