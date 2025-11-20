/**
 * Owner: sean.shi@kupotech.com
 */

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Box } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import { getIsApp } from 'kc-next/boot';
import { queryPersistence } from 'tools/base/QueryPersistence';
import remoteEvent from 'tools/remoteEvent';
import { Captcha } from 'packages/captcha';
import isObject from 'lodash/isObject';
import { kcsensorsManualTrack } from 'tools/sensors';
import { useMultiSiteConfig } from 'hooks/useMultiSiteConfig';
import loadable from '@loadable/component';
import storage from 'tools/storage';
import clsx from 'clsx';
import { getTenantConfig } from '../../config/tenant';
import ThirdPartyLogin from '../../components/ThirdPartyLogin';
import { IThirdPartyState, LoginStoreProvider } from '../../Login/model';
import { InvitationListDialog } from '../../components/InvitationListDialog';
import Agreement from '../Agreement';
import SetAccount from '../SetAccount';
import { EMAIL_BIZTYPE, PHONE_BIZTYPE, SIGNUP_STEP } from '../constants';
import { useRegisterPhoneBindEmailABtest, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';
import { InviterState, useSignupStore } from '../model';
import { removeSpaceSE, sentryReport } from '../../common/tools';
import commonStyles from '../index.module.scss';
import styles from './index.module.scss';

const VerifyAccount = loadable(() => import('../VerifyAccount'));
const BindEmail = loadable(() => import('../BindEmail'));
const SetPassword = loadable(() => import('../SetPassword'));
const KycGuideDialog = loadable(() => import('../KycGuideDialog'));
const LeaveDialog = loadable(() => import('../LeaveDialog'));

const bizTypeMap = {
  email: EMAIL_BIZTYPE,
  phone: PHONE_BIZTYPE,
};

const AccountPageOpener = {
  loginSuccess: 'loginSuccess',
  registerSuccess: 'registerSuccess',
};

export interface FusionSignUpProps {
  onChange?: (userInfo: any) => void;
  onBack?: () => void;
  visibleAgree?: boolean;
  BoxProps?: any;
  initEmail?: string;
  initPhone?: string;
  initPhoneCode?: string;
  bonusImg?: React.ReactNode;
  recallType?: number | null;
  fromDrawer?: boolean;
  forgetLeft?: React.ReactNode;
  noLayout?: boolean;
  trackingConfig?: any;
  kycGuideWithDialog?: boolean;
  setAccountDesc?: string;
  setAccountTitle?: string;
  onThirdPartySetAccount?: (account: any, sendCode?: () => void) => void;
  fromThirdPartySimpleSignup?: boolean;
  fromBindThirdPartyAccount?: boolean;
  onThirdPartyLoginAuthorizeComplete?: (data?: any) => void;
  singUpBtnText?: string;
  onAccountInput?: (value: string) => void;
  showInviterInfo?: boolean;
  multiSiteConfig?: any;
  thirdPartyPlatform?: IThirdPartyState['thirdPartyPlatform'];
  thirdPartyInfo?: IThirdPartyState['thirdPartyInfo'];
  onUpdateInviter?: (inviter?: InviterState['data'] | null) => void;
}

export function FusionSignUp(props: FusionSignUpProps = {}) {
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
    onAccountInput,
    showInviterInfo,
    thirdPartyPlatform,
    thirdPartyInfo,
    onUpdateInviter,
  } = props;

  const isH5 = useIsMobile();

  // 使用 Zustand store
  const currentStep = useSignupStore(state => state.currentStep);
  const isCaptchaOpen = useSignupStore(state => state.isCaptchaOpen);
  const sendVerifyCodePayload = useSignupStore(state => state.sendVerifyCodePayload);
  const registerType = useSignupStore(state => state.registerType);
  const userInfo = useSignupStore(state => state.userInfo);

  // Store actions
  const updateStore = useSignupStore(state => state.update);
  const nextStep = useSignupStore(state => state.nextStep);
  const rebackStep = useSignupStore(state => state.rebackStep);
  const bindThirdParty = useSignupStore(state => state.bindThirdParty);
  const sendSMSVerifyCode = useSignupStore(state => state.sendSMSVerifyCode);
  const sendEmailVerifyCode = useSignupStore(state => state.sendEmailVerifyCode);
  const postPhoneRecall = useSignupStore(state => state.postPhoneRecall);
  const postEmailRecall = useSignupStore(state => state.postEmailRecall);
  const pullInviterInfo = useSignupStore(state => state.pullInviterInfo);
  const clearInviterInfo = useSignupStore(state => state.clearInviterInfo);
  const resetInit = useSignupStore(state => state.resetInit);

  const { t } = useLang();
  const [invitationListDialogVisible, setInvitationListDialogVisible] = useState(false);
  const tenantConfig = getTenantConfig();
  const agreementList =
    typeof tenantConfig.signup.agreementList === 'function' ? (tenantConfig.signup.agreementList as any)(t) : [];
  const agreementListRef = useRef(agreementList);
  agreementListRef.current = agreementList;
  const signUpMultiSiteConfig = useMultiSiteConfig();

  const multiSiteConfig = props?.multiSiteConfig || signUpMultiSiteConfig?.multiSiteConfig; // use props first
  const supportEmailAccount = useMemo(
    () => multiSiteConfig?.accountConfig?.accountTypes?.includes('email') ?? false,
    [multiSiteConfig?.accountConfig?.accountTypes]
  );
  const isNewApi = useRegisterPhoneBindEmailABtest();

  const needEmail = useMemo(() => supportEmailAccount && isNewApi, [isNewApi, supportEmailAccount]);
  const bizType = useMemo(() => bizTypeMap[registerType as keyof typeof bizTypeMap], [registerType]);
  const [kycGuideDialogVisible, setKycGuideDialogVisible] = useState(false);

  const extraTrackingConfigData = useTrackingConfigDataOfInviter();

  // 签署完协议下一步到账号输入页面
  const beginSetAccountFromAgreement = (userTermList: any[]) => {
    // 更新签署的协议列表
    updateStore?.({
      userTermList,
    });
    nextStep?.(SIGNUP_STEP.REGISTER_STEP_SET_ACCOUNT);
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
        await bindThirdParty?.({
          code: '',
          validationType: 'EMAIL',
          extInfo: thirdPartyInfo!,
          extPlatform: thirdPartyPlatform!,
        });
        kcsensorsManualTrack(
          {
            spm: ['easyRegister', 'createResult'],
            data: {
              status: 'success',
            },
          },
          'register_result'
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
          'register_result'
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
          ? typeof (err as any).msg === 'string'
            ? (err as any).msg
            : JSON.stringify((err as any).msg)
          : String(err);
        if (msg) {
          updateStore?.({ registerTip: msg });
        }
      }
    } else {
      nextStep?.(SIGNUP_STEP.REGISTER_STEP_VERIFY_ACCOUNT);
    }
  };

  const beginVerifyCodeFromBindEmail = () => {
    kcsensorsManualTrack({ spm: ['gotoVerifyCodeFromBindEmail', '1'] }, 'page_click');
    nextStep?.(SIGNUP_STEP.REGISTER_STEP_VERIFY_ACCOUNT);
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
        nextStep?.(SIGNUP_STEP.REGISTER_STEP_BIND_EMAIL);
      } else {
        nextStep?.(SIGNUP_STEP.REGISTER_STEP_SET_PASSWORD);
      }
    },
    [needEmail]
  );

  const handleSetPasswordFinish = (userInfo: any) => {
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
  const onCloseCaptcha = (captchaType?: string) => {
    kcsensorsManualTrack(
      {
        spm: ['robotClose', '1'],
        data: { accountType: bizType, activityType: captchaType, ...extraTrackingConfigData },
      },
      'page_click'
    );
    updateStore?.({ isCaptchaOpen: false });
  };

  // 发送手机验证码
  const handleSendPhoneCode = (params: any) => {
    const { phone, countryCode } = params || {};
    // 发送成功
    kcsensorsManualTrack({ spm: ['phoneSendCode', '1'], data: extraTrackingConfigData }, 'page_click');
    sendSMSVerifyCode?.(params);
    // 注册召回接口调用
    if (recallType !== null) {
      postPhoneRecall?.({
        countryCode,
        language: navigator.language,
        phone: removeSpaceSE(phone),
        type: recallType,
      });
    }
  };

  // 发送邮箱验证码
  const handleSendEmailCode = (params: any) => {
    const { email } = params || {};
    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: extraTrackingConfigData }, 'page_click');
    sendEmailVerifyCode?.(params);
    // 注册召回接口调用
    if (recallType !== null) {
      postEmailRecall?.({
        language: navigator.language,
        type: recallType,
        email: removeSpaceSE(email),
      });
    }
  };

  // 人机校验通过
  const onValidateSuccess = (captchaType: string) => {
    updateStore?.({ isCaptchaOpen: false });
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
      'page_click'
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
      'page_click'
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
      'page_click'
    );
  };

  // 人机校验拉取失败
  const onValidateError = (captchaType: string) => {
    kcsensorsManualTrack(
      { spm: ['robotfail', '1'], data: { accountType: bizType, activityType: captchaType } },
      'page_click'
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
      'page_click'
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
      'page_click'
    );
  };

  // 点击回退回调
  const onBackHandle = () => {
    rebackStep?.(onBack);
  };

  useEffect(() => {
    // 如果有协议，则默认展示协议页面
    if (agreementListRef.current && agreementListRef.current.length) {
      updateStore?.({
        currentStep: SIGNUP_STEP.REGISTER_AGREEMENT,
      });
    }
  }, [updateStore]);

  useEffect(() => {
    const persistenceRcode = queryPersistence.getPersistenceQuery('rcode');
    // 只要没有 persistenceRcode 或者 不展示邀请者信息 showInviterInfo = false, 都不请求邀请者信息
    // 所以必须二者都存在，才展示邀请者信息
    if (persistenceRcode && showInviterInfo) {
      pullInviterInfo?.({ rcode: persistenceRcode, updateInviteInfo: onUpdateInviter });
    }
    return () => {
      clearInviterInfo?.({ updateInviteInfo: onUpdateInviter });
    };
  }, [showInviterInfo, pullInviterInfo, clearInviterInfo]);

  useEffect(() => {
    return () => {
      resetInit?.();
    };
  }, [resetInit]);

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
    if (getIsApp()) {
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
    if (isCaptchaOpen) {
      if (registerType && ['email', 'phone'].includes(registerType)) {
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

  // 是否隐藏第三方登录 (三方注册绑定流程、 抽屉形式注册、没有三方登陆授权完成回调)
  const isHideThirdPartyLogin =
    // 三方极简注册
    fromThirdPartySimpleSignup ||
    // 三方绑定注册
    fromBindThirdPartyAccount ||
    fromDrawer ||
    !onThirdPartyLoginAuthorizeComplete;

  return (
    <>
      <Captcha
        bizType={bizType}
        open={isCaptchaOpen}
        onClose={onCloseCaptcha}
        onValidateSuccess={onValidateSuccess}
        onValidateError={onValidateError}
      />
      <Box
        className={clsx(styles.contentBox, {
          [styles.fromDrawer]: fromDrawer,
          [styles.noLayout]: noLayout,
        })}
        style={{ flex: isH5 ? 1 : 'auto' }}
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
              <LoginStoreProvider>
                <ThirdPartyLogin
                  // 三方登陆接口不会出人机校验
                  onAuthorizeComplete={onThirdPartyLoginAuthorizeComplete}
                  multiSiteConfig={multiSiteConfig}
                />
                {/* 展示第三方登录时，调整 forgetLeft 布局(（实际是“已有账号？快速登录”的入口）的位置，放到第三方登录下面。 用 AlreadyHasCount 包裹是复用 SetAccount.js 内部的包裹逻辑 */}
                <div className={commonStyles.alreadyHasCount}>{forgetLeft}</div>
              </LoginStoreProvider>
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
            thirdPartyPlatform={thirdPartyPlatform}
            thirdPartyInfo={thirdPartyInfo}
          />
        ) : currentStep === SIGNUP_STEP.REGISTER_STEP_SET_PASSWORD ? (
          <SetPassword
            bonusImg={bonusImg}
            fromDrawer={fromDrawer}
            trackingConfig={trackingConfig}
            onFinish={handleSetPasswordFinish}
            needEmail={needEmail}
            onBack={onBackHandle}
          />
        ) : null}
      </Box>
      {/* 没有 kyc 引导步骤了，只要支持注册引导，都会有挽留弹窗 */}
      {multiSiteConfig?.registerConfig?.supportRegisterGuide ? <LeaveDialog /> : null}
      {kycGuideWithDialog ? <KycGuideDialog open={kycGuideDialogVisible} onClose={handleCloseKycGuideDialog} /> : null}
      <InvitationListDialog
        visible={invitationListDialogVisible}
        onClose={() => {
          setInvitationListDialogVisible(false);
        }}
      />
    </>
  );
}
