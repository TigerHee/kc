/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Box, Badge, Avatar } from '@kux/mui';
import { ICNotificationOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const BadgeDoc = () => {
  return (
    <Box>
      <Badge count={100} overflowCount={99}>
        <Avatar variant="square">ST</Avatar>
      </Badge>
      <p />
      <Badge count={0} showZero>
        <Avatar variant="square">ST</Avatar>
      </Badge>
      <p />
      <Badge count={9}>
        <Avatar variant="square">ST</Avatar>
      </Badge>
      <p />
      <Badge count={20}>
        <Avatar variant="square">ST</Avatar>
      </Badge>
      <p />
      <Badge dot count={20}>
        <Avatar variant="square">ST</Avatar>
      </Badge>
      <p />
      <Badge dot count={20}>
        <ICNotificationOutlined size={24} />
      </Badge>
      <Badge count={99} status="default">
        <ICNotificationOutlined  size={24} />
      </Badge>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <BadgeDoc />
    </Wrapper>
  );
};
