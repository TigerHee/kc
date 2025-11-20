/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import { _t } from 'tools/i18n';
import RejectedWrapper from '../../../../components/RejectedWrapper';

const ExBaseCard = styled(BaseCard)``;

const Desc = styled(BaseDescription)``;

const Divider = styled.div`
  width: 100%;
  height: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 16px;
  }
`;

const Rejected = ({ reason, rightImg, verifyButton }) => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          <KycWelfare />
          <Divider />
          {reason}
          {verifyButton}
        </>
      }
      rightSlot={rightImg}
    />
  );
};

export default RejectedWrapper(Rejected);
