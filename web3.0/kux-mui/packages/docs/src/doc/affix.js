/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Affix, Button } from '@kux/mui';
import Wrapper from './wrapper';

const Doc = () => {
  return (
    <div style={{ height: '10000px' }}>
      <div style={{ marginTop: '400px' }}>
        <Affix
          offsetTop={200}
          onChange={(status) => {
            console.log(status, 'status');
          }}
        >
          <Button>2323</Button>
        </Affix>
      </div>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
