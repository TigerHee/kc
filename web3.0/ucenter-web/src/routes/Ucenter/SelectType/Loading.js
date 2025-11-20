/**
 * Owner: willen@kupotech.com
 */
import { Spin, styled } from '@kux/mui';
import React from 'react';

const LoadingPage = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = () => {
  return (
    <LoadingPage>
      <Spin />
    </LoadingPage>
  );
};

export default React.memo(Loading);
