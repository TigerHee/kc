/**
 * Owner: willen@kupotech.com
 */
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { Box, Notification, Snackbar, styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { Captcha } from '@packages/captcha';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { GlobalCss } from '../../components';

import { LOGIN_STEP, BIZ, NAMESPACE } from '../constants';
import InputAccount from '../InputAccount';
import MultiDeviceDialog from '../MultiDeviceDialog';

const MailAuthorize = loadable(() => import('../MailAuthorize'));
const ValidateFormV2 = loadable(() => import('../ValidateFormV2'));

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const ContentBox = styled(Box)`
  width: ${(props) => (props.noLayout ? '486px' : '100%')};
  max-width: ${(props) => (props.withDrawer ? 'unset' : '486px')};
  margin: ${(props) =>
    props.isCenter ? '0 auto' : props.withDrawer || props.noLayout ? '0 auto' : '0 auto 0 100px'};
  padding: ${(props) => (props.withDrawer ? '40px 64px 40px' : 'unset')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 auto;
    padding: ${(props) => (props.withDrawer ? '30px 40px 40px' : 'unset')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin: 0 auto;
    max-width: unset;
    padding: ${(props) => (props.withDrawer ? '0px 16px 40px !important' : 'unset')};
  }
`;

const FusionSignIn = (props = {}) => {
  const {
    onSuccess = () => {},
    onClose = () => {},
    onForgetPwdClick = () => {},
    BoxProps = {},
    verifyCanNotUseClick,
    showLoginSafeWord = false,
    signOrDownClick,
    loginKey,
    relLoginClasses,
    validateFormClasses,
    trackingConfig,
    customTitle,
    withDrawer, // 是否Drawer弹窗打开
    noLayout,
    forgetBottom,
  } = props;

  const signInMultiSiteConfig = useMultiSiteConfig();

  const multiSiteConfig = props?.multiSiteConfig || signInMultiSiteConfig?.multiSiteConfig; // use props first

  const dispatch = useDispatch();
  const {
    currentStep,
    type = 1,
    token,
    finishUpgrade,
    isCaptchaOpen,
    sendVerifyCodePayload,
  } = useSelector((state) => state[NAMESPACE]);

  const isSub = type === 3;
  const rv = useResponsive();

  const handleResetStep = () => {
    dispatch({ type: `${NAMESPACE}/rebackStep` });
  };

  // 关闭人机弹窗
  const onCloseCaptcha = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
  };

  // 人机校验通过
  const onValidateSuccess = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
    const { onSendCodeSuccess, onSendError, ...rest } = sendVerifyCodePayload;
    dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: rest,
      onSendCodeSuccess,
      onSendError,
    });
  };

  useEffect(() => {
    // 预加载组件
    MailAuthorize.preload();
    ValidateFormV2.preload();

    return () => {
      dispatch({ type: `${NAMESPACE}/reset` });
    };
  }, []);

  const isValidImage = !!multiSiteConfig?.loginConfig?.loginPageContextUrl;

  // 是否配置的有左侧图片，没有则居中，如果图片无效，也居中
  const isCenter =
    (tenantConfig.signin.isCenter && !multiSiteConfig?.loginConfig?.loginPageContextUrl) ||
    (tenantConfig.signin.isCenter &&
      multiSiteConfig?.loginConfig?.loginPageContextUrl &&
      !isValidImage);

  const supportUserPwdLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('userpwd');
  // const supportPasskeyLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('passkey');

  if (!multiSiteConfig) {
    return null;
  }

  return (
    <div id="loginFormContainer" data-inspector="signin_form_container">
      <SnackbarProvider>
        <NotificationProvider>
          <Box>
            <Captcha
              bizType={BIZ}
              open={isCaptchaOpen}
              onClose={onCloseCaptcha}
              onValidateSuccess={onValidateSuccess}
            />
            <ContentBox
              isCenter={isCenter}
              withDrawer={withDrawer}
              noLayout={noLayout}
              style={{
                flex: !rv.sm ? 1 : 'auto',
              }}
              {...BoxProps}
            >
              {currentStep === LOGIN_STEP.SIGN_IN_STEP_INPUT_ACCOUNT && supportUserPwdLogin ? (
                <InputAccount
                  classes={relLoginClasses}
                  loginKey={loginKey}
                  onSuccess={onSuccess}
                  onForgetPwdClick={onForgetPwdClick}
                  signOrDownClick={signOrDownClick}
                  customTitle={customTitle}
                  forgetBottom={forgetBottom}
                  withDrawer={withDrawer}
                />
              ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT ? (
                <ValidateFormV2
                  namespace={NAMESPACE}
                  classes={validateFormClasses}
                  showLoginSafeWord={showLoginSafeWord}
                  onSuccess={onSuccess}
                  onBack={handleResetStep}
                  verifyCanNotUseClick={verifyCanNotUseClick}
                  isSub={isSub}
                  trackingConfig={trackingConfig}
                  withDrawer={withDrawer}
                  finishUpgrade={finishUpgrade}
                  token={token}
                />
              ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK ? (
                <MailAuthorize
                  onBack={handleResetStep}
                  onSuccess={onSuccess}
                  trackingConfig={trackingConfig}
                  inDrawer={withDrawer}
                />
              ) : null}
            </ContentBox>
            <GlobalCss />
            <MultiDeviceDialog
              withDrawer={withDrawer}
              onCloseDrawer={onClose}
              onLoginSuccess={onSuccess}
            />
          </Box>
        </NotificationProvider>
      </SnackbarProvider>
    </div>
  );
};

export default FusionSignIn;
