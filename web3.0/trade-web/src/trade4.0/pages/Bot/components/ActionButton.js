/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Button } from '@kux/mui';

export default (props) => {
  return (
    <Button {...props} mt={32} mb={32}>
      {props.children}
    </Button>
  );
};
