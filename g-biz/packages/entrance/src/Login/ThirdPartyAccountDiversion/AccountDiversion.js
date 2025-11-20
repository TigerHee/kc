/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { styled, Button } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useSelector } from 'react-redux';
import { useLang } from '../../hookTool';
import ThirdPartyCreateAccount from '../../../static/third-party-create-account.svg';
import ThirdPartyBindAccount from '../../../static/third-party-bind-account.svg';
import { LOGIN_STEP, NAMESPACE, THIRD_PARTY_LOGIN_PLATFORM } from '../constants';
import { compose, kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'KuFox Sans';
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    font-weight: 600;
    line-height: 130%;
  }
`;
const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-family: 'KuFox Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    font-weight: 400;
    line-height: 150%; /* 21px */
  }
`;
const AccountInfo = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: Kufox Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
`;
const ButtonWrap = styled(Button)`
  width: 100%;
  height: auto;
  margin-top: 20px;
  font-size: 18px;
  padding: 24px;
  display: flex;
  flex-flow: nowrap row;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 16px;
    padding: 24px 20px;
  }
`;
const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

export const AccountDiversion = ({ handleNewAccount, handleBindExistAccount }) => {
  const { t } = useLang();
  const { thirdPartyPlatform, thirdPartyDecodeInfo, prevStepList } = useSelector(
    (s) => s[NAMESPACE],
  );

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';

  const onHandleNewAccount = () => {
    kcsensorsClick(['easyRegisterPage', 'newKCAccount']);
    handleNewAccount();
  };

  const onHandleBindExistAccount = () => {
    kcsensorsClick(['easyRegisterPage', 'bindExistingKCAccount']);
    handleBindExistAccount();
  };

  useEffect(() => {
    const isFromSimpleSignup = prevStepList.length
      ? prevStepList[prevStepList.length - 1] === LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE
      : false;
    kcsensorsManualTrack({
      spm: ['accountDiversionPage', '1'],
      data: {
        pre_spm_id: isFromSimpleSignup
          ? compose(['easyRegisterPage', 'bindOtherAccount'])
          : compose(['thirdAccount', 'thirdPartyPlatform']),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title>{t('169f9aaaa7164000a396')}</Title>
      <Desc>
        <div>{t('1e51fc6a27c64800a6e1')}</div>
        <div>{t('acbb9c5a25734000abc2', { platform: platformLabel })}</div>
        <div>{t('34c3197622024000a061')}</div>
      </Desc>
      <AccountInfo>
        {t('7f84a595a85b4000aa38', {
          platform: platformLabel,
          account: thirdPartyDecodeInfo?.userInfo,
        })}
      </AccountInfo>
      {/* 三方注册 绑定新账号 */}
      <ButtonWrap variant="outlined" fullWidth onClick={onHandleNewAccount}>
        <Icon>
          <img src={ThirdPartyCreateAccount} alt="create new account" />
          <span>{t('ce7aea3fa3b24800a9cd')}</span>
        </Icon>
        <ICArrowRight2Outlined size="24" />
      </ButtonWrap>
      {/* 三方注册 绑定已有账号 */}
      <ButtonWrap variant="outlined" fullWidth onClick={onHandleBindExistAccount}>
        <Icon>
          <img src={ThirdPartyBindAccount} alt="bind other account" />
          <span>{t('9fabaa38d6f74800a6bb')}</span>
        </Icon>
        <ICArrowRight2Outlined size="24" />
      </ButtonWrap>
    </>
  );
};
