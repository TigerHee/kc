/**
 * Owner: sean.shi@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { PasswordInput } from '@kucoin-gbiz-next/entrance';
import { Alert, Button, Form, Input } from '@kux/design';
import { delay } from 'lodash-es';
import { useState } from 'react';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

const { FormItem, useForm, useWatch } = Form;

export const Password = ({ isBind, onSubmit }) => {
  useLocale();
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState({ value: '', error: true });
  const password2 = useWatch('password2', form);

  const handlePasswordChange = (changeValue = { value: '', error: true }) => {
    setPassword(changeValue);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      await onSubmit({
        password: password.value,
      });
    } catch (err) {
      console.log('err..', err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (rule, value) => {
    return new Promise((resolve, reject) => {
      delay(() => {
        if (value && !password.error && value === password.value) {
          resolve();
        } else {
          reject(new Error(_t('form.inconsistent')));
        }
      }, 300);
    });
  };

  const handlePwdFocus = () => {
    form.setFields([{ name: 'password2', errors: [] }]);
  };

  return (
    <>
      <div className={styles.alertWrapper}>
        <Alert
          className={styles.alert}
          type="warning"
          duration={0}
          message={_t('7c96c965a1f04800a4ae')}
        />
      </div>

      <PasswordInput
        prefix={''}
        className={styles.passwordFormItem}
        onChange={handlePasswordChange}
      />

      <Form className={styles.passwordRepeatFormItem} form={form} onFinish={handleFormSubmit}>
        <FormItem
          name="password2"
          label={_t(isBind ? 'password.confirm' : '77c6ec72aff14000a14d')}
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
          <Input id="password2" fullWidth type="password" onFucus={handlePwdFocus} allowClear />
        </FormItem>
      </Form>

      <Button
        type="primary"
        size="large"
        fullWidth
        loading={loading}
        className={styles.submitButton}
        disabled={password.error || !password.value || !password2 || password2 !== password.value}
        onClick={handleSubmit}
      >
        {_t('submit')}
      </Button>
    </>
  );
};
