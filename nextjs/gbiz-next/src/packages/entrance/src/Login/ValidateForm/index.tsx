/**
 * Owner: sean.shi@kupotech.com
 * gbiz 中是 ValidateFormV2
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ICArrowRight2Outlined, ICSecurityOutlined } from '@kux/icons';
import { Box, Button, Checkbox, Form, Spin } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import { kcsensorsManualTrack } from 'tools/sensors';
import { compose, getTrackingSource } from '../../common/tools';
import { SwitchMultiTypeModal } from '../../components/SwitchMultiTypeModal';
import Email from '../../components/ValidateFormV2/Email';
import GFA from '../../components/ValidateFormV2/GFA';
import SMS from '../../components/ValidateFormV2/SMS';
import { useLang, useToast } from '../../hookTool';
import { TOKEN_INVALID_CODE } from '../../common/constants';
import { RISK_TAG, THIRD_PARTY_ACCOUNT_DIVERSION_STEP } from '../constants';
import { TUserResponse, useLoginStore } from '../../Login/model';
import styles from './index.module.scss';
import { TFunction } from 'next-i18next';
import Alert from '../../components/Alert';
import { addLangToPath } from 'tools';

const { FormItem } = Form;

interface ValidateFormProps {
  namespace: string;
  onSuccess?: (data: TUserResponse | null) => void;
  verifyCanNotUseClick?: (token: string) => void;
  showLoginSafeWord?: boolean;
  isSub?: boolean;
  trackingConfig?: Record<string, any>;
  withDrawer?: boolean;
  token?: string;
  onBack?: () => void;
}

const ValidateForm: React.FC<ValidateFormProps> = props => {
  const {
    onSuccess,
    verifyCanNotUseClick,
    showLoginSafeWord,
    isSub = false,
    trackingConfig = {},
    withDrawer,
    token,
    onBack,
  } = props;

  // zustand
  const loginSafeWord = useLoginStore(state => state.loginSafeWord);
  const riskTag = useLoginStore(state => state.riskTag);
  const phone = useLoginStore(state => state.phone);
  const email = useLoginStore(state => state.email);
  const needValidations = useLoginStore(state => state.needValidations) || [];
  const countryCode = useLoginStore(state => state.countryCode);
  const isThirdPartyBindAccount = useLoginStore(state => state.isThirdPartyBindAccount);
  const validateLoading = useLoginStore(state => state.validateLoading);
  const sendVerifyCode = useLoginStore(state => state.sendVerifyCode);
  const validate = useLoginStore(state => state.validate);
  const emailRetryAfterSeconds = useLoginStore(state => state.emailRetryAfterSeconds);
  const loadingEmail = useLoginStore(state => state.loadingEmail);
  const update = useLoginStore(state => state.update);
  const smsRetryAfterSeconds = useLoginStore(state => state.smsRetryAfterSeconds);
  const loadingSms = useLoginStore(state => state.loadingSms);
  const isThirdPartyLogin = useLoginStore(state => state.isThirdPartyLogin);
  const thirdPartyPlatform = useLoginStore(state => state.thirdPartyPlatform)!;
  const thirdPartyDiversionStep = useLoginStore(state => state.thirdPartyDiversionStep);

  const toast = useToast();
  const isH5 = useIsMobile();
  const [trustDevice, setTrustDevice] = useState(false);
  const [inputEmailCode, setInputEmailCode] = useState({ email: '', error: true });
  const [inputPhoneCode, setInputPhoneCode] = useState({ phone: '', error: true });
  const [inputG2FACode, setInputG2FACode] = useState({ g2fa: '', error: true });
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const { t } = useLang();
  const { warnText } = riskTag ? RISK_TAG[riskTag] || {} : {};

  const [currentType, setCurrentType] = useState(0);

  const currentValidation = useMemo(() => {
    return needValidations.length > 0 ? needValidations[currentType] : [];
  }, [currentType, needValidations]);

  const [isAutoSendCode, setIsAutoSendCode] = useState(false);
  const hasSent = useRef(false);

  const hasEmail = currentValidation?.includes('my_email');
  const hasSMS = currentValidation?.includes('my_sms');
  const hasGFA = currentValidation?.includes('google_2fa');

  // 如果子账号只有Google 2FA 校验 不展示不可用入口
  const onlyG2FAWhenIsSub = useMemo(() => {
    const allValidations = [...new Set(currentValidation?.flat())];
    return isSub && allValidations?.length === 1 && allValidations.includes('google_2fa');
  }, [currentValidation, isSub]);

  // 当且仅当第一个验证方式只有一个，且不是谷歌验证器验证码的时候，自动发送验证码
  useEffect(() => {
    if (
      isAutoSendCode === false &&
      hasSent.current === false &&
      needValidations?.length > 0 &&
      needValidations[0]?.length === 1 &&
      currentValidation.length === 1 &&
      needValidations[0][0] !== 'google_2fa' &&
      needValidations[0][0] === currentValidation[0]
    ) {
      setIsAutoSendCode(true);
    }
  }, []);

  // 返回
  const goback = () => {
    onBack?.();
  };

  const canSubmit = useMemo(() => {
    if (hasEmail && inputEmailCode.error) {
      return false;
    }
    if (hasSMS && inputPhoneCode.error) {
      return false;
    }
    if (hasGFA && inputG2FACode.error) {
      return false;
    }
    return true;
  }, [hasEmail, inputEmailCode.error, hasSMS, inputPhoneCode.error, hasGFA, inputG2FACode.error]);

  const handleVerifyValidation = useCallback(() => {
    if (currentValidation.length === 0 && needValidations.length === 0) {
      return;
    }
    const validations: Record<string, string> = {};
    if (hasEmail) {
      validations.my_email = inputEmailCode.email;
    }
    if (hasSMS) {
      validations.my_sms = inputPhoneCode.phone;
    }
    if (hasGFA) {
      validations.google_2fa = inputG2FACode.g2fa;
    }
    const trackSource = getTrackingSource(trackingConfig);
    validate?.({
      payload: {
        toast,
        token,
        validations,
        trustDevice,
        validationType: currentValidation.join(''),
        t: t as TFunction,
      },
      onSuccess,
      onBack,
      trackResultParams: {
        source: trackSource,
      },
    });
  }, [
    currentValidation,
    hasEmail,
    hasGFA,
    hasSMS,
    inputEmailCode.email,
    inputG2FACode.g2fa,
    inputPhoneCode.phone,
    needValidations.length,
    onBack,
    onSuccess,
    t,
    toast,
    token,
    trackingConfig,
    trustDevice,
    validate,
  ]);

  const handleSecurityUnavailable = () => {
    if (typeof verifyCanNotUseClick === 'function') {
      verifyCanNotUseClick?.(token || '');
    } else {
      window.location.href = addLangToPath(`/ucenter/reset-security/token/${token}`);
    }
  };

  const handleSwitchValidation = () => {
    kcsensorsManualTrack({
      spm: ['switchVerification', '1'],
    });
    if (needValidations.length > 2) {
      setSwitchModalOpen(true);
    } else if (needValidations.length === 2) {
      setCurrentType(currentType === 0 ? 1 : 0);
    }
  };

  const handleSubmit = () => {
    handleVerifyValidation();
  };

  const handleSendCodeError = (err: any) => {
    if (err?.code === TOKEN_INVALID_CODE) {
      onBack?.();
    }
  };
  const handleEmailChange = (email: { value: string; error: boolean }) => {
    kcsensorsManualTrack({
      spm: ['emailInsertCode', '1'],
    });
    setInputEmailCode({ email: email.value, error: email.error });
  };
  const handleSMSChange = (phone: { value: string; error: boolean }) => {
    kcsensorsManualTrack({
      spm: ['phoneInsertCode', '1'],
    });
    setInputPhoneCode({ phone: phone.value, error: phone.error });
  };
  const handleG2faChange = (g2fa: { value: string; error: boolean }) => {
    kcsensorsManualTrack({
      spm: ['googleInsertCode', '1'],
    });
    setInputG2FACode({ g2fa: g2fa.value, error: g2fa.error });
  };
  const handleTrustCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    kcsensorsManualTrack({
      spm: ['trustDevice', '1'],
      data: {
        checked: e.target.checked,
      },
    });
    setTrustDevice(e.target.checked);
  };

  // 登陆验证组件曝光事件
  useEffect(() => {
    let preSpmId: string[] = [];
    // 三方免密登陆
    if (isThirdPartyLogin) {
      preSpmId = ['thirdAccount', thirdPartyPlatform];
    } else if (isThirdPartyBindAccount) {
      if (thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.EXIST_ACCOUNT_LOGIN) {
        // 登陆绑定
        preSpmId = ['loginExistingKCAccount', 'nextButton'];
      } else if (thirdPartyDiversionStep === THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT) {
        preSpmId = ['bindExistingKCAccountInputPassword', 'nextButton'];
      }
    }
    kcsensorsManualTrack({
      spm: ['signinVerify', '1'],
      data: preSpmId.length
        ? {
            pre_spm_id: compose(preSpmId),
          }
        : {},
    });
  }, []);

  return (
    <Spin spinning={!!validateLoading} size="small">
      <Box display="flex" flexDirection="column" height="100%" data-inspector="signin_verify_container">
        <Box flex="1">
          {/* 返回 */}
          <Box display="flex" className={clsx(isH5 ? styles.mb24 : styles.mb40, isH5 ? styles.mtNeg16 : '')}>
            <div className={clsx(styles.back)} onClick={goback}>
              <ICArrowRight2Outlined size="16" />
              <span> {t('8RcupwHqYraGhrjT8kAzG7')}</span>
            </div>
          </Box>
          {/* title */}
          <h2 className={clsx(styles.title, { [styles.withDrawer]: withDrawer })}>{t('verify')}</h2>
          {/* 通过此验证来证实您确实是该账号的所有者 */}
          <div className={styles.subtitle}>{t('08042ac296784000a371')}</div>
          {!!warnText && (
            <div className={styles.riskAlert}>
              <Alert title={t(warnText)} closable={false} type="warning" showIcon />
            </div>
          )}
          {hasEmail && (
            <Email
              allowClear={false}
              value={inputEmailCode.email}
              isAutoSendCode={isAutoSendCode}
              hasSent={hasSent}
              onChange={handleEmailChange}
              extra={{
                emailRetryAfterSeconds,
                email,
                loadingEmail,
                onFinish: () => {
                  update?.({
                    emailRetryAfterSeconds: { time: 0, deadline: 0 },
                  });
                },
                onSendCode: () => {
                  sendVerifyCode?.({
                    payload: {
                      toast,
                      sendChannel: 'MY_EMAIL',
                    },
                    onSendError: handleSendCodeError,
                  });
                },
              }}
            />
          )}
          {hasSMS && (
            <SMS
              allowClear={false}
              value={inputPhoneCode.phone}
              hasSent={hasSent}
              isAutoSendCode={isAutoSendCode}
              onChange={handleSMSChange}
              onSendVoice={() => {
                sendVerifyCode?.({
                  payload: {
                    toast,
                    sendChannel: 'MY_VOICE',
                  },
                  onSendError: handleSendCodeError,
                });
              }}
              extra={{
                smsRetryAfterSeconds,
                phone,
                countryCode,
                loadingSms,
                onFinish: () => {
                  update?.({
                    smsRetryAfterSeconds: { time: 0, deadline: 0 },
                  });
                },
                onSendCode: () => {
                  sendVerifyCode?.({
                    payload: {
                      toast,
                      sendChannel: 'MY_SMS',
                    },
                    onSendError: handleSendCodeError,
                  });
                },
              }}
            />
          )}
          {hasGFA && <GFA allowClear={false} defaultValue={inputG2FACode.g2fa} onChange={handleG2faChange} />}
          <Form className={`${styles.formWrapper} ${styles.mt12}`}>
            <FormItem initialValue={trustDevice} valuePropName="checked" name="trustDevice">
              <Checkbox
                className={styles.trustCheckbox}
                onChange={handleTrustCheck}
                checkOptions={{
                  type: 2,
                  checkedType: 1,
                }}
              >
                {t('gfa_trust')}
              </Checkbox>
            </FormItem>
          </Form>
          {isH5 && (
            <Button
              className={styles.mt32}
              size="large"
              disabled={!canSubmit}
              fullWidth
              onClick={handleSubmit}
              data-inspector="entrance_verify_button"
            >
              {t('gfa_btn')}
            </Button>
          )}
          {/* 安全语 */}
          {showLoginSafeWord && isH5 ? (
            <div className={clsx(styles.safeWordBox, styles.mt16)}>
              <p className={styles.safeword}>
                <ICSecurityOutlined size="20" />
                <span>{loginSafeWord || t('login_safe_word')}</span>
              </p>
              <p className={styles.safewordTips}>
                {loginSafeWord ? t('has_login_safe_word_tips') : t('no_login_safe_word_tips')}
              </p>
            </div>
          ) : null}
          <Box style={{ height: isH5 ? '28px' : '16px' }} />
          {/* 三方登陆展示不可用入口 , 子账号只有g2fa || 三方登陆绑定不展示不可用入口 */}
          {!isThirdPartyBindAccount && !onlyG2FAWhenIsSub ? (
            <div className={styles.formFooterItem} onClick={handleSecurityUnavailable}>
              {t('62315228e8884000a82d')}
            </div>
          ) : null}
          {needValidations?.length > 1 && (
            <div className={styles.formFooterItem} onClick={handleSwitchValidation}>
              {t('d10b3b11531e4000ac30')}
            </div>
          )}

          {!isH5 && (
            <Button
              id="loginBtn"
              className={styles.mt32}
              size="large"
              disabled={!canSubmit}
              fullWidth
              onClick={handleSubmit}
              data-inspector="entrance_verify_button"
            >
              {t('gfa_btn')}
            </Button>
          )}
          {/* 安全语 */}
          {showLoginSafeWord && !isH5 ? (
            <div className={clsx(styles.safeWordBox, styles.mt40)}>
              <p className={styles.safeword}>
                <ICSecurityOutlined size="20" />
                <span>{loginSafeWord || t('login_safe_word')}</span>
              </p>
              <p className={styles.safewordTips}>
                {loginSafeWord ? t('has_login_safe_word_tips') : t('no_login_safe_word_tips')}
              </p>
            </div>
          ) : null}
        </Box>
      </Box>
      <SwitchMultiTypeModal
        open={switchModalOpen}
        validations={needValidations || []}
        onCancel={() => setSwitchModalOpen(false)}
        currentType={currentType}
        onOk={type => {
          setCurrentType(type);
        }}
      />
    </Spin>
  );
};

export default ValidateForm;
