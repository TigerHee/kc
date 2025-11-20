/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useResponsive } from '@kux/mui';
import Wrapper from './wrapper';

function GetData() {
  const rv = useResponsive();
  return JSON.stringify(rv);
}

export default function responsiveHook() {
  return (
    <Wrapper><GetData /></Wrapper>
  )
};