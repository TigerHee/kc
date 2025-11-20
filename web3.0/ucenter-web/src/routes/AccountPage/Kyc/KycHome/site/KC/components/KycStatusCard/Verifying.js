/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import { _t } from 'tools/i18n';
import VerifyingWrapper from '../../../../components/VerifyingWrapper';

const ExBaseCard = styled(BaseCard)`
  & > div:nth-of-type(1) {
    padding: 11px 0;
  }
`;

const ExBaseAlert = styled(BaseAlert)`
  margin-top: 32px;
`;

const VerifyingGlobal = ({ fake, alertMsg, rightImg }) => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          {fake ? null : (
            <BaseDescription>{_t('kyc_homepage_describe_unverified')}</BaseDescription>
          )}
          <KycWelfare fake={fake} />
          <ExBaseAlert>{alertMsg}</ExBaseAlert>
        </>
      }
      rightSlot={rightImg}
    />
  );
};

export default VerifyingWrapper(VerifyingGlobal);
