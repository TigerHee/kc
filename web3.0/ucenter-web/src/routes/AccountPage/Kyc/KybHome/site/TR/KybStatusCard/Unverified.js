/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import BindDialog from 'components/Account/Kyc3/Home/BindDialog';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import illustrationIcon from 'static/account/kyc/kyb/illustration.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';

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

const KycStatusUnverified = ({ desc }) => {
  const { email, phone } = useSelector((state) => state.user?.user ?? {});
  const [preAuthShow, setPreAuthShow] = useState(false);
  const handleClick = () => {
    trackClick(['KYBgoVerifiy', '1']);
    if (!email || !phone) {
      return setPreAuthShow(true);
    }
    push('/account/kyc/institutional-kyc');
  };

  return (
    <>
      <BaseCard
        leftSlot={
          <>
            <BaseTitle>{_t('5MNDjLkQDEn3KnL2NFDhP1')}</BaseTitle>
            {desc.map((item) => (
              <BaseDescription key={item}>{item}</BaseDescription>
            ))}

            <ButtonBox>
              <VerifyButton onClick={handleClick}>{_t('ujZc9hLkSmYHhQy4CQHo6u')}</VerifyButton>
            </ButtonBox>
          </>
        }
        rightSlot={<RightImg src={illustrationIcon} />}
      />
      <BindDialog open={preAuthShow} onCancel={() => setPreAuthShow(false)} />
    </>
  );
};

export default KycStatusUnverified;
