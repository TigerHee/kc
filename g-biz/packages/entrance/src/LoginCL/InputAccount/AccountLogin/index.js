/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useRef, forwardRef, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import noop from 'lodash/noop';
import { Form, Button, Box, Input, styled } from '@kux/mui';
import { Captcha } from '@packages/captcha';
import storage from '@utils/storage';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { kcsensorsManualTrack, getTrackingSource } from '@utils/sensors';
import { ErrorAlert } from '../../../components';
import { ACCOUNT_KEY, ACCOUNT_LOGIN_TAB_KEY, NAMESPACE, BIZ } from '../../constants';
import { checkAccountType, getMobileCode } from '../../../common/tools';
import { useLang, useToast } from '../../../hookTool';
import FusionInputFormItem from '../../../components/FusionInputFormItem';

const { FormItem } = Form;

let submitValues = null;

const ExtendForm = styled(Form)`
  .subButton {
    margin-top: 40px;
  }
  .mtSpace {
    margin-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
  .KuxInput-togglePwdIcon {
    margin-left: 12px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-left: 10px;
    }
  }
`;
const ForgetPWDBox = styled(Box)`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  margin-top: 0;
`;

const AccountLogin = forwardRef((props = {}, ref) => {
  const { onForgetPwdClick = noop, trackingConfig, onSuccess, tabKey } = props;

  const [form] = Form.useForm();
  const formRef = useRef(form);
  formRef.current = form;
  const { t } = useLang();

  const dispatch = useDispatch();
  const toast = useToast();
  const { countryCodes, loginLoading, loginErrorTip } = useSelector((state) => state[NAMESPACE]);
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
      dispatch({ type: `${NAMESPACE}/getCountryCodes` });
    }
  }, [countryCodes?.length]);

  useLayoutEffect(() => {
    const bindEventListener = (e) => {
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
      formRef.current.validateFields().catch((err) => {
        console.log('form validate error...', err);
      });
    };
    document.body.addEventListener('click', bindEventListener);
    return () => {
      document.body.removeEventListener('click', bindEventListener);
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

  const handleSubmit = (values) => {
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
    dispatch({
      type: `${NAMESPACE}/loginV2`,
      payload,
      onSuccess,
      toast,
      trackResultParams: { source },
      onOpenCaptcha: () => {
        setCaptchaOpen(true);
      },
    });
  };

  const commonRule = [{ required: true, message: t('form.required') }];

  useEffect(() => {
    form.resetFields();
  }, []);

  const closeCaptcha = () => {
    setCaptchaOpen(false);
    dispatch({ type: `${NAMESPACE}/update`, payload: { loginLoading: false } });
  };

  const onCloseCaptcha = () => {
    kcsensorsManualTrack({ spm: ['robotClose', '1'] }, 'page_click');
    closeCaptcha();
  };

  const onFormChange = () => {
    dispatch({ type: `${NAMESPACE}/update`, payload: { loginErrorTip: '' } });
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
      <ExtendForm form={form} onFinish={handleSubmit} ref={ref} onValuesChange={onFormChange}>
        <Captcha
          open={captchaOpen}
          onClose={onCloseCaptcha}
          onValidateError={onValidateError}
          bizType={BIZ}
          onValidateSuccess={onValidateSuccess}
        />
        <FusionInputFormItem
          scene="login"
          shouldBlurValidate={false}
          form={form}
          countryCodes={countryCodes}
          onInputBlur={handleAccountBlur}
          initValues={{
            countryCode: initCountryCode,
            account: window?.atob?.(storage.getItem(ACCOUNT_KEY[tabKey]) || '') || '',
          }}
          multiSiteConfig={multiSiteConfig}
        />
        {/* 登錄密碼 */}
        <FormItem
          requiredMark={false}
          label={t('login.password')}
          name="password"
          rules={commonRule}
        >
          <Input
            size="xlarge"
            autoComplete="new-password"
            type="password"
            className="mtSpace"
            allowClear
            data-inspector="signin_password_input"
          />
        </FormItem>
        <ErrorAlert msg={loginErrorTip} />
        <ForgetPWDBox>
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
            {t('forget.pwd')}
          </Box>
        </ForgetPWDBox>
        <Button
          className="subButton"
          fullWidth
          htmlType="submit"
          size="large"
          loading={loginLoading}
          data-inspector="signin_submit_button"
          disabled={loginLoading || isBtnDisable}
        >
          {loginLoading ? t('login.ing') : t('login')}
        </Button>
      </ExtendForm>
    </>
  );
});

export default AccountLogin;
