/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Avatar, Box } from '@kux/mui';
import { ICTradeOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const AvatarDoc = () => {
  return (
    <Box style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar size="small">St</Avatar>
      <Avatar size="basic">St</Avatar>
      <Avatar size="middle">St</Avatar>
      <Avatar size="large">St</Avatar>
      <Avatar size="large">
        <ICTradeOutlined size={36} />
      </Avatar>
      <Avatar size="large" src="https://t7.baidu.com/it/u=1723468391,764687099&fm=193&f=GIF" />
      <Avatar size="xlarge">St</Avatar>
      <Avatar size={60}>St</Avatar>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <AvatarDoc />
    </Wrapper>
  );
};
