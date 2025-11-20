/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Spin, Box, Button } from '@kux/mui';
import Wrapper from './wrapper';

const SpinDoc = ({ type }) => {
  return (
    <Spin spinning type={type}>
      <Box width="400px" height="300px">
        Can be used for withdrawals of all coins supported by the network for even easier
        management. Can be used for withdrawals of all coins supported by the network for even
        easier management.Can be used for withdrawals of all coins supported by the network for even
        easier management.Can be used for withdrawals of all coins supported by the network for even
        easier management.
      </Box>
    </Spin>
  );
};

const SpinDoc2 = ({ type }) => {
  return <Spin spinning type={type} />;
};

const SpinDoc3 = ({ type }) => {
  return (
    <Spin spinning size="small" type={type}>
      <Box width="300px" height="200px">
        Can be used for withdrawals of all coins supported by the network for even easier
        management. Can be used for withdrawals of all coins supported by the network for even
        easier management.Can be used for withdrawals of all coins supported by the network for even
        easier management.Can be used for withdrawals of all coins supported by the network for even
        easier management.
      </Box>
    </Spin>
  );
};

const SpinDoc4 = ({ type }) => {
  return <Spin spinning size="small" type={type} />;
};

export default () => {
  const [type, setType] = useState('brand');
  return (
    <Wrapper>
      <Box display="flex" flexDirection="column">
        <Box>
          <Button onClick={() => setType('brand')}>brand</Button>
          <Button onClick={() => setType('normal')}>normal</Button>
        </Box>
        <SpinDoc type={type} />
        <SpinDoc2 type={type} />
        <SpinDoc3 type={type} />
        <SpinDoc4 type={type} />
      </Box>
    </Wrapper>
  );
};
