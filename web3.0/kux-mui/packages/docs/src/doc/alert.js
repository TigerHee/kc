/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Alert, Box } from '@kux/mui';
import Wrapper from './wrapper';

const AlertBox = () => {
  return (
    <Box mt="100px">
      <Alert
        showIcon
        type="info"
        title="Can be used for withdrawals of all coins supported by the network for even easier management."
      />
      <p />
      <Alert
        showIcon
        type="error"
        title="Incorrect password. You have 4 more chances to input the correct password."
      />
      <p />
      <Alert
        showIcon
        type="warning"
        title="Incorrect password. You have 4 more chances to input the correct password."
      />
      <p />
      <Alert
        closable
        showIcon
        type="success"
        title="Can be used for withdrawals of all coins supported by the network for even easier management.Can be used for withdrawals of all coins supported by the network for even easier management.Can be used for withdrawals of all coins supported by the network for even easier management."
      />
      <p />
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <AlertBox />
    </Wrapper>
  );
};
