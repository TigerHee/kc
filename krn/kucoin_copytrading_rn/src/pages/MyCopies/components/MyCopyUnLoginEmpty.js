import React, {memo} from 'react';
import styled, {css} from '@emotion/native';
import {Button, Empty} from '@krn/ui';

import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {useWithLoginFn} from 'hooks/useWithLoginFn';
import CopyProfitHeader from '../CopyProfitHeader';

const StyledEmptyWrap = styled.View`
  flex: 1;
  align-items: center;
  padding: 24px 0 32px;
`;

const EmptyPage = styled.View`
  flex: 1;
`;

export const MyCopyUnLoginEmptyHocWrap = memo(({children}) => {
  const {_t} = useLang();
  const {isLogin, run: launchToLoginPage} = useWithLoginFn();

  if (isLogin) {
    return children;
  }

  return (
    <EmptyPage>
      <CopyProfitHeader />
      <StyledEmptyWrap>
        <RowWrap>
          <Empty
            style={css`
              padding-bottom: 16px;
            `}
            text={_t('uxzDn2FZKZDGux3kFdoB91')}
          />
        </RowWrap>
        <RowWrap>
          <Button onPress={launchToLoginPage}>{_t('login')}</Button>
        </RowWrap>
      </StyledEmptyWrap>
    </EmptyPage>
  );
});
