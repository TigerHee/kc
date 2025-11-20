/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Typography } from '@kux/mui';
import Wrapper from './wrapper';

function Demo1() {
  return (
    <div>
      <Typography>56px</Typography>
      <Typography variant="h2">48px</Typography>
      <Typography variant="h3">36px</Typography>
      <Typography variant="h4">28px</Typography>
      <Typography variant="h5">24px</Typography>
      <Typography variant="h6">20px</Typography>
      <Typography size="18">18px</Typography>
      <Typography size="16">16px</Typography>
      <Typography size="14">14px</Typography>
      <Typography size="12">12px</Typography>
      <Typography size="10">10px</Typography>
    </div>
  );
}

function TransitionsDoc() {
  return (
    <Wrapper>
      <Demo1 />
    </Wrapper>
  );
}

export default TransitionsDoc;
