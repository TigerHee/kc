/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import { Form, Button, Box } from '@kux/mui';
import { ICArrowRightOutlined } from '@kux/icons';
import { useMultiSiteConfig } from 'hooks';
import { useLoginStore } from '../model';
import { useEffect } from 'react';
import {
  THIRD_PARTY_LOGIN_PLATFORM,
  THIRD_PARTY_LOGIN_DECISION,
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
} from '../constants';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { compose, getMobileCode } from '../../common/tools';
import { useLang } from '../../hookTool';
import styles from './index.module.scss';

const { useForm } = Form;

interface AccountHasBoundProps {
  handleExistAccountLogin: () => void;
}

export const AccountHasBound: React.FC<AccountHasBoundProps> = ({ handleExistAccountLogin }) => {
  const { t } = useLang();
  const [form] = useForm();
  // zustand 替换 redux
  const countryCodes = useLoginStore(state => state.countryCodes);
  const thirdPartyInfo = useLoginStore(state => state.thirdPartyInfo);
  const thirdPartyPlatform = useLoginStore(state => state.thirdPartyPlatform)!;
  const thirdPartyDecodeInfo = useLoginStore(state => state.thirdPartyDecodeInfo);
  const thirdPartyBindAccountInfo = useLoginStore(state => state.thirdPartyBindAccountInfo);
  const thirdPartyDiversionPrevStepList = useLoginStore(state => state.thirdPartyDiversionPrevStepList);
  const update = useLoginStore(state => state.update);

  const { multiSiteConfig } = useMultiSiteConfig();
  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  // 直接登陆
  const continueLogin = () => {
    trackClick(['alreadyBoundKCAccount', 'continueLogin']);
    handleExistAccountLogin();
    kcsensorsManualTrack({
      spm: ['loginExistingKCAccount', '1'],
      data: {
        pre_spm_id: compose(['alreadyBoundKCAccount', 'continueLogin']),
      },
    });
  };

  // 换绑登陆
  const relinkAccountLogin = () => {
    trackClick(['alreadyBoundKCAccount', 'switchThirdPartyAccount']);
    update?.({
      loginDecision: THIRD_PARTY_LOGIN_DECISION.relink,
    });
    handleExistAccountLogin();
    kcsensorsManualTrack({
      spm: ['loginExistingKCAccount', '1'],
      data: {
        pre_spm_id: compose(['alreadyBoundKCAccount', 'switchThirdPartyAccount']),
      },
    });
  };

  const currentAccount = thirdPartyBindAccountInfo?.countryCode
    ? `${getMobileCode(thirdPartyBindAccountInfo?.countryCode)}-${thirdPartyBindAccountInfo?.phone}`
    : thirdPartyBindAccountInfo?.email;

  useEffect(() => {
    // 是否从新建账号过来
    const isFromCreateNewAccount = thirdPartyDiversionPrevStepList?.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT
      : false;
    kcsensorsManualTrack({
      spm: ['alreadyBoundKCAccount', '1'],
      data: {
        pre_spm_id: isFromCreateNewAccount
          ? compose(['createNewKCAccount', '1'])
          : compose(['bindExistingKCAccountInputAccount', '1']),
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
      <Form className={clsx(styles.extendForm)} form={form}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          errorTips={t('48ac1bdadda64000aa70', {
            platform: platformLabel,
          })}
          initValues={{
            countryCode: thirdPartyBindAccountInfo?.countryCode || '',
            account: thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
          }}
          scene="login"
          multiSiteConfig={multiSiteConfig}
          disabled
        />
        <Box className={clsx(styles.continueLoginBox)}>
          <div className={clsx(styles.continueLogin)} onClick={continueLogin}>
            <span>
              {t('0e4b36dfb3524800aa8c', {
                account: currentAccount,
              })}
            </span>
            <ICArrowRightOutlined size={16} />
          </div>
          <div className={clsx(styles.continueLogin)} onClick={relinkAccountLogin}>
            <span>
              {t('9c99ebced2df4800ae64', {
                platform: platformLabel,
                account: currentAccount,
              })}
            </span>
            <ICArrowRightOutlined size={16} />
          </div>
        </Box>
        <Button
          className={clsx(styles.subButton)}
          fullWidth
          htmlType="submit"
          size="large"
          data-inspector="signin_submit_button"
          disabled
        >
          <span>{t('next')}</span>
        </Button>
      </Form>
    </>
  );
};

export default AccountHasBound;
