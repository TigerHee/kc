/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { useMemo } from 'react';
import { _t } from 'tools/i18n';
import { kycStatusEnum } from '../../constants';
import useKyc3Status from '../../hooks/useKyc3Status';
import { RightImg } from './common';

const ButtonBox = styled.div`
  margin-top: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    button {
      padding: 0 34.5px;
    }
  }
`;

export default ({ onClickVerify, isBtnLoading }) => {
  const { kyc3Status } = useKyc3Status();

  // 是否基础认证通过
  const isBaseVerified = useMemo(() => {
    return [kycStatusEnum.KYB_VERIFIED, kycStatusEnum.KYC_VERIFIED].includes(kyc3Status);
  }, [kyc3Status]);

  return (
    <BaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('d433f7cc73be4000a22c')}</BaseTitle>
          <BaseDescription>{_t('94daa0d60fa74000af61')}</BaseDescription>

          {isBaseVerified ? (
            <ButtonBox>
              <VerifyButton onClick={onClickVerify} loading={isBtnLoading}>
                {_t('ujZc9hLkSmYHhQy4CQHo6u')}
              </VerifyButton>
            </ButtonBox>
          ) : null}
        </>
      }
      rightSlot={isBaseVerified ? <RightImg /> : null}
      privacy={isBaseVerified}
    />
  );
};
