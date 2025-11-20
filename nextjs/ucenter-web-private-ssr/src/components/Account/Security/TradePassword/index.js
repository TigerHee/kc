/**
 * Owner: sean.shi@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Alert, Button, Form, Input } from '@kux/design';
import { useState } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import * as styles from './index.module.scss';

const { FormItem, useForm, useWatch } = Form;

export const TradePassword = ({ isBind, onSubmit, hiddenAlert }) => {
  useLocale();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const password = useWatch('password', form);
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [password2Checked, setPassword2Checked] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      await onSubmit({
        password: password,
        isUpdate: !isBind,
      });
    } catch (err) {
      console.log('err..', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePwdFocus = () => {
    form.setFields([{ name: 'password', errors: [] }]);
  };
  const handleRePwdFocus = () => {
    form.setFields([{ name: 'password2', errors: [] }]);
  };

  const handlePwdBlur = async () => {
    try {
      await form.validateFields(['password']);
      setPasswordChecked(true);
    } catch (err) {
      setPasswordChecked(false);
      console.log('err..', err);
    }
  };

  const handleRePwdBlur = async () => {
    try {
      await form.validateFields(['password2']);
      setPassword2Checked(true);
    } catch (err) {
      setPassword2Checked(false);
      console.log('err..', err);
    }
  };

  return (
    <>
      {!isBind && !hiddenAlert ? (
        <div className={styles.alertWrapper}>
          <Alert
            className={styles.alert}
            type="warning"
            duration={0}
            message={
              <div>
                <div>1.&nbsp;{_t('f89ab5205d6a4000adcd')}</div>
                <div>2.&nbsp;{_t('9b3cfe7bbd554000a762')}</div>
              </div>
            }
          />
        </div>
      ) : (
        <div className={styles.alertTips}>{_tHTML('46ef0f53f5a24000a71a')}</div>
      )}

      <Form className={styles.tradePasswordForm} form={form} onFinish={handleFormSubmit}>
        <FormItem
          name="password"
          label={_t('trade.code.new')}
          validateTrigger={['onBlur', 'onSubmit']}
          rules={[
            {
              required: true,
              message: _t('form.required'),
            },
            {
              validator: (_, value) => {
                if (value && !value.match(/^\d{6}$/)) {
                  return Promise.reject(new Error(_t('form.tradeCode.required')));
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input
            id="password"
            fullWidth
            type="password"
            prefix={''}
            maxLength={6}
            allowClear
            onFucus={handlePwdFocus}
            onBlur={handlePwdBlur}
          />
        </FormItem>
        <FormItem
          name="password2"
          label={_t('trade.code.confirm')}
          validateTrigger={['onBlur', 'onSubmit']}
          rules={[
            {
              required: true,
              message: _t('form.required'),
            },
            {
              validator: (_, value) => {
                if (value && !value.match(/^\d{6}$/)) {
                  return Promise.reject(new Error(_t('form.tradeCode.required')));
                } else if (value !== password) {
                  return Promise.reject(new Error(_t('form.inconsistent')));
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input
            id="password2"
            fullWidth
            type="password"
            maxLength={6}
            allowClear
            onFucus={handleRePwdFocus}
            onBlur={handleRePwdBlur}
          />
        </FormItem>
      </Form>

      <Button
        type="primary"
        size="large"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={!passwordChecked || !password2Checked}
        onClick={handleSubmit}
      >
        {_t('submit')}
      </Button>
    </>
  );
};
