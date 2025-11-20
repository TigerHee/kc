/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import { useEffect } from 'react';
import illustrationIcon from 'static/account/kyc/kyb/illustration.svg';
import { _t } from 'tools/i18n';
import { saTrackForBiz } from 'utils/ga';

const ExBaseCard = styled(BaseCard)`
  & > div:nth-of-type(1) {
    padding: 11px 0;
  }
`;

const RightImg = styled.img`
  width: 184px;
  height: 184px;
  pointer-events: none;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 130px;
    height: 130px;
  }
`;

const ExBaseAlert = styled(BaseAlert)`
  margin-top: 32px;
`;

const KycStatusVerifying = ({ desc }) => {
  useEffect(() => {
    saTrackForBiz({}, ['KYBWaiting', '']);
  }, []);

  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('5MNDjLkQDEn3KnL2NFDhP1')}</BaseTitle>
          {desc.map((item) => (
            <BaseDescription key={item}>{item}</BaseDescription>
          ))}
          <ExBaseAlert>{_t('kyc_homepage_describe_verifying')}</ExBaseAlert>
        </>
      }
      rightSlot={<RightImg src={illustrationIcon} />}
    />
  );
};

export default KycStatusVerifying;
