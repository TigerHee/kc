/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import CountDown from './CountDown';
import {
  MultiWrapper,
} from './style';

const Multi = (props) => {
  return (
    <MultiWrapper>
      <CountDown {...props} />
    </MultiWrapper>
  );
};
export default Multi;
