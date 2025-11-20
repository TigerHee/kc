/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { Button } from '@kufox/mui';
import useTheme from '@kufox/mui/hooks/useTheme';
import loginImgLight from 'assets/recall/login_light.svg';
import loginImgDark from 'assets/recall/login_dark.svg';
import { _t } from 'utils/lang';
import { useDispatch, useSelector } from 'dva';
import Login from 'components/Login';
import JsBridge from 'utils/jsBridge';

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.base};
  border-top-left-radius: ${px2rem(12)};
  border-top-right-radius: ${px2rem(12)};
  flex: 1;
  padding: ${px2rem(16)} ${px2rem(24)};
  margin-top: ${({ bannerHeight }) => bannerHeight ? 0 : px2rem(14)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  height: ${px2rem(100)};
  margin-top: ${px2rem(72)};
  margin-bottom: ${px2rem(60)};
`;

const UnLogin = ({ bannerHeight }) => {
  const { currentTheme } = useTheme();
  const dispatch = useDispatch();
  const { isInApp } = useSelector(state => state.app);
  const handleLogin = () => {
    if (isInApp) {
      JsBridge.open({ type: 'jump', params: { url: '/user/login' } });
    } else {
      dispatch({ type: 'user/update', payload: { showLoginDrawer: true } });
    }
  };
  return (
    <Wrapper bannerHeight={bannerHeight}>
      <Image src={currentTheme === 'light' ? loginImgLight : loginImgDark} />
      <Button onClick={handleLogin}>{_t('oQSZSjsH7ZoLG3hf9VAEgx')}</Button>
      <Login />
    </Wrapper>
  );
};

export default UnLogin;
