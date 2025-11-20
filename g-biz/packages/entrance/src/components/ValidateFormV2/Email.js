/**
 * Owner: corki@kupotech.com
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, styled } from '@kux/mui';
import { Trans, useTranslation } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE_MAPS } from '../../common/constants';
import { formatEmail, kcsensorsClick } from '../../common/tools';
import {
  useToast,
  useRegisterPhoneBindEmailABtest,
  useCountDown,
  useTrackingConfigDataOfInviter,
} from '../../hookTool';
import { AccountInput } from './styled';
import SendCodeBtn from '../SendCodeBtnV2';

const { FormItem } = Form;

const noop = () => {};

const Bold = styled.b`
  color: ${(props) => props.theme.colors.text};
`;

const FormItemTipWrapper = styled.div`
  display: inline-block;
  opacity: ${({ hide }) => (hide ? 0 : 1)};
  height: 16px;
  margin-top: 4px;
  width: 100%;
  line-height: 100%;
  /* padding-left: 16px; */
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: inline-block;
    width: 100%;
    height: auto;
  }
  .voiceCodeText {
    color: ${({ theme }) => theme.colors.text};
    font-size: 12px !important;
  }
  .voiceCodeBox {
    display: inline;
  }
`;

const StyledFormItem = styled.div`
  margin-bottom: 28px;
  .KuxForm-itemHelp {
    display: ${({ hasHelp }) => (hasHelp ? 'block' : 'none')};
  }
  .KuxForm-itemError {
    .KuxForm-itemHelp {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-end;
      justify-content: flex-start;
      margin-top: 0px;
    }
  }
`;

const CodeWrapper = styled.div`
  .KuxForm-itemHelp {
    min-height: 0px;
  }
`;

const FormItemLabel = styled.div`
  [dir='rtl'] & {
    text-align: left;
  }
`;

const FormItemTipText = styled.span`
  display: inline;
  color: ${(props) => props.theme.colors.text60};
  font-size: 12px;
  width: auto;
  line-height: 100%;
  font-style: normal;
  font-weight: 400;
  span {
    b {
      color: ${(props) => props.theme.colors.text} !important;
    }
  }
`;

const formItemLayout = {
  required: false,
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const sendCodeEffectsMap = {
  [NAMESPACE_MAPS.LOGIN]: 'sendVerifyCode',
  [NAMESPACE_MAPS.FORGET_PWD]: 'sendVerifyCode',
  [NAMESPACE_MAPS.SIGNUP]: 'sendEmailVerifyCode',
};

const sendChannelMap = {
  [NAMESPACE_MAPS.LOGIN]: 'MY_EMAIL',
  [NAMESPACE_MAPS.FORGET_PWD]: 'MY_EMAIL',
  [NAMESPACE_MAPS.SIGNUP]: '', // 注册场景无需sendChannel
};

const Email = (props = { isAutoSendCode: false, hasSent: { current: true } }) => {
  const {
    isAutoSendCode,
    namespace,
    value,
    hasSent,
    onChange = noop,
    allowClear = true,
    onSendError = noop,
  } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    emailRetryAfterSeconds,
    email,
    needValidations,
    loadingEmail,
    // 注册的手机号、邮箱在这个状态里
    preRegisterData,
  } = useSelector((state) => state[namespace]);

  const isNewApi = useRegisterPhoneBindEmailABtest();

  const [disable, setDisable] = useState(false);

  const { t } = useTranslation('entrance');

  const deadline = useMemo(() => emailRetryAfterSeconds?.deadline, [
    emailRetryAfterSeconds?.deadline,
  ]);

  const { countTime } = useCountDown({
    deadline,
    onBegin: () => {
      setDisable(true);
    },
    onFinish: () => {
      setDisable(false);
      dispatch({
        type: `${namespace}/update`,
        payload: {
          emailRetryAfterSeconds: { time: 0, deadline: 0 },
        },
      });
    },
  });

  // 校验器，校验输入的长度
  const validator = (rule, value, callback) => {
    if (!value || value.length !== 6) {
      callback(new Error(t('form.format.error')));
      onChange({
        value,
        error: true,
      });
    } else {
      callback();
    }
  };

  // 重新聚焦时，去除错误提示
  const handleReFocus = (key) => {
    if (form.getFieldError(key)?.length > 0) {
      const placeHolder = '******'; // 合法校验占位符
      const formValue = form.getFieldValue(key);
      form.setFieldsValue({ [key]: placeHolder });
      form.validateFields([key]); // 去除错误提示
      form.setFieldsValue({ [key]: formValue });
    }
  };

  const trackingConfigData = useTrackingConfigDataOfInviter();
  // 发送验证码
  const handleSendCode = () => {
    if (namespace === NAMESPACE_MAPS.LOGIN) {
      kcsensorsClick(['send_login_verify', '1'], {
        type: 'my_email',
        source: String(needValidations.join()),
      });
    }

    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: trackingConfigData }, 'page_click');
    if (!loadingEmail) {
      const payload = {
        toast,
        t,
      };
      if (sendChannelMap[namespace]) {
        payload.sendChannel = sendChannelMap[namespace];
      }
      if (namespace === NAMESPACE_MAPS.SIGNUP) {
        // 神策白名单 & 第一步输入的是手机号，邮箱验证码才是新业务REGISTER_EMAIL，否则都是老业务 REGISTER
        payload.validationBiz = isNewApi && preRegisterData.phone ? 'REGISTER_EMAIL' : 'REGISTER';
      }
      dispatch({
        type: `${namespace}/${[sendCodeEffectsMap[namespace]]}`,
        payload,
        onSendError,
      });
      hasSent.current = true;
    }
  };

  const handleSendCodeRef = useRef(handleSendCode);
  handleSendCodeRef.current = handleSendCode;

  const handleChange = (target) => {
    if (form.getFieldError('my_email')?.length > 0) {
      onChange({
        value: target,
        error: true,
      });
    } else {
      kcsensorsManualTrack(
        {
          spm: [
            isNewApi && preRegisterData?.phone ? 'signupBindEmailverify' : 'emailSecurityVerify',
            'codeInput',
          ],
          data: {
            before_click_element_value: '',
            after_click_element_value: 'notEmpty',
          },
        },
        'page_click',
      );
      onChange({
        value: target,
        error: false,
      });
    }
  };

  const handleAutoCheck = (value) => {
    if (value.length === 6) {
      handleChange(value);
    } else {
      onChange({
        value,
        error: true, // 重置提示按钮状态
      });
    }
  };

  const helpText = () => {
    return (
      <FormItemTipWrapper hide={!(email || preRegisterData?.email)}>
        <FormItemTipText>
          <Trans
            ns="entrance"
            i18nKey="tung7oRbHSRMT3fw878BMA"
            // 验证码 如果是注册就明文展示 登陆脱敏展示
            values={{
              email:
                namespace === NAMESPACE_MAPS.SIGNUP
                  ? email || preRegisterData?.email
                  : formatEmail(email || preRegisterData?.email),
            }}
            components={{ b: <Bold /> }}
          />
        </FormItemTipText>
      </FormItemTipWrapper>
    );
  };

  useEffect(() => {
    if (disable || loadingEmail || !isAutoSendCode || hasSent.current) {
      return;
    }
    handleSendCodeRef.current();
  }, [disable, hasSent, isAutoSendCode, loadingEmail]);

  return (
    <Form form={form}>
      <CodeWrapper>
        <StyledFormItem name="my_email" requiredMark={false} key="my_email" hasHelp>
          <FormItem
            {...formItemLayout}
            label={<FormItemLabel>{t('vc_email')}</FormItemLabel>}
            name="my_email"
            validateStatus="success"
            initialValue={value}
            help={helpText()}
            rules={[
              {
                validator,
              },
            ]}
            validateTrigger={['onBlur']}
            validateFirst
          >
            <AccountInput
              inputProps={{ maxLength: 6 }}
              value={value}
              onBlur={(e) => handleChange(e.target.value)}
              onChange={(e) => handleAutoCheck(e.target.value)}
              addonAfter={null}
              size="xlarge"
              onFocus={() => handleReFocus('my_email')}
              allowClear={allowClear}
              prefix={t('vc_email')}
              data-inspector="entrance_email_verify_input"
              suffix={
                <SendCodeBtn
                  data-inspector="entrance_email_send_button"
                  style={{ flexShrink: 0 }}
                  loading={loadingEmail}
                  disabled={disable}
                  onChange={handleSendCode}
                  countTime={countTime}
                  countText={t('voice_send')}
                  size="large"
                  variant="text"
                />
              }
            />
          </FormItem>
        </StyledFormItem>
      </CodeWrapper>
    </Form>
  );
};

export default Email;
