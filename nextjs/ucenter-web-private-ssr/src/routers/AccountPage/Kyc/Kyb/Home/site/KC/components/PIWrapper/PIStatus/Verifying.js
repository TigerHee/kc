/**
 * Owner: vijay.zhou@kupotech.com
 */
import IdentityIPFlow from 'components/Account/Kyc/common/IdentityIPFlow';
import { _t } from 'tools/i18n';
import { PIFlowDesc, PIFlowWrapper, StepDesc, VerifyingAlert } from '../styled';

export default () => {
  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />
        <VerifyingAlert>{_t('kyc_homepage_describe_verifying')}</VerifyingAlert>
      </PIFlowWrapper>
    </>
  );
};
