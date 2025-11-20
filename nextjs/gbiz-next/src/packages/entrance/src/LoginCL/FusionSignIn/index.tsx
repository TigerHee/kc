/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useMultiSiteConfig } from 'hooks';
import { Box } from '@kux/mui';
import loadable from '@loadable/component';
import { Captcha } from 'packages/captcha';
import { getTenantConfig } from '../../config/tenant';
import { LOGIN_STEP, BIZ } from '../constants';
import clsx from 'clsx';
import { useLoginStore } from '../../Login/model';
import InputAccount from '../InputAccount';
import MultiDeviceDialog from '../MultiDeviceDialog';
import ErrorBoundary, { SCENE_MAP } from '../../components/ErrorBoundary';
import styles from './index.module.scss';
import './global.scss';

export interface FusionSignInProps {
  onSuccess?: (data: any) => void;
  onClose?: () => void;
  onForgetPwdClick?: () => void;
  BoxProps?: React.HTMLAttributes<HTMLDivElement>;
  verifyCanNotUseClick?: (...args: any[]) => void;
  showLoginSafeWord?: boolean;
  signOrDownClick?: () => void;
  loginKey?: string;
  relLoginClasses?: Record<string, string>;
  validateFormClasses?: Record<string, string>;
  trackingConfig?: Record<string, any>;
  theme?: 'light' | 'dark';
  customTitle?: React.ReactNode;
  withDrawer?: boolean;
  noLayout?: boolean;
  forgetBottom?: React.ReactNode;
  multiSiteConfig?: any;
}

const MailAuthorize = loadable(() => import('../MailAuthorize'));
const ValidateForm = loadable(() => import('../ValidateForm'));

const FusionSignIn: React.FC<FusionSignInProps> = (props = {}) => {
  const {
    onSuccess = () => {},
    onClose = () => {},
    onForgetPwdClick = () => {},
    BoxProps = {},
    verifyCanNotUseClick,
    showLoginSafeWord = false,
    trackingConfig,
    customTitle,
    withDrawer, // 是否Drawer弹窗打开
    noLayout,
  } = props;

  const tenantConfig = getTenantConfig();
  const { multiSiteConfig: signInMultiSiteConfig } = useMultiSiteConfig();

  const multiSiteConfig = useMemo(() => {
    return props?.multiSiteConfig || signInMultiSiteConfig;
  }, [props?.multiSiteConfig, signInMultiSiteConfig]);

  // zustand store
  const currentStep = useLoginStore(s => s.currentStep);
  const type = useLoginStore(s => s.type) || 1;
  const token = useLoginStore(s => s.token);
  const finishUpgrade = useLoginStore(s => s.finishUpgrade);
  const isCaptchaOpen = useLoginStore(s => s.isCaptchaOpen);
  const sendVerifyCodePayload = useLoginStore(s => s.sendVerifyCodePayload);
  const sendVerifyCode = useLoginStore(s => s.sendVerifyCode);
  const update = useLoginStore(s => s.update);
  const reset = useLoginStore(s => s.reset);
  const rebackStep = useLoginStore(s => s.rebackStep);

  const isSub = type === 3;

  const handleResetStep = () => {
    rebackStep?.();
  };

  // 关闭人机弹窗
  const onCloseCaptcha = () => {
    update?.({ isCaptchaOpen: false });
  };

  // 人机校验通过
  const onValidateSuccess = () => {
    if (sendVerifyCodePayload) {
      update?.({ isCaptchaOpen: false });
      const { onSendCodeSuccess, onSendError, ...rest } = sendVerifyCodePayload;
      // 触发发送验证码
      sendVerifyCode?.({
        payload: rest,
        onSendCodeSuccess,
        onSendError,
      });
    }
  };

  useEffect(() => {
    // 预加载组件
    MailAuthorize.preload();
    ValidateForm.preload();

    return () => {
      reset?.();
    };
  }, [reset]);

  const isValidImage = useMemo(
    () => !!multiSiteConfig?.loginConfig?.loginPageContextUrl,
    [multiSiteConfig?.loginConfig?.loginPageContextUrl]
  );

  // 是否配置的有左侧图片，没有则居中，如果图片无效，也居中
  const isCenter = useMemo(() => {
    return (
      (tenantConfig.signin.isCenter && !multiSiteConfig?.loginConfig?.loginPageContextUrl) ||
      (tenantConfig.signin.isCenter && multiSiteConfig?.loginConfig?.loginPageContextUrl && !isValidImage)
    );
  }, [tenantConfig.signin.isCenter, multiSiteConfig?.loginConfig?.loginPageContextUrl, isValidImage]);

  const supportUserPwdLogin = useMemo(
    () => multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('userpwd'),
    [multiSiteConfig?.loginConfig?.loginAccountTypes]
  );

  return (
    <div id="loginFormContainer" data-inspector="signin_form_container">
      <Box>
        {isCaptchaOpen && (
          <ErrorBoundary scene={SCENE_MAP.loginCL.fusionSigninCaptcha}>
            <Captcha
              bizType={BIZ}
              open={isCaptchaOpen}
              onClose={onCloseCaptcha}
              onValidateSuccess={onValidateSuccess}
            />
          </ErrorBoundary>
        )}

        <div
          className={clsx(styles.contentBox, {
            [styles.center]: isCenter,
            [styles.withDrawer]: withDrawer,
            [styles.noLayout]: noLayout,
          })}
          {...BoxProps}
        >
          {currentStep === LOGIN_STEP.SIGN_IN_STEP_INPUT_ACCOUNT && supportUserPwdLogin ? (
            <ErrorBoundary scene={SCENE_MAP.login.inputAccount}>
              <InputAccount onForgetPwdClick={onForgetPwdClick} customTitle={customTitle} withDrawer={withDrawer} />
            </ErrorBoundary>
          ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT ? (
            <ErrorBoundary scene={SCENE_MAP.login.validateForm}>
              <ValidateForm
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
            </ErrorBoundary>
          ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK ? (
            <ErrorBoundary scene={SCENE_MAP.login.mailAuthorize}>
              <MailAuthorize
                onBack={handleResetStep}
                onSuccess={onSuccess}
                trackingConfig={trackingConfig}
                inDrawer={withDrawer}
              />
            </ErrorBoundary>
          ) : null}
        </div>
        <ErrorBoundary scene={SCENE_MAP.login.multiDeviceDialog}>
          <MultiDeviceDialog withDrawer={withDrawer} onCloseDrawer={onClose} onLoginSuccess={onSuccess} />
        </ErrorBoundary>
      </Box>
    </div>
  );
};

export default FusionSignIn;
