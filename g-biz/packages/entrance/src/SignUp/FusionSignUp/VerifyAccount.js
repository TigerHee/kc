/**
 * Owner: iron@kupotech.com
 */
import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get as safeGet } from 'lodash';
import { useTheme, Spin, Button, styled } from '@kux/mui';
import {
  useTranslation,
  // Trans
} from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import { NAMESPACE, PHONE_BIZTYPE, SIGNUP_TYPE_CONFIG } from '../constants';
import {
  useToast,
  useRegisterPhoneBindEmailABtest,
  useCountDown,
  useTrackingConfigDataOfInviter,
} from '../../hookTool';
import NewVoiceCodeV2 from '../../components/NewVoiceCode/v2';
import Email from '../../components/ValidateFormV2/Email';
import SMS from '../../components/ValidateFormV2/SMS';
import { Back } from '../../components/Back';
import { compose, kcsensorsClick, removeSpaceSE, sentryReport } from '../../common/tools';
import { Tips, Title, VerifyAccountWrap, VoiceCodeWrapper } from './styled';

export const SubmitButton = styled(Button)`
  margin-top: 32px;
`;

const Container = styled.div`
  display: inline-block;
`;

const BaseText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  cursor: ${({ disable }) => (disable ? 'default' : 'pointer')};
  color: ${({ theme, disable }) => (disable ? 'inherit' : theme.colors.text)};
  text-decoration-line: underline;
`;

const VerifyAccount = ({
  fromDrawer,
  onFinish,
  trackingConfig = {},
  recallType = null,
  fromBindThirdPartyAccount,
  onBack,
}) => {
  const toast = useToast();
  const { t } = useTranslation('entrance');
  const {
    loading,
    smsRetryAfterSeconds,
    emailRetryAfterSeconds,
    preRegisterData,
    registerType,
  } = useSelector((state) => state[NAMESPACE]);
  const verifyCodeLoading = useSelector((s) => s.loading.effects[`${NAMESPACE}/verifyCode`]);
  const bindThirdPartyLoading = useSelector(
    (s) => s.loading.effects[`${NAMESPACE}/bindThirdParty`],
  );
  const [voiceModal, setVoiceModal] = useState(false);
  const theme = useTheme();
  const [inputEmailCode, setInputEmailCode] = useState({ email: '', error: true });
  const [inputPhoneCode, setInputPhoneCode] = useState({ phone: '', error: true });
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const hasSent = useRef(true);
  const isNewApi = useRegisterPhoneBindEmailABtest();

  // 组装需要的数据
  const { phone, email, countryCode } = preRegisterData || {};

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
    [isRegisterByPhone, countryCode, phone, recallType, email],
  );

  const { validationType } = useMemo(() => SIGNUP_TYPE_CONFIG[registerType], [registerType]);

  // 手机验证码监听
  const phoneSendCodeChange = (phone) =>
    setInputPhoneCode({ phone: phone.value, error: phone.error });

  // 邮箱验证码监听
  const emailSendCodeChange = (email) =>
    setInputEmailCode({ email: email.value, error: email.error });

  // 发送验证码之后同时需要调用的接口
  const sendCodeCb = () => {
    // 注册召回接口调用
    if (recallType !== null) {
      // 仅调用接口，没有其他逻辑
      dispatch({
        type: `${NAMESPACE}/${SIGNUP_TYPE_CONFIG[registerType].recallAPI}`,
        payload: postRecallParams,
      });
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
        kcsensorsClick(['registerSecurityVerification', 'submitButton']);
        await dispatch({
          type: `${NAMESPACE}/bindThirdParty`,
          payload: { code: val, validationType },
        });
        kcsensorsManualTrack(
          {
            spm: ['normalRegister', 'createResult'],
            data: {
              status: 'success',
            },
          },
          'register_result',
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
          'register_result',
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
        'page_click',
      );

      kcsensorsManualTrack(
        {
          spm: [isRegisterByPhone ? 'phoneInsertCode' : 'emailInsertCode', '1'],
          data: extraTrackingConfigData,
        },
        'page_click',
      );
      kcsensorsManualTrack(
        {
          spm: [isRegisterByPhone ? 'SMSSecurityVerify' : 'emailSecurityVerify', 'submit'],
          data: {
            before_click_element_value: '',
            after_click_element_value: 'Submit',
          },
        },
        'page_click',
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
            'page_click',
          );
          kcsensorsManualTrack(
            {
              spm: ['signupBindEmailverify', 'confirm'],
              data: {
                before_click_element_value: '',
                after_click_element_value: 'confirm',
              },
            },
            'page_click',
          );
          // 邮箱验证，此时有手机号，说明邮箱验证是新流程中第二步
          validationBiz = 'REGISTER_EMAIL';
        }
      }

      await dispatch({
        type: `${NAMESPACE}/verifyCode`,
        payload: {
          code: val,
          validationType,
          toast,
          countryCode,
          [registerType]: isRegisterByPhone ? phone : email,
          validationBiz,
          // 校验验证码成功回调
          verifyCodeSuccessCb: () => {
            onFinish?.(false, isRegisterByPhone);
          },
        },
      });
    }
  };

  const handleAskCode = () => {
    setVoiceModal(true);
    kcsensorsManualTrack(
      { spm: ['noVerificationCode', '1'], data: extraTrackingConfigData },
      'page_click',
    );
    kcsensorsManualTrack(
      {
        spm: [
          isRegisterByPhone
            ? 'SMSSecurityVerify'
            : phone
            ? 'signupBindEmailverify'
            : 'emailSecurityVerify',
          'noVerifyCode',
        ],
        data: {
          before_click_element_value: '',
          after_click_element_value: "Didn't receive the verification code?",
        },
      },
      'page_click',
    );
  };

  // 语音验证码
  const onSendVoice = () => {
    return dispatch({
      type: `${NAMESPACE}/sendSMSVerifyCode`,
      payload: {
        countryCode,
        phone: removeSpaceSE(phone),
        bizType: PHONE_BIZTYPE,
        toast,
        sendChannel: 'VOICE',
      },
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
      spm: [
        isRegisterByPhone
          ? 'SMSSecurityVerify'
          : phone
          ? 'signupBindEmailverify'
          : 'emailSecurityVerify',
        '1',
      ],
      data: {
        is_login: false,
        pre_spm_id: isRegisterByPhone
          ? 'kcWeb.B1register.createAccount.confirm'
          : phone
          ? 'kcWeb.B1register.signupBindEmail.confirm'
          : 'kcWeb.B1register.createAccount.confirm',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { countTime } = useCountDown({
    deadline: isRegisterByPhone ? smsRetryAfterSeconds?.deadline : emailRetryAfterSeconds?.deadline,
    onBegin: () => {
      setDisable(true);
    },
    onFinish: () => {
      setDisable(false);
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: isRegisterByPhone
          ? {
              smsRetryAfterSeconds: { time: 0, deadline: 0 },
            }
          : {
              emailRetryAfterSeconds: { time: 0, deadline: 0 },
            },
      });
    },
  });

  return (
    <Spin spinning={!!verifyCodeLoading || !!bindThirdPartyLoading} size="small">
      <VerifyAccountWrap className="AccountActive-Wrap" data-inspector="account_verify_wrapper">
        <Back onBack={onBack} />
        <Title theme={theme} fromDrawer={fromDrawer}>
          {t('verify')}
        </Title>
        <Tips>{t('08042ac296784000a371')}</Tips>
        {isRegisterByPhone ? (
          <SMS
            allowClear={false}
            namespace={NAMESPACE}
            value={inputPhoneCode.phone}
            isAutoSendCode={false}
            hasSent={hasSent}
            onChange={phoneSendCodeChange}
            sendCodeCb={sendCodeCb}
            fromBindThirdPartyAccount={fromBindThirdPartyAccount}
          />
        ) : (
          <Email
            allowClear={false}
            namespace={NAMESPACE}
            value={inputEmailCode.email}
            isAutoSendCode={false}
            hasSent={hasSent}
            onChange={emailSendCodeChange}
          />
        )}
        <VoiceCodeWrapper>
          <Container className="voiceCodeBox">
            <NewVoiceCodeV2
              open={voiceModal}
              title={
                <BaseText onClick={handleAskCode} theme={theme} className="voiceCodeText">
                  {t('newsignup.code.ask')}
                </BaseText>
              }
              phone={phone}
              email={email}
              countryCode={countryCode}
              countTime={countTime}
              loading={loading}
              disable={disable}
              onSend={onSendVoice}
              onClose={() => {
                setVoiceModal(false);
              }}
              trackingConfig={trackingConfig}
              theme={theme.currentTheme}
            />
          </Container>
        </VoiceCodeWrapper>
        <SubmitButton
          fullWidth
          size="large"
          loading={loading}
          disabled={!canSubmit}
          onClick={handleSubmit}
          data-inspector="set_password_btn"
        >
          {t('gfa_btn')}
        </SubmitButton>
      </VerifyAccountWrap>
    </Spin>
  );
};

export default VerifyAccount;
