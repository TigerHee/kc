/**
 * Owner: corki@kupotech.com
 */
import { Form, styled } from '@kux/mui';
import { Trans, useTranslation } from '@tools/i18n';
import { kcsensorsManualTrack } from '@utils/sensors';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE_MAPS } from '../../common/constants';
import { formatPhoneNumber, kcsensorsClick } from '../../common/tools';
import { useToast, useRegisterPhoneBindEmailABtest, useCountDown } from '../../hookTool';
import SendCodeBtn from '../SendCodeBtnV2';
import { AccountInput } from './styled';

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
  line-height: 100%;
  width: 100%;
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
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  span {
    b {
      color: ${(props) => props.theme.colors.text};
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
  [NAMESPACE_MAPS.SIGNUP]: 'sendSMSVerifyCode',
};

// 语音验证码不在此逻辑中
const sendChannelMap = {
  [NAMESPACE_MAPS.LOGIN]: 'MY_SMS',
  [NAMESPACE_MAPS.FORGET_PWD]: 'MY_SMS',
  [NAMESPACE_MAPS.SIGNUP]: 'SMS',
};

const SMS = (props = { isAutoSendCode: false, hasSent: { current: true } }) => {
  const {
    isAutoSendCode,
    namespace,
    value,
    hasSent,
    allowClear = true,
    fromBindThirdPartyAccount = false,
    onChange = noop,
    sendCodeCb = noop,
    onSendError = noop,
  } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    smsRetryAfterSeconds,
    phone,
    needValidations,
    loadingSms,
    // 注册的手机号、邮箱在这个状态里
    preRegisterData,
  } = useSelector((state) => state[namespace]);

  const isNewApi = useRegisterPhoneBindEmailABtest();

  const toast = useToast();

  const [disable, setDisable] = useState(false);

  const { t } = useTranslation('entrance');

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

  const handleReFocus = (key) => {
    if (form.getFieldError(key)?.length > 0) {
      const placeHolder = '******'; // 合法校验占位符
      const formValue = form.getFieldValue(key);
      form.setFieldsValue({ [key]: placeHolder });
      form.validateFields([key]); // 去除错误提示
      form.setFieldsValue({ [key]: formValue });
    }
  };

  const handleSendCode = () => {
    if (namespace === NAMESPACE_MAPS.LOGIN) {
      kcsensorsClick(['send_login_verify', '1'], {
        type: 'my_sms',
        source: String(needValidations),
      });
    }

    kcsensorsManualTrack({ spm: ['phoneSendCode', '1'] }, 'page_click');
    const payload = {
      toast,
      t,
    };
    if (sendChannelMap[namespace]) {
      payload.sendChannel = sendChannelMap[namespace];
    }
    if (namespace === NAMESPACE_MAPS.SIGNUP) {
      // 三方注册 发送验证码老流程
      payload.validationBiz = isNewApi && !fromBindThirdPartyAccount ? 'REGISTER_SMS' : 'REGISTER';
    }
    if (!loadingSms) {
      dispatch({
        type: `${namespace}/${sendCodeEffectsMap[namespace]}`,
        payload,
        onSendError,
      });
      sendCodeCb?.();
      hasSent.current = true;
    }
  };
  const handleSendCodeRef = useRef(handleSendCode);
  handleSendCodeRef.current = handleSendCode;

  const deadline = useMemo(() => smsRetryAfterSeconds?.deadline, [smsRetryAfterSeconds?.deadline]);

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
          smsRetryAfterSeconds: { time: 0, deadline: 0 },
        },
      });
    },
  });

  const handleChange = (target) => {
    if (form.getFieldError('my_sms')?.length > 0) {
      onChange({
        value: target,
        error: true,
      });
    } else {
      kcsensorsManualTrack(
        {
          spm: ['SMSSecurityVerify', 'codeInput'],
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
      <FormItemTipWrapper hide={!(phone || preRegisterData?.phone)}>
        <FormItemTipText>
          <Trans
            ns="entrance"
            i18nKey="qibEqVh37GMhHZZgS2qa8C"
            values={{
              // 验证码 如果是注册就明文展示 登陆脱敏展示
              phone:
                namespace === NAMESPACE_MAPS.SIGNUP
                  ? phone || preRegisterData?.phone
                  : formatPhoneNumber(phone || preRegisterData?.phone),
            }} // 和email的提示文案一样，共用一个key
            components={{ b: <Bold /> }}
          />
        </FormItemTipText>
      </FormItemTipWrapper>
    );
  };

  useEffect(() => {
    if (disable || loadingSms || !isAutoSendCode || hasSent.current) {
      return;
    }
    handleSendCodeRef.current();
  }, [disable, hasSent, isAutoSendCode, loadingSms]);

  return (
    <Form form={form}>
      <CodeWrapper>
        <StyledFormItem name="my_sms" requiredMark={false} key="my_sms" hasHelp>
          <FormItem
            {...formItemLayout}
            label={<FormItemLabel>{t('gfa_vc_sms')}</FormItemLabel>}
            name="my_sms"
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
              onFocus={() => handleReFocus('my_sms')}
              allowClear={allowClear}
              prefix={t('gfa_vc_sms')}
              data-inspector="entrance_sms_verify_input"
              suffix={
                <SendCodeBtn
                  style={{ flexShrink: 0 }}
                  loading={loadingSms}
                  disabled={disable}
                  onChange={handleSendCode}
                  countTime={countTime}
                  countText={t('voice_send')}
                  data-inspector="entrance_sms_send_button"
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

export default SMS;
