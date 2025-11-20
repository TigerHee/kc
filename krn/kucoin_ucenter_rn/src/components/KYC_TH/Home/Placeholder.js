import React from 'react';
import styled from '@emotion/native';
import {VerifyBox} from './VerifyArea';

const Avatar = styled.View`
  width: 120px;
  height: 120px;
  background-color: ${({theme}) => theme.colorV2.cover4};
  border-radius: 8px;
  margin-bottom: 16px;
`;
const Block = styled.View`
  height: ${({blockHeight}) => blockHeight};
  background-color: ${({theme}) => theme.colorV2.cover4};
  border-radius: 4px;
  width: 100%;
`;
export const VerifyPlaceholder = () => {
  return (
    <VerifyBox key="1">
      <Avatar />
      <Block blockHeight="32px" />
      <Block blockHeight="16px" style={{marginTop: 8, marginBottom: 8}} />
      <Block blockHeight="16px" />
    </VerifyBox>
  );
};

export const Empty = styled.View`
  height: 14px;
  width: 50px;
  background-color: ${({theme}) => theme.colorV2.cover4};
`;
