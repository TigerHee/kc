/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import {
  NAMESPACE,
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
  THIRD_PARTY_LOGIN_DECISION,
  THIRD_PARTY_LOGIN_PLATFORM,
} from '../constants';
import { useLang } from '../../hookTool';
import { compose, getTrackingSource, kcsensorsClick } from '../../common/tools';
import { SignUpNoLayout } from '../../SignUp';

export const CreateNewAccount = ({
  theme,
  onSuccess,
  trackingConfig,
  handleExistAccountLogin,
  handleAccountHasBound,
  onBack,
}) => {
  const { t } = useLang();
  const dispatch = useDispatch();
  const {
    thirdPartyInfo,
    thirdPartyPlatform,
    thirdPartyDecodeInfo,
    thirdPartyBindAccountInfo,
    thirdPartyDiversionPrevStepList,
  } = useSelector((s) => s[NAMESPACE]);

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  useEffect(() => {
    // 是否从输入账号非 kc 账号过来
    const isFromBindExistAccount = thirdPartyDiversionPrevStepList.length
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SignUpNoLayout
      theme={theme}
      kycGuideWithDialog
      setAccountTitle={t('a5e59b5a44234000a106')}
      setAccountDesc={t('ecc205544b464800acbe', {
        platform: platformLabel,
        account: thirdPartyDecodeInfo?.userInfo,
      })}
      onThirdPartySetAccount={async (registerData, handleSendCode) => {
        kcsensorsClick(['createNewKCAccount', 'createButton']);
        try {
          // 0--表示用户没注册，走注册流程
          // 1--用户已注册，且可以绑定，走登录绑定流程
          // 2--用户已注册，但不能绑定，可能已绑定其他账号，或处于冻结状态等
          const status = await dispatch({
            type: `${NAMESPACE}/checkAccount`,
            payload: {
              extInfo: thirdPartyInfo,
              extPlatform: thirdPartyPlatform,
              ...(registerData || {}),
            },
          });
          // 没有注册，走注册绑定流程
          if (status === 0) {
            handleSendCode();
          } else if (status === 1) {
            // 登陆绑定渠道
            dispatch({
              type: `${NAMESPACE}/update`,
              payload: {
                loginDecision: THIRD_PARTY_LOGIN_DECISION.login,
              },
            });
            handleExistAccountLogin();
            // 已经注册，可以绑定，登陆绑定流程
          } else if (status === 2) {
            handleAccountHasBound();
            // 用户已注册，但不能绑定，继续登陆/换绑流程
          }
        } catch (error) {
          console.error('Error checking account:', error);
        }
      }}
      onChange={(data) => {
        const source = getTrackingSource(trackingConfig);
        // 三方账号注册新账号后登陆
        kcsensorsManualTrack(
          {
            checkID: false,
            data: {
              source,
              businessType: 'thirdPartyCreateNewAccount',
              is_success: true,
              is_login: true, // 客户端设置is_login可能在这个之前，故这里默认login true
            },
          },
          'login_result',
        );
        // 三方极简注册后登陆
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
