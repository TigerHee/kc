/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import Loading from 'components/Loading';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  border-top-left-radius: ${px2rem(12)};
  border-top-right-radius: ${px2rem(12)};
  flex: 1;
  padding: ${px2rem(16)} ${px2rem(24)};
  margin-top: ${px2rem(14)};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`;
const PageLoading = ({ style }) => {
  return (
    <Wrapper style={style}>
      <Loading />
    </Wrapper>
  );
};

export default PageLoading;
