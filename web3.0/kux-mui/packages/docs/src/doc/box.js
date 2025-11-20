/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Box } from '@kux/mui';
import throttle from 'lodash/throttle'
import Wrapper from './wrapper';

const Doc = () => {
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', throttle(() => {
      setSize(window.innerWidth);
    }, 300))
  }, []);

  return (
    <Box color="#fff" width="100vw" height="300px" background={{ xs: 'gray', sm: 'orange', lg: 'blue', xl: 'yellow' }}>
      {window.innerWidth}
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
