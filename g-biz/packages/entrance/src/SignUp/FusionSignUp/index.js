/**
 * Owner: willen@kupotech.com
 */

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Box, Notification, Snackbar, styled, useResponsive } from '@kux/mui';
import JsBridge from '@knb/native-bridge';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import remoteEvent from '@tools/remoteEvent';
import { useDispatch, useSelector } from 'react-redux';
import { Captcha } from '@packages/captcha';
import isObject from 'lodash/isObject';
import { kcsensorsManualTrack } from '@utils/sensors';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import loadable from '@loadable/component';
import storage from '@utils/storage';
import { tenantConfig } from '../../config/tenant';
import { GlobalCss } from '../../components';
import ThirdPartyLogin from '../../components/ThirdPartyLogin';
import { InvitationListDialog } from '../../components/InvitationListDialog';
import Agreement from './Agreement';
import SetAccount from './SetAccount';
import { EMAIL_BIZTYPE, NAMESPACE, PHONE_BIZTYPE, SIGNUP_STEP } from '../constants';
import {
  useRegisterPhoneBindEmailABtest,
  useLang,
  useTrackingConfigDataOfInviter,
} from '../../hookTool';

import { AlreadyHasCount } from './styled';
import { removeSpaceSE, sentryReport } from '../../common/tools';

const VerifyAccount = loadable(() => import('./VerifyAccount'));
const BindEmail = loadable(() => import('./BindEmail'));
const SetPassword = loadable(() => import('./SetPassword'));
const KycGuideDialog = loadable(() => import('./KycGuideDialog'));
const LeaveDialog = loadable(() => import('./LeaveDialog'));

const ContentBox = styled(Box)`
  width: ${(props) => (props.noLayout ? '486px' : '100%')};
  max-width: ${(props) => (props.fromDrawer ? 'unset' : '486px')};
  margin: ${(props) => (props.fromDrawer || props.noLayout ? '0 auto' : '0 auto 0 100px')};
  padding: ${(props) => (props.fromDrawer ? '40px 64px 40px' : 'unset')};
  ${(props) => props.theme.breakpoints.down('xl')} {
    margin: 0 auto;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 auto;
    padding: ${(props) => (props.fromDrawer ? '30px 40px 40px' : 'unset')};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin: 0 auto;
    max-width: unset;
    padding: ${(props) => (props.fromDrawer ? '0px 16px 40px !important' : 'unset')};
  }
`;

const { NotificationProvider } = Notification;
const { SnackbarProvider } = Snackbar;

const bizTypeMap = {
  'email': EMAIL_BIZTYPE,
  'phone': PHONE_BIZTYPE,
};

const AccountPageOpener = {
  loginSuccess: 'loginSuccess',
  registerSuccess: 'registerSuccess',
};

function FusionSignUp(props = {}) {
  const {
    onChange,
    // 点击回退，注册组件回退到最前面继续回退的回调
    onBack,
    visibleAgree,
    BoxProps = {},
    initEmail = '',
    initPhone = '',
    initPhoneCode,
    bonusImg,
    recallType = null,
    fromDrawer = false,
    forgetLeft,
    noLayout,
    trackingConfig,
    kycGuideWithDialog, // 注册成功后的kyc引导使用弹窗展示
    setAccountDesc = '',
    setAccountTitle = '',
    // 三方绑定 输入账号完成回调
    onThirdPartySetAccount,
    fromThirdPartySimpleSignup = false, // 三方极简注册
    fromBindThirdPartyAccount = false, // 绑定三方账号
    onThirdPartyLoginAuthorizeComplete, // 注册页完成三方登录授权的回调
    singUpBtnText,
    ignoreKycCheck = false, // 是否忽略kyc认证弹窗
    onAccountInput,
    showInviterInfo,
  } = props;
  const { currentStep, isCaptchaOpen, sendVerifyCodePayload, registerType } = useSelector(
    (state) => state[NAMESPACE],
  );
  const { t } = useLang();
  const userInfo = useSelector((s) => s[NAMESPACE].userInfo);
  const [invitationListDialogVisible, setInvitationListDialogVisible] = useState(false);
  const agreementList = tenantConfig.signup.agreementList(storage.getItem('kucoinv2_lang'), t);
  const agreementListRef = useRef(agreementList);
  agreementListRef.current = agreementList;
  const signUpMultiSiteConfig = useMultiSiteConfig();

  const multiSiteConfig = props?.multiSiteConfig || signUpMultiSiteConfig?.multiSiteConfig; // use props first
  const supportEmailAccount = useMemo(
    () => multiSiteConfig?.accountConfig?.accountTypes?.includes('email'),
    [multiSiteConfig?.accountConfig?.accountTypes],
  );
  const isNewApi = useRegisterPhoneBindEmailABtest();

  const needEmail = useMemo(() => supportEmailAccount && isNewApi, [isNewApi, supportEmailAccount]);

  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const bizType = useMemo(() => bizTypeMap[registerType], [registerType]);
  const rv = useResponsive();
  const [kycGuideDialogVisible, setKycGuideDialogVisible] = useState(false);

  const extraTrackingConfigData = useTrackingConfigDataOfInviter();

  // 签署完协议下一步到账号输入页面
  const beginSetAccountFromAgreement = (userTermList) => {
    // 更新签署的协议列表
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        userTermList,
      },
    });
    dispatchRef.current({
      type: `${NAMESPACE}/nextStep`,
      payload: {
        nextStep: SIGNUP_STEP.REGISTER_STEP_SET_ACCOUNT,
      },
    });
  };

  const handleThirdPartyComplete = async () => {
    // 三方注册完成也要打开 kyc 引导弹窗
    setKycGuideDialogVisible(true);
  };
  const handleThirdPartyCompleteRef = useRef(handleThirdPartyComplete);
  handleThirdPartyCompleteRef.current = handleThirdPartyComplete;

  const beginVerifyCodeFromAccount = async () => {
    kcsensorsManualTrack({ spm: ['gotoVerifyCodeFromAccount', '1'] }, 'page_click');
    // 三方极简注册，直接调用三方注册绑定接口
    if (fromThirdPartySimpleSignup) {
      try {
        // 调用三方极简注册接口
        await dispatch({
          type: `${NAMESPACE}/bindThirdParty`,
          payload: { validationType: 'EMAIL' },
        });
        kcsensorsManualTrack(
          {
            spm: ['easyRegister', 'createResult'],
            data: {
              status: 'success',
            },
          },
          'register_result',
        );
        // 注册成功回调
        await handleThirdPartyCompleteRef.current();
        // 写入本地缓存，在概览页如果没有账号没有登陆密码会弹出设置密码弹窗
        storage.setItem('kucoinv2_third_party_simple_signup', 1);
      } catch (err) {
        kcsensorsManualTrack(
          {
            spm: ['easyRegister', 'createResult'],
            data: {
              status: 'fail',
            },
          },
          'register_result',
        );
        sentryReport({
          level: 'warning',
          message: `signup page third party simple signup error: ${err}`,
          tags: {
            errorType: 'third_party_simple_signup_error',
          },
        });
        // 报错，提示
        const msg = isObject(err)
          ? typeof err.msg === 'string'
            ? err.msg
            : JSON.stringify(err.msg)
          : err;
        if (msg) {
          dispatch({
            type: `${NAMESPACE}/update`,
            payload: { registerTip: msg },
          });
        }
      }
    } else {
      dispatchRef.current({
        type: `${NAMESPACE}/nextStep`,
        payload: {
          nextStep: SIGNUP_STEP.REGISTER_STEP_VERIFY_ACCOUNT,
        },
      });
    }
  };

  const beginVerifyCodeFromBindEmail = () => {
    kcsensorsManualTrack({ spm: ['gotoVerifyCodeFromBindEmail', '1'] }, 'page_click');
    dispatchRef.current({
      type: `${NAMESPACE}/nextStep`,
      payload: {
        nextStep: SIGNUP_STEP.REGISTER_STEP_VERIFY_ACCOUNT,
      },
    });
  };

  /**
   *
   * @param {bool} thirdPartyBindComplete 是否是第三方账号绑定
   * @param {bool} isRegisterByPhone 如果不是第三方账号，是否是手机号注册
   */
  const handleVerifyAccountFinish = useCallback(
    async (thirdPartyBindComplete, isRegisterByPhone) => {
      if (thirdPartyBindComplete) {
        // 三方绑定注册完成
        await handleThirdPartyCompleteRef.current();
        // 写入本地缓存，在概览页如果没有账号没有登陆密码会弹出设置密码弹窗
        storage.setItem('kucoinv2_third_party_simple_signup', 1);
      } else if (isRegisterByPhone && needEmail) {
        // 神策白名单 手机号注册需要绑定邮箱
        dispatchRef.current({
          type: `${NAMESPACE}/nextStep`,
          payload: {
            nextStep: SIGNUP_STEP.REGISTER_STEP_BIND_EMAIL,
          },
        });
      } else {
        dispatchRef.current({
          type: `${NAMESPACE}/nextStep`,
          payload: {
            nextStep: SIGNUP_STEP.REGISTER_STEP_SET_PASSWORD,
          },
        });
      }
    },
    [needEmail],
  );

  const handleSetPasswordFinish = (userInfo) => {
    // 若kyc未受限，直接通知外层注册完成，并将用户信息传出去
    const uid = userInfo?.uid;
    if (uid) {
      storage.setItem(`kucoinv2_${uid}_accountPageOpener`, AccountPageOpener.registerSuccess);
    }
    // 若kyc受限，进入引导kyc向导页，正常注册流程都是要弹出 kyc 弹窗
    if (kycGuideWithDialog) {
      setKycGuideDialogVisible(true);
    } else {
      // 如果没有 kycGuideWithDialog，直接注册完成
      onChange && onChange(userInfo);
    }
  };

  const handleCloseKycGuideDialog = () => {
    setKycGuideDialogVisible(false);
    onChange && onChange(userInfo);
  };

  // 关闭人机弹窗
  const onCloseCaptcha = (captchaType) => {
    kcsensorsManualTrack(
      {
        spm: ['robotClose', '1'],
        data: { accountType: bizType, activityType: captchaType, ...extraTrackingConfigData },
      },
      'page_click',
    );
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
  };

  // 发送手机验证码
  const handleSendPhoneCode = (params) => {
    const { phone, countryCode } = params || {};
    // 发送成功
    kcsensorsManualTrack(
      { spm: ['phoneSendCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
    dispatch({
      type: `${NAMESPACE}/sendSMSVerifyCode`,
      payload: params,
    });
    // 注册召回接口调用
    if (recallType !== null) {
      dispatch({
        type: `${NAMESPACE}/postPhoneRecall`,
        payload: {
          countryCode,
          language: navigator.language,
          phone: removeSpaceSE(phone),
          type: recallType,
        },
      });
    }
  };

  // 发送邮箱验证码
  const handleSendEmailCode = (params) => {
    const { email } = params || {};
    kcsensorsManualTrack(
      { spm: ['emailSendCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
    dispatch({
      type: `${NAMESPACE}/sendEmailVerifyCode`,
      payload: params,
    });
    // 注册召回接口调用
    if (recallType !== null) {
      dispatch({
        type: `${NAMESPACE}/postEmailRecall`,
        payload: {
          language: navigator.language,
          type: recallType,
          email: removeSpaceSE(email),
        },
      });
    }
  };

  // 人机校验通过
  const onValidateSuccess = (captchaType) => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
    if (registerType === 'email') {
      handleSendEmailCode(sendVerifyCodePayload);
    } else {
      handleSendPhoneCode(sendVerifyCodePayload);
    }
    kcsensorsManualTrack(
      {
        spm: ['robotSuccess', '1'],
        data: { accountType: bizType, activityType: captchaType, ...extraTrackingConfigData },
      },
      'page_click',
    );
    kcsensorsManualTrack(
      {
        spm: ['robot', 'verifyResult'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'I am human',
          clickStatus: 'success',
        },
      },
      'page_click',
    );
    kcsensorsManualTrack(
      {
        spm: [registerType === 'email' ? 'emailRobot' : 'SMSRobot', 'verifyResult'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'I am human',
          clickStatus: 'success',
        },
      },
      'page_click',
    );
  };

  // 人机校验拉取失败
  const onValidateError = (captchaType) => {
    kcsensorsManualTrack(
      { spm: ['robotfail', '1'], data: { accountType: bizType, activityType: captchaType } },
      'page_click',
    );
    kcsensorsManualTrack(
      {
        spm: ['robot', 'verifyResult'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'I am human',
          clickStatus: 'humanMachineVerificationFail',
        },
      },
      'page_click',
    );
    kcsensorsManualTrack(
      {
        spm: [registerType === 'email' ? 'emailRobot' : 'SMSRobot', 'verifyResult'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'I am human',
          clickStatus: 'humanMachineVerificationFail',
        },
      },
      'page_click',
    );
  };

  // 点击回退回调
  const onBackHandle = () => {
    dispatch({ type: `${NAMESPACE}/rebackStep`, onBack });
  };

  useEffect(() => {
    // 如果有协议，则默认展示协议页面
    if (agreementListRef.current && agreementListRef.current.length) {
      dispatchRef.current({
        type: `${NAMESPACE}/update`,
        payload: {
          currentStep: SIGNUP_STEP.REGISTER_AGREEMENT,
        },
      });
    }
  }, []);

  useEffect(() => {
    const persistenceRcode = queryPersistence.getPersistenceQuery('rcode');
    // 只要没有 persistenceRcode 或者 不展示邀请者信息 showInviterInfo = false, 都不请求邀请者信息
    // 所以必须二者都存在，才展示邀请者信息
    if (persistenceRcode && showInviterInfo) {
      dispatchRef.current({
        type: `${NAMESPACE}/pullInviterInfo`,
        payload: { rcode: persistenceRcode },
      });
    }
    return () => {
      dispatchRef.current({ type: `${NAMESPACE}/clearInviterInfo` });
    };
  }, [showInviterInfo]);

  useEffect(() => {
    return () => {
      dispatchRef.current({ type: `${NAMESPACE}/resetInit` });
    };
  }, []);

  useEffect(() => {
    const cb = () => {
      setInvitationListDialogVisible(true);
    };
    // 这里接收 packages/entrance/src/common/invitation-list 监听泰国站未在邀请名单用户注册报错
    remoteEvent.on(remoteEvent.evts.SHOW_INVITATION_LIST_DIALOG, cb);
    return () => {
      remoteEvent.off(remoteEvent.evts.SHOW_INVITATION_LIST_DIALOG, cb);
    };
  }, []);

  useEffect(() => {
    // gbiz 这里只做 sentry 上报，防止处理逻辑不符合其他业务线要求
    if (JsBridge.isApp()) {
      sentryReport({
        level: 'warning',
        message: `gbiz signup page open in app. referrer url: ${document.referrer}, location: ${window.location}`,
        tags: {
          errorType: 'signup_in_app',
        },
      });
    }
  }, []);

  useEffect(() => {
    VerifyAccount.preload();
    SetPassword.preload();
    KycGuideDialog.preload();
    LeaveDialog.preload();
  }, []);

  useEffect(() => {
    if (isCaptchaOpen) {
      if (['email', 'phone'].includes(registerType)) {
        kcsensorsManualTrack({
          spm: ['robot', 'IAmHuman'],
          data: {
            pre_spm_id:
              registerType === 'email'
                ? 'kcWeb.B1register.emailSecurityVerify.sendButton'
                : 'kcWeb.B1register.SMSSecurityVerify.sendButton',
          },
        });
      }
      kcsensorsManualTrack({
        spm: ['robot', 'IAmHuman'],
        data: {
          pre_spm_id: 'kcWeb.B1register.createAccount.confirm',
        },
      });
    }
  }, [isCaptchaOpen, registerType]);

  if (!multiSiteConfig) {
    return null;
  }

  // 是否隐藏第三方登录 (三方注册绑定流程、 抽屉形式注册、没有三方登陆授权完成回调)
  const isHideThirdPartyLogin =
    // 三方极简注册
    fromThirdPartySimpleSignup ||
    // 三方绑定注册
    fromBindThirdPartyAccount ||
    fromDrawer ||
    !onThirdPartyLoginAuthorizeComplete;

  return (
    <SnackbarProvider>
      <NotificationProvider>
        <>
          <Captcha
            bizType={bizType}
            open={isCaptchaOpen}
            onClose={onCloseCaptcha}
            onValidateSuccess={onValidateSuccess}
            onValidateError={onValidateError}
          />
          <ContentBox
            fromDrawer={fromDrawer}
            noLayout={noLayout}
            style={{ flex: !rv.sm ? 1 : 'auto' }}
            data-inspector="signup-content-box"
            {...BoxProps}
          >
            {currentStep === SIGNUP_STEP.REGISTER_AGREEMENT ? (
              <Agreement
                fromDrawer={fromDrawer}
                agreementList={agreementList}
                multiSiteConfig={multiSiteConfig}
                trackingConfig={trackingConfig}
                forgetLeft={forgetLeft}
                onBack={onBackHandle}
                fromThirdPartySimpleSignup={fromThirdPartySimpleSignup}
                fromBindThirdPartyAccount={fromBindThirdPartyAccount}
                isShowForgetLeft
                onFinish={beginSetAccountFromAgreement}
              />
            ) : null}
            {currentStep === SIGNUP_STEP.REGISTER_STEP_SET_ACCOUNT ? (
              <>
                <SetAccount
                  visibleAgree={visibleAgree}
                  bonusImg={bonusImg}
                  initPhoneCode={initPhoneCode}
                  initPhone={initPhone}
                  initEmail={initEmail}
                  trackingConfig={trackingConfig}
                  onFinish={beginVerifyCodeFromAccount}
                  recallType={recallType}
                  forgetLeft={forgetLeft}
                  // 只要不是抽屉形式 并且是三方极简注册或者三方绑定，才展示 forgetLeft 布局（实际是“已有账号？快速登录”的入口）
                  // 非三方绑定展示下方的 forgetLeft
                  isShowForgetLeft={isHideThirdPartyLogin}
                  fromDrawer={fromDrawer}
                  setAccountTitle={setAccountTitle}
                  setAccountDesc={setAccountDesc}
                  onThirdPartySetAccount={onThirdPartySetAccount}
                  fromThirdPartySimpleSignup={fromThirdPartySimpleSignup}
                  fromBindThirdPartyAccount={fromBindThirdPartyAccount}
                  singUpBtnText={singUpBtnText}
                  onAccountInput={onAccountInput}
                  onBack={onBackHandle}
                />
                {isHideThirdPartyLogin ? null : (
                  <>
                    <ThirdPartyLogin
                      // 三方登陆接口不会出人机校验
                      onAuthorizeComplete={onThirdPartyLoginAuthorizeComplete}
                      multiSiteConfig={multiSiteConfig}
                    />
                    {/* 展示第三方登录时，调整 forgetLeft 布局(（实际是“已有账号？快速登录”的入口）的位置，放到第三方登录下面。 用 AlreadyHasCount 包裹是复用 SetAccount.js 内部的包裹逻辑 */}
                    <AlreadyHasCount>{forgetLeft}</AlreadyHasCount>
                  </>
                )}
              </>
            ) : currentStep === SIGNUP_STEP.REGISTER_STEP_BIND_EMAIL ? (
              <BindEmail
                initEmail={initEmail}
                onFinish={beginVerifyCodeFromBindEmail}
                recallType={recallType}
                fromDrawer={fromDrawer}
                setAccountDesc={setAccountDesc}
                onAccountInput={onAccountInput}
                onBack={onBackHandle}
              />
            ) : currentStep === SIGNUP_STEP.REGISTER_STEP_VERIFY_ACCOUNT ? (
              <VerifyAccount
                fromDrawer={fromDrawer}
                fromBindThirdPartyAccount={fromBindThirdPartyAccount}
                onFinish={handleVerifyAccountFinish}
                trackingConfig={trackingConfig}
                recallType={recallType}
                onBack={onBackHandle}
              />
            ) : currentStep === SIGNUP_STEP.REGISTER_STEP_SET_PASSWORD ? (
              <SetPassword
                bonusImg={bonusImg}
                fromDrawer={fromDrawer}
                trackingConfig={trackingConfig}
                onFinish={handleSetPasswordFinish}
                ignoreKycCheck={ignoreKycCheck}
                needEmail={needEmail}
                onBack={onBackHandle}
              />
            ) : null}
          </ContentBox>
          {/* 没有 kyc 引导步骤了，只要支持注册引导，都会有挽留弹窗 */}
          {multiSiteConfig?.registerConfig?.supportRegisterGuide ? <LeaveDialog /> : null}
          {kycGuideWithDialog ? (
            <KycGuideDialog open={kycGuideDialogVisible} onClose={handleCloseKycGuideDialog} />
          ) : null}
          <InvitationListDialog
            visible={invitationListDialogVisible}
            onClose={() => {
              setInvitationListDialogVisible(false);
            }}
          />
          <GlobalCss />
        </>
      </NotificationProvider>
    </SnackbarProvider>
  );
}

export default FusionSignUp;
