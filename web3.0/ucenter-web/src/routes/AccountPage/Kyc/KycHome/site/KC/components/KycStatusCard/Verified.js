/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import VerifiedWrapper from '../../../../components/VerifiedWrapper';

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

const VerifiedGlobal = ({ handleDeposit, rightImg }) => {
  // 是否入过金
  const recharged = useSelector((state) => state.user?.recharged);
  const rewardInfo = useSelector((s) => s.kyc?.rewardInfo);
  const rewardMessage = useMemo(() => {
    if (['DEPOSIT'].includes(rewardInfo?.taskType)) {
      return rewardInfo?.taskSubTitle;
    }
    return '';
  }, [rewardInfo]);
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
      rightSlot={rightImg}
    />
  );
};

export default VerifiedWrapper(VerifiedGlobal);
