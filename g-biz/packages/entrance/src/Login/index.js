/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, ThemeProvider, styled, useResponsive, useTheme } from '@kux/mui';
import noop from 'lodash/noop';
import { isEmpty } from 'lodash';
import { NAMESPACE } from './constants';
import Layout from '../Layout';
import RootEmotionCacheProvider from '../Layout/RootEmotionCacheProvider';
import FusionSignIn from './FusionSignIn';

const { withLayout } = Layout;

const ExtendDrawer = styled(Drawer)`
  max-width: 615px;
  width: 100%;
  background: ${({ theme }) => theme.colors.overlay};
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 100%;
    height: calc(100% - 80px);
    border-radius: 12px 12px 0px 0px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
    height: calc(100% - 32px);
    border-radius: 12px 12px 0px 0px;
  }
`;

const LoginWithTheme = (props = {}) => {
  return (
    <ThemeProvider theme={props?.theme || 'light'}>
      <FusionSignIn {...props} />
    </ThemeProvider>
  );
};

const LayoutWrapperLogin = withLayout(LoginWithTheme, { centerKey: 'login' });

const LoginDrawerWithTheme = (props) => {
  const {
    onSuccess = noop,
    onForgetPwdClick = noop,
    verifyCanNotUseClick,
    BoxProps,
    showLoginSafeWord,
    signOrDownClick,
    loginKey,
    relLoginClasses,
    validateFormClasses,
    trackingConfig = {},
    theme,
    open, // 兼容老API
    show, // 新API
    ...restProps
  } = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.$entrance_signUp?.userInfo);
  const _theme = useTheme();
  const rv = useResponsive();
  const handleClose = () => {
    // 这里是当用户已注册成功，但因为kyc受限，引导到了kyc guide页面，用户选择关闭则将用户信息传出去
    if (onSuccess && !isEmpty(userInfo)) {
      onSuccess({
        ...userInfo,
        finishUpgrade: true, // user-info接口不返这个字段，但新注册的账号这个肯定为true。
      });
    } else {
      dispatch({ type: `${NAMESPACE}/reset` });
      if (restProps.onClose) {
        restProps.onClose();
      }
    }
  };

  return (
    <ExtendDrawer
      show={open || show}
      {...restProps}
      onClose={handleClose}
      anchor={!rv.lg ? 'bottom' : 'right'}
      theme={_theme}
      back={false}
      headerBorder={false}
    >
      <FusionSignIn
        loginKey={loginKey}
        showLoginSafeWord={showLoginSafeWord}
        onSuccess={onSuccess}
        onClose={handleClose}
        onForgetPwdClick={onForgetPwdClick}
        verifyCanNotUseClick={verifyCanNotUseClick}
        signOrDownClick={signOrDownClick}
        relLoginClasses={relLoginClasses}
        validateFormClasses={validateFormClasses}
        BoxProps={{ width: '100%', height: '100%', ...BoxProps }}
        trackingConfig={trackingConfig}
        theme={theme}
        withDrawer
      />
    </ExtendDrawer>
  );
};

export const LoginDrawer = (props) => (
  <ThemeProvider theme={props?.theme || 'light'}>
    <RootEmotionCacheProvider>
      <LoginDrawerWithTheme {...props} />
    </RootEmotionCacheProvider>
  </ThemeProvider>
);

export const LoginNoLayout = (props) => {
  return (
    <ThemeProvider theme={props?.theme || 'light'}>
      <RootEmotionCacheProvider>
        <FusionSignIn {...props} noLayout />
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export default LayoutWrapperLogin;
