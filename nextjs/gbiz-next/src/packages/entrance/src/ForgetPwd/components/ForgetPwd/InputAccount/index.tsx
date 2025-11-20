import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Button } from '@kux/mui';
import storage from 'tools/storage';
import { useMultiSiteConfig } from 'hooks';
import { kcsensorsManualTrack } from 'tools/sensors';
import { useToast, useLang } from '../../../../hookTool';
import { goVerifyWithAddress } from 'packages/verification';
import FusionInputFormItem from '../../../../components/FusionInputFormItem';
import { checkAccountType, searchToJson } from '../../../../common/tools';
import modifyPasswordIcon from '../../../../../static/modify-password-icon.png';
import { getTenantConfig } from '../../../../config/tenant';
import { useForgetPwdStore } from '../../../model';
import { SecurityTipModal } from '../Modal';
import styles from './styles.module.scss';

const { useForm, useWatch } = Form;

function InputAccount({ onSuccess, onBack }) {
  const { t } = useLang();
  const [form] = useForm();
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const _account = useWatch('account', form);
  const countryCode = useWatch('countryCode', form);
  // 检测输入的是邮箱还是手机号码
  const accountType = useMemo(() => checkAccountType(_account), [_account]);
  const update = useForgetPwdStore(state => state.update);
  const isLogin = useForgetPwdStore(state => state.isLogin);
  const countryCodes = useForgetPwdStore(state => state.countryCodes);
  const getCountryCodes = useForgetPwdStore(state => state.getCountryCodes);
  const toast = useToast();
  const { multiSiteConfig } = useMultiSiteConfig();

  const handleAccountBlur = () => {
    if (accountType === 'email') {
      kcsensorsManualTrack({ spm: ['email', '1'] }, 'page_click');
    } else if (accountType === 'phone') {
      kcsensorsManualTrack({ spm: ['phone', '1'] }, 'page_click');
    }
  };

  const handleFinish = () => {
    setTipModalOpen(true);
  };

  const handleTipModalCancel = () => {
    setTipModalOpen(false);
  };

  // 提示弹窗的确认按钮
  const handleTipModalOk = () => {
    setTipModalOpen(false);
    try {
      goVerifyWithAddress({
        address: accountType === 'email' ? _account : `${countryCode}-${_account}`,
        bizType: accountType === 'email' ? 'RV_RESET_EMAIL_LP' : 'RV_RESET_PHONE_LP',
        businessData: {
          operateType: 'RESET_LP',
        },
        onSuccess: res => {
          update?.({
            verifyResult: res,
            accountType,
            email: accountType === 'email' ? _account : '',
            phone: accountType === 'phone' ? _account : '',
            countryCode: countryCode || '',
          });
          onSuccess();
        },
        onCancel: () => {
          onBack?.();
        },
      });
    } catch (err) {
      toast.error((err as any)?.message);
    }
  };

  useEffect(() => {
    getCountryCodes?.();
  }, []);

  // 忘记密码组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['forgetPwd', '1'],
    });
  }, []);

  const initialValue = useMemo(() => {
    const search = searchToJson() as { phone?: string; email?: string };
    let countryCode = storage.getItem('$entrance.f.mc') || '';
    let account = atob?.(storage.getItem('$entrance.f.a') || '') || '';
    if (typeof search.phone === 'string') {
      countryCode = search.phone.split('-')[0];
      account = search.phone.split('-')[1];
    } else if (typeof search.email === 'string') {
      account = search.email;
    }
    return {
      countryCode,
      account,
    };
  }, []);

  return (
    <>
      <Form form={form}>
        <FusionInputFormItem
          form={form}
          countryCodes={countryCodes}
          scene="forgetPwd"
          initValues={initialValue}
          multiSiteConfig={multiSiteConfig}
          onInputBlur={handleAccountBlur}
          disabled={isLogin}
        />
        <Button
          type="primary"
          fullWidth
          size="large"
          onClick={handleFinish}
          className={styles.button}
          disabled={accountType === 'email' ? !_account : accountType === 'phone' ? !_account || !countryCode : true}
          data-inspector="forget_pwd_send_code"
        >
          {t('vHBPtPwoVzxY4ZqfjDhAaR')}
        </Button>
      </Form>
      <SecurityTipModal
        isOpen={tipModalOpen}
        iconUrl={modifyPasswordIcon}
        onClose={handleTipModalCancel}
        onOk={handleTipModalOk}
        title={t('jDxAEXC2T4hpidJXV6Guyv')}
        content={[<div>{getTenantConfig().forgetPwd.alertText(t)}</div>]}
      />
    </>
  );
}

export default InputAccount;
