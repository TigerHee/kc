/**
 * Owner: tiger@kupotech.com
 */
import { ICArrowRight2Outlined, ICSecurityOutlined } from '@kux/icons';
import { Alert, Box, Button, Form, Spin, useResponsive } from '@kux/mui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import { Trans } from '@tools/i18n';
import storage from '@utils/storage';
import { getTrackingSource, addLangToPath } from '../../common/tools';
import { SecurityVerificationUnavailable } from '../../components/SecurityVerificationUnavailable';
import { SwitchMultiTypeModal } from '../../components/SwitchMultiTypeModal';
import Email from '../../components/ValidateFormV2/Email';
import GFA from '../../components/ValidateFormV2/GFA';
import SMS from '../../components/ValidateFormV2/SMS';
import { useLang, useToast } from '../../hookTool';
import { LOGIN_BIZ_TYPE, RISK_TAG } from '../constants';
import { TOKEN_INVALID_CODE } from '../../common/constants';
import siteConfig from '../../common/siteConfig';
import {
  Back,
  Title,
  Subtitle,
  WithdrawPolicyWrap,
  ValidateCheckbox,
  AgreeLabel,
  SafeWordBox,
  RiskAlert,
  FormFooterItem,
} from './styled';

const { FormItem } = Form;

export default function ValidateFormV2(props) {
  const {
    namespace,
    onSuccess,
    verifyCanNotUseClick,
    showLoginSafeWord,
    isSub = false,
    trackingConfig = {},
    withDrawer,
    finishUpgrade,
    token,
    onBack,
  } = props;

  const {
    loginSafeWord,
    riskTag,
    phone,
    email,
    needValidations,
    countryCode,
    isThirdPartyBindAccount,
  } = useSelector((state) => {
    return state[namespace];
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const responsive = useResponsive();
  const isH5 = !responsive?.sm;

  const [form] = Form.useForm();
  const policyCheck = Form.useWatch('policy', form);

  const [trustDevice, setTrustDevice] = useState(false);
  const [inputEmailCode, setInputEmailCode] = useState({ email: '', error: true });
  const [inputPhoneCode, setInputPhoneCode] = useState({ phone: '', error: true });
  const [inputG2FACode, setInputG2FACode] = useState({ g2fa: '', error: true });
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const validateLoading = useSelector((state) => state.loading.effects[`${namespace}/validate`]);
  const { t } = useLang();
  const { warnText } = RISK_TAG[riskTag] || {};
  const rv = useResponsive();
  const isSm = !rv?.sm;

  const [currentType, setCurrentType] = useState(0);

  const currentValidation = useMemo(() => {
    return needValidations.length > 0 ? needValidations[currentType] : [];
  }, [currentType, needValidations]);

  const [isAutoSendCode, setIsAutoSendCode] = useState(false);
  const hasSent = useRef(false);

  const hasEmail = currentValidation?.includes('my_email');
  const hasSMS = currentValidation?.includes('my_sms');
  const hasGFA = currentValidation?.includes('google_2fa');

  // 用户资产申领协议
  const withdrawPolicyUrl = addLangToPath(
    `${siteConfig?.KC_SITE_HOST}/announcement/en-assets-recovery-agreement`,
    storage.getItem('kucoinv2_lang'),
  );

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

  const onSendVoice = () => {
    return dispatch({
      type: `${namespace}/sendVerifyCode`,
      payload: {
        toast,
        sendChannel: 'MY_VOICE',
        bizType: LOGIN_BIZ_TYPE,
      },
    });
  };

  const canSubmit = useMemo(() => {
    if (!policyCheck) {
      return false;
    }
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
  }, [
    policyCheck,
    hasEmail,
    inputEmailCode.error,
    hasSMS,
    inputPhoneCode.error,
    hasGFA,
    inputG2FACode.error,
  ]);

  const handleVerifyValidation = useCallback(() => {
    if (currentValidation.length === 0 && needValidations.length === 0) {
      return;
    }
    const validations = {};
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
    dispatch({
      type: `${namespace}/validate`,
      payload: {
        token,
        validations,
        trustDevice,
        validationType: currentValidation.join(''),
        toast,
        t,
      },
      onSuccess,
      onBack,
      trackResultParams: {
        source: trackSource,
      },
    });
  }, [
    currentValidation,
    dispatch,
    hasEmail,
    hasGFA,
    hasSMS,
    inputEmailCode.email,
    inputG2FACode.g2fa,
    inputPhoneCode.phone,
    namespace,
    needValidations.length,
    onBack,
    onSuccess,
    t,
    toast,
    token,
    trackingConfig,
    trustDevice,
  ]);

  const handleSwitchValidation = () => {
    kcsensorsManualTrack({
      spm: ['switchVerification', '1'],
    });
    if (needValidations.length > 2) {
      // 有三种验证方式则弹出切换弹窗
      setSwitchModalOpen(true);
    } else if (needValidations.length === 2) {
      // 有两种验证方式则直接切换
      setCurrentType(currentType === 0 ? 1 : 0);
    }
  };

  const handleSubmit = () => {
    handleVerifyValidation();
  };

  const handleSendCodeError = (err) => {
    if (err?.code === TOKEN_INVALID_CODE) {
      onBack?.();
    }
  };
  const handleEmailChange = (email) => {
    kcsensorsManualTrack({
      spm: ['emailInsertCode', '1'],
    });
    setInputEmailCode({ email: email.value, error: email.error });
  };
  const handleSMSChange = (phone) => {
    kcsensorsManualTrack({
      spm: ['phoneInsertCode', '1'],
    });
    setInputPhoneCode({ phone: phone.value, error: phone.error });
  };
  const handleG2faChange = (g2fa) => {
    kcsensorsManualTrack({
      spm: ['googleInsertCode', '1'],
    });
    setInputG2FACode({ g2fa: g2fa.value, error: g2fa.error });
  };
  const handleTrustCheck = (e) => {
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
    kcsensorsManualTrack({
      spm: ['signinVerify', '1'],
    });
  }, []);

  return (
    <Spin spinning={!!validateLoading} size="small">
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex="1">
          {/* 返回 */}
          <Box display="flex" mb={isSm ? 24 : 40} mt={isSm ? -16 : 0}>
            <Back onClick={goback}>
              <ICArrowRight2Outlined size="16" />
              <span> {t('8RcupwHqYraGhrjT8kAzG7')}</span>
            </Back>
          </Box>
          {/* title */}
          <Title withDrawer={withDrawer}>{t('verify')}</Title>
          {/* 通过此验证来证实您确实是该账号的所有者 */}
          <Subtitle>{t('08042ac296784000a371')}</Subtitle>
          {!!warnText && (
            <RiskAlert>
              <Alert title={t(warnText)} closable={false} type="warning" showIcon />
            </RiskAlert>
          )}
          {hasEmail && (
            <Email
              allowClear={false}
              namespace={namespace}
              onSendError={handleSendCodeError}
              value={inputEmailCode.email}
              isAutoSendCode={isAutoSendCode}
              hasSent={hasSent}
              onChange={handleEmailChange}
            />
          )}
          {hasSMS && (
            <SMS
              allowClear={false}
              namespace={namespace}
              value={inputPhoneCode.phone}
              hasSent={hasSent}
              isAutoSendCode={isAutoSendCode}
              onSendError={handleSendCodeError}
              onChange={handleSMSChange}
            />
          )}
          {hasGFA && (
            <GFA allowClear={false} value={inputG2FACode.g2fa} onChange={handleG2faChange} />
          )}
          <Form mt="16px" form={form}>
            <WithdrawPolicyWrap>
              <FormItem initialValue={false} valuePropName="checked" name="policy">
                <ValidateCheckbox
                  checkOptions={{
                    type: 2,
                    checkedType: 1,
                  }}
                >
                  <AgreeLabel onClick={(e) => e.stopPropagation()}>
                    <Trans
                      i18nKey="eba3b9ab6fd34000a1b1"
                      ns="entrance"
                      values={{
                        url: withdrawPolicyUrl,
                      }}
                      components={{
                        a: (
                          // eslint-disable-next-line jsx-a11y/control-has-associated-label
                          <a href={withdrawPolicyUrl} target="_blank" rel="noopener noreferrer" />
                        ),
                      }}
                    />
                  </AgreeLabel>
                </ValidateCheckbox>
              </FormItem>
            </WithdrawPolicyWrap>

            <FormItem initialValue={trustDevice} valuePropName="checked" name="trustDevice">
              <ValidateCheckbox
                onChange={handleTrustCheck}
                checkOptions={{
                  type: 2,
                  checkedType: 1,
                }}
              >
                {t('gfa.trust')}
              </ValidateCheckbox>
            </FormItem>
          </Form>
          {isH5 && (
            <Button mt="32px" size="large" disabled={!canSubmit} fullWidth onClick={handleSubmit}>
              {t('gfa.btn')}
            </Button>
          )}
          {/* 安全语 */}
          {showLoginSafeWord && isH5 ? (
            <SafeWordBox mt={16}>
              <p className="safeword">
                <ICSecurityOutlined size="20" />
                <span>{loginSafeWord || t('login.safe.word')}</span>
              </p>
              <p className="safewordTips">
                {loginSafeWord ? t('has.login.safe.word.tips') : t('no.login.safe.word.tips')}
              </p>
            </SafeWordBox>
          ) : null}
          <Box style={{ height: isH5 ? '28px' : '16px' }} />
          {/* 三方登陆展示不可用入口 , 子账号只有g2fa || 三方登陆绑定不展示不可用入口 */}
          {!isThirdPartyBindAccount && !onlyG2FAWhenIsSub ? (
            <FormFooterItem onClick={() => setSecurityModalOpen(true)}>
              {t('62315228e8884000a82d')}
            </FormFooterItem>
          ) : null}

          {needValidations?.length > 1 && (
            <FormFooterItem onClick={handleSwitchValidation}>
              {t('d10b3b11531e4000ac30')}
            </FormFooterItem>
          )}

          {!isH5 && (
            <Button
              id="loginBtn"
              mt="32px"
              size="large"
              disabled={!canSubmit}
              fullWidth
              onClick={handleSubmit}
            >
              {t('gfa.btn')}
            </Button>
          )}
          {/* 安全语 */}
          {showLoginSafeWord && !isH5 ? (
            <SafeWordBox mt={40}>
              <p className="safeword">
                <ICSecurityOutlined size="20" />
                <span>{loginSafeWord || t('login.safe.word')}</span>
              </p>
              <p className="safewordTips">
                {loginSafeWord ? t('has.login.safe.word.tips') : t('no.login.safe.word.tips')}
              </p>
            </SafeWordBox>
          ) : null}
        </Box>
      </Box>
      <SwitchMultiTypeModal
        open={switchModalOpen}
        validations={needValidations || []}
        onCancel={() => setSwitchModalOpen(false)}
        currentType={currentType}
        onOk={(type) => {
          setCurrentType(type);
        }}
      />
      <SecurityVerificationUnavailable
        namespace={namespace}
        open={securityModalOpen}
        countryCode={countryCode}
        withDrawer={withDrawer}
        trackingConfig={trackingConfig}
        email={email}
        phone={phone}
        validations={currentValidation || []}
        verifyCanNotUseClick={verifyCanNotUseClick}
        isSub={isSub}
        onCancel={() => setSecurityModalOpen(false)}
        finishUpgrade={finishUpgrade}
        token={token}
        tabKey={currentValidation?.join('')}
        onSendVoice={onSendVoice}
      />
    </Spin>
  );
}
