/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';

import { Form, Input, Button, Checkbox } from '@kux/mui';
import { isPlainObject, get as safeGet } from 'lodash';

import { useDispatch, useSelector } from 'react-redux';

import { kcsensorsManualTrack } from '@utils/sensors';
import InputEye from '../../components/InputEye';
import NewInviteCode from '../../components/NewInviteCode';
import PhoneAreaSelector from '../../components/PhoneAreaSelector';

import { REGEXP, removeSpaceSE, getTrackingSource } from '../../common/tools';

import InputSendCode from '../../components/InputSendCode';

import { useToast, useLang } from '../../hookTool';
import VoiceCode from '../../components/voiceCode';

import { PHONE_BIZTYPE, NAMESPACE } from '../constants';

const { FormItem } = Form;

const bizType = PHONE_BIZTYPE;

const PhoneSign = (props) => {
  const {
    onChange,
    agreeJSX = null,
    defaultCountryCode,
    isKumex = false,
    bonusImg,
    initPhone = '',
    recallType = null,
    trackingConfig = {},
    fromDrawer,
    forgetLeft,
    showDiscount,
  } = props;
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [disable, setDisable] = useState(false);

  const [form] = Form.useForm();

  const _countryCode = Form.useWatch('countryCode', form);

  const {
    t,
    i18n: { language },
  } = useLang();

  const isCn = language === 'zh_CN';
  const blockID = fromDrawer ? 'confirmButton' : 'phoneConfirm';

  const dispatch = useDispatch();

  const toast = useToast();
  const { loading, countryCodes, PHONE_REGISTER_countTime, sendChannel = '' } = useSelector(
    (state) => state[NAMESPACE],
  );

  useEffect(() => {
    dispatch({ type: `${NAMESPACE}/getCountryCodes` });
    eleExposureGaPhone();
    return () => {};
  }, []);

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

  // 坑位曝光事件集合
  const eleExposureGaPhone = () => {
    handleManualTrack({ pagecate: fromDrawer ? 'sideRegister' : null });
  };

  useEffect(() => {
    const countryCode = countryCodes.find((country) => {
      return country.code === defaultCountryCode;
    });
    if (countryCode) {
      form.setFieldsValue({ countryCode: countryCode.mobileCode });
    }
    return () => {};
  }, [countryCodes]);

  const handleSubmit = useCallback(async (e) => {
    e && e.preventDefault();

    if (fromDrawer) {
      handleManualTrack({ pagecate: 'sideRegister' }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: [blockID, '1'] }, 'page_click');
    }
    // 校验表单值
    form.validateFields().then(async (formValue) => {
      if (!formValue) return;

      const { validationType = 'PHONE', ...rest } = formValue;

      const payload = {
        validationType,
        toast,
        t,
        ...rest,
        isKumex, // kumex 需要注册时直接开通合约
      };
      const trackSource = getTrackingSource(trackingConfig);
      const trackReferralCode = rest.referralCode;
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
        const userInfo = isOk;
        if (userInfo !== false && isPlainObject(userInfo)) {
          userInfo.$$blockID = blockID;
        }
        dispatch({ type: `${NAMESPACE}/resetInit` });
        onChange(userInfo);
      }
    });
  }, []);

  const commonRule = [{ required: true, whitespace: true, message: t('form.required') }];

  const handleSendCode = useCallback(() => {
    form.validateFields(['phone', 'countryCode']).then(({ phone, countryCode }) => {
      dispatch({
        type: `${NAMESPACE}/sendVerifyCode`,
        payload: {
          countryCode,
          phone,
          bizType,
          toast,
          sendChannel: 'SMS',
        },
      });
      // 注册召回接口调用
      if (recallType !== null) {
        dispatch({
          type: `${NAMESPACE}/postPhoneRecall`,
          payload: {
            countryCode,
            language: navigator.language,
            phone,
            type: recallType,
          },
        });
      }
      // 发送成功
      kcsensorsManualTrack({ spm: ['phoneSendCode', '1'] }, 'page_click');
    });
  }, []);

  const handleCheckAgree = (rule, value) => {
    if (!value) {
      return Promise.reject(t('check.required'));
    }
    return Promise.resolve();
  };

  const validateForVoice = useCallback(() => {
    return new Promise((resolve, reject) => {
      form
        .validateFields(['phone', 'countryCode'])
        .then(({ phone, countryCode }) => {
          setPhone(phone);
          setCountryCode(countryCode);
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }, [form, setPhone, setCountryCode]);

  const onSendVoice = useCallback(() => {
    return dispatch({
      type: `${NAMESPACE}/sendVerifyCode`,
      payload: {
        countryCode,
        phone: removeSpaceSE(phone),
        bizType,
        toast,
        sendChannel: 'VOICE',
      },
    });
  }, [phone, countryCode, toast, dispatch, setDisable]);

  const offDisabled = useCallback(() => {
    setDisable(false);
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        PHONE_REGISTER_countTime: { time: 0 },
      },
    });
  }, [dispatch]);

  const startAdornment = (
    <FormItem noStyle name="countryCode" fullWidth={false}>
      <PhoneAreaSelector
        countries={countryCodes}
        isCn={isCn}
        language={language}
        forbiddenCountry
      />
    </FormItem>
  );
  const handleFocus = (type) => {
    if (type === '4') {
      // 填写验证码
      kcsensorsManualTrack({ spm: ['phoneInsertCode', '1'] }, 'page_click');
    } else if (type === '5') {
      // 填写密码
      kcsensorsManualTrack({ spm: ['phonePassword', '1'] }, 'page_click');
    } else if (type === '6') {
      // 邀请码
      kcsensorsManualTrack({ spm: ['referralCode', '1'] }, 'page_click');
    }
  };
  useEffect(() => {
    if (PHONE_REGISTER_countTime && PHONE_REGISTER_countTime.time > 0) {
      setDisable(true);
    }
  }, [PHONE_REGISTER_countTime]);

  return (
    <Form form={form}>
      <FormItem
        initialValue={initPhone}
        label={t('phone')}
        rules={[
          ...commonRule,
          {
            pattern: REGEXP.phone,
            message: t('form.phone.error'),
          },
        ]}
        validateTrigger={['onBlur', 'onSubmit']}
        name="phone"
      >
        <InputSendCode
          onSendCode={handleSendCode}
          countTime={sendChannel && sendChannel === 'SMS' ? PHONE_REGISTER_countTime : null}
          loading={loading}
          disabled={disable}
          countTimeOver={offDisabled}
          placeholder={t('phone')}
          startAdornment={startAdornment}
          onClick={() => handleFocus('2')}
        />
      </FormItem>
      <FormItem
        name="code"
        label={t('vc.phone')}
        rules={commonRule}
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <Input
          size="large"
          inputProps={{ autocomplete: 'nope' }}
          onClick={() => handleFocus('4')}
          allowClear
        />
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
          type="password"
          size="large"
          autoComplete="new-password"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0' }}>
        <div>{forgetLeft}</div>
        <VoiceCode
          validateFunc={validateForVoice}
          phone={phone}
          countryCode={_countryCode || ''}
          countTime={sendChannel && sendChannel === 'VOICE' ? PHONE_REGISTER_countTime : null}
          loading={loading}
          disable={disable}
          onTimeOver={offDisabled}
          onSend={onSendVoice}
        />
      </div>
    </Form>
  );
};

export default PhoneSign;
