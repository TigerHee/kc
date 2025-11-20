/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';

import {
  Box,
  Drawer,
  ThemeProvider,
  styled,
  Snackbar,
  useResponsive,
  useTheme,
  Notification,
} from '@kux/mui';

import loadable from '@loadable/component';

import { useDispatch, useSelector } from 'react-redux';
import ResetPwd from './ResetPwd';
import ForgetPwdAuthorize from './ForgetPwdAuthorize';
import { push } from '../../utils/router';

import { NAMESPACE } from './constants';
import Layout from '../Layout';
import RootEmotionCacheProvider from '../Layout/RootEmotionCacheProvider';
import { useLang } from '../hookTool';
import { StepLine, GuideTitle, GlobalCss } from '../components'; // GuideTitle, StepLine
import InputAccount from './InputAccount';

const ValidateFormV2 = loadable(() => import('./ValidateFormV2'));

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;
const { withLayout } = Layout;

const ContentBox = styled(Box)`
  width: 100%;
  max-width: ${(props) => (props.inDrawer ? 'unset' : '486px')};
  margin: ${(props) => (props.inDrawer ? '0 auto' : '0 auto 0 100px')};
  padding: ${(props) => (props.inDrawer ? '40px 64px 40px' : 'unset')};
  ${(props) => props.theme.breakpoints.down('xl')} {
    margin: 0 auto;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 auto;
    padding: ${(props) => (props.inDrawer ? '30px 40px 40px' : 'unset')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 auto;
    max-width: unset;
    padding: ${(props) => (props.inDrawer ? '0px 16px 40px !important' : 'unset')};
  }
`;

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
    border-radius: 12px 12px 0px 0px;
  }
`;

const FORGET_PASSWORD_INPUT_ACCOUNT = 1;
const FORGET_PASSWORD_VERIFY_CODE = 2;
const FORGET_PASSWORD_RESET_PASSWORD = 3;
const FORGET_PASSWORD_RISK_CHECK = 4;

function ForgetPwd(props = {}) {
  const { onSuccess, moreClasses = {}, inDrawer, BoxProps = {}, onBack } = props;
  const res = useLang();
  const [step, setStep] = useState(FORGET_PASSWORD_INPUT_ACCOUNT);

  const {
    t,
    i18n: { language },
  } = res;
  const dispatch = useDispatch();
  const classes = useMemo(() => {
    return { ...moreClasses };
  }, [moreClasses]);

  const rv = useResponsive();

  const { isCodeRegx, isShowAuthorizePage } = useSelector((state) => state[NAMESPACE]);

  useEffect(() => {
    return () => {
      dispatch({ type: `${NAMESPACE}/resetInit` });
    };
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      push('/ucenter/signin', language);
    }
  };

  useEffect(() => {
    // 验证码校验通过
    if (isCodeRegx) {
      setStep(FORGET_PASSWORD_RESET_PASSWORD);
    }
  }, [isCodeRegx]);

  useEffect(() => {
    if (isShowAuthorizePage) {
      setStep(FORGET_PASSWORD_RISK_CHECK);
    }
  }, [isShowAuthorizePage]);

  return (
    <SnackbarProvider>
      <NotificationProvider>
        <>
          {!inDrawer ? <StepLine precent={step / 3} /> : null}
          <ContentBox
            data-inspector="forget_pwd_container"
            inDrawer={inDrawer}
            style={{ flex: !rv.sm ? 1 : 'auto' }}
            {...BoxProps}
          >
            <GuideTitle
              onBack={handleBack}
              title={t('jDxAEXC2T4hpidJXV6Guyv')}
              inDrawer={inDrawer}
            />
            {step === FORGET_PASSWORD_INPUT_ACCOUNT ? (
              <InputAccount
                classes={classes}
                inDrawer={inDrawer}
                onSuccess={() => {
                  if (step !== FORGET_PASSWORD_VERIFY_CODE) {
                    setStep(FORGET_PASSWORD_VERIFY_CODE);
                  }
                }}
              />
            ) : step === FORGET_PASSWORD_VERIFY_CODE ? (
              <ValidateFormV2
                namespace={NAMESPACE}
                showLoginSafeWord={false}
                onSuccess={onSuccess}
                isSub={false}
                withDrawer={inDrawer}
                finishUpgrade={false}
              />
            ) : step === FORGET_PASSWORD_RESET_PASSWORD ? (
              <ResetPwd onSuccess={onSuccess} classes={classes} inDrawer={inDrawer} />
            ) : step === FORGET_PASSWORD_RISK_CHECK ? (
              <SnackbarProvider>
                <NotificationProvider>
                  <ContentBox
                    inDrawer={inDrawer}
                    style={{ flex: !rv.sm ? 1 : 'auto' }}
                    {...BoxProps}
                  >
                    <ForgetPwdAuthorize onSuccess={onSuccess} inDrawer={inDrawer} />
                  </ContentBox>
                </NotificationProvider>
              </SnackbarProvider>
            ) : null}
          </ContentBox>
          <GlobalCss />
        </>
      </NotificationProvider>
    </SnackbarProvider>
  );
}

const WithThemeForgetPwd = (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <ForgetPwd {...props} />
    </ThemeProvider>
  );
};

const LayOutForgetPwd = withLayout(WithThemeForgetPwd);

const ForgetPwdWithThemeDrawer = (props = {}) => {
  const {
    onClose,
    BoxProps = {},
    tabKey,
    moreClasses,
    onSuccess,
    open,
    show,
    onBack,
    ...restProps
  } = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const rv = useResponsive();
  const handleClose = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/reset`,
    });
    if (onClose) {
      onClose();
    }
  }, []);
  return (
    <ExtendDrawer
      show={open || show}
      {...restProps}
      onClose={handleClose}
      anchor={!rv.lg ? 'bottom' : 'right'}
      theme={theme}
      back={false}
      headerBorder={false}
    >
      <ForgetPwd
        moreClasses={moreClasses}
        onSuccess={onSuccess}
        tabKey={tabKey}
        BoxProps={{ width: '100%', height: '100%', ...BoxProps }}
        inDrawer
        onBack={onBack}
      />
    </ExtendDrawer>
  );
};

export const ForgetPwdDrawer = (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <RootEmotionCacheProvider>
        <ForgetPwdWithThemeDrawer {...props} />
      </RootEmotionCacheProvider>
    </ThemeProvider>
  );
};

export default LayOutForgetPwd;
