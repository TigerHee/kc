/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useRef, forwardRef, useMemo, useState, useLayoutEffect } from 'react';
import { Trans } from 'tools/i18n';
import noop from 'lodash-es/noop';
import { Form, Button, Box, Input } from '@kux/mui';
import { Captcha } from 'packages/captcha';
import storage from 'tools/storage';
import { useOauthLogin, useMultiSiteConfig } from 'hooks';
import { kcsensorsManualTrack } from 'tools/sensors';
import { getTrackingSource } from '../../../common/tools';
import {
  ACCOUNT_KEY,
  ACCOUNT_LOGIN_TAB_KEY,
  SUB_ACCOUNT_LOGIN_TAB_KEY,
  BIZ,
  ACCOUNT_LOGIN_STEP,
} from '../../constants';
import { checkAccountType, getMobileCode } from '../../../common/tools';
import { passkeysSupported } from '../../../common/webauthn';
import { useLang, usePasskeyLogin, PasskeyLoginStatus } from '../../../hookTool';
import { ErrorAlert } from '../../../components/ErrorAlert';
import ThirdPartyLogin from '../../../components/ThirdPartyLogin';
import FusionInputFormItem from '../../../components/FusionInputFormItem';
import PasskeyLoginBtn from './PasskeyLoginBtn';
import FirstNextBtn from './FirstNextBtn';
import { TUserResponse, useLoginStore } from '../../model';
import clsx from 'clsx';
import styles from './index.module.scss';

const { FormItem } = Form;

let submitValues: any = null;
const isSupportPasskey = passkeysSupported();

interface AccountLoginProps {
  onForgetPwdClick?: () => void;
  trackingConfig?: any;
  signOrDownClick?: () => void;
  forgetBottom?: React.ReactNode;
  onSuccess?: (data: TUserResponse | null) => void;
  withDrawer?: boolean;
  tabKey?: string;
}

const AccountLogin = forwardRef<any, AccountLoginProps>((props: AccountLoginProps, ref: React.Ref<any>) => {
  const { onForgetPwdClick = noop, trackingConfig, signOrDownClick, forgetBottom, onSuccess, tabKey } = props || {};

  const [form] = Form.useForm();
  const formRef = useRef(form);
  formRef.current = form;
  const { t } = useLang();

  // zustand
  const accountLoginStep = useLoginStore(state => state.accountLoginStep);
  const countryCodes = useLoginStore(state => state.countryCodes);
  const loginLoading = useLoginStore(state => state.loginLoading);
  const loginErrorTip = useLoginStore(state => state.loginErrorTip);
  const update = useLoginStore(state => state.update);
  const getCountryCodes = useLoginStore(state => state.getCountryCodes);
  const loginV2 = useLoginStore(state => state.loginV2);
  const passkeyLogin = useLoginStore(state => state.passkeyLogin);

  const [captchaOpen, setCaptchaOpen] = useState(false);
  const oauthLogin = useOauthLogin('TELEGRAM,GOOGLE,APPLE');
  const { currentPasskeyStatus, passkeyAuth } = usePasskeyLogin();
  const { multiSiteConfig } = useMultiSiteConfig();

  const accountValue = Form.useWatch('account', form);
  const _countryCode = Form.useWatch('countryCode', form);
  const _pwd = Form.useWatch('password', form);
  const isBtnDisable = !accountValue || !_pwd;
  const accountType = useMemo(() => checkAccountType(accountValue), [accountValue]);

  // 多租户支持 三方登陆（保持与原逻辑一致，运行时值为小写）
  const supportThirdLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('extlogin');
  const supportTelegram = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('telegram');
  const supportGoole = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('google');
  const supportApple = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('apple');
  const hasThirdParty = supportTelegram || supportGoole || supportApple;

  const supportPasskeyLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('passkey');
  const isOpenPasskey = isSupportPasskey;

  const isShowThirdPartyLogin = useMemo(() => {
    return ['telegram_domain', 'google_domain', 'apple_domain'].some(
      domain => oauthLogin?.oauthConfig?.[domain] === (typeof window !== 'undefined' ? window.location.host : '')
    );
  }, [oauthLogin]);

  const thirdPartyAvailable = supportThirdLogin && hasThirdParty && isShowThirdPartyLogin;

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
  }, [countryCodes?.length]);

  useLayoutEffect(() => {
    const bindEventListener = (e: any) => {
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
        return;
      }
      formRef.current.validateFields().catch(() => {});
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
    if (trackingConfig && trackingConfig.kc_pageid && trackingConfig.spm) {
      kcsensorsManualTrack(trackingConfig);
    }
    if (isOpenPasskey && supportPasskeyLogin) {
      kcsensorsManualTrack({
        kc_pageid: 'B1login',
        spm: ['PasskeyloginButton', '1'],
      });
    }
  }, [isOpenPasskey, supportPasskeyLogin, trackingConfig]);

  const initCountryCode = useMemo(() => {
    return storage.getItem(ACCOUNT_KEY.mobileCode) || '';
  }, []);

  const handlePasskeyLogin = async (accountObj?: any) => {
    let passkeyLoginResult = false;
    try {
      kcsensorsManualTrack({ spm: ['accountPasskeyLogin', '1'] }, 'page_click');
      const payload: any = {};
      if (accountObj) {
        payload.account = accountObj.account;
        payload.countryCode = accountObj.countryCode;
        payload.loginType = tabKey;
        const isPhoneLogin = checkAccountType(payload.account) === 'phone';
        if (isPhoneLogin) {
          payload.phone = payload.account;
          payload.account = `${getMobileCode(payload.countryCode)}-${payload.account}`;
          payload.mobileCode = getMobileCode(payload.countryCode);
        }
        kcsensorsManualTrack({ spm: ['accountPasskeyloginByNextButton', '1'] });
      }
      const passkeyLoginRes = await passkeyAuth({ account: payload?.account });
      if (passkeyLoginRes) {
        kcsensorsManualTrack({ spm: ['accountPasskeyLoginSuccess', '1'] });
        const source = getTrackingSource(trackingConfig);
        await passkeyLogin?.({
          payload,
          passkeyLoginRes,
          onSuccess,
          trackResultParams: { source },
        });
        passkeyLoginResult = true;
      } else {
        kcsensorsManualTrack({ spm: ['accountPasskeyLoginFail', '1'] });
        passkeyLoginResult = false;
      }
    } catch (error) {
      kcsensorsManualTrack({ spm: ['accountPasskeyLoginFail', '1'] });
      passkeyLoginResult = false;

      console.error('passkey login error:', error);
    }
    return passkeyLoginResult;
  };

  const handleClickNextBtn = async () => {
    try {
      kcsensorsManualTrack({ spm: ['nextButton', '1'] }, 'page_click');
      const formValues = await form.validateFields();
      const [account, countryCode] = [formValues?.account, formValues?.countryCode];

      if (account && supportPasskeyLogin && isOpenPasskey) {
        const passkeyIsLogin = await handlePasskeyLogin({ account: account.trim(), countryCode });
        if (!passkeyIsLogin) {
          update?.({ accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD });
        } else {
          kcsensorsManualTrack({ spm: ['nextButtonAccountPasskeyLoginSuccess', '1'] }, 'page_click');
        }
      } else {
        update?.({ accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD });
      }
    } catch {
      update?.({ accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD });
    }
  };

  const handleSubmit = (values?: any) => {
    if (trackingConfig && trackingConfig.kc_pageid && trackingConfig.spm) {
      kcsensorsManualTrack(trackingConfig, 'page_click');
    }
    if (!_pwd) {
      handleClickNextBtn();
      return;
    }
    if (values) {
      kcsensorsManualTrack({ spm: ['loginButton', '1'] }, 'page_click');
      submitValues = { ...values };
    }
    const payload: any = { ...(values || submitValues) };
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

  const handleClickPasskeyLogin = async () => {
    try {
      kcsensorsManualTrack({ spm: ['PasskeyloginButton', '1'] }, 'page_click');
      const passkeyIsLogin = await handlePasskeyLogin();
      if (!passkeyIsLogin) {
        update?.({ accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD });
      }
    } catch {
      update?.({ accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD });
    }
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

  const onValidateError = () => {
    kcsensorsManualTrack({ spm: ['robotfail', '1'] }, 'page_click');
  };

  const onValidateSuccess = () => {
    closeCaptcha();
    kcsensorsManualTrack({ spm: ['robotSuccess', '1'] }, 'page_click');
    handleSubmit();
  };

  const handleSignIn = () => {
    kcsensorsManualTrack({ spm: ['register', '1'] }, 'page_click');
    signOrDownClick?.();
  };

  return (
    <>
      <Form
        className={clsx(styles.extendForm)}
        form={form}
        onFinish={handleSubmit}
        ref={ref}
        onValuesChange={onFormChange}
      >
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
          isSubAccount={tabKey === SUB_ACCOUNT_LOGIN_TAB_KEY}
          multiSiteConfig={multiSiteConfig}
        />
        {accountLoginStep === ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ONLY_ACCOUNT ? (
          <FirstNextBtn onClick={handleClickNextBtn} loading={currentPasskeyStatus === PasskeyLoginStatus.LOADING} />
        ) : (
          <>
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
                allowClear
                data-inspector="signin_password_input"
                fullWidth
              />
            </FormItem>
            <ErrorAlert msg={loginErrorTip} />
            <Box
              className={clsx(styles.forgetPWDBox)}
              display="inline-block"
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              data-inspector="signin_forget_password"
              onClick={() => {
                if (tabKey === ACCOUNT_LOGIN_TAB_KEY) {
                  storage.setItem('$entrance.f.mc', _countryCode || '');
                  storage.setItem('$entrance.f.a', typeof window !== 'undefined' ? window?.btoa?.(accountValue || '') || '' : '');
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
            <Button
              className={clsx(styles.subButton)}
              fullWidth
              htmlType="submit"
              size="large"
              loading={loginLoading}
              data-inspector="signin_submit_button"
              disabled={loginLoading || isBtnDisable || currentPasskeyStatus === PasskeyLoginStatus.LOADING}
            >
              <span>{loginLoading ? t('login_ing') : t('login')}</span>
            </Button>
            {signOrDownClick ? (
              <Box className={clsx(styles.mtSignupBox)}>
                <div className={clsx(styles.fastClick)}>
                  <Trans i18nKey="fast_signup" ns="entrance">
                    _<span onClick={handleSignIn}>_</span>
                  </Trans>
                </div>
              </Box>
            ) : null}
          </>
        )}
      </Form>
      {isOpenPasskey && supportPasskeyLogin ? (
        <div className={clsx(styles.continueWithOther)}>
          <span>{t('jbpawp11pFKgMF2sqfVata')}</span>
        </div>
      ) : null}
      {isOpenPasskey && supportPasskeyLogin ? (
        <PasskeyLoginBtn
          disabled={loginLoading}
          passkeyLoginStatus={currentPasskeyStatus}
          handleClick={handleClickPasskeyLogin}
        />
      ) : null}
      {thirdPartyAvailable ? (
        <ThirdPartyLogin
          onSuccess={onSuccess}
          multiSiteConfig={multiSiteConfig}
          showTitle={!(isOpenPasskey && supportPasskeyLogin)}
        />
      ) : null}
      {forgetBottom ? <Box className={clsx(styles.mtForgetBottom)}>{forgetBottom}</Box> : null}
    </>
  );
});

export default AccountLogin;
