/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import KycWelfare from 'components/Account/Kyc3/Home/KycStatusCard/modules/KycWelfare';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { _t } from 'tools/i18n';
import UnverifiedWrapper from '../../../../components/UnverifiedWrapper';

const ButtonBox = styled.div`
  margin-top: 28px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    button {
      padding: 0 34.5px;
    }
  }
`;

const UnverifiedGlobal = ({ handleClickVerify, rightImg }) => {
  return (
    <BaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('kyc_homepage_subtitle')}</BaseTitle>
          <BaseDescription>{_t('kyc_homepage_describe_unverified')}</BaseDescription>
          <KycWelfare />
          <ButtonBox>
            <VerifyButton onClick={handleClickVerify}>{_t('ujZc9hLkSmYHhQy4CQHo6u')}</VerifyButton>
          </ButtonBox>
        </>
      }
      rightSlot={rightImg}
    />
  );
};

export default UnverifiedWrapper(UnverifiedGlobal);
