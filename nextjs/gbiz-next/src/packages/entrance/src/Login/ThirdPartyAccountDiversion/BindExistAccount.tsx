/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import React from 'react';
import clsx from 'clsx';
import { Form, Button } from '@kux/mui';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { useMultiSiteConfig } from 'hooks';
import { THIRD_PARTY_LOGIN_DECISION, THIRD_PARTY_LOGIN_PLATFORM } from '../constants';
import { useLang, useToast } from '../../hookTool';
import { checkAccountType, compose, getMobileCode } from '../../common/tools';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import { useLoginStore } from '../model';
import styles from './index.module.scss';

const { useForm } = Form;

interface BindExistAccountProps {
  handleExistAccountLogin: () => void;
  handleNewAccount: () => void;
  handleAccountHasBound: () => void;
}

export const BindExistAccount: React.FC<BindExistAccountProps> = ({
  handleExistAccountLogin,
  handleNewAccount,
  handleAccountHasBound,
}) => {
  const toast = useToast();
  const { t } = useLang();
  const [form] = useForm();
  // zustand 替换 redux
  const countryCodes = useLoginStore(state => state.countryCodes);
  const thirdPartyInfo = useLoginStore(state => state.thirdPartyInfo);
  const thirdPartyPlatform = useLoginStore(state => state.thirdPartyPlatform)!;
  const thirdPartyDecodeInfo = useLoginStore(state => state.thirdPartyDecodeInfo);
  const thirdPartyBindAccountInfo = useLoginStore(state => state.thirdPartyBindAccountInfo);
  const update = useLoginStore(state => state.update);
  const checkAccount = useLoginStore(state => state.checkAccount);
  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';
  const { multiSiteConfig } = useMultiSiteConfig();
  const accountValue = Form.useWatch('account', form);

  const handleCheckAccount = async () => {
    try {
      const values = await form.validateFields();
      trackClick(['bindExistingKCAccountInputAccount', 'nextButton']);

      const accountType = checkAccountType(values?.account);
      const countryCode = getMobileCode(values?.countryCode);
      // 0--表示用户没注册，走注册流程
      // 1--用户已注册，且可以绑定，走登录绑定流程
      // 2--用户已注册，但不能绑定，可能已绑定其他账号，或处于冻结状态等
      const status = await checkAccount?.({
        extInfo: thirdPartyInfo,
        extPlatform: thirdPartyPlatform,
        ...(accountType === 'phone' ? { countryCode, phone: values.account } : { email: values.account }),
      });

      if (status === 0) {
        handleNewAccount();
      } else if (status === 1) {
        update?.({
          loginDecision: THIRD_PARTY_LOGIN_DECISION.login,
        });
        handleExistAccountLogin();
      } else if (status === 2) {
        handleAccountHasBound();
      }
    } catch (error) {
      if ((error as any)?.msg) {
        toast.error((error as any).msg);
      }
      console.error('Error checking account:', error);
    }
  };

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['bindExistingKCAccountInputAccount', '1'],
      data: {
        pre_spm_id: compose(['accountDiversionPage', 'bindExistingKCAccount']),
      },
    });
  }, []);

  return (
    <>
      <h2 className={clsx(styles.title)}>{t('9fabaa38d6f74800a6bb')}</h2>
      <p className={clsx(styles.desc)}>
        {t('3db4576973104000ae4f', {
          platform: platformLabel,
          account: thirdPartyDecodeInfo?.userInfo,
        })}
      </p>
      <Form form={form} className={clsx(styles.extendForm)}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          scene="login"
          initValues={{
            countryCode: thirdPartyBindAccountInfo?.countryCode || '',
            account: thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
          }}
          onInputFocus={() => {
            kcsensorsManualTrack({ spm: ['accountInsert', '1'] }, 'page_click');
          }}
          multiSiteConfig={multiSiteConfig}
        />
        <Button
          className={clsx(styles.subButton)}
          fullWidth
          size="large"
          data-inspector="signin_submit_button"
          disabled={!accountValue}
          onClick={handleCheckAccount}
        >
          <span>{t('next')}</span>
        </Button>
      </Form>
    </>
  );
};

export default BindExistAccount;
