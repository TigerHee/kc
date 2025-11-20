import React, {memo} from 'react';
import styled from '@emotion/native';
import {Loading} from '@krn/ui';

const StyledView = styled.View`
  background: ${({theme}) => theme.colorV2.overlay};
  justify-content: center;
  align-items: center;
`;

const Label = styled.Text`
  color: ${({theme}) => theme.colorV2.primary};
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  line-height: 15.6px;
  margin-top: 6px;
`;

const LoadingHeader = () => {
  return (
    <StyledView>
      <Loading spin size={'small'} />
      <Label>Kucoin</Label>
    </StyledView>
  );
};

export default memo(LoadingHeader);
