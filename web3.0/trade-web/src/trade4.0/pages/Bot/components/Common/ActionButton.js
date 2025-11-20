/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Button from '@kux/mui/Button';
import { Flex } from '../Widgets';

export default (props) => {
  return (
    <Flex fe mt={32} mb={32}>
      <Button {...props}>{props.children}</Button>
    </Flex>
  );
};
