/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import clsx from 'clsx';
import { kcsensorsManualTrack } from 'tools/sensors';
import { THIRD_PARTY_LOGIN_PLATFORM } from '../constants';
import { useLang } from '../../hookTool';
import { compose, getTrackingSource } from '../../common/tools';
import { SignUpNoLayout } from '../../index';
import { useLoginStore } from '../model';
import styles from './index.module.scss';

interface ThirdPartySimpleSignupProps {
  theme?: any;
  onSuccess: (data: any) => void;
  trackingConfig?: Record<string, any>;
  onBack?: () => void;
  onBindOtherAccount?: () => void;
}

const ThirdPartySimpleSignup: React.FC<ThirdPartySimpleSignupProps> = ({
  theme,
  onSuccess,
  trackingConfig,
  onBack,
  onBindOtherAccount,
}) => {
  const { t } = useLang();
  // zustand 替换 redux
  const thirdPartyPlatform = useLoginStore(s => s.thirdPartyPlatform)!;
  const thirdPartyInfo = useLoginStore(s => s.thirdPartyInfo)!;
  const thirdPartyDecodeInfo = useLoginStore(s => s.thirdPartyDecodeInfo);

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['easyRegisterPage', '1'],
      data: {
        pre_spm_id: compose(['thirdAccount', 'thirdPartyPlatform']),
      },
    });
  }, []);

  return (
    
    <div>
      {thirdPartyDecodeInfo?.userInfo ? (
        <SignUpNoLayout
          theme={theme}
          setAccountTitle={t('a5e59b5a44234000a106')}
          setAccountDesc={t('94e1cb09efe94800a53d', {
            platform: platformLabel,
            account: thirdPartyDecodeInfo?.userInfo,
          })}
          thirdPartyPlatform={thirdPartyPlatform}
          thirdPartyInfo={thirdPartyInfo}
          singUpBtnText={t('4f9f52739de44000abba')}
          onChange={data => {
            const source = getTrackingSource(trackingConfig);
            kcsensorsManualTrack(
              {
                checkID: false,
                data: {
                  source,
                  businessType: 'simpleThirdPartySignup',
                  is_success: true,
                  is_login: true,
                },
              },
              'login_result'
            );
            onSuccess(data);
          }}
          onBack={onBack}
          fromThirdPartySimpleSignup
          initEmail={thirdPartyDecodeInfo?.userInfo}
          forgetLeft={
            <span className={clsx(styles.forgetLeft)} onClick={onBindOtherAccount}>
              {t('b652ede9c3054800a771')}
            </span>
          }
        />
      ) : null}
    </div>
  );
};

export default ThirdPartySimpleSignup;
