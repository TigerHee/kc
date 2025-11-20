/**
 * Owner: sean.shi@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Alert, Button, Form, Input } from '@kux/design';
import { delay } from 'lodash-es';
import { useState } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import * as styles from './index.module.scss';

const { FormItem, useForm, useWatch } = Form;

export const TradePassword = ({ isBind, onSubmit, hiddenAlert }) => {
  useLocale();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const password = useWatch('password', form);
  const password2 = useWatch('password2', form);

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

  const validateTradePassword = (rule, value) => {
    return new Promise((resolve, reject) => {
      delay(() => {
        if (value && !value.match(/^\d{6}$/)) {
          reject(new Error(_t('form.tradeCode.required')));
        } else {
          resolve();
        }
      }, 300);
    });
  };

  const validatePassword = (rule, value) => {
    return new Promise((resolve, reject) => {
      delay(() => {
        if (value && value === password) {
          resolve();
        } else {
          reject(new Error(_t('form.inconsistent')));
        }
      }, 300);
    });
  };

  const handlePwdFocus = () => {
    form.setFields([{ name: 'password', errors: [] }]);
  };
  const handleRePwdFocus = () => {
    form.setFields([{ name: 'password2', errors: [] }]);
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
          rules={[
            {
              required: true,
              message: _t('form.required'),
            },
            {
              validator: validateTradePassword,
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
          />
        </FormItem>
        <FormItem
          name="password2"
          label={_t('trade.code.confirm')}
          rules={[
            {
              required: true,
              message: _t('form.required'),
            },
            {
              validator: validatePassword,
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
          />
        </FormItem>
      </Form>

      <Button
        type="primary"
        size="large"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={
          !password ||
          !password2 ||
          form.getFieldError('password')?.length > 0 ||
          form.getFieldError('password2')?.length > 0
        }
        onClick={handleSubmit}
      >
        {_t('submit')}
      </Button>
    </>
  );
};
