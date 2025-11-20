/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';

import { Form, styled, Spin, useTheme } from '@kux/mui';

import { useDispatch, useSelector } from 'react-redux';
import { Captcha } from '@packages/captcha';

import { Trans } from '@tools/i18n';

import { kcsensorsClick } from '../../common/tools';

import InputSendCode from '../../components/InputSendCode';

import { NAMESPACE } from '../constants';

import { useToast, useLang } from '../../hookTool';
import VoiceCode from '../../components/NewVoiceCode';

const Container = styled.div`
  width: 100%;
  height: auto;
  margin: 0 auto;
`;
const FormWrapper = styled.div``;
const VoiceCodeWrapper = styled.div`
  margin-top: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 2px;
  }
`;

const Tip = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin: 16px 0 40px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin: 8px 0 40px 0;
  }
`;
const Title = styled.h3`
  font-weight: 700;
  font-size: ${({ inDrawer }) => (inDrawer ? '36px' : '40px')};
  line-height: 130%;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const { FormItem } = Form;

/**
 * @deprecated 废弃，请使用validateFormV2
 */
const VerifyPhoneCode = ({ inDrawer }) => {
  const [form] = Form.useForm();
  const theme = useTheme();
  const [disable, setDisable] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();
  const { t } = useLang();

  const countryCode = useSelector((state) => state[NAMESPACE]?.countryCode);
  const phone = useSelector((state) => state[NAMESPACE]?.phone);
  const bizType = useSelector((state) => state[NAMESPACE]?.bizType);
  const isCaptchaOpen = useSelector((state) => state[NAMESPACE]?.isCaptchaOpen);
  const SMS_countTime = useSelector((state) => state[NAMESPACE]?.SMS_countTime);
  const sendChannel = useSelector((state) => state[NAMESPACE]?.sendChannel);
  const verifyCodeFlowLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/verifyCode`],
  );
  const sendCodeLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/sendVerifyCode`],
  );

  useEffect(() => {
    dispatch({ type: `${NAMESPACE}/getCountryCodes` });
  }, []);

  const handleSendCode = () => {
    dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: { phone, countryCode, bizType, toast, sendChannel: 'SMS', checkCaptcha: true },
    });
  };

  const onSendVoice = () => {
    dispatch({
      toast,
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: { phone, countryCode, bizType, toast, sendChannel: 'VOICE', checkCaptcha: true },
    });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e && e.preventDefault();
      kcsensorsClick(['confirm', '1']);
      // 校验表单值
      form.validateFields().then(({ code }) => {
        dispatch({
          type: `${NAMESPACE}/verifyCode`,
          payload: { phone, countryCode, code, toast, sendChannel, bizType },
        });
      });
    },
    [sendChannel, phone, countryCode],
  );

  const offDisabled = useCallback(() => {
    setDisable(false);
    dispatch({ type: `${NAMESPACE}/update`, payload: { SMS_countTime: { time: 0 } } });
  }, [dispatch]);

  useEffect(() => {
    if (SMS_countTime && SMS_countTime.time > 0) {
      setDisable(true);
    }
  }, [SMS_countTime]);

  const formatAccount = (_account) => {
    if (!_account) {
      return '';
    }
    const str = String(_account) || '';
    const len = str.length;
    if (!len) return str;
    if (len >= 4) {
      return ['***', str.substr(-4)].join('');
    }
    return ['***', str].join('');
  };

  const commonRule = [{ required: true, whitespace: true, message: t('form.required') }];

  const handleInputSendCode = (val) => {
    if (val.length > 6) {
      return;
    }
    if (val.length === 6) {
      handleSubmit();
    }
  };

  const onCloseCaptcha = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
  };

  return (
    <Spin spinning={!!verifyCodeFlowLoading} size="small">
      <>
        <Container data-inspector="verify_phone_container">
          <Title inDrawer={inDrawer}>
            <Trans
              i18nKey="qoLWdLorisNMPrJueojcgn"
              ns="entrance"
              values={{ account: `+${countryCode} ${formatAccount(phone)}` }}
              dir="rtl"
            >
              <span>{`+${countryCode} ${formatAccount(phone)}`}</span>
            </Trans>
          </Title>
          <Tip>{t('3uGZS2SiuXvEG2WUxXcDV6')}</Tip>
          <Form form={form}>
            <FormWrapper>
              <FormItem
                label={t('vc.phone')}
                name="code"
                rules={commonRule}
                validateTrigger={['onBlur', 'onSubmit']}
              >
                <InputSendCode
                  loading={sendCodeLoading}
                  disabled={disable}
                  countTimeOver={offDisabled}
                  onSendCode={handleSendCode}
                  countTime={SMS_countTime}
                  autoFocus
                  size="large"
                  onChange={handleInputSendCode}
                />
              </FormItem>
            </FormWrapper>
            <VoiceCodeWrapper>
              <VoiceCode
                theme={theme.currentTheme}
                phone={formatAccount(phone)}
                countryCode={countryCode}
                countTime={SMS_countTime}
                loading={sendCodeLoading}
                disable={disable}
                onTimeOver={offDisabled}
                onSend={onSendVoice}
              />
            </VoiceCodeWrapper>
          </Form>
        </Container>
        <Captcha
          bizType={bizType}
          open={isCaptchaOpen}
          onClose={onCloseCaptcha}
          onValidateSuccess={() => {
            onCloseCaptcha();
            handleSendCode();
          }}
        />
      </>
    </Spin>
  );
};

export default VerifyPhoneCode;
