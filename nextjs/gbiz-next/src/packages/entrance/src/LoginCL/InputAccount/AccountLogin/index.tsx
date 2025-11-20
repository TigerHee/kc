/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useRef, forwardRef, useMemo, useState, useLayoutEffect } from 'react';
import noop from 'lodash/noop';
import { Form, Button, Box, Input } from '@kux/mui';
import { Captcha } from 'packages/captcha';
import storage from 'tools/storage';
import useMultiSiteConfig from 'hooks/useMultiSiteConfig';
import { kcsensorsManualTrack } from 'tools/sensors';
import clsx from 'clsx';
import { ErrorAlert } from '../../../components/ErrorAlert';
import { ACCOUNT_KEY, ACCOUNT_LOGIN_TAB_KEY, BIZ } from '../../constants';
import { checkAccountType, getMobileCode, getTrackingSource } from '../../../common/tools';
import { useLang, useToast } from '../../../hookTool';
import FusionInputFormItem from '../../../components/FusionInputFormItem';
import { useLoginStore } from '../../../Login/model';
import styles from './index.module.scss';

interface AccountLoginProps {
  onForgetPwdClick?: () => void;
  trackingConfig?: Record<string, any>;
  onSuccess?: (data: any) => void;
  tabKey?: string;
}

const { FormItem } = Form;

let submitValues: any = null;

const AccountLogin = forwardRef<HTMLFormElement, AccountLoginProps>((props = {}, ref) => {
  const { onForgetPwdClick = noop, trackingConfig, onSuccess, tabKey } = props;

  const [form] = Form.useForm();
  const formRef = useRef(form);
  formRef.current = form;
  const { t } = useLang();

  // zustand store
  const countryCodes = useLoginStore(s => s.countryCodes);
  const loginLoading = useLoginStore(s => s.loginLoading);
  const loginErrorTip = useLoginStore(s => s.loginErrorTip);
  const getCountryCodes = useLoginStore(s => s.getCountryCodes);
  const loginV2 = useLoginStore(s => s.loginV2);
  const update = useLoginStore(s => s.update);

  const toast = useToast();
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const { multiSiteConfig } = useMultiSiteConfig();

  const accountValue = Form.useWatch('account', form);
  const _countryCode = Form.useWatch('countryCode', form);
  const _pwd = Form.useWatch('password', form);
  const isBtnDisable = !accountValue || !_pwd;
  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(accountValue), [accountValue]);

  const handleAccountBlur = () => {
    if (accountType === 'email') {
      kcsensorsManualTrack({ spm: ['email', '1'] }, 'page_click');
    } else if (accountType === 'phone') {
      kcsensorsManualTrack({ spm: ['phone', '1'] }, 'page_click');
    }
  };

  useEffect(() => {
    if (!countryCodes?.length) {
      getCountryCodes?.();
    }
  }, [countryCodes?.length, getCountryCodes]);

  useLayoutEffect(() => {
    const bindEventListener = e => {
      const targetId = e?.target?.id;
      const disableValidateAccountInputId = [
        'login_passkey_btn',
        'login_telegram_btn',
        'login_google_btn',
        'login_apple_btn',
      ];
      if (disableValidateAccountInputId.includes(targetId)) {
        return;
      }
      const accountInputElement = document.querySelector('#login_account_input .KuxInput-input');
      if (accountInputElement && accountInputElement === e?.target) {
        // 点击账号输入框，也不用校验
        return;
      }
      formRef.current.validateFields().catch(err => {
        console.log('form validate error...', err);
      });
    };
    if (typeof window !== 'undefined') {
      document.body.addEventListener('click', bindEventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.removeEventListener('click', bindEventListener);
      }
    };
  }, []);

  useEffect(() => {
    // 登录按钮曝光
    if (trackingConfig && trackingConfig.kc_pageid && trackingConfig.spm) {
      kcsensorsManualTrack(trackingConfig);
    }
  }, [trackingConfig]);

  const initCountryCode = useMemo(() => {
    return storage.getItem(ACCOUNT_KEY.mobileCode) || '';
  }, []);

  const handleSubmit = (values?: any) => {
    // 登录按钮点击
    if (trackingConfig && trackingConfig.kc_pageid && trackingConfig.spm) {
      kcsensorsManualTrack(trackingConfig, 'page_click');
    }

    if (values) {
      kcsensorsManualTrack({ spm: ['loginButton', '1'] }, 'page_click');
      submitValues = { ...values };
    }
    const payload = { ...(values || submitValues) };
    payload.account = payload.account.trim();
    payload.loginType = tabKey;
    const isPhoneLogin = checkAccountType(payload.account) === 'phone';
    if (isPhoneLogin) {
      payload.phone = payload.account;
      payload.account = `${getMobileCode(payload.countryCode)}-${payload.account}`;
      payload.mobileCode = getMobileCode(payload.countryCode);
    }
    const source = getTrackingSource(trackingConfig);
    loginV2?.({
      payload,
      onSuccess,
      trackResultParams: { source },
      onOpenCaptcha: () => {
        setCaptchaOpen(true);
      },
    });
  };

  const commonRule = [{ required: true, message: t('form_required') }];

  useEffect(() => {
    form.resetFields();
  }, []);

  const closeCaptcha = () => {
    setCaptchaOpen(false);
    update?.({ loginLoading: false });
  };

  const onCloseCaptcha = () => {
    kcsensorsManualTrack({ spm: ['robotClose', '1'] }, 'page_click');
    closeCaptcha();
  };

  const onFormChange = () => {
    update?.({ loginErrorTip: '' });
  };

  // 人机校验拉取失败
  const onValidateError = () => {
    kcsensorsManualTrack({ spm: ['robotfail', '1'] }, 'page_click');
  };

  const onValidateSuccess = () => {
    closeCaptcha();
    kcsensorsManualTrack({ spm: ['robotSuccess', '1'] }, 'page_click');
    handleSubmit();
  };

  return (
    <>
      <Form className={styles.extendForm} form={form} onFinish={handleSubmit} ref={ref} onValuesChange={onFormChange}>
        <Captcha
          open={captchaOpen}
          onClose={onCloseCaptcha}
          onValidateError={onValidateError}
          bizType={BIZ}
          onValidateSuccess={onValidateSuccess}
        />
        <FusionInputFormItem
          scene="login"
          form={form}
          countryCodes={countryCodes}
          onInputBlur={handleAccountBlur}
          initValues={{
            countryCode: initCountryCode,
            account:
              typeof window !== 'undefined'
                ? window?.atob?.(storage.getItem(ACCOUNT_KEY[tabKey as keyof typeof ACCOUNT_KEY]) || '') || ''
                : '',
          }}
          multiSiteConfig={multiSiteConfig}
        />
        {/* 登錄密碼 */}
        <FormItem
          className={clsx(styles.passwordFormItem)}
          requiredMark={false}
          label={t('login_password')}
          name="password"
          rules={commonRule}
        >
          <Input
            size="xlarge"
            autoComplete="new-password"
            type="password"
            className={styles.mtSpace}
            allowClear
            data-inspector="signin_password_input"
          />
        </FormItem>
        <ErrorAlert msg={loginErrorTip} />
        <Box className={styles.forgetPwdBox}>
          <Box
            display="inline-block"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            data-inspector="signin_forget_password"
            onClick={() => {
              if (tabKey === ACCOUNT_LOGIN_TAB_KEY) {
                storage.setItem('$entrance.f.mc', _countryCode || '');
                storage.setItem('$entrance.f.a', window?.btoa?.(accountValue || '') || '');
              } else {
                storage.removeItem('$entrance.f.mc');
                storage.removeItem('$entrance.f.a');
              }
              kcsensorsManualTrack({ spm: ['forgetPassword', '1'] }, 'page_click');
              onForgetPwdClick();
            }}
          >
            {t('forget_pwd')}
          </Box>
        </Box>
        <Button
          className={styles.subButton}
          fullWidth
          htmlType="submit"
          size="large"
          loading={loginLoading}
          data-inspector="signin_submit_button"
          disabled={loginLoading || isBtnDisable}
        >
          {loginLoading ? t('login_ing') : t('login')}
        </Button>
      </Form>
    </>
  );
});

export default AccountLogin;
