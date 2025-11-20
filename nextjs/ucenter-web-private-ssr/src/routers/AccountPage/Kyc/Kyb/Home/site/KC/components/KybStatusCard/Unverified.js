/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { Button as OriginButton, styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import WaitIcon from 'static/account/kyc/kyb/wait_icon.svg';
import { trackClick } from 'utils/ga';
import { Warning } from '../../../../components/styled';
import VerificationRequirements from '../../../../components/VerificationRequirements';

const Button = styled(OriginButton)`
  display: flex;
  min-width: 240px;
  height: 48px;
  padding: 15px 32px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 130%;
  margin-top: 28px;
`;

const Unverified = ({ goVerify }) => {
  const { currentPhase } = useSelector((state) => state.kyb?.companyDetail ?? {});
  const isContinue = currentPhase >= 1;
  return (
    <VerificationRequirements>
      {isContinue ? (
        <Warning>
          <img src={WaitIcon} alt="wait" />
          {_t('917141689c944000ac18')}
        </Warning>
      ) : null}
      <Button
        onClick={() => {
          trackClick(['verifyPage', 'goVerify']);
          goVerify();
        }}
      >
        {isContinue ? _t('32d142571cde4000a96f') : _t('ujZc9hLkSmYHhQy4CQHo6u')}
        <ICArrowRight2Outlined />
      </Button>
    </VerificationRequirements>
  );
};

export default Unverified;
