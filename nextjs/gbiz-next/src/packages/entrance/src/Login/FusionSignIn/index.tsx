/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useMultiSiteConfig, TSiteConfig } from 'hooks';
import { getIsApp } from 'kc-next/boot';
import { Box } from '@kux/mui';
import loadable from '@loadable/component';
import { Captcha } from 'packages/captcha';
import { TUserResponse, useLoginStore } from '../model';
import remoteEvent from 'tools/remoteEvent';
import { getTenantConfig } from '../../config/tenant';
import { LOGIN_STEP, BIZ, REFUSE_SIGN_TERM_JUMP_URL } from '../constants';
import InputAccount from '../InputAccount';
import MultiDeviceDialog from '../MultiDeviceDialog';
import { ClearUserDialog } from '../../components/ClearUserDialog';
import addLangToPath from 'tools/addLangToPath';
import { trackClick } from 'tools/sensors';
import { searchToJson, sentryReport } from '../../common/tools';
import { UpdateTermDialog } from '../../components/UpdateTermDialog';
import UpdatePwdTipDialog from '../../components/UpdatePwdTipDialog';
import ErrorBoundary, { SCENE_MAP } from '../../components/ErrorBoundary';
import { UserUpdateTermResponse } from '../../api/ucenter';
import styles from './index.module.scss';
import './global.scss';

const MailAuthorize = loadable(() => import('../MailAuthorize'));
const ValidateForm = loadable(() => import('../ValidateForm'));
const ThirdPartySimpleSignup = loadable(() => import('../ThirdPartySimpleSignup'));
const ThirdPartyAccountDiversion = loadable(() => import('../ThirdPartyAccountDiversion'));

type TTheme = 'light' | 'dark';
export interface IFusionSignInProps {
  onSuccess?: (data: TUserResponse | null) => void;
  onClose?: () => void;
  onForgetPwdClick?: () => void;
  BoxProps?: React.HTMLAttributes<HTMLDivElement>;
  verifyCanNotUseClick?: (token?: string) => void;
  showLoginSafeWord?: boolean;
  signOrDownClick?: () => void;
  loginKey?: string;
  inputAccountTitleClassName?: string;
  trackingConfig?: Record<string, any>;
  theme?: TTheme;
  customTitle?: string;
  withDrawer?: boolean;
  noLayout?: boolean;
  forgetBottom?: boolean;
  multiSiteConfig?: TSiteConfig;
}

const FusionSignIn: React.FC<IFusionSignInProps> = (props = {}) => {
  const {
    onSuccess = () => {},
    onClose = () => {},
    onForgetPwdClick = () => {},
    BoxProps = {},
    verifyCanNotUseClick,
    showLoginSafeWord = false,
    signOrDownClick,
    loginKey,
    inputAccountTitleClassName,
    trackingConfig,
    theme,
    customTitle,
    withDrawer,
    noLayout,
    forgetBottom,
  } = props;
  const tenantConfig = getTenantConfig();
  const { multiSiteConfig: signInMultiSiteConfig } = useMultiSiteConfig();
  const [clearUserDialogVisible, setClearUserDialogVisible] = useState(false);

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
  const userUpdateTermList = useLoginStore(s => s.userUpdateTermList);
  const loginSuccessData = useLoginStore(s => s.loginSuccessData);
  const sendVerifyCode = useLoginStore(s => s.sendVerifyCode);
  const update = useLoginStore(s => s.update);
  const reset = useLoginStore(s => s.reset);
  const rebackStep = useLoginStore(s => s.rebackStep);
  const nextStep = useLoginStore(s => s.nextStep);
  const getUserUpdateTerm = useLoginStore(s => s.getUserUpdateTerm);
  const signTerm = useLoginStore(s => s.signTerm);
  const logout = useLoginStore(s => s.logout);

  const isSub = type === 3;

  const [updateTermDialogVisible, setUpdateTermDialogVisible] = useState(false);
  const [isUpdatePwdTipDialogInit, setUpdatePwdTipDialogInit] = useState(false);

  const onBackHandle = useCallback(() => {
    rebackStep?.();
  }, [rebackStep]);

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

  // 签署协议
  const signTermHandle = async (termIdList: UserUpdateTermResponse[] | UserUpdateTermResponse) => {
    signTerm?.({
      userTermSubRequests: Array.isArray(termIdList) ? termIdList : [termIdList],
    });
  };

  // 拒绝签署协议退出登陆
  const handleLogout = () => {
    const query = searchToJson() as { back?: string; backUrl?: string };
    const { back, backUrl } = query || {};
    let to = addLangToPath(REFUSE_SIGN_TERM_JUMP_URL);
    if (backUrl) {
      to = window._CHECK_BACK_URL_IS_SAFE_?.(backUrl) ? backUrl : REFUSE_SIGN_TERM_JUMP_URL;
    } else if (back) {
      to = window._CHECK_BACK_URL_IS_SAFE_?.(back) ? back : REFUSE_SIGN_TERM_JUMP_URL;
    }
    setUpdateTermDialogVisible(false);
    logout?.({ to });
  };

  // 检查是否需要更新密码提示
  const onCheckUpdatePwd = async (preData?: TUserResponse | null) => {
    if (tenantConfig.signin.isSupportUpdatePwdTipDialog) {
      setUpdatePwdTipDialogInit(true);
    } else {
      const data = preData || loginSuccessData!;
      onSuccess(data);
    }
  };

  // 签署协议流程结束
  const signTermFinish = () => {
    setUpdateTermDialogVisible(false);
    onCheckUpdatePwd();
  };

  // 登陆成功后回调
  const onLoginSuccess = async (data: TUserResponse | null) => {
    getUserUpdateTerm?.({
      loginSuccessData: data,
      hasUpdateTermCallback: () => {
        setUpdateTermDialogVisible(true);
      },
      noUpdateTermCallback: () => {
        onCheckUpdatePwd(data);
      },
    });
  };

  useEffect(() => {
    if (getIsApp()) {
      sentryReport({
        level: 'warning',
        message: `gbiz signin page open in app. referrer url: ${document.referrer}, location: ${window.location}`,
        tags: {
          errorType: 'signin_in_app',
        },
      });
    }
  }, []);

  useEffect(() => {
    const cb = () => {
      setClearUserDialogVisible(true);
    };
    remoteEvent.on(remoteEvent.evts.SHOW_CLEAR_USE_DIALOG, cb);
    return () => {
      remoteEvent.off(remoteEvent.evts.SHOW_CLEAR_USE_DIALOG, cb);
    };
  }, []);

  useEffect(() => {
    MailAuthorize.preload();
    ValidateForm.preload();
    ThirdPartySimpleSignup.preload();
    ThirdPartyAccountDiversion.preload();
    return () => {
      reset?.();
    };
  }, []);

  const isValidImage = useMemo(
    () => !!multiSiteConfig?.loginConfig?.loginPageContextUrl,
    [multiSiteConfig?.loginConfig?.loginPageContextUrl]
  );

  const isCenter = useMemo(() => {
    return (
      (tenantConfig.signin.isCenter && !multiSiteConfig?.loginConfig?.loginPageContextUrl) ||
      (tenantConfig.signin.isCenter && multiSiteConfig?.loginConfig?.loginPageContextUrl && !isValidImage)
    );
  }, [tenantConfig.signin.isCenter, multiSiteConfig?.loginConfig?.loginPageContextUrl, isValidImage]);

  return (
    <div id="loginFormContainer" data-inspector="signin_form_container">
      <Box>
        {isCaptchaOpen && (
          <ErrorBoundary scene={SCENE_MAP.login.fusionSigninCaptcha}>
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
          {currentStep === LOGIN_STEP.SIGN_IN_STEP_INPUT_ACCOUNT ? (
            <ErrorBoundary scene={SCENE_MAP.login.inputAccount}>
              <InputAccount
                inputAccountTitleClassName={inputAccountTitleClassName}
                loginKey={loginKey}
                onSuccess={onLoginSuccess}
                onForgetPwdClick={onForgetPwdClick}
                signOrDownClick={signOrDownClick}
                customTitle={customTitle}
                forgetBottom={forgetBottom}
                withDrawer={withDrawer}
              />
            </ErrorBoundary>
          ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_VERIFY_ACCOUNT ? (
            <ErrorBoundary scene={SCENE_MAP.login.validateForm}>
              <ValidateForm
                showLoginSafeWord={showLoginSafeWord}
                onSuccess={onLoginSuccess}
                onBack={onBackHandle}
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
                onBack={onBackHandle}
                onSuccess={onLoginSuccess}
                trackingConfig={trackingConfig}
                inDrawer={withDrawer}
              />
            </ErrorBoundary>
          ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY ? (
            <ErrorBoundary scene={SCENE_MAP.login.thirdPartyAccountDiversion}>
              <ThirdPartyAccountDiversion
                theme={theme}
                onBack={onBackHandle}
                onSuccess={onLoginSuccess}
                onForgetPwdClick={onForgetPwdClick}
                trackingConfig={trackingConfig}
                noLayout={noLayout}
                withDrawer={withDrawer}
              />
            </ErrorBoundary>
          ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE ? (
            <ErrorBoundary scene={SCENE_MAP.login.thirdPartySimpleSignup}>
              <ThirdPartySimpleSignup
                theme={theme}
                onBack={onBackHandle}
                onSuccess={onLoginSuccess}
                trackingConfig={trackingConfig}
                onBindOtherAccount={() => {
                  trackClick(['easyRegisterPage', 'bindOtherAccount']);
                  nextStep?.(LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY);
                }}
              />
            </ErrorBoundary>
          ) : null}
        </div>
        <ErrorBoundary scene={SCENE_MAP.login.multiDeviceDialog}>
          <MultiDeviceDialog withDrawer={withDrawer} onCloseDrawer={onClose} onLoginSuccess={onLoginSuccess} />
        </ErrorBoundary>

        <ErrorBoundary scene={SCENE_MAP.login.clearUserDialog}>
          <ClearUserDialog
            visible={clearUserDialogVisible}
            onClose={() => {
              setClearUserDialogVisible(false);
            }}
          />
        </ErrorBoundary>
        {updateTermDialogVisible && (
          <ErrorBoundary scene={SCENE_MAP.login.updateTermDialogVisible}>
            <UpdateTermDialog
              userUpdateTermList={userUpdateTermList || []}
              onClose={signTermFinish}
              signTermHandle={signTermHandle}
              refuseSignTermHandle={handleLogout}
            />
          </ErrorBoundary>
        )}
        {isUpdatePwdTipDialogInit && (
          <ErrorBoundary scene={SCENE_MAP.login.updatePwdTipDialog}>
            <UpdatePwdTipDialog
              theme={theme}
              isInit={isUpdatePwdTipDialogInit}
              onCallback={() => {
                setUpdatePwdTipDialogInit(false);
                onSuccess(loginSuccessData!);
              }}
            />
          </ErrorBoundary>
        )}
      </Box>
    </div>
  );
};

export default FusionSignIn;
