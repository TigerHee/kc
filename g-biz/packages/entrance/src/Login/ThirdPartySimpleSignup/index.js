/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import { styled } from '@kux/mui';
import { NAMESPACE, THIRD_PARTY_LOGIN_PLATFORM } from '../constants';
import { useLang } from '../../hookTool';
import { compose, getTrackingSource } from '../../common/tools';
import { SignUpNoLayout } from '../../SignUp';

const ForgetLeft = styled.div`
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  margin-top: 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 28px;
  }
`;

// 三方极简注册
const ThirdPartySimpleSignup = ({
  theme,
  onSuccess,
  trackingConfig,
  onBack,
  onBindOtherAccount,
}) => {
  const { t } = useLang();
  const thirdPartyPlatform = useSelector((s) => s[NAMESPACE]?.thirdPartyPlatform);
  const thirdPartyDecodeInfo = useSelector((s) => s[NAMESPACE]?.thirdPartyDecodeInfo);

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['easyRegisterPage', '1'],
      data: {
        pre_spm_id: compose(['thirdAccount', 'thirdPartyPlatform']),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          singUpBtnText={t('4f9f52739de44000abba')}
          onChange={(data) => {
            const source = getTrackingSource(trackingConfig);
            // 三方极简注册后登陆
            kcsensorsManualTrack(
              {
                checkID: false,
                data: {
                  source,
                  businessType: 'simpleThirdPartySignup',
                  is_success: true,
                  is_login: true, // 客户端设置is_login可能在这个之前，故这里默认login true
                },
              },
              'login_result',
            );
            onSuccess(data);
          }}
          kycGuideWithDialog
          onBack={onBack}
          fromThirdPartySimpleSignup
          initEmail={thirdPartyDecodeInfo?.userInfo}
          forgetLeft={
            <ForgetLeft onClick={onBindOtherAccount}>{t('b652ede9c3054800a771')}</ForgetLeft>
          }
        />
      ) : null}
    </div>
  );
};

export default ThirdPartySimpleSignup;
