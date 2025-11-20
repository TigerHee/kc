import React, { useEffect, useMemo, useState } from 'react';
import { Input, Form } from '@kux/design';
import { map } from 'lodash-es';
import { useLang } from '../../hookTool';
import { getMailSuffixesUsingGet } from '../../api/market-operation';
import clsx from 'clsx';
import { checkAccountType } from '../../common/tools';
import styles from './index.module.scss';

const { FormItem, useWatch, useForm } = Form;

export interface IEmailInputProps {
  className?: string;
  onChange?: (param: { value: string; error: boolean }) => void;
  initValues?: string;
  disabled?: boolean;
  shouldBlurValidate?: boolean;
  label?: React.ReactNode;
  prefix?: React.ReactNode;
}

const EmailInput: React.FC<IEmailInputProps> = ({ onChange, initValues, disabled, className = '', prefix, label }) => {
  const { t } = useLang();
  const [form] = useForm();
  const emailValue = useWatch(['email'], form);
  const [emailSuffixes, setEmailSuffixes] = useState<string[]>([]);
  const [inputIsFocus, setInputIsFocus] = useState(false);

  const handleChange = value => {
    if (form.getFieldError('email')?.length > 0) {
      onChange?.({
        value,
        error: true,
      });
    } else {
      onChange?.({
        value,
        error: false,
      });
    }
  };

  const handleAccountFocus = () => {
    setInputIsFocus(true);
    form.setFields([{ name: 'email', errors: [] }]);
  };

  const handleAccountBlur = e => {
    setInputIsFocus(false);
    form
      .validateFields(['email'])
      .then(() => {
        handleChange(e.target.value);
      })
      .catch(() => {
        handleChange(e.target.value);
      });
  };

  const handleInputChange = e => {
    handleChange(e.target.value);
  };

  const handleFinish = e => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      const { data } = await getMailSuffixesUsingGet();
      setEmailSuffixes(data || []);
    })();
  }, []);

  const matchedSuffixes = useMemo(() => {
    if (!emailValue) return [];
    const index = emailValue.indexOf('@');
    if (index === -1) return [];
    const _suffix = emailValue.slice(index + 1);
    return emailSuffixes.filter(item => item.startsWith(_suffix) && item !== _suffix);
  }, [emailValue, emailSuffixes]);

  return (
    <Form form={form} onFinish={handleFinish}>
      <div className={clsx(styles.formItemBox, className)}>
        <FormItem
          name="email"
          label={label ?? t('5e072c122d574000a8ba')}
          validateTrigger={['onBlur', 'onSubmit']}
          rules={[
            {
              validator: (_: any, value: string) => {
                if (!checkAccountType(value, 'email') && /@/.test(value)) {
                  return Promise.reject(t('fsCtaeGdJidTiUDSdysTGN'));
                }
                return Promise.resolve();
              },
              message: t('fsCtaeGdJidTiUDSdysTGN'),
            },
            {
              validator: (_: any, value: string) => {
                if (!checkAccountType(value, 'email')) {
                  return Promise.reject(t('form_email_error'));
                }
                return Promise.resolve();
              },
              message: t('form_email_error'),
            },
          ]}
          initialValue={initValues}
        >
          <Input
            id="email_input"
            disabled={disabled}
            size="medium"
            fullWidth
            label={t('5e072c122d574000a8ba')}
            onFocus={handleAccountFocus}
            onBlur={handleAccountBlur}
            onChange={handleInputChange}
            prefix={prefix}
            autoComplete="off"
            allowClear
          />
        </FormItem>
        {matchedSuffixes?.length && inputIsFocus ? (
          <ul className={styles.dropdownMenu}>
            {map(matchedSuffixes, item => (
              <li
                className={styles.dropdownMenuItem}
                style={{ direction: 'ltr' }}
                key={item}
                onMouseDown={() =>
                  form.setFieldsValue({
                    email: `${emailValue.slice(0, emailValue?.indexOf?.('@'))}@${item}`,
                  })
                }
              >
                {`${emailValue.slice(0, emailValue?.indexOf?.('@'))}@`}
                <span className={styles.suffixText}>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Form>
  );
};

export default EmailInput;
