/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';

import { InputNumber, Box, Button } from '@kux/mui';

import Wrapper from './wrapper';

const Doc = () => {
  const [size, setSize] = useState('xlarge');

  return (
    <Box mt={96}>
      <Button onClick={() => setSize('small')}>small</Button>
      <Button onClick={() => setSize('medium')}>medium</Button>
      <Button onClick={() => setSize('large')}>large</Button>
      <Button onClick={() => setSize('xlarge')}>xlarge</Button>

      <div style={{ marginTop: 20 }}>
        <InputNumber
          min={0}
          max={2}
          variant="filled"
          size={size}
          autoFixPrecision={false}
          precision={3}
          controlExpand={true}
          placeholder="Amount(BTC)"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <InputNumber
          unit="BTC"
          size={size}
          autoFixPrecision={false}
          precision={3}
          controlExpand={false}
          placeholder="Amount(BTC)"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <InputNumber
          size={size}
          autoFixPrecision={false}
          precision={3}
          controls={false}
          placeholder="Amount(BTC)"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <InputNumber
          variant="filled"
          size={size}
          autoFixPrecision={false}
          precision={3}
          controlExpand={true}
          placeholder="Variant Filled"
        />
      </div>
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
