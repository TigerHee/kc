/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BindDialog from 'components/Account/Kyc3/Home/BindDialog';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import UnverifiedWrapper from '../../../../components/UnverifiedWrapper';

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

const Unverified = ({ handleClickVerify, rightImg }) => {
  const { email, phone } = useSelector((state) => state.user?.user ?? {});
  const [preAuthShow, setPreAuthShow] = useState(false);

  const onGoVerify = () => {
    if (!email || !phone) {
      return setPreAuthShow(true);
    }
    handleClickVerify();
  };

  return (
    <>
      <BaseCard
        leftSlot={
          <>
            <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
            <ButtonBox>
              <VerifyButton onClick={onGoVerify}>{_t('ujZc9hLkSmYHhQy4CQHo6u')}</VerifyButton>
            </ButtonBox>
          </>
        }
        rightSlot={rightImg}
      />
      <BindDialog open={preAuthShow} onCancel={() => setPreAuthShow(false)} />
    </>
  );
};

export default UnverifiedWrapper(Unverified);
