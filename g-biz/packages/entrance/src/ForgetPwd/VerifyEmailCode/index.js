/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback, useState, useEffect } from 'react';
import { Form, styled, Spin } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Captcha } from '@packages/captcha';
import { kcsensorsClick, emailHide } from '../../common/tools';

import InputSendCode from '../../components/InputSendCode';

import { NAMESPACE } from '../constants';

import { useToast, useLang } from '../../hookTool';

const Container = styled.div`
  width: 100%;
  height: auto;
  margin: 0 auto;
`;
const FormWrapper = styled.div``;

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
  color: ${(props) => props.theme.colors.text};
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const { FormItem } = Form;

const sendChannel = 'EMAIL';

/**
 * @deprecated 废弃，请使用validateFormV2
 */
const VerifyEmailCode = ({ inDrawer }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);

  const toast = useToast();
  const { t } = useLang();

  const email = useSelector((state) => state[NAMESPACE]?.email);
  const bizType = useSelector((state) => state[NAMESPACE]?.bizType);
  const isCaptchaOpen = useSelector((state) => state[NAMESPACE]?.isCaptchaOpen);
  const EMAIL_countTime = useSelector((state) => state[NAMESPACE]?.EMAIL_countTime);

  const verifyCodeFlowLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/verifyCode`],
  );
  const sendCodeLoading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/sendVerifyCode`],
  );

  const handleSendCode = useCallback(() => {
    dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: { email, bizType, toast, sendChannel, checkCaptcha: true },
    });
  }, []);

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    kcsensorsClick(['confirm', '1']);

    // 校验表单值
    form.validateFields().then(({ code }) => {
      dispatch({
        type: `${NAMESPACE}/verifyCode`,
        payload: { email, code, toast, sendChannel, bizType },
      });
    });
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

  // 倒计时期间禁用语音验证
  useEffect(() => {
    if (EMAIL_countTime && EMAIL_countTime.time > 0) {
      setDisable(true);
    }
  }, [EMAIL_countTime]);

  const offDisabled = useCallback(() => {
    setDisable(false);
    dispatch({ type: `${NAMESPACE}/update`, payload: { EMAIL_countTime: { time: 0 } } });
  }, []);

  const onCloseCaptcha = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { isCaptchaOpen: false } });
  };

  return (
    <Spin spinning={!!verifyCodeFlowLoading} size="small">
      <>
        <Container data-inspector="verify_email_container">
          <Title inDrawer={inDrawer}>
            <Trans
              i18nKey="qoLWdLorisNMPrJueojcgn"
              ns="entrance"
              values={{ account: emailHide(email) }}
              dir="rtl"
            >
              <span>{emailHide(email)}</span>
            </Trans>
          </Title>
          <Tip>{t('3uGZS2SiuXvEG2WUxXcDV6')}</Tip>
          <Form form={form}>
            <FormWrapper>
              <FormItem
                label={t('vc.email')}
                name="code"
                rules={commonRule}
                validateTrigger={['onBlur', 'onSubmit']}
              >
                <InputSendCode
                  loading={sendCodeLoading}
                  disabled={disable}
                  countTimeOver={offDisabled}
                  onSendCode={handleSendCode}
                  countTime={EMAIL_countTime}
                  autoFocus
                  size="large"
                  onChange={handleInputSendCode}
                />
              </FormItem>
            </FormWrapper>
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

export default VerifyEmailCode;
