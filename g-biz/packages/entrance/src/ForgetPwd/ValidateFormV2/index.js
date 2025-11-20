/**
 * Owner: corki@kupotech.com
 */
import { Box, Button, Spin, styled, useResponsive } from '@kux/mui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Captcha } from '@packages/captcha';
import { kcsensorsManualTrack } from '@utils/sensors';
import { SwitchMultiTypeModal } from '../../components/SwitchMultiTypeModal';
import Email from '../../components/ValidateFormV2/Email';
import GFA from '../../components/ValidateFormV2/GFA';
import SMS from '../../components/ValidateFormV2/SMS';
import { useLang, useToast } from '../../hookTool';
import { NAMESPACE } from '../constants';

const Title = styled.h2`
  font-weight: 700;
  font-size: ${(props) => (props.withDrawer ? '36px' : '40px')};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 32px;
  }
`;

const FormFooterItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  cursor: pointer;
  & + & {
    margin-top: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    text-align: center;
  }
`;

export default function ValidateFormV2(props) {
  const { onSuccess, withDrawer } = props;

  const { needValidations } = useSelector((state) => {
    return state[NAMESPACE];
  });

  const dispatch = useDispatch();
  const toast = useToast();
  const responsive = useResponsive();
  const isH5 = !responsive?.sm;
  const [inputEmailCode, setInputEmailCode] = useState({ email: '', error: true });
  const [inputPhoneCode, setInputPhoneCode] = useState({ phone: '', error: true });
  const [inputG2FACode, setInputG2FACode] = useState({ g2fa: '', error: true });
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const isCaptchaOpen = useSelector((state) => state[NAMESPACE]?.isCaptchaOpen);
  const validateLoading = useSelector((state) => state.loading.effects[`${NAMESPACE}/validate`]);
  const securityBizType = useSelector((state) => state[NAMESPACE]?.securityBizType);
  const sendVerifyCodePayload = useSelector((state) => state[NAMESPACE]?.sendVerifyCodePayload);
  const { t } = useLang();

  const [currentType, setCurrentType] = useState(0);

  const currentValidation = useMemo(() => {
    return needValidations.length > 0 ? needValidations[currentType] : [];
  }, [currentType, needValidations]);

  const [isAutoSendCode, setIsAutoSendCode] = useState(false);
  const hasSent = useRef(false);

  const hasEmail = currentValidation?.includes('my_email');
  const hasSMS = currentValidation?.includes('my_sms');
  const hasGFA = currentValidation?.includes('google_2fa');

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

  const handleVerifyValidation = () => {
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
    dispatch({
      type: `${NAMESPACE}/verifyCode`,
      payload: {
        validations,
        toast,
        t,
      },
      onSuccess,
    });
  };

  const handleSwitchValidation = () => {
    if (needValidations.length > 2) {
      // 有三种验证方式则弹出切换弹窗
      setSwitchModalOpen(true);
    } else if (needValidations.length === 2) {
      // 有两种验证方式则直接切换
      setCurrentType(currentType === 0 ? 1 : 0);
    }
  };

  const handleCloseCaptcha = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
  };

  const onCloseCaptcha = () => {
    handleCloseCaptcha();
  };

  // 人机校验拉取失败
  const onValidateError = () => {
    kcsensorsManualTrack({ spm: ['robotfail', '1'] }, 'page_click');
  };

  const onValidateSuccess = () => {
    handleCloseCaptcha();
    kcsensorsManualTrack({ spm: ['robotSuccess', '1'] }, 'page_click');
    dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: sendVerifyCodePayload,
      onSuccess,
    });
  };

  const handleSubmit = () => {
    handleVerifyValidation();
  };

  return (
    <Spin spinning={!!validateLoading} size="small">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        data-inspector="verify_phone_container"
      >
        <Box flex="1">
          {/* title */}
          <Title withDrawer={withDrawer}>{t('verify')}</Title>
          {/* 通过此验证来证实您确实是该账号的所有者 */}
          {/* <Subtitle>{t('tbMcSBnCx53jbCNjJpCuRf')}</Subtitle> */}
          <Subtitle>{t('08042ac296784000a371')}</Subtitle>
          {hasEmail && (
            <Email
              allowClear={false}
              namespace={NAMESPACE}
              value={inputEmailCode.email}
              isAutoSendCode={isAutoSendCode}
              hasSent={hasSent}
              onChange={(email) => setInputEmailCode({ email: email.value, error: email.error })}
            />
          )}
          {hasSMS && (
            <SMS
              allowClear={false}
              namespace={NAMESPACE}
              value={inputPhoneCode.phone}
              hasSent={hasSent}
              isAutoSendCode={isAutoSendCode}
              onChange={(phone) => setInputPhoneCode({ phone: phone.value, error: phone.error })}
            />
          )}
          {hasGFA && (
            <GFA
              allowClear={false}
              value={inputG2FACode.g2fa}
              onChange={(g2fa) => setInputG2FACode({ g2fa: g2fa.value, error: g2fa.error })}
            />
          )}
          {isH5 && (
            <Button mt="8px" size="large" disabled={!canSubmit} fullWidth onClick={handleSubmit}>
              {t('gfa.btn')}
            </Button>
          )}
          <Box style={{ height: isH5 ? '28px' : '0' }} />
          {needValidations?.length > 1 && (
            <FormFooterItem onClick={handleSwitchValidation}>
              {t('pAqyaWwQUk1rafMSbFBKZk')}
            </FormFooterItem>
          )}
          {!isH5 && (
            <Button mt="32px" size="large" disabled={!canSubmit} fullWidth onClick={handleSubmit}>
              {t('gfa.btn')}
            </Button>
          )}
        </Box>
      </Box>
      {isCaptchaOpen && (
        <Captcha
          bizType={securityBizType}
          open={isCaptchaOpen}
          onClose={onCloseCaptcha}
          onValidateError={onValidateError}
          onValidateSuccess={onValidateSuccess}
        />
      )}
      {switchModalOpen && (
        <SwitchMultiTypeModal
          open={switchModalOpen}
          validations={needValidations || []}
          currentType={currentType}
          onCancel={() => setSwitchModalOpen(false)}
          onOk={(type) => {
            setCurrentType(type);
          }}
        />
      )}
    </Spin>
  );
}
