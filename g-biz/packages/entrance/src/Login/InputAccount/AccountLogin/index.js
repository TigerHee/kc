/**
 * Owner: willen@kupotech.com
 */
import { useEffect, useRef, forwardRef, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans } from '@tools/i18n';
import noop from 'lodash/noop';
import { Form, Button, Box, Input, styled, useResponsive } from '@kux/mui';
import { Captcha } from '@packages/captcha';
import storage from '@utils/storage';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import useOauthLogin from '@hooks/useOauthLogin';
import { kcsensorsManualTrack, getTrackingSource } from '@utils/sensors';
import { ErrorAlert } from '../../../components';
import {
  ACCOUNT_KEY,
  ACCOUNT_LOGIN_TAB_KEY,
  NAMESPACE,
  SUB_ACCOUNT_LOGIN_TAB_KEY,
  BIZ,
  ACCOUNT_LOGIN_STEP,
} from '../../constants';
import { checkAccountType, getMobileCode } from '../../../common/tools';
import { passkeysSupported } from '../../../common/webauthn-json';
import ThirdPartyLogin from '../../../components/ThirdPartyLogin';
import PasskeyLoginBtn from './PasskeyLoginBtn';
import { useLang, useToast } from '../../../hookTool';
import usePasskeyLogin, { PasskeyLoginStatus } from '../../../hookTool/usePasskeyLogin';
import FusionInputFormItem from '../../../components/FusionInputFormItem';
import FirstNextBtn from './FirstNextBtn';

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

const FastClick = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  & span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
  }
`;

// 或使用其他登陆方式
const ContinueWithOther = styled.div`
  height: 18px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
  display: flex;
  align-items: center;
  margin: 32px 0 24px;
  span {
    padding: 0 12px;
  }
  &::before {
    content: '';
    height: 1px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.cover12};
  }
  &::after {
    content: '';
    height: 1px;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.cover12};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 0 20px;
  }
`;

const isSupportPasskey = passkeysSupported();

const AccountLogin = forwardRef((props = {}, ref) => {
  const {
    onForgetPwdClick = noop,
    trackingConfig,
    signOrDownClick,
    forgetBottom,
    onSuccess,
    withDrawer,
    tabKey,
  } = props;

  const [form] = Form.useForm();
  const formRef = useRef(form);
  formRef.current = form;
  const { t } = useLang();

  const dispatch = useDispatch();
  const toast = useToast();
  // accountLoginStep 用于控制登陆第一步的步骤
  const { accountLoginStep, countryCodes, loginLoading, loginErrorTip } = useSelector(
    (state) => state[NAMESPACE],
  );
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const oauthLogin = useOauthLogin('TELEGRAM,GOOGLE,APPLE');
  const { currentPasskeyStatus, passkeyAuth } = usePasskeyLogin();
  const rv = useResponsive();
  const isSm = !rv?.sm;
  const { multiSiteConfig } = useMultiSiteConfig();

  const accountValue = Form.useWatch('account', form);
  const _countryCode = Form.useWatch('countryCode', form);
  const _pwd = Form.useWatch('password', form);
  const isBtnDisable = !accountValue || !_pwd;
  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(accountValue), [accountValue]);

  // 多租户支持 三方登陆
  const supportThirdLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('extlogin');
  const supportTelegram = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('telegram');
  const supportGoole = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('google');
  const supportApple = multiSiteConfig?.accountConfig?.supportExtAccounts?.includes('apple');
  const hasThirdParty = supportTelegram || supportGoole || supportApple;

  const supportPasskeyLogin = multiSiteConfig?.loginConfig?.loginAccountTypes?.includes('passkey');

  const isOpenPasskey = isSupportPasskey;

  const isShowThirdPartyLogin = useMemo(() => {
    return ['telegram_domain', 'google_domain', 'apple_domain'].some(
      (domain) => oauthLogin?.oauthConfig?.[domain] === window.location.host,
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
    if (isOpenPasskey && supportPasskeyLogin) {
      // Passkey 登录按钮曝光
      kcsensorsManualTrack({
        kc_pageid: 'B1login',
        spm: ['PasskeyloginButton', '1'],
      });
    }
  }, [isOpenPasskey, supportPasskeyLogin, trackingConfig]);

  const initCountryCode = useMemo(() => {
    return storage.getItem(ACCOUNT_KEY.mobileCode) || '';
  }, []);

  /**
   * @return 返回 passkey 是否登陆成功
   * @param {账号信息} accountObj
   */
  const handlePasskeyLogin = async (accountObj) => {
    let passkeyLogin = false;
    try {
      // 调用 passkey 的所有次数
      kcsensorsManualTrack({ spm: ['accountPasskeyLogin', '1'] }, 'page_click');
      const payload = {};
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
        // 点击下一步按钮时调用 passkey 的次数
        kcsensorsManualTrack({
          spm: ['accountPasskeyloginByNextButton', '1'],
        });
      }
      // 后端接口 account格式: 邮箱：account=xxxx@xxx.com，手机号：account=xxx-xxxxxxx
      const passkeyLoginRes = await passkeyAuth({ account: payload?.account });
      if (passkeyLoginRes) {
        // passkey 登陆成功
        kcsensorsManualTrack({ spm: ['accountPasskeyLoginSuccess', '1'] });
        const source = getTrackingSource(trackingConfig);
        await dispatch({
          type: `${NAMESPACE}/passkeyLogin`,
          payload,
          passkeyLoginRes,
          onSuccess,
          trackResultParams: { source },
          // onOpenCaptcha: () => {
          //   setCaptchaOpen(true);
          // },
        });
        passkeyLogin = true;
      } else {
        kcsensorsManualTrack({ spm: ['accountPasskeyLoginFail', '1'] });
        passkeyLogin = false;
      }
    } catch (error) {
      kcsensorsManualTrack({ spm: ['accountPasskeyLoginFail', '1'] });
      passkeyLogin = false;
      console.error('passkey login error:', error);
    }

    return passkeyLogin;
  };

  const handleClickNextBtn = async () => {
    try {
      kcsensorsManualTrack({ spm: ['nextButton', '1'] }, 'page_click');
      const formValues = await form.validateFields();
      const [account, countryCode] = [formValues?.account, formValues?.countryCode];
      console.log('account:', account);

      if (account && supportPasskeyLogin && isOpenPasskey) {
        const passkeyIsLogin = await handlePasskeyLogin({ account: account.trim(), countryCode });
        if (!passkeyIsLogin) {
          // passkey 登陆失败，进入输入密码步骤
          dispatch({
            type: `${NAMESPACE}/update`,
            payload: {
              accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD,
            },
          });
        } else {
          // 点击下一步 passkey 登陆成功
          kcsensorsManualTrack(
            { spm: ['nextButtonAccountPasskeyLoginSuccess', '1'] },
            'page_click',
          );
        }
      } else {
        // 不支持 passkey 登陆，进入输入密码步骤
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD,
          },
        });
      }
    } catch (error) {
      // 发生错误，进入输入密码步骤
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD,
        },
      });
      console.log('click next step:', error);
    }
  };

  const handleSubmit = (values) => {
    // 登录按钮点击
    if (trackingConfig && trackingConfig.kc_pageid && trackingConfig.spm) {
      kcsensorsManualTrack(trackingConfig, 'page_click');
    }

    // 没有密码，说明是第一步用户直接回车造成的提交，此时执行点击下一步的操作
    if (!_pwd) {
      handleClickNextBtn();
      return;
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

  const handleClickPasskeyLogin = async () => {
    try {
      // passkey登录按钮点击上报
      kcsensorsManualTrack(
        {
          spm: ['PasskeyloginButton', '1'],
        },
        'page_click',
      );
      const passkeyIsLogin = await handlePasskeyLogin();
      if (!passkeyIsLogin) {
        // passkey 登陆失败，进入输入密码步骤
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD,
          },
        });
      }
    } catch (error) {
      // 发生错误，进入输入密码步骤
      dispatch({
        type: `${NAMESPACE}/update`,
        payload: {
          // passkey 登陆失败，进入输入密码步骤
          accountLoginStep: ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ACCOUNT_PASSWORD,
        },
      });
      console.log('click next step:', error);
    }
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

  const handleSignIn = () => {
    kcsensorsManualTrack({ spm: ['register', '1'] }, 'page_click');
    signOrDownClick?.();
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
          isSubAccount={tabKey === SUB_ACCOUNT_LOGIN_TAB_KEY}
          multiSiteConfig={multiSiteConfig}
        />
        {accountLoginStep === ACCOUNT_LOGIN_STEP.LOGIN_IN_STEP_ONLY_ACCOUNT ? (
          <FirstNextBtn
            onClick={handleClickNextBtn}
            loading={currentPasskeyStatus === PasskeyLoginStatus.LOADING}
          />
        ) : (
          <>
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
              disabled={
                loginLoading || isBtnDisable || currentPasskeyStatus === PasskeyLoginStatus.LOADING
              }
            >
              <span>{loginLoading ? t('login.ing') : t('login')}</span>
            </Button>

            {signOrDownClick ? (
              <Box mt={isSm ? 16 : 24}>
                <FastClick>
                  <Trans i18nKey="fast_signup" ns="entrance">
                    _<span onClick={handleSignIn}>_</span>
                  </Trans>
                </FastClick>
              </Box>
            ) : null}
          </>
        )}
      </ExtendForm>

      {isOpenPasskey && supportPasskeyLogin ? (
        <ContinueWithOther>
          <span>{t('jbpawp11pFKgMF2sqfVata')}</span>
        </ContinueWithOther>
      ) : null}
      {isOpenPasskey && supportPasskeyLogin ? (
        <PasskeyLoginBtn
          disabled={loginLoading}
          passkeyLoginStatus={currentPasskeyStatus}
          handleClick={handleClickPasskeyLogin}
        />
      ) : null}
      {thirdPartyAvailable ? (
        // 三方登陆接口不会出人机校验
        <ThirdPartyLogin
          withDrawer={withDrawer}
          onSuccess={onSuccess}
          multiSiteConfig={multiSiteConfig}
          showTitle={!(isOpenPasskey && supportPasskeyLogin)}
        />
      ) : null}
      {forgetBottom ? <Box mt={isSm ? 20 : 24}>{forgetBottom}</Box> : null}
    </>
  );
});

export default AccountLogin;
