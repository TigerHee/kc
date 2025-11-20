/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Box, Empty, Divider, Button, Status } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  const [name, setName] = useState('no-record');
  return (
    <Box>
      <Box>
        <Button onClick={() => setName('network-error')}>network-error</Button>
        <Button onClick={() => setName('no-record')}>no-record</Button>
        <Button onClick={() => setName('suspension-of-trading')}>suspension-of-trading</Button>
        <Button onClick={() => setName('system-busy')}>system-busy</Button>
      </Box>
      <Empty name={name} />
      <Divider />
      <Empty name={name} size="small" />
      <Divider />
      <Status name="success" /> <Status name="loading" /> <Status name="error" /> <Status name="warning" /> <Status name="info" /> <Status name="lock" /> <Status name="safe" />
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
