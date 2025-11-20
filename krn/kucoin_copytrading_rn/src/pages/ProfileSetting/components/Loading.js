import React from 'react';
import styled from '@emotion/native';
import {Loading as KrnLoading} from '@krn/ui';

const LoadingLandWrap = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Loading = () => {
  return (
    <LoadingLandWrap>
      <KrnLoading size="small" spin />
    </LoadingLandWrap>
  );
};
