import React from 'react';
import styled from '@emotion/native';

export const ArrowRightIcon = styled.Image`
  height: 16px;
  width: 16px;
  margin-right: 4px;
`;

export const Icon = () => {
  return <ArrowRightIcon source={require('./img/fast.png')} />;
};
export const IconBlack = () => {
  return <ArrowRightIcon source={require('./img/fastblack.png')} />;
};
