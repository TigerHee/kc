/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Box, Typography, ModalHeader, ModalFooter } from '@kux/mui';
import Wrapper from './wrapper';

function Demo1() {
  return (
    <Box width="480px">
      <ModalHeader title="Title" border back />
      <Typography variant="h4">
        这是中间分隔内容
      </Typography>
      <ModalFooter />
    </Box>
  );
}

export default () => {
  return (
    <Wrapper>
      <Demo1 />
    </Wrapper>
  );
};
