/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Popconfirm, Box, Button } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  return (
    <Box>
      <Popconfirm
        // title="Are you sure to remove the device?"
        title="您确定要移除此设备吗？"
        placement="bottom"
        okText="确认"
        cancelText="取消"
      >
        <Button>click</Button>
      </Popconfirm>
      <Popconfirm title="hahahahah" placement="top">
        <Button>click</Button>
      </Popconfirm>
      <Popconfirm title="hahahahah" placement="right">
        <Button>click</Button>
      </Popconfirm>
      <Popconfirm title="hahahahah" placement="left">
        <Button>click</Button>
      </Popconfirm>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
