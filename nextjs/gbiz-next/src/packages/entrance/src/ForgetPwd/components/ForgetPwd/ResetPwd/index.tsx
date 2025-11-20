import React, { useEffect, useState, useRef } from 'react';
import { Form, Button } from '@kux/mui';
import { delay } from 'lodash-es';
import { kcsensorsManualTrack } from 'tools/sensors';
import { REGEXP, matchPasswordCheck } from '../../../../common/tools';
import NewInputEye from 'packages/entrance/src/components/NewInputEye';
import PasswordCheck from 'packages/entrance/src/components/PasswordCheck';
import PasswordStrength from 'packages/entrance/src/components/PasswordStrength';
import { useToast, useLang } from '../../../../hookTool';
import modifyPasswordIcon from '../../../../../static/modify-password-icon.png';
import styles from './styles.module.scss';
import { useForgetPwdStore } from '../../../model';
import { getTenantConfig } from '../../../../config/tenant';
import { SecurityTipModal } from '../Modal';
import { goVerifyWithAddress } from 'packages/verification';
import clsx from 'clsx';

const { FormItem } = Form;
let timer: number | null = null;
const ResetPwd = ({ onSuccess, onBack }) => {
  const [form] = Form.useForm();
  const verifyResult = useForgetPwdStore(state => state.verifyResult);
  const resetPwd = useForgetPwdStore(state => state.resetPwd);
  const loading = useForgetPwdStore(state => state.loading.resetPwd);
  const [isPwdError, updatePwdError] = useState(false);
  const _password = Form.useWatch('password', form);
  const _password2 = Form.useWatch('password2', form);
  const toast = useToast();
  const { setFields } = form;
  const { t } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);

  const matchAllRules = matchPasswordCheck(_password);
  const handleSubmit = async e => {
    e && e.preventDefault();
    // 校验表单值
    form.validateFields().then(async ({ password }) => {
      const isOk = await resetPwd?.({
        password,
        toast,
        headers: {
          ...(verifyResult?.headers || {}),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (isOk) {
        kcsensorsManualTrack({ spm: ['confirmPassword', '1'] }, 'page_click');
        toast.success(t('bopToEojhPLfQUvu1wgPfs'));
        timer = delay(() => onSuccess?.(isOk), 2000);
      }
    });
  };


  const handlePwdFocus = () => {
    setFields([{ name: 'password', errors: [] }]);
  };

  const handlePwd2Focus = () => {
    setFields([{ name: 'password2', errors: [] }]);
  };
  const handlePwdBlur = () => {
    form
      .validateFields(['password'])
      .then(() => {
        kcsensorsManualTrack({ spm: ['insertPassword', '1'] }, 'page_click');
        updatePwdError(false);
      })
      .catch(() => {
        updatePwdError(true);
      });
  };

  // 忘记密码设置密码组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['password', '1'],
    });
  }, []);


  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Form form={form} className={clsx(styles.form)}>
        <FormItem
          className={styles.newPassword}
          label={t('7DZjKaSedHndJevqcb3uV1')}
          name="password"
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
            onFocus={handlePwdFocus}
            autoComplete="new-password"
            onBlur={handlePwdBlur}
            ref={inputRef}
          />
        </FormItem>
        {/* 输入密码不满足要求，则不展示强度 */}
        {matchAllRules && <PasswordStrength password={_password} />}
        <PasswordCheck password={_password} isError={isPwdError} always matchAllRules={matchAllRules} />
        <FormItem
          label={t('5V1KtkFvcn4mguSBWD4iyY')}
          name="password2"
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
              validator: (rule, value, callback) => {
                if (value !== _password) {
                  callback(t('3q1w6JcjUQjnFo3NyXSdH6'));
                  return;
                }
                callback();
              },
            },
          ]}
          validateTrigger={['onBlur', 'onSubmit', 'onChange']}
        >
          <NewInputEye className="mtSpace" onFocus={handlePwd2Focus} autoComplete="new-password" />
        </FormItem>
        <Button
          className={styles.button}
          type="primary"
          fullWidth
          size="large"
          onClick={handleSubmit}
          loading={!!loading}
          disabled={!_password || isPwdError || _password !== _password2}
        >
          {t('vHBPtPwoVzxY4ZqfjDhAaR')}
        </Button>
      </Form>
    </>
  );
};

export default ResetPwd;
