/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';

import { Form, Input, Button, Checkbox } from '@kux/mui';

import { isPlainObject, get as safeGet } from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

import { kcsensorsManualTrack } from '@utils/sensors';
import { InputEye, NewInviteCode } from '../../components';

import { REGEXP, removeSpaceSE, getTrackingSource } from '../../common/tools';

import InputSendCode from '../../components/InputSendCode';

import { EMAIL_BIZTYPE, NAMESPACE } from '../constants';

import { useToast, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';

const { FormItem } = Form;

const EmailSign = (props) => {
  const {
    onChange,
    agreeJSX = null,
    isKumex,
    initEmail = '',
    bonusImg,
    recallType = null,
    trackingConfig = {},
    fromDrawer,
    forgetLeft,
    showDiscount,
  } = props;

  const dispatch = useDispatch();
  const { t } = useLang();
  const blockID = fromDrawer ? 'confirmButton' : 'emailCondim';

  const [form] = Form.useForm();

  const toast = useToast();

  const { loading, EMAIL_REGISTER_countTime } = useSelector((state) => state[NAMESPACE]);

  const trackingConfigData = useTrackingConfigDataOfInviter();

  const handleSendCode = () => {
    form.validateFields(['email']).then(({ email }) => {
      dispatch({
        type: `${NAMESPACE}/sendVerifyCode`,
        payload: {
          email: removeSpaceSE(email),
          bizType: EMAIL_BIZTYPE,
          toast,
        },
      });
      // 注册召回接口调用
      if (recallType !== null) {
        dispatch({
          type: `${NAMESPACE}/postEmailRecall`,
          payload: {
            language: navigator.language,
            type: recallType,
            email: removeSpaceSE(email),
          },
        });
      }
      // 发送成功
      kcsensorsManualTrack({ spm: ['emailSendCode', '1'], data: trackingConfigData }, 'page_click');
    });
  };

  const handleManualTrack = (data = {}, type = 'expose') => {
    kcsensorsManualTrack(
      {
        spm: [blockID, '1'],
        data: {
          ...data,
          ...safeGet(trackingConfig, 'data', {}),
        },
      },
      type,
    );
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();

    if (fromDrawer) {
      handleManualTrack({ pagecate: 'sideRegister' }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: [blockID, '1'] }, 'page_click');
    }
    // 校验表单值
    form.validateFields().then(async (formValue) => {
      if (!formValue) return;

      const { email, code, validationType = 'EMAIL', ...other } = formValue;
      const payload = {
        email,
        code,
        validationType,
        toast,
        t,
        ...other,
        isKumex, // kumex 需要注册时直接开通合约
      };
      const trackSource = getTrackingSource(trackingConfig);
      const trackReferralCode = other.referralCode;
      const trackIsFuturesCode = isKumex;
      const isOk = await dispatch({
        type: `${NAMESPACE}/signUpFlow`,
        payload,
        trackResultParams: {
          source: trackSource,
          hasReferralCode: !!trackReferralCode,
          is_futures_referral: trackIsFuturesCode,
        },
      });
      if (isOk) {
        dispatch({ type: `${NAMESPACE}/resetInit` });
        const userInfo = isOk;
        if (userInfo !== false && isPlainObject(userInfo)) {
          userInfo.$$blockID = blockID;
        }
        onChange(userInfo);
      }
    });
  };

  const commonRule = [{ required: true, whitespace: true, message: t('form.required') }];

  const handleCheckAgree = (rule, value) => {
    if (!value) {
      return Promise.reject(t('check.required'));
    }
    return Promise.resolve();
  };

  // useFormValidateByLang(form, language, 'email');

  useEffect(() => {
    eleExposureGaEmail();
  }, []);
  // 坑位曝光事件集合
  const eleExposureGaEmail = () => {
    handleManualTrack({ pagecate: fromDrawer ? 'sideRegister' : null });
  };
  const handleFocus = (type) => {
    if (type === '4') {
      // 填写验证码
      kcsensorsManualTrack(
        { spm: ['emailInsertCode', '1'], data: trackingConfigData },
        'page_click',
      );
    } else if (type === '5') {
      // 填写密码
      kcsensorsManualTrack({ spm: ['emailPassword', '1'] }, 'page_click');
    } else if (type === '6') {
      // 邀请码
      kcsensorsManualTrack({ spm: ['referralCode', '1'] }, 'page_click');
    }
  };
  return (
    <Form form={form}>
      <FormItem
        name="email"
        initialValue={initEmail}
        label={t('email')}
        rules={[
          ...commonRule,
          {
            pattern: REGEXP.email,
            message: t('form.email.error'),
          },
        ]}
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <InputSendCode
          onSendCode={handleSendCode}
          countTime={EMAIL_REGISTER_countTime}
          loading={loading}
          disabled={false}
          placeholder={t('email')}
          onClick={() => handleFocus('3')}
        />
      </FormItem>
      <FormItem
        name="code"
        label={t('vc.email')}
        rules={commonRule}
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <Input size="large" autoComplete="nope" onClick={() => handleFocus('4')} allowClear />
      </FormItem>
      <FormItem
        name="password"
        label={t('set.login.psw')}
        rules={[
          ...commonRule,
          {
            pattern: REGEXP.pwd,
            message: t('form.password.error'),
          },
        ]}
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <InputEye
          size="large"
          autoComplete="new-password"
          type="password"
          onClick={() => handleFocus('5')}
        />
      </FormItem>
      <FormItem name="referralCode" label={null}>
        <NewInviteCode showDiscount={showDiscount} onClick={() => handleFocus('6')} />
      </FormItem>
      <FormItem
        name="agree"
        rules={[{ validator: handleCheckAgree }]}
        initialValue={!!1}
        valuePropName="checked"
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <Checkbox>{agreeJSX}</Checkbox>
      </FormItem>
      <Button fullWidth onClick={handleSubmit} size="large">
        {t('sign.up')}
        {bonusImg || null}
      </Button>

      <div style={{ marginTop: 8 }}>{forgetLeft}</div>
    </Form>
  );
};

export default EmailSign;
