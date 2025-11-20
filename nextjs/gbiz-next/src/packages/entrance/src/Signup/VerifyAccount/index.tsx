/**
 * Owner: sean.shi@kupotech.com
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { get as safeGet } from 'lodash';
import { Spin, Button } from '@kux/mui';
import { useTranslation } from 'tools/i18n';
import { SIGNUP_TYPE_CONFIG } from '../constants';
import { useToast, useRegisterPhoneBindEmailABtest, useTrackingConfigDataOfInviter } from '../../hookTool';
import Email from '../../components/ValidateFormV2/Email';
import SMS from '../../components/ValidateFormV2/SMS';
import { Back } from '../../components/Back';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { compose, removeSpaceSE, sentryReport } from '../../common/tools';
import { useSignupStore } from '../model';
import clsx from 'clsx';
import commonStyles from '../index.module.scss';
import styles from './index.module.scss';
import { IThirdPartyState, useLoginStore } from '../../Login/model';

interface VerifyAccountProps {
  fromDrawer?: boolean;
  onFinish?: (thirdPartyBindComplete?: boolean, isRegisterByPhone?: boolean) => void;
  trackingConfig?: any;
  recallType?: number | null;
  fromBindThirdPartyAccount?: boolean;
  onBack?: () => void;
  thirdPartyPlatform?: IThirdPartyState['thirdPartyPlatform'];
  thirdPartyInfo?: IThirdPartyState['thirdPartyInfo'];
}

const VerifyAccount = ({
  fromDrawer,
  onFinish,
  trackingConfig = {},
  recallType = null,
  fromBindThirdPartyAccount,
  onBack,
  thirdPartyPlatform,
  thirdPartyInfo,
}: VerifyAccountProps) => {
  const toast = useToast();
  const { t } = useTranslation('entrance');

  // 使用 Zustand store
  const loading = useSignupStore(state => state.loading);
  const smsRetryAfterSeconds = useSignupStore(state => state.smsRetryAfterSeconds);
  const emailRetryAfterSeconds = useSignupStore(state => state.emailRetryAfterSeconds);
  const preRegisterData = useSignupStore(state => state.preRegisterData);
  const registerType = useSignupStore(state => state.registerType) || '';

  // Store actions
  const updateStore = useSignupStore(state => state.update);
  const verifyCode = useSignupStore(state => state.verifyCode);
  const bindThirdParty = useSignupStore(state => state.bindThirdParty);
  const sendSMSVerifyCode = useSignupStore(state => state.sendSMSVerifyCode);
  const sendEmailVerifyCode = useSignupStore(state => state.sendEmailVerifyCode);
  const postPhoneRecall = useSignupStore(state => state.postPhoneRecall);
  const postEmailRecall = useSignupStore(state => state.postEmailRecall);

  const verifyCodeLoading = useSignupStore(state => state.verifyCodeLoading);
  const [inputEmailCode, setInputEmailCode] = useState<{ email: string; error: boolean }>({ email: '', error: true });
  const [inputPhoneCode, setInputPhoneCode] = useState<{ phone: string; error: boolean }>({ phone: '', error: true });
  const hasSent = useRef(true);
  const isNewApi = useRegisterPhoneBindEmailABtest();

  // 组装需要的数据
  const { phone, email, countryCode = '' } = preRegisterData || {};

  const isRegisterByPhone = useMemo(() => registerType === 'phone', [registerType]);
  const postRecallParams = useMemo(
    () =>
      isRegisterByPhone
        ? {
            countryCode,
            language: navigator.language,
            phone,
            type: recallType,
          }
        : {
            language: navigator.language,
            type: recallType,
            email: removeSpaceSE(email),
          },
    [isRegisterByPhone, countryCode, phone, recallType, email]
  );

  const { validationType } = useMemo(
    () => SIGNUP_TYPE_CONFIG[registerType as keyof typeof SIGNUP_TYPE_CONFIG],
    [registerType]
  );

  // 手机验证码监听
  const phoneSendCodeChange = (phone: { value: string; error: boolean }) =>
    setInputPhoneCode({ phone: phone.value, error: phone.error });

  // 邮箱验证码监听
  const emailSendCodeChange = (email: { value: string; error: boolean }) =>
    setInputEmailCode({ email: email.value, error: email.error });

  // 发送验证码之后同时需要调用的接口
  const sendCodeCb = () => {
    // 注册召回接口调用
    if (recallType !== null) {
      // 仅调用接口，没有其他逻辑
      if (isRegisterByPhone) {
        postPhoneRecall?.(postRecallParams as any);
      } else {
        postEmailRecall?.(postRecallParams as any);
      }
    }
    kcsensorsManualTrack({ spm: ['resentCode', '1'] }, 'page_click');
  };

  const extraTrackingConfigData = useTrackingConfigDataOfInviter();
  // 校验验证码
  const handleSubmit = async () => {
    const val = isRegisterByPhone ? inputPhoneCode.phone : inputEmailCode.email;
    // 自动注册并绑定三方账号
    if (fromBindThirdPartyAccount) {
      try {
        trackClick(['registerSecurityVerification', 'submitButton']);
        await bindThirdParty?.({
          code: val,
          validationType,
          extInfo: thirdPartyInfo!,
          extPlatform: thirdPartyPlatform!,
        });
        kcsensorsManualTrack(
          {
            spm: ['normalRegister', 'createResult'],
            data: {
              status: 'success',
            },
          },
          'register_result'
        );
        onFinish?.(true);
      } catch (e) {
        sentryReport({
          level: 'warning',
          message: `signup page third party signup error: ${e}`,
          tags: {
            errorType: 'third_party_bind_signup_error',
          },
        });
        kcsensorsManualTrack(
          {
            spm: ['normalRegister', 'createResult'],
            data: {
              status: 'fail',
            },
          },
          'register_result'
        );
        toast.error(t('5uykjGhPRbQ3fRZByV1ZP2'));
      }
    } else {
      kcsensorsManualTrack(
        {
          spm: ['activeConfirm', '1'],
          data: {
            pagecate: fromDrawer ? 'sideRegister' : 'page',
            ...safeGet(trackingConfig, 'data', {}),
          },
        },
        'page_click'
      );

      kcsensorsManualTrack(
        {
          spm: [isRegisterByPhone ? 'phoneInsertCode' : 'emailInsertCode', '1'],
          data: extraTrackingConfigData,
        },
        'page_click'
      );
      kcsensorsManualTrack(
        {
          spm: [isRegisterByPhone ? 'SMSSecurityVerify' : 'emailSecurityVerify', 'submit'],
          data: {
            before_click_element_value: '',
            after_click_element_value: 'Submit',
          },
        },
        'page_click'
      );
      let validationBiz = 'REGISTER';
      // 神策白名单
      if (isNewApi) {
        // 手机号验证，必须是新流程
        if (isRegisterByPhone) {
          validationBiz = 'REGISTER_SMS';
        } else if (phone) {
          // 手机号绑定邮箱验证
          kcsensorsManualTrack(
            {
              spm: ['bindEmailVerify', '1'],
            },
            'page_click'
          );
          kcsensorsManualTrack(
            {
              spm: ['signupBindEmailverify', 'confirm'],
              data: {
                before_click_element_value: '',
                after_click_element_value: 'confirm',
              },
            },
            'page_click'
          );
          // 邮箱验证，此时有手机号，说明邮箱验证是新流程中第二步
          validationBiz = 'REGISTER_EMAIL';
        }
      }

      // 根据类型分别传递参数，修复类型不兼容问题
      if (isRegisterByPhone) {
        await verifyCode?.({
          code: val,
          validationType: 'PHONE',
          toast,
          countryCode,
          phone,
          validationBiz,
          // 校验验证码成功回调
          verifyCodeSuccessCb: () => {
            onFinish?.(false, true);
          },
        });
      } else {
        await verifyCode?.({
          code: val,
          validationType: 'EMAIL',
          toast,
          email,
          validationBiz,
          // 校验验证码成功回调
          verifyCodeSuccessCb: () => {
            onFinish?.(false, false);
          },
        });
      }
    }
  };

  const handleAskCode = () => {
    kcsensorsManualTrack(
      {
        spm: [
          isRegisterByPhone ? 'SMSSecurityVerify' : phone ? 'signupBindEmailverify' : 'emailSecurityVerify',
          'noVerifyCode',
        ],
        data: {
          before_click_element_value: '',
          after_click_element_value: "Didn't receive the verification code?",
        },
      },
      'page_click'
    );
  };
  // 语音验证码
  const onSendVoice = () => {
    return sendSMSVerifyCode?.({
      countryCode,
      phone: removeSpaceSE(phone),
      toast,
      t,
      sendChannel: 'VOICE',
    });
  };

  const canSubmit = useMemo(() => {
    if (isRegisterByPhone && inputPhoneCode.error) {
      return false;
    }
    if (!isRegisterByPhone && inputEmailCode.error) {
      return false;
    }

    return true;
  }, [isRegisterByPhone, inputPhoneCode.error, inputEmailCode.error]);

  // 账号验证曝光
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signupAccountVerify', '1'],
      ...((trackingConfig && trackingConfig.data) || {}),
    });
    if (fromBindThirdPartyAccount) {
      kcsensorsManualTrack({
        spm: ['registerSecurityVerification', '1'],
        data: {
          pre_spm_id: compose(['createNewKCAccount', 'createButton']),
        },
      });
    }
    kcsensorsManualTrack({
      spm: [isRegisterByPhone ? 'SMSSecurityVerify' : phone ? 'signupBindEmailverify' : 'emailSecurityVerify', '1'],
      data: {
        is_login: false,
        pre_spm_id: isRegisterByPhone
          ? 'kcWeb.B1register.createAccount.confirm'
          : phone
          ? 'kcWeb.B1register.signupBindEmail.confirm'
          : 'kcWeb.B1register.createAccount.confirm',
      },
    });
  }, []);

  return (
    // @ts-ignore
    <Spin spinning={verifyCodeLoading} size="small">
      <div className={clsx(styles.verifyAccountWrap, 'AccountActive-Wrap')} data-inspector="account_verify_wrapper">
        <Back onBack={onBack} />
        <h2 className={commonStyles.title}>{t('verify')}</h2>
        <div className={styles.tips}>{t('08042ac296784000a371')}</div>
        {isRegisterByPhone ? (
          <SMS
            allowClear={false}
            value={inputPhoneCode.phone}
            isAutoSendCode={false}
            hasSent={hasSent}
            onChange={phoneSendCodeChange}
            extra={{
              smsRetryAfterSeconds,
              phone,
              countryCode,
              loadingSms: loading,
              onFinish: () => {
                updateStore?.({
                  smsRetryAfterSeconds: { time: 0, deadline: 0 },
                });
              },
              onSendCode: () => {
                if (loading) return;
                sendSMSVerifyCode?.({
                  t,
                  toast,
                  sendChannel: 'SMS',
                  validationBiz: isNewApi && !fromBindThirdPartyAccount ? 'REGISTER_SMS' : 'REGISTER',
                });
                sendCodeCb();
              },
            }}
            onSendVoice={onSendVoice}
          />
        ) : (
          <Email
            allowClear={false}
            value={inputEmailCode.email}
            isAutoSendCode={false}
            hasSent={hasSent}
            onChange={emailSendCodeChange}
            extra={{
              emailRetryAfterSeconds,
              email,
              loadingEmail: loading,
              onFinish: () => {
                updateStore?.({
                  emailRetryAfterSeconds: { time: 0, deadline: 0 },
                });
              },
              onSendCode: () => {
                sendEmailVerifyCode?.({
                  t,
                  toast,
                  sendChannel: '',
                  validationBiz: isNewApi && !fromBindThirdPartyAccount ? 'REGISTER_EMAIL' : 'REGISTER',
                });
              },
            }}
          />
        )}
        {/* @ts-ignore */}
        <Button
          fullWidth
          className={styles.submitButton}
          size="large"
          loading={verifyCodeLoading}
          disabled={!canSubmit}
          onClick={handleSubmit}
          data-inspector="set_password_btn"
        >
          {t('gfa_btn')}
        </Button>
      </div>
    </Spin>
  );
};

export default VerifyAccount;
