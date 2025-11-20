/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from '@kux/mui';

import { isPlainObject } from 'lodash';
import { kcsensorsManualTrack } from '@utils/sensors';
import { ErrorAlert, NewInputEye, PasswordCheck, PasswordStrength } from '../../components';
import { Back } from '../../components/Back';
import { REGEXP, getTrackingSource, matchPasswordCheck } from '../../common/tools';
import { useToast, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';
import { NAMESPACE, SIGNUP_TYPE_CONFIG } from '../constants';
import { Title, Tips } from './styled';

const { useForm, FormItem } = Form;

const SetPassword = ({
  bonusImg,
  fromDrawer,
  trackingConfig = {},
  onFinish,
  needEmail = false,
  onBack,
}) => {
  // 表单校验报错提示，如果输入状态, 即使是不符合密码规则，也不提示错误
  const [isPwdErrorInForm, updatePwdErrorInForm] = useState(false);
  const [form] = useForm();
  const { validateFields, setFields } = form;
  const _password = Form.useWatch('password', form);
  const { t } = useLang();
  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const toast = useToast();
  const inputRef = useRef(null);
  const { registerTip, preRegisterData, registerType } = useSelector((state) => state[NAMESPACE]);
  const loading = useSelector((s) => s.loading);
  const signUpLoading =
    loading.effects[`${NAMESPACE}/signUp`] || loading.effects[`${NAMESPACE}/getUserInfo`];

  const handleSubmit = async () => {
    kcsensorsManualTrack(
      {
        spm: ['signupSetPassword', 'confirm'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'confirm',
        },
      },
      'page_click',
    );
    if (fromDrawer) {
      kcsensorsManualTrack({ spm: ['sideRegister', 'signup'] }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: ['password', 'confirm'] }, 'page_click');
    }
    try {
      const values = await validateFields();
      const { password } = values;
      const { phone, email, referralCode, countryCode } = preRegisterData || {};
      const { validationType } = SIGNUP_TYPE_CONFIG[registerType];
      kcsensorsManualTrack({ spm: ['password', 'qualify'] });
      const payload = {
        password,
        validationType,
        countryCode,
        referralCode,
        toast,
        t,
      };

      // 只有有手机号&需要绑定邮箱，才调用新接口, 如果还是邮箱注册，继续保留之前逻辑
      if (needEmail && phone) {
        payload.email = email;
        payload.phone = phone;
        payload.needEmail = needEmail;
      } else {
        payload[registerType] = registerType === 'phone' ? phone : email;
      }

      const isOk = await dispatch({
        type: `${NAMESPACE}/signUp`,
        payload,
        trackResultParams: {
          pagecate: 'registerV2',
          hasReferralCode: !!referralCode,
          source: getTrackingSource(trackingConfig),
          is_futures_referral: false,
        },
      });
      if (isOk) {
        kcsensorsManualTrack(
          { spm: ['accountConfirm', '1'], data: trackingConfigData },
          'page_click',
        );
        kcsensorsManualTrack(
          {
            spm: ['signupSetPassword', 'confirmResult'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'confirm',
              clickStatus: 'success',
              after_page_id: 'B1KYCHomepage',
            },
          },
          'page_click',
        );
        try {
          // dispatch({ type: `${NAMESPACE}/resetInit` });
          const userInfo = isOk;
          if (userInfo !== false && isPlainObject(userInfo)) {
            userInfo.$$blockID = 'activeConfirm';
          }
          onFinish && onFinish(userInfo);
        } catch (err) {
          console.log(err);
        }
      } else {
        kcsensorsManualTrack(
          { spm: ['accountConfirmFail', '1'], data: trackingConfigData },
          'page_click',
        );
        kcsensorsManualTrack(
          {
            spm: ['signupSetPassword', 'confirmResult'],
            data: {
              before_click_element_value: '',
              after_click_element_value: 'confirm',
              clickStatus: 'setPasswordFail',
              after_page_id: 'B1KYCHomepage',
            },
          },
          'page_click',
        );
      }
    } catch (e) {
      kcsensorsManualTrack(
        { spm: ['accountConfirmFail', '2'], data: trackingConfigData },
        'page_click',
      );
      kcsensorsManualTrack(
        {
          spm: ['signupSetPassword', 'confirmResult'],
          data: {
            before_click_element_value: '',
            after_click_element_value: 'confirm',
            clickStatus: 'setPasswordFail',
            after_page_id: 'B1KYCHomepage',
          },
        },
        'page_click',
      );
      handleErrorTips();
    }
  };

  const handlePwdFocus = () => {
    setFields([{ name: 'password', errors: [] }]);
    kcsensorsManualTrack({ spm: ['insertPassword', '1'], data: trackingConfigData }, 'page_click');
    if (registerType === 'phone') {
      kcsensorsManualTrack({ spm: ['newPhoneSecret', '1'] }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: ['newEmailSecret', '1'] }, 'page_click');
    }
  };

  const handleErrorTips = () => {
    kcsensorsManualTrack(
      {
        spm: ['signupSetPassword', 'passwordInput'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'notEmpry',
        },
      },
      'page_click',
    );
    form
      .validateFields(['password'])
      .then(() => {
        updatePwdErrorInForm(false);
      })
      .catch(() => {
        updatePwdErrorInForm(true);
      });
  };

  // 表单项规则
  const formRules = {
    password: [
      {
        validator: (rule, value) => {
          if (typeof value === 'string' && value.trim() === '') {
            return Promise.reject(t('form.required'));
          }
          return Promise.resolve();
        },
        message: t('form.required'),
      },
      {
        pattern: REGEXP.pwd,
        message: t('form.password.error'),
      },
    ],
  };

  // 密码是否满足规则要求，实时检测
  const matchAllRules = matchPasswordCheck(_password);
  const trackingConfigData = useTrackingConfigDataOfInviter();
  // 绑定邮箱组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signupSetPassword', '1'],
      data: {
        is_login: false,
        pre_spm_id:
          registerType === 'phone'
            ? 'kcWeb.B1register.SMSSecurityVerify.submit'
            : 'kcWeb.B1register.signupBindEmailverify.confirm',
      },
    });
    // 进入设置密码页面，输入框选中
    inputRef.current?.focus();
    // 请求国家区号
    dispatchRef.current({ type: `${NAMESPACE}/getCountryCodes` });
  }, []);

  return (
    <>
      <Back onBack={onBack} />
      <Title fromDrawer={fromDrawer}>{t('dNbUwkPyY3HWTPa27wAQ9A')}</Title>
      <Tips>{t('hM6fPZT7SmULycEAmUqLtA')}</Tips>
      <Form size="large" form={form}>
        <FormItem
          label={t('set.login.psw')}
          name="password"
          initialValue=""
          rules={formRules.password}
          validateTrigger={['onBlur', 'onSubmit']}
        >
          <NewInputEye
            className="mtSpace inputEye"
            size="xlarge"
            onFocus={handlePwdFocus}
            autoComplete="new-password"
            onBlur={handleErrorTips}
            ref={inputRef}
          />
        </FormItem>
        {/* 输入密码不满足要求，则不展示强度 */}
        {matchAllRules && <PasswordStrength password={_password} />}
        <PasswordCheck
          password={_password}
          always
          isError={isPwdErrorInForm}
          matchAllRules={matchAllRules}
        />
        <ErrorAlert msg={registerTip} />
        <Button
          fullWidth
          size="large"
          loading={!!signUpLoading}
          onClick={handleSubmit}
          data-inspector="signup_setpwd_btn"
        >
          {t('vHBPtPwoVzxY4ZqfjDhAaR')}
          {bonusImg || null}
        </Button>
      </Form>
    </>
  );
};

export default SetPassword;
