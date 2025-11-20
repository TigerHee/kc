/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';

import {
  Drawer,
  ThemeProvider,
  Snackbar,
  useResponsive,
  useTheme,
  styled,
  Notification,
} from '@kux/mui';

import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import Layout from '../Layout';
import RootEmotionCacheProvider from '../Layout/RootEmotionCacheProvider';

import { kcsensorsManualTrack } from '../common/tools';
import { NAMESPACE } from './constants';

import FusionSignUp from './FusionSignUp';
import SignUpKumex from './SignUpKumex';
import { SignupPageLayout as OriSignupPageLayout } from './FusionSignUp/PageLayout';

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const ExtendDrawer = styled(Drawer)`
  max-width: 615px;
  width: 100%;
  background: ${({ theme }) => theme.colors.overlay};
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 100%;
    height: calc(100% - 80px);
    border-radius: 12px 12px 0 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    max-width: 100%;
    height: calc(100% - 32px);
    border-radius: 12px 12px 0 0;
  }
`;
const { withLayout } = Layout;

export const Signup4KuMEXDrawer = ({ theme, ...others }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <SnackbarProvider>
        <NotificationProvider>
          <SignUpKumex {...others} />
        </NotificationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const SignUpDrawerWithTheme = (props = {}) => {
  const {
    onClose,
    onChange,
    visibleAgree,
    BoxProps = {},
    trackingConfig = {},
    initEmail,
    initPhone,
    recallType,
    forgetLeft,
    singUpBtnText = null,
    ignoreKycCheck = false,
    ...resetProps
  } = props;

  const { userInfo } = useSelector((state) => state[NAMESPACE]) || {};

  const theme = useTheme();

  const rv = useResponsive();

  const dispatch = useDispatch();

  const handleCloseDrawer = () => {
    if (onClose) {
      onClose();
      // 这里是当用户已注册成功，但因为kyc受限，引导到了kyc guide页面，用户选择关闭则将用户信息传出去
      if (onChange && !isEmpty(userInfo)) {
        onChange(userInfo);
      }
    }
    dispatch({ type: `${NAMESPACE}/reset` });
  };

  // 侧边栏注册-曝光埋点
  useEffect(() => {
    if (resetProps.open) {
      kcsensorsManualTrack({
        kc_pageid: 'B1sideRegister',
        spm: ['popUp', '1'],
        ...trackingConfig,
      });
    }
  }, [resetProps.open]);

  return (
    <ExtendDrawer
      show={!!resetProps.open}
      onClose={handleCloseDrawer}
      {...resetProps}
      anchor={!rv.lg ? 'bottom' : 'right'}
      theme={theme}
      back={false}
      headerBorder={false}
    >
      <FusionSignUp
        onChange={onChange}
        visibleAgree={visibleAgree}
        BoxProps={{ width: '100%', height: '100%', ...BoxProps }}
        trackingConfig={trackingConfig}
        fromDrawer
        initEmail={initEmail}
        initPhone={initPhone}
        recallType={recallType}
        forgetLeft={forgetLeft}
        singUpBtnText={singUpBtnText}
        ignoreKycCheck={ignoreKycCheck}
      />
    </ExtendDrawer>
  );
};

export const SignUpDrawer = ({ theme, ...others }) => {
  return (
    <ThemeProvider theme={theme}>
      <RootEmotionCacheProvider>
        <SignUpDrawerWithTheme {...others} />
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export const SignUpNoLayout = ({ theme, ...others }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <RootEmotionCacheProvider>
        <SnackbarProvider>
          <FusionSignUp noLayout {...others} />
        </SnackbarProvider>
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export const SignupPageLayout = ({ theme, ...others }) => {
  return (
    <ThemeProvider theme={theme || 'light'}>
      <RootEmotionCacheProvider>
        <SnackbarProvider>
          <OriSignupPageLayout theme={theme} {...others} />
        </SnackbarProvider>
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export default withLayout(FusionSignUp, 'signup');
