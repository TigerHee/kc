/**
 * Owner: tiger@kupotech.com
 */
import { styled, Tooltip } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import { _t, _tHTML } from 'tools/i18n';
import { RightImg } from './common';

const ExBaseCard = styled(BaseCard)``;
const Desc = styled(BaseDescription)``;
const Divider = styled.div`
  width: 100%;
  height: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 16px;
  }
`;
const ExBaseAlert = styled(BaseAlert)`
  margin-bottom: 16px;
  user-select: none;
  & span > span {
    text-decoration: underline;
  }
`;

const ButtonBox = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;
    button {
      padding: 0 34.5px;
    }
  }
`;

const Rejected = ({ onClickVerify = () => {}, failedReason, isBtnLoading }) => {
  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('d433f7cc73be4000a22c')}</BaseTitle>
          <Desc>{_t('94daa0d60fa74000af61')}</Desc>
          <Divider />
          <Tooltip title={<FailureReason failureReasonLists={failedReason} />}>
            <div style={{ display: 'inline-flex' }}>
              <ExBaseAlert type="error">{_tHTML('4uVfEqapQ5qKnUKYm5176L')}</ExBaseAlert>
            </div>
          </Tooltip>
          <ButtonBox>
            <VerifyButton onClick={onClickVerify} loading={isBtnLoading}>
              {_t('mwdwXUvagzZaLxv8oYUZLr')}
            </VerifyButton>
          </ButtonBox>
        </>
      }
      rightSlot={<RightImg />}
    />
  );
};

export default Rejected;
