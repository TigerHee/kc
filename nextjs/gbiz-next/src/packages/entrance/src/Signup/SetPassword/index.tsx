/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Button } from '@kux/mui';
import { isPlainObject } from 'lodash';
import clsx from 'clsx';
import { kcsensorsManualTrack } from 'tools/sensors';
import { ErrorAlert } from '../../components/ErrorAlert';
import PasswordInput from '../../components/PasswordInput';
import { Back } from '../../components/Back';
import { getTrackingSource } from '../../common/tools';
import { useToast, useLang, useTrackingConfigDataOfInviter } from '../../hookTool';
import { SIGNUP_TYPE_CONFIG } from '../constants';
import { useSignupStore } from '../model';
import styles from './index.module.scss';

interface SetPasswordProps {
  bonusImg?: React.ReactNode;
  fromDrawer?: boolean;
  trackingConfig?: Record<string, any>;
  onFinish?: (userInfo: any) => void;
  needEmail?: boolean;
  onBack?: () => void;
}

const SetPassword: React.FC<SetPasswordProps> = ({
  bonusImg,
  fromDrawer,
  trackingConfig = {},
  onFinish,
  needEmail = false,
  onBack,
}) => {
  const { t } = useLang();
  const toast = useToast();

  const [password, setPassword] = useState({ value: '', error: true });

  const handlePasswordChange = (changeValue = { value: '', error: true }) => {
    setPassword(changeValue);
  };

  // 使用 Zustand store
  const registerTip = useSignupStore(state => state.registerTip);
  const preRegisterData = useSignupStore(state => state.preRegisterData);
  const registerType = useSignupStore(state => state.registerType);
  const loading = useSignupStore(state => state.loading);
  const signUp = useSignupStore(state => state.signUp);

  const handleSubmit = async () => {
    kcsensorsManualTrack(
      {
        spm: ['signupSetPassword', 'confirm'],
        data: {
          before_click_element_value: '',
          after_click_element_value: 'confirm',
        },
      },
      'page_click'
    );
    if (fromDrawer) {
      kcsensorsManualTrack({ spm: ['sideRegister', 'signup'] }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: ['password', 'confirm'] }, 'page_click');
    }
    try {
      const { phone, email, referralCode, countryCode } = preRegisterData || {};
      const signupTypeConfig = registerType ? SIGNUP_TYPE_CONFIG[registerType] : undefined;
      const { validationType } = signupTypeConfig || {};
      kcsensorsManualTrack({ spm: ['password', 'qualify'] });

      let payload: any = {
        password: password.value,
        validationType,
        countryCode: countryCode || '',
        referralCode,
        toast,
        t,
      };

      // 只有有手机号&需要绑定邮箱，才调用新接口, 如果还是邮箱注册，继续保留之前逻辑
      if (needEmail && phone) {
        payload = {
          ...payload,
          email,
          phone,
          needEmail,
        };
      } else {
        if (registerType === 'phone') {
          payload.phone = phone;
        } else {
          payload.email = email;
        }
      }

      const isOk = await signUp?.(payload, {
        pagecate: 'registerV2',
        hasReferralCode: !!referralCode,
        source: getTrackingSource(trackingConfig),
        is_futures_referral: false,
      });
      if (isOk) {
        kcsensorsManualTrack({ spm: ['accountConfirm', '1'], data: trackingConfigData }, 'page_click');
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
          'page_click'
        );
        try {
          const userInfo = isOk;
          if (userInfo !== false && isPlainObject(userInfo)) {
            userInfo.$$blockID = 'activeConfirm';
          }
          onFinish && onFinish(userInfo);
        } catch (err) {
          console.log(err);
        }
      } else {
        kcsensorsManualTrack({ spm: ['accountConfirmFail', '1'], data: trackingConfigData }, 'page_click');
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
          'page_click'
        );
      }
    } catch (e) {
      kcsensorsManualTrack({ spm: ['accountConfirmFail', '2'], data: trackingConfigData }, 'page_click');
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
        'page_click'
      );
    }
  };

  const handlePwdFocus = () => {
    kcsensorsManualTrack({ spm: ['insertPassword', '1'], data: trackingConfigData }, 'page_click');
    if (registerType === 'phone') {
      kcsensorsManualTrack({ spm: ['newPhoneSecret', '1'] }, 'page_click');
    } else {
      kcsensorsManualTrack({ spm: ['newEmailSecret', '1'] }, 'page_click');
    }
  };

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
  }, []);

  return (
    <>
      <Back onBack={onBack} />
      <h2 className={clsx(styles.title, fromDrawer && styles.fromDrawer)}>{t('dNbUwkPyY3HWTPa27wAQ9A')}</h2>
      <p className={styles.tips}>{t('hM6fPZT7SmULycEAmUqLtA')}</p>
      <PasswordInput onFucus={handlePwdFocus} onChange={handlePasswordChange} />
      <ErrorAlert msg={registerTip} />
      <Button
        fullWidth
        size="large"
        loading={!!loading}
        onClick={handleSubmit}
        disabled={!password.value || password.error}
        data-inspector="signup_setpwd_btn"
        className={styles.submitButton}
      >
        {t('vHBPtPwoVzxY4ZqfjDhAaR')}
        {bonusImg || null}
      </Button>
    </>
  );
};

export default SetPassword;
