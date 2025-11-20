/**
 * Owner: tiger@kupotech.com
 */
import styled from '@emotion/styled';
import { Tooltip } from '@kux/mui';
import BaseAlert from 'components/Account/Kyc3/Home/KycStatusCard/components/Alert';
import BaseCard from 'components/Account/Kyc3/Home/KycStatusCard/components/Card';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import BaseTitle from 'components/Account/Kyc3/Home/KycStatusCard/components/Title';
import VerifyButton from 'components/Account/Kyc3/Home/KycStatusCard/modules/VerifyButton';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import illustrationIcon from 'static/account/kyc/kyb/illustration.svg';
import { _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';

const ExBaseCard = styled(BaseCard)``;

const Desc = styled(BaseDescription)``;

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

const KycStatusRejected = ({ desc }) => {
  const kybInfo = useSelector((s) => s.kyc.kybInfo);

  const handleClick = () => {
    trackClick(['KYBgoVerifiy', '1']);
    push('/account/kyc/institutional-kyc');
  };

  // 失败原因
  const failureReasonLists = useMemo(() => {
    return Object.values(kybInfo?.failureReason || {});
  }, [kybInfo]);

  return (
    <ExBaseCard
      leftSlot={
        <>
          <BaseTitle>{_t('5MNDjLkQDEn3KnL2NFDhP1')}</BaseTitle>
          <Desc>{desc || _t('iK2Fy85yexL5JjKMhZedhu')}</Desc>
          <Divider />

          {failureReasonLists && failureReasonLists?.length ? (
            <Tooltip
              onOpen={() => {}}
              title={<FailureReason failureReasonLists={failureReasonLists} />}
            >
              <div style={{ display: 'inline-flex' }}>
                <ExBaseAlert type="error">{_tHTML('4uVfEqapQ5qKnUKYm5176L')}</ExBaseAlert>
              </div>
            </Tooltip>
          ) : null}

          <ButtonBox>
            <VerifyButton onClick={handleClick}>{_t('mwdwXUvagzZaLxv8oYUZLr')}</VerifyButton>
          </ButtonBox>
        </>
      }
      rightSlot={<RightImg src={illustrationIcon} />}
    />
  );
};

export default KycStatusRejected;
