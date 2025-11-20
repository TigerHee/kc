/*
 * owner: borden@kupotech.com
 */
import React, { Fragment, Suspense, useState, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'dva';
import Button from '@mui/Button';
import { _t } from 'src/utils/lang';
import useLoginAndRegister from '@/hooks/useLoginAndRegister';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';
import { useTradeType } from '@/hooks/common/useTradeType';
import { isFuturesNew, FUTURES } from '@/meta/const';

const Container = styled.div`
  display: flex;
  & > * {
    flex: 1;
    &:not(:first-of-type) {
      margin-left: 8px;
    }
  }
  .login-button{
    margin-right: 8px;
  }
`;

const SideDrawer = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutSideDrawer' */ './SideDrawer');
});

const LoginAndRegister = React.memo(() => {
  const { loginProps, registerProps } = useLoginAndRegister();
  return (
    <Fragment>
      <Button className="login-button" {...loginProps} />
      <Button {...registerProps} />
    </Fragment>
  );
});

const FixedButtonGroup = React.memo(() => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const [drawerProps, setDrawerProps] = useState(null);
  const tradeType = useTradeType();

  const openDrawer = useCallback((side) => {
    setDrawerProps({
      side,
      show: true,
    });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerProps({ show: false });
  }, []);

  const isBot = useIsTradingBot();

  // 合约融合增加
  const isFutures = isFuturesNew() && tradeType === FUTURES;

  return (
    <Container>
      {isLogin ? (
        <Fragment>
          <Suspense fallback={<div />}>
            <SideDrawer {...drawerProps} onClose={closeDrawer} />
          </Suspense>
          {isBot ? (
            <Button type="primary" onClick={() => openDrawer('buy')}>
              {_t('bots.smart.create')}
            </Button>
          ) : (
            <Fragment>
              <Button type="brandGreen" onClick={() => openDrawer('buy')}>
                {isFutures ? _t('trade.order.buy') : _t('trd.form.btn.buy')}
              </Button>
              <Button type="secondary" onClick={() => openDrawer('sell')}>
                {isFutures ? _t('trade.order.sell') : _t('trd.form.btn.sell')}
              </Button>
            </Fragment>
          )}
        </Fragment>
      ) : (
        <LoginAndRegister />
      )}
    </Container>
  );
});

export default FixedButtonGroup;
