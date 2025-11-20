/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import VerifiedTag2 from 'components/Account/Kyc/common/VerifiedTag2';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { _t } from 'tools/i18n';

const ExBaseCard = styled(BaseCard)`
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    & > div:nth-of-type(1) {
      width: 100%;
    }
  }
`;

const ExBaseTitle = styled(BaseTitle)`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  b {
    margin-right: 12px;
    font-weight: 600;
  }
`;

const Verified = ({ rightImg }) => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <ExBaseTitle>
            <b>{_t('038a0c3842134000ac6c')}</b>
            <VerifiedTag2 />
          </ExBaseTitle>
        </>
      }
      rightSlot={rightImg}
      privacy={false}
    />
  );
};

export default Verified;
