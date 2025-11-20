/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
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

const ExBaseButton = styled(BaseButton)`
  height: 48px;
  & > svg {
    font-size: 20px;
  }
`;

const ButtonContent = styled.span`
  line-height: 21px;
  font-size: 16px;
`;

const VerifiedTR = ({ handleDeposit, rightImg }) => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <ExBaseTitle>{_t('kyc_homepage_deposited')}</ExBaseTitle>
          <ExBaseButton size="small" onClick={handleDeposit}>
            <ButtonContent>{_t('kyc_homepage_deposited_button')}</ButtonContent>
          </ExBaseButton>
        </>
      }
      rightSlot={rightImg}
    />
  );
};

export default VerifiedWrapper(VerifiedTR);
