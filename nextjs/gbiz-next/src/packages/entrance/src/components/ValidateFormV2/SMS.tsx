/**
 * Owner: corki@kupotech.com
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Input } from '@kux/design';
import { Trans } from 'tools/i18n';
import { kcsensorsManualTrack } from 'tools/sensors';
import clsx from 'clsx';
import { formatPhoneNumber } from '../../common/tools';
import { useCountDown, useTrackingConfigDataOfInviter } from '../../hookTool';
import SendCodeBtn from '../SendCodeBtn';
import NewVoiceCode from '../NewVoiceCode';
import { useLang } from '../../hookTool';
import styles from './styles.module.scss';

const { FormItem } = Form;

const noop = () => {};

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

// const sendCodeEffectsMap = {
//   [NAMESPACE_MAPS.LOGIN]: 'sendVerifyCode',
//   [NAMESPACE_MAPS.FORGET_PWD]: 'sendVerifyCode',
//   [NAMESPACE_MAPS.SIGNUP]: 'sendSMSVerifyCode',
// };

// // 语音验证码不在此逻辑中
// const sendChannelMap = {
//   [NAMESPACE_MAPS.LOGIN]: 'MY_SMS',
//   [NAMESPACE_MAPS.FORGET_PWD]: 'MY_SMS',
//   [NAMESPACE_MAPS.SIGNUP]: 'SMS',
// };

export interface Props {
  isAutoSendCode: boolean;
  hasSent: {
    current: boolean;
  };
  value?: string;
  countryCode?: string;
  // 是否展示手机号码
  showPhoneInfo?: boolean;
  sendCodeBtnDisabled?: boolean;
  onChange?: (params: { value: string; error: boolean }) => void;
  onSendVoice?: () => void;
  allowClear?: boolean;
  // sendCodeCb: typeof noop;
  // onSendError?: typeof noop;
  trackingConfig?: any;
  extra: {
    smsRetryAfterSeconds?: {
      time: number;
      deadline: number;
    } | null;
    phone?: string;
    countryCode?: string;
    // needValidations: any[],
    loadingSms?: boolean;
    preRegisterData?: any;
    desensitize?: boolean;
    onFinish: typeof noop;
    onBeforeSendCode?: typeof noop;
    onSendCode: typeof noop;
  };
}

const SMS = (props: Props) => {
  const {
    isAutoSendCode = false,
    showPhoneInfo = true,
    sendCodeBtnDisabled = false,
    value,
    trackingConfig = {},
    onSendVoice = noop,
    hasSent = { current: true },
    allowClear = true,
    // fromBindThirdPartyAccount = false,
    onChange = noop,
    // sendCodeCb = noop,
    // onSendError = noop,
    extra: {
      // 以前是外部传入 namespace，内部通过 redux 读全局状态
      // 现在改成外部传入以下数据
      smsRetryAfterSeconds,
      phone,
      countryCode,
      // needValidations,
      loadingSms,
      // 注册的手机号、邮箱在这个状态里
      preRegisterData,
      // 以下是需要外部新传入的属性
      desensitize = true,
      // 以下是需要外部新增的事件
      onFinish,
      onBeforeSendCode,
      onSendCode,
    },
  } = props;
  const [form] = Form.useForm();

  const [disable, setDisable] = useState(false);
  const [voiceModal, setVoiceModal] = useState<boolean>(false);
  const extraTrackingConfigData = useTrackingConfigDataOfInviter();

  const { t } = useLang();

  // 校验器，校验输入的长度
  const validator = (rule, currentValue, callback) => {
    if (currentValue && !/\d{6}/.test(currentValue)) {
      callback(new Error(t('form.format.error')));
      onChange({
        value: currentValue,
        error: true,
      });
    } else {
      callback();
    }
  };

  const handleReFocus = () => {
    form.setFields([{ name: 'my_sms', errors: [] }]);
  };

  const handleSendCode = () => {
    if (loadingSms) return;
    onBeforeSendCode?.();
    // 以下代码在外部传入的 onBeforeSendCode 里实现
    // if (namespace === NAMESPACE_MAPS.LOGIN) {
    //   trackClick(['send_login_verify', '1'], {
    //     type: 'my_sms',
    //     source: String(needValidations),
    //   });
    // }

    kcsensorsManualTrack({ spm: ['phoneSendCode', '1'] }, 'page_click');
    // const payload = {
    //   toast,
    //   t,
    // };
    onSendCode();
    hasSent.current = true;
    // 以下代码在外部传入的 onSendCode 里实现
    // if (sendChannelMap[namespace]) {
    //   payload.sendChannel = sendChannelMap[namespace];
    // }
    // if (!loadingSms) {
    //   dispatch({
    //     type: `${namespace}/${sendCodeEffectsMap[namespace]}`,
    //     payload,
    //     onSendError,
    //   });
    //   sendCodeCb?.();
    // }
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
      onFinish();
    },
  });

  const handleChange = target => {
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
        'page_click'
      );
      onChange({
        value: target,
        error: false,
      });
    }
  };

  const handleAutoCheck = currValue => {
    if (currValue.length === 6) {
      handleChange(currValue);
    } else {
      onChange({
        value: currValue,
        error: true, // 重置提示按钮状态
      });
    }
  };

  const handleAskCode = () => {
    setVoiceModal(true);
    kcsensorsManualTrack({ spm: ['noVerificationCode', '1'], data: extraTrackingConfigData }, 'page_click');
    if (!disable) {
      onSendVoice();
    }
  };

  const handleFormFinish = e => {
    e.preventDefault();
  };

  const helpText = () => {
    return (
      <div className={clsx(styles.formItemTipWrapper)}>
        <div
          className={clsx(
            styles.formItemTipText,
            !(phone || preRegisterData?.phone) || !showPhoneInfo ? styles.hide : null
          )}
        >
          <Trans
            ns="entrance"
            i18nKey="qibEqVh37GMhHZZgS2qa8C"
            values={{
              // 验证码 如果是注册就明文展示 登陆脱敏展示
              phone: `+${
                !desensitize
                  ? `${countryCode}-${phone || preRegisterData?.phone}`
                  : `${countryCode}-${formatPhoneNumber(phone || preRegisterData?.phone)}`
              }`,
            }} // 和email的提示文案一样，共用一个key
            components={{ b: <b /> }}
          />
        </div>
        <div className={'voiceCodeBox'}>
          <NewVoiceCode
            open={voiceModal}
            title={
              <span onClick={handleAskCode} className={clsx(styles.baseText)}>
                {t('newsignup.code.ask')}
              </span>
            }
            phone={phone}
            countryCode={countryCode}
            countTime={countTime}
            disable={disable || sendCodeBtnDisabled}
            onSend={onSendVoice}
            onClose={() => {
              setVoiceModal(false);
            }}
            trackingConfig={trackingConfig}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (disable || loadingSms || !isAutoSendCode || hasSent.current) {
      return;
    }
    handleSendCodeRef.current();
  }, [disable, hasSent, isAutoSendCode, loadingSms]);

  return (
    <>
      <Form form={form} onFinish={handleFormFinish}>
        <div className={styles.codeWrapper}>
          <div className={clsx(styles.formItem, styles.hasHelp)}>
            <FormItem
              {...formItemLayout}
              label={<div className={styles.formItemLabel}>{t('gfa_vc_sms')}</div>}
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
              <Input
                className={styles.input}
                inputProps={{ maxLength: 6 }}
                value={value}
                onBlur={e => handleChange(e.target.value)}
                onChange={e => handleAutoCheck(e.target.value)}
                addonAfter={null}
                size="medium"
                onFocus={handleReFocus}
                fullWidth
                allowClear={allowClear}
                label={t('gfa_vc_sms')}
                data-inspector="entrance_sms_verify_input"
                autoComplete="off"
                suffix={
                  <SendCodeBtn
                    style={{ flexShrink: 0 }}
                    loading={loadingSms}
                    disabled={disable || sendCodeBtnDisabled}
                    onChange={handleSendCode}
                    countTime={countTime}
                    countText={t('voice_send')}
                    data-inspector="entrance_sms_send_button"
                    size="huge"
                  />
                }
              />
            </FormItem>
          </div>
        </div>
      </Form>
    </>
  );
};

export default SMS;
