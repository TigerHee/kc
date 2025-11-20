/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useState, useRef } from 'react';
import { Form } from '@kux/design';
import clsx from 'clsx'
import NewInputEye from '../../components/NewInputEye';
import PasswordCheck from '../../components/PasswordCheck';
import PasswordStrength from '../../components/PasswordStrength';
import { REGEXP, matchPasswordCheck } from '../../common/tools';
import { useLang } from '../../hookTool';
import styles from './index.module.scss';

const { useForm, FormItem, useWatch } = Form;

export interface IPasswordInputProps {
  className?: string;
  label?: React.ReactNode;
  prefix?: React.ReactNode;
  onChange?: (param: { value: string; error: boolean }) => void;
  onFucus?: () => void;
}

const PasswordInput: React.FC<IPasswordInputProps> = ({ className = '', prefix, onFucus, onChange, label }) => {
  // 表单校验报错提示，如果输入状态, 即使是不符合密码规则，也不提示错误
  const [isPwdErrorInForm, updatePwdErrorInForm] = useState(false);
  const [form] = useForm();
  const _password = useWatch('password', form);
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showItemHelp, setShowItemHelp] = useState(false);

  const handleChange = (value) => {
    if (form.getFieldError('password')?.length > 0) {
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

  const handlePwdFocus = () => {
    setShowItemHelp(false);
    form.setFields([{ name: 'password', errors: [] }]);
    onFucus?.();
  };

  const handleErrorTips = (e) => {
    form
      .validateFields(['password'])
      .then(() => {
        updatePwdErrorInForm(false);
        handleChange(e.target.value)
      })
      .catch(() => {
        setShowItemHelp(true);
        updatePwdErrorInForm(true);
        handleChange(e.target.value)
      });
  };

  const handleInputChange = e => {
    handleChange(e.target.value)
  }

  const handleFormFinish = (e) => {
    e.preventDefault();
  }


  // 密码是否满足规则要求，实时检测
  const matchAllRules = matchPasswordCheck(_password);

  return (
    <Form form={form} className={clsx(styles.form, showItemHelp && styles.showItemHelp, className)} onFinish={handleFormFinish}>
      <FormItem
        label={label ?? t('set_login_psw')}
        name="password"
        initialValue=""
        rules={[
          {
            validator: (rule, value) => {
              if (typeof value === 'string' && value.trim() === '') {
                return Promise.reject(t('form_required'));
              }
              return Promise.resolve();
            },
            message: t('form_required'),
          },
          {
            pattern: REGEXP.pwd,
            message: t('form_password_error'),
          },
        ]}
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <NewInputEye
          className={clsx(styles.mtSpace, styles.inputEye)}
          onFocus={handlePwdFocus}
          // autoComplete="new-password"
          onBlur={handleErrorTips}
          onChange={handleInputChange}
          prefix={prefix}
          ref={inputRef}
        />
      </FormItem>
      {/* 输入密码不满足要求，则不展示强度 */}
      {matchAllRules && <PasswordStrength password={_password} />}
      <PasswordCheck password={_password} always isError={isPwdErrorInForm} matchAllRules={matchAllRules} />
    </Form>
  );
};

export default PasswordInput;
