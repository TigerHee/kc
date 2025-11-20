/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui';

export const Pages = styled.div`
  position: relative;
  height: 100%;
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export const LayoutBox = styled.div`
  padding: 0 24px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 12px;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: auto;
  //overflow: hidden;
`;
