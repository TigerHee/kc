/**
 * Owner: corki@kupotech.com
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Input } from '@kux/design';
import { useLang } from '../../hookTool';
import { kcsensorsManualTrack } from 'tools/sensors';
import { formatEmail } from '../../common/tools';
import {
  useRegisterPhoneBindEmailABtest,
  useCountDown,
  useTrackingConfigDataOfInviter,
} from '../../hookTool';
import SendCodeBtn from '../SendCodeBtn';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { Trans } from 'tools/i18n';

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
//   [NAMESPACE_MAPS.SIGNUP]: 'sendEmailVerifyCode',
// };

// const sendChannelMap = {
//   [NAMESPACE_MAPS.LOGIN]: 'MY_EMAIL',
//   [NAMESPACE_MAPS.FORGET_PWD]: 'MY_EMAIL',
//   [NAMESPACE_MAPS.SIGNUP]: '', // 注册场景无需sendChannel
// };

export interface Props {
  isAutoSendCode: boolean;
  hasSent: {
    current: boolean;
  }
  value?: string;
  onChange?: (params: { value: string, error: boolean }) => void;
  allowClear?: boolean;
  sendCodeBtnDisabled?: boolean;
  showEmailInfo?: boolean;
  // onSendError?: (err: any) => void;
  extra: {
    emailRetryAfterSeconds?: {
      time: number;
      deadline: number;
    } | null;
    email?: string;
    // needValidations: any[];
    loadingEmail?: boolean;
    preRegisterData?: any;
    desensitize?: boolean;
    onFinish: typeof noop;
    onBeforeSendCode?: typeof noop;
    onSendCode: typeof noop;
  };
}

const Email = (props: Props) => {
  const {
    isAutoSendCode = false,
    value,
    hasSent = { current: true },
    onChange = noop,
    allowClear = true,
    sendCodeBtnDisabled = false,
    showEmailInfo = true,
    // onSendError = noop,
    extra: {
      // 以前是外部传入 namespace，内部通过 redux 读全局状态
      // 现在改成外部传入以下数据
      emailRetryAfterSeconds,
      email,
      // needValidations,
      loadingEmail,
      preRegisterData, // 注册的手机号、邮箱在这个状态里
      // 以下是需要外部新传入的属性
      desensitize = true,
      // 以下是需要外部新增的事件
      onFinish,
      onBeforeSendCode,
      onSendCode
    }
  } = props;
  const [form] = Form.useForm();

  const isNewApi = useRegisterPhoneBindEmailABtest();

  const [disable, setDisable] = useState(false);

  const { t } = useLang();

  const deadline = useMemo(() => emailRetryAfterSeconds?.deadline, [
    emailRetryAfterSeconds?.deadline,
  ]);

  const handleFinish = (e) => {
    e.preventDefault();
  }

  const { countTime } = useCountDown({
    deadline,
    onBegin: () => {
      setDisable(true);
    },
    onFinish: () => {
      setDisable(false);
      onFinish();
      // 以下代码在外部传入的 onFinish 里实现
      // dispatch({
      //   type: `${namespace}/update`,
      //   payload: {
      //     emailRetryAfterSeconds: { time: 0, deadline: 0 },
      //   },
      // });
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
  const handleReFocus = () => {
   form.setFields([{ name: 'my_email', errors: [] }]);
  };

  const trackingConfigData = useTrackingConfigDataOfInviter();
  // 发送验证码
  const handleSendCode = () => {
    onBeforeSendCode?.()
    // 以下代码在外部传入的 onBeforeSendCode 里实现
    // if (namespace === NAMESPACE_MAPS.LOGIN) {
    //   trackClick(['send_login_verify', '1'], {
    //     type: 'my_email',
    //     source: String(needValidations.join()),
    //   });
    // }

    kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: trackingConfigData }, 'page_click');
    if (!loadingEmail) {
      // const payload: any = {
      //   toast,
      //   t,
      // };
      onSendCode();
      // 以下代码在外部传入的 onSendCode 里实现
      // if (sendChannelMap[namespace]) {
      //   payload.sendChannel = sendChannelMap[namespace];
      // }
      // if (namespace === NAMESPACE_MAPS.SIGNUP) {
      //   // 神策白名单 & 第一步输入的是手机号，邮箱验证码才是新业务REGISTER_EMAIL，否则都是老业务 REGISTER
      //   payload.validationBiz = isNewApi && preRegisterData.phone ? 'REGISTER_EMAIL' : 'REGISTER';
      // }
      // dispatch({
      //   type: `${namespace}/${[sendCodeEffectsMap[namespace]]}`,
      //   payload,
      //   onSendError,
      // });
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
      <div className={clsx(styles.formItemTipWrapper, !(email || preRegisterData?.email) || !showEmailInfo ? styles.hide : null)}>
        <div className={styles.formItemTipText}>
          <Trans
            ns="entrance"
            i18nKey="tung7oRbHSRMT3fw878BMA"
            // 验证码 如果是注册就明文展示 登陆脱敏展示
            values={{
              email:
                // namespace === NAMESPACE_MAPS.SIGNUP
                !desensitize
                  ? email || preRegisterData?.email
                  : formatEmail(email || preRegisterData?.email),
            }}
            components={{ b: <b className={styles.b}/> }}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (disable || loadingEmail || !isAutoSendCode || hasSent.current) {
      return;
    }
    handleSendCodeRef.current();
  }, [disable, hasSent, isAutoSendCode, loadingEmail]);

  return (
    <Form form={form} onFinish={handleFinish}>
      <div className={styles.codeWrapper}>
        <div className={clsx(styles.formItem)}>
          <FormItem
            {...formItemLayout}
            label={<div className={styles.formItemLabel}>{t('vc_email')}</div>}
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
            <Input
              className={styles.input}
              inputProps={{ maxLength: 6 }}
              value={value}
              autoComplete="off"
              onBlur={(e) => handleChange(e.target.value)}
              onChange={(e) => handleAutoCheck(e.target.value)}
              addonAfter={null}
              fullWidth
              onFocus={handleReFocus}
              allowClear={allowClear}
              label={t('vc_email')}
              data-inspector="entrance_email_verify_input"
              suffix={
                <SendCodeBtn
                  data-inspector="entrance_email_send_button"
                  style={{ flexShrink: 0 }}
                  loading={loadingEmail}
                  disabled={disable || sendCodeBtnDisabled}
                  onChange={handleSendCode}
                  countTime={countTime}
                  countText={t('voice_send')}
                  size="large"
                />
              }
            />
          </FormItem>
        </div>
      </div>
    </Form>
  );
};

export default Email;
