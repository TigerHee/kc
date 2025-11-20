/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import {
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
  THIRD_PARTY_LOGIN_DECISION,
  THIRD_PARTY_LOGIN_PLATFORM,
} from '../constants';
import { useLang } from '../../hookTool';
import { compose, getTrackingSource } from '../../common/tools';
import { SignUpNoLayout } from '../../index';
import { useLoginStore } from '../model';

interface CreateNewAccountProps {
  theme?: any;
  onSuccess: (data: any) => void;
  trackingConfig?: Record<string, any>;
  handleExistAccountLogin: () => void;
  handleAccountHasBound: () => void;
  onBack?: () => void;
}

export const CreateNewAccount: React.FC<CreateNewAccountProps> = ({
  theme,
  onSuccess,
  trackingConfig,
  handleExistAccountLogin,
  handleAccountHasBound,
  onBack,
}) => {
  const { t } = useLang();
  // zustand 替换 redux
  const thirdPartyInfo = useLoginStore(state => state.thirdPartyInfo);
  const thirdPartyPlatform = useLoginStore(state => state.thirdPartyPlatform)!;
  const thirdPartyDecodeInfo = useLoginStore(state => state.thirdPartyDecodeInfo);
  const thirdPartyBindAccountInfo = useLoginStore(state => state.thirdPartyBindAccountInfo);
  const checkAccount = useLoginStore(state => state.checkAccount);
  const thirdPartyDiversionPrevStepList = useLoginStore(state => state.thirdPartyDiversionPrevStepList);
  const update = useLoginStore(state => state.update);

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  useEffect(() => {
    // 是否从输入账号非 kc 账号过来
    const isFromBindExistAccount = thirdPartyDiversionPrevStepList?.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.BIND_EXIST_ACCOUNT
      : false;
    kcsensorsManualTrack({
      spm: ['createNewKCAccount', '1'],
      data: {
        pre_spm_id: isFromBindExistAccount
          ? compose(['bindExistingKCAccount', '1'])
          : compose(['accountDiversionPage', 'newKCAccount']),
      },
    });
  }, []);

  return (
    // @ts-ignore 注册改造之后生效
    <SignUpNoLayout
      theme={theme}
      kycGuideWithDialog
      setAccountTitle={t('a5e59b5a44234000a106')}
      setAccountDesc={t('ecc205544b464800acbe', {
        platform: platformLabel,
        account: thirdPartyDecodeInfo?.userInfo,
      })}
      thirdPartyPlatform={thirdPartyPlatform}
      thirdPartyInfo={thirdPartyInfo}
      onThirdPartySetAccount={async (registerData, handleSendCode) => {
        try {
          trackClick(['createNewKCAccount', 'createButton']);
          // 0--表示用户没注册，走注册流程
          // 1--用户已注册，且可以绑定，走登录绑定流程
          // 2--用户已注册，但不能绑定，可能已绑定其他账号，或处于冻结状态等
          const status = await checkAccount?.({
            extInfo: thirdPartyInfo,
            extPlatform: thirdPartyPlatform,
            ...(registerData || {}),
          });
          if (status === 0) {
            handleSendCode?.();
          } else if (status === 1) {
            update?.({
              loginDecision: THIRD_PARTY_LOGIN_DECISION.login,
            });
            handleExistAccountLogin();
          } else if (status === 2) {
            handleAccountHasBound();
          }
        } catch (error) {
          console.error('Error checking account:', error);
        }
      }}
      onChange={data => {
        const source = getTrackingSource(trackingConfig);
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              source,
              businessType: 'thirdPartyCreateNewAccount',
              is_success: true,
              is_login: true,
            },
          },
          'login_result'
        );
        onSuccess(data);
      }}
      singUpBtnText={t('4f9f52739de44000abba')}
      fromBindThirdPartyAccount
      onBack={onBack}
      initEmail={thirdPartyBindAccountInfo?.email || ''}
      initPhone={thirdPartyBindAccountInfo?.phone || ''}
      initPhoneCode={thirdPartyBindAccountInfo?.countryCode || ''}
    />
  );
};

export default CreateNewAccount;
