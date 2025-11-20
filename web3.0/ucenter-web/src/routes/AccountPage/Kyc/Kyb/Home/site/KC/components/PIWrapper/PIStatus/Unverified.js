/**
 * Owner: vijay.zhou@kupotech.com
 */
import IdentityIPFlow from 'components/Account/Kyc/common/IdentityIPFlow';
import BaseButton from 'components/Account/Kyc3/Home/KycStatusCard/components/Button';
import { _t } from 'tools/i18n';
import { PIFlowDesc, PIFlowWrapper, StepDesc, UnverifiedButtonBox } from '../styled';

export default ({ onPIVerify }) => {
  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />
        <UnverifiedButtonBox>
          <BaseButton onClick={onPIVerify}>{_t('ujZc9hLkSmYHhQy4CQHo6u')}</BaseButton>
        </UnverifiedButtonBox>
      </PIFlowWrapper>
    </>
  );
};
