/**
 * Owner: willen@kupotech.com
 */
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import JsBridge from '@knb/native-bridge';
import { Box, Notification, Snackbar, styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { Captcha } from '@packages/captcha';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import remoteEvent from '@tools/remoteEvent';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { GlobalCss } from '../../components';
import { LOGIN_STEP, BIZ, NAMESPACE, REFUSE_SIGN_TERM_JUMP_URL } from '../constants';
import InputAccount from '../InputAccount';
import MultiDeviceDialog from '../MultiDeviceDialog';
import { ClearUserDialog } from '../../components/ClearUserDialog';
import { addLangToPath, kcsensorsClick, searchToJson, sentryReport } from '../../common/tools';
import { UpdateTermDialog } from '../../components/UpdateTermDialog';
import UpdatePwdTipDialog from '../../components/UpdatePwdTipDialog';

const MailAuthorize = loadable(() => import('../MailAuthorize'));
const ValidateFormV2 = loadable(() => import('../ValidateFormV2'));
const ThirdPartySimpleSignup = loadable(() => import('../ThirdPartySimpleSignup'));
const ThirdPartyAccountDiversion = loadable(() => import('../ThirdPartyAccountDiversion'));

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
    theme,
    customTitle,
    withDrawer, // 是否Drawer弹窗打开
    noLayout,
    forgetBottom,
  } = props;

  const signInMultiSiteConfig = useMultiSiteConfig();
  const [clearUserDialogVisible, setClearUserDialogVisible] = useState(false);

  const multiSiteConfig = props?.multiSiteConfig || signInMultiSiteConfig?.multiSiteConfig; // use props first

  const dispatch = useDispatch();
  // 登陆流程的各个步骤都是用 model 中的 currentStep 来控制的
  const {
    currentStep,
    type = 1,
    token,
    finishUpgrade,
    isCaptchaOpen,
    sendVerifyCodePayload,
    userUpdateTermList,
    loginSuccessData,
  } = useSelector((state) => state[NAMESPACE]);

  const isSub = type === 3;
  const rv = useResponsive();

  const [updateTermDialogVisible, setUpdateTermDialogVisible] = useState(false);
  const [isUpdatePwdTipDialogInit, setUpdatePwdTipDialogInit] = useState(false);

  const onBackHandle = () => {
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

  // 签署协议
  const signTermHandle = async (termIdList) => {
    dispatch({
      type: `${NAMESPACE}/signTerm`,
      payload: {
        userTermSubRequests: Array.isArray(termIdList) ? termIdList : [termIdList],
      },
    });
  };

  // 拒绝签署协议退出登陆
  const logout = () => {
    const query = searchToJson();
    const { back, backUrl } = query || {};
    let to = addLangToPath(REFUSE_SIGN_TERM_JUMP_URL);
    // 优先使用backUrl跳转
    if (backUrl) {
      // backUrl 不能使用 addLangToPath 包裹，因为如果 backUrl 中是跨站点的链接，使用 addLangToPath 无法匹配跨站点的语言 base
      to = window._CHECK_BACK_URL_IS_SAFE_?.(backUrl) ? backUrl : REFUSE_SIGN_TERM_JUMP_URL;
    } else if (back) {
      // back 和 backUrl 一样的
      to = window._CHECK_BACK_URL_IS_SAFE_?.(back) ? back : REFUSE_SIGN_TERM_JUMP_URL;
    }
    // 关闭协议签署弹窗
    setUpdateTermDialogVisible(false);
    // 调用踢出登陆
    dispatch({ type: `${NAMESPACE}/logout`, payload: { to } });
  };

  // 检查是否需要更新密码提示
  const onCheckUpdatePwd = async (preData) => {
    if (tenantConfig.signin.isSupportUpdatePwdTipDialog) {
      setUpdatePwdTipDialogInit(true);
    } else {
      const data = preData || loginSuccessData;
      onSuccess(...data);
    }
  };

  // 签署协议流程结束
  const signTermFinish = () => {
    // 关闭签署协议弹窗
    setUpdateTermDialogVisible(false);
    // 继续检查是否需要更新密码提示
    onCheckUpdatePwd();
  };

  // 登陆成功后回调
  const onLoginSuccess = async (...args) => {
    // 先获取是否需要签署协议
    dispatch({
      type: `${NAMESPACE}/getUserUpdateTerm`,
      payload: {
        loginSuccessData: args,
        hasUpdateTermCallback: () => {
          setUpdateTermDialogVisible(true);
        },
        noUpdateTermCallback: () => {
          onCheckUpdatePwd(args);
        },
      },
    });
  };

  useEffect(() => {
    // gbiz 这里只做 sentry 上报，上报，防止处理逻辑不符合其他业务线要求
    if (JsBridge.isApp()) {
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
    // 这里接收 packages/entrance/src/common/clear-user.js 监听清退用户登陆报错
    remoteEvent.on(remoteEvent.evts.SHOW_CLEAR_USE_DIALOG, cb);
    return () => {
      remoteEvent.off(remoteEvent.evts.SHOW_CLEAR_USE_DIALOG, cb);
    };
  }, []);

  useEffect(() => {
    // 预加载组件
    MailAuthorize.preload();
    ValidateFormV2.preload();
    ThirdPartySimpleSignup.preload();
    ThirdPartyAccountDiversion.preload();
  }, []);

  useEffect(
    () => () => {
      dispatch({ type: `${NAMESPACE}/reset` });
    },
    [],
  );

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
                  onSuccess={onLoginSuccess}
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
                  onSuccess={onLoginSuccess}
                  onBack={onBackHandle}
                  verifyCanNotUseClick={verifyCanNotUseClick}
                  isSub={isSub}
                  trackingConfig={trackingConfig}
                  withDrawer={withDrawer}
                  finishUpgrade={finishUpgrade}
                  token={token}
                />
              ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_EMAIL_RISK ? (
                <MailAuthorize
                  onBack={onBackHandle}
                  onSuccess={onLoginSuccess}
                  trackingConfig={trackingConfig}
                  inDrawer={withDrawer}
                />
              ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY ? (
                // 三方注册 绑定注册新流程
                <ThirdPartyAccountDiversion
                  theme={theme}
                  onBack={onBackHandle}
                  onSuccess={onLoginSuccess}
                  onForgetPwdClick={onForgetPwdClick}
                  trackingConfig={trackingConfig}
                  noLayout={noLayout}
                  withDrawer={withDrawer}
                />
              ) : currentStep === LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE ? (
                // 三方注册 极简注册流程
                <ThirdPartySimpleSignup
                  theme={theme}
                  onBack={onBackHandle}
                  onSuccess={onLoginSuccess}
                  trackingConfig={trackingConfig}
                  onBindOtherAccount={() => {
                    kcsensorsClick(['easyRegisterPage', 'bindOtherAccount']);
                    dispatch({
                      type: `${NAMESPACE}/nextStep`,
                      payload: { nextStep: LOGIN_STEP.SIGN_IN_STEP_BIND_THIRD_PARTY },
                    });
                  }}
                />
              ) : null}
            </ContentBox>
            <GlobalCss />
            <MultiDeviceDialog
              withDrawer={withDrawer}
              onCloseDrawer={onClose}
              onLoginSuccess={onLoginSuccess}
            />
            <ClearUserDialog
              visible={clearUserDialogVisible}
              onClose={() => {
                setClearUserDialogVisible(false);
              }}
            />
            {updateTermDialogVisible && (
              <UpdateTermDialog
                userUpdateTermList={userUpdateTermList}
                onClose={signTermFinish}
                signTermHandle={signTermHandle}
                refuseSignTermHandle={logout}
              />
            )}
            {isUpdatePwdTipDialogInit && (
              <UpdatePwdTipDialog
                theme={theme.currentTheme}
                isInit={isUpdatePwdTipDialogInit}
                onCallback={() => {
                  setUpdatePwdTipDialogInit(false);
                  onSuccess(...loginSuccessData);
                }}
              />
            )}
          </Box>
        </NotificationProvider>
      </SnackbarProvider>
    </div>
  );
};

export default FusionSignIn;
