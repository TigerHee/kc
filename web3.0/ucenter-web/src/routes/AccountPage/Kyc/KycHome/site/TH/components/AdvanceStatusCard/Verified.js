/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import VerifiedTag2 from 'components/Account/Kyc/common/VerifiedTag2';
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { addLangToPath, _t } from 'tools/i18n';
import { VerifiedImg } from './common';

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
  display: flex;
  align-items: center;
  b {
    margin-right: 12px;
  }
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

const Verified = ({ onClickVerify }) => {
  // 是否入过金
  const recharged = useSelector((state) => state.user?.recharged);
  const rewardInfo = useSelector((s) => s.kyc?.rewardInfo);
  const advanceStatusData = useSelector((s) => s.kyc_th?.advanceStatusData ?? {});
  const { isMaxLevel } = advanceStatusData;
  const rewardMessage = useMemo(() => {
    if (['DEPOSIT'].includes(rewardInfo?.taskType)) {
      return rewardInfo?.taskSubTitle;
    }
    return '';
  }, [rewardInfo]);

  const handleClick = () => {
    if (isMaxLevel) {
      window.location.href = addLangToPath('/assets/coin');
    } else {
      onClickVerify?.();
    }
  };

  return (
    <ExBaseCard
      leftSlot={
        <>
          <ExBaseTitle>
            <b>{_t('4a730c3346164000a241')}</b>
            <VerifiedTag2 />
          </ExBaseTitle>
          <DescBox>
            <BaseDescription>{_t('ef13116224f94000a6a9')}</BaseDescription>
            <ExBaseButton size="small" variant="outlined" onClick={handleClick}>
              {isMaxLevel ? (
                <span>{_t('45813def186c4800aa66')}</span>
              ) : (
                <span>{_t('6b12f8328eb24000a597')}</span>
              )}
            </ExBaseButton>
          </DescBox>
        </>
      }
      rightSlot={<VerifiedImg />}
    />
  );
};

export default Verified;
