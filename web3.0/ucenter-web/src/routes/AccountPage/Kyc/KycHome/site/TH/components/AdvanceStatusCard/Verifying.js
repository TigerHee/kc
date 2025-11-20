/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { _t } from 'tools/i18n';
import { RightImg } from './common';

const ExBaseCard = styled(BaseCard)``;

const ExBaseAlert = styled(BaseAlert)`
  margin-top: 32px;
`;

const Verifying = () => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('d433f7cc73be4000a22c')}</BaseTitle>
          <BaseDescription>{_t('94daa0d60fa74000af61')}</BaseDescription>
          <ExBaseAlert>{_t('8d551e18f2624000adb8')}</ExBaseAlert>
        </>
      }
      rightSlot={<RightImg />}
    />
  );
};

export default Verifying;
