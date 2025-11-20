/**
 * Owner: sean.shi@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { PhoneAreaSelector, SMSVerifyInput } from 'gbiz-next/entrance';
import { Alert, Button, Form, Input } from '@kux/design';
import { tenantConfig } from 'config/tenant';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

const { FormItem, useForm, useWatch } = Form;

const resolveContryCode = (code) => {
  if (code instanceof Object) {
    return code?.mobileCode?.replace(/_.*$/g, '');
  }
  return (code || '').replace(/_.*$/g, '');
};

export const Phone = ({ isBind, customSendRequest, onSubmit, hiddenAlert, addressLabel }) => {
  const { currentLang } = useLocale();
  const [form] = useForm();
  const dispatch = useDispatch();
  const phoneNumber = useWatch(['phone'], form);
  const countryCode = useWatch(['countryCode'], form);
  const { countryList } = useSelector((state) => state.homepage);

  const [smsCode, setSmsCode] = useState({ value: '', error: true });
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingSms, setLoadingSms] = useState(false);
  const [sendChannel, setSendChannel] = useState('SMS');

  const validatePhoneNumber = (rule, value, callback) => {
    if (value) {
      if (!value.match(/^\d{1,32}$/)) {
        callback(_t('kyc.mobile.required'));
      }
      //  else if (value.startsWith('0')) {
      //   callback(_t('33ec784d8aaa4000ad39'));
      // }
      else {
        callback();
      }
    } else {
      callback(_t('kyc.mobile.required'));
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { countryCode, phone } = values;
      await onSubmit({
        phone,
        code: smsCode.value,
        countryCode: resolveContryCode(countryCode),
        sendChannel,
      });
    } catch (err) {
      console.log('err..', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = (currentSendChannel = 'SMS') => {
    form.validateFields(['countryCode', 'phone']).then(async ({ countryCode, phone }) => {
      setLoadingSms(true);
      const request = customSendRequest
        ? customSendRequest({ phone: `${countryCode}-${phone}`, sendChannel: currentSendChannel })
        : dispatch({
          type: 'account_security/sendBindCode',
          payload: {
            type: 'phone',
            params: {
              bizType: isBind ? 'BIND_PHONE_V2' : 'UPDATE_PHONE_V2',
              phone,
              countryCode,
              sendChannel: currentSendChannel,
            },
          },
        });
      request
        .then(({ retryAfterSeconds: retrySeconds }) => {
          setRetryAfterSeconds(new Date().getTime() + retrySeconds * 1000);
          setSendChannel(currentSendChannel);
        })
        .finally(() => {
          setLoadingSms(false);
        });
    });
  };

  const handleSMSCodeChange = (changeValue = { value: '', error: true }) => {
    setSmsCode(changeValue);
  };

  useEffect(() => {
    dispatch({ type: 'homepage/pullCountryList' });
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      {!isBind && !hiddenAlert && (
        <div className={styles.alertWrapper}>
          <Alert
            className={styles.alert}
            type="warning"
            duration={0}
            message={_t('2197e7056b704000a567')}
          />
        </div>
      )}
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <FormItem
          className={styles.phoneFormItem}
          name="phone"
          label={addressLabel || _t('phone.number')}
          rules={[
            {
              required: true,
              message: _t('form.required'),
            },
            {
              validator: validatePhoneNumber,
            },
          ]}
        >
          <Input
            autoComplete="off"
            fullWidth
            allowClear
            prefix={
              <FormItem
                className={styles.countryCodeFormItem}
                name="countryCode"
                label={_t('country.code')}
                initialValue={tenantConfig.resetPhone.countryCodeInitialValue?.mobileCode || ''}
                rules={[
                  {
                    required: true,
                    message: _t('form.required'),
                  },
                ]}
              >
                <PhoneAreaSelector
                  countries={countryList}
                  language={currentLang}
                  disabled={tenantConfig.resetPhone.disabledCountrySelect}
                  forbiddenCountry
                  useInit={
                    tenantConfig.resetPhone.isCountryCodeInit
                      ? true
                      : !!tenantConfig.resetPhone.countryCodeInitialValue
                  }
                />
              </FormItem>
            }
          />
        </FormItem>
      </Form>
      <SMSVerifyInput
        allowClear={false}
        value={phoneNumber}
        showPhoneInfo={false}
        isAutoSendCode={false}
        onChange={handleSMSCodeChange}
        sendCodeBtnDisabled={!phoneNumber || !countryCode}
        onSendVoice={() => {
          if (loadingSms) return;
          handleSendCode('VOICE');
        }}
        extra={{
          smsRetryAfterSeconds: {
            time: 0,
            deadline: retryAfterSeconds,
          },
          countryCode,
          phone: phoneNumber,
          loadingSms,
          onFinish: () => {
            setRetryAfterSeconds(0);
          },
          onSendCode: () => {
            if (loadingSms) return;
            handleSendCode('SMS');
          },
        }}
      />

      <Button
        type="primary"
        size="large"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={!smsCode.value || smsCode.error || !phoneNumber || !countryCode}
        onClick={handleSubmit}
      >
        {isBind ? _t('active') : _t('submit')}
      </Button>
    </div>
  );
};
