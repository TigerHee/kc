/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { searchToJson } from 'helper';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import illustrationIcon from 'static/account/kyc/kyb/illustration.svg';
import { addLangToPath, _t } from 'tools/i18n';

const ExBaseCard = styled(BaseCard)`
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    & > div:nth-of-type(1) {
      width: 100%;
    }
  }
`;

const ExBaseTitle = styled(BaseTitle)`
  margin-bottom: 32px;
  ${({ theme }) => theme.breakpoints.down('xl')} {
    margin-bottom: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
  }
`;

const RightImg = styled.img`
  width: 160px;
  height: 160px;
  pointer-events: none;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 130px;
    height: 130px;
  }
`;

const DescBox = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.cover2};
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;

const ExBaseButton = styled(BaseButton)`
  height: 32px;
`;

const { soure } = searchToJson();

const KycStatusSuspend = () => {
  // 是否入过金
  const recharged = useSelector((state) => state.user?.recharged);
  const rewardInfo = useSelector((s) => s.kyc?.rewardInfo);

  const rewardMessage = useMemo(() => {
    if (['DEPOSIT'].includes(rewardInfo?.taskType)) {
      return rewardInfo?.taskSubTitle;
    }
    return '';
  }, [rewardInfo]);

  const handleDeposit = () => {
    window.location.href = addLangToPath(`/assets/coin/${window._BASE_CURRENCY_}`);
  };

  return (
    <ExBaseCard
      leftSlot={
        <>
          <ExBaseTitle>{_t('kyc_homepage_deposited')}</ExBaseTitle>
          <DescBox>
            <BaseDescription>
              {recharged || !rewardMessage ? _t('kyc_homepage_deposited_default') : rewardMessage}
            </BaseDescription>
            <ExBaseButton size="small" onClick={handleDeposit}>
              {_t('kyc_homepage_deposited_button')}
            </ExBaseButton>
          </DescBox>
        </>
      }
      rightSlot={<RightImg src={illustrationIcon} />}
    />
  );
};

export default KycStatusSuspend;
