/**
 * Owner: tiger@kupotech.com
 */
import IdentityIPFlow from 'components/Account/Kyc/common/IdentityIPFlow';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import { PIFlowDesc, PIFlowWrapper, StepDesc, VerifyingAlert } from '../style';

export default ({ fake }) => {
  const kycInfo = useSelector((s) => s.kyc.kycInfo);

  return (
    <>
      <StepDesc>{_t('5a1ff894e2854000a49c')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow />
        <VerifyingAlert>
          {fake
            ? _t('qMtT86sT5eodpqQEM6Wn49')
            : kycInfo?.verifyType === 0 // 0-人工审核
            ? _t('KYC_verifying_manual')
            : _t('kyc_homepage_describe_verifying')}
        </VerifyingAlert>
      </PIFlowWrapper>
    </>
  );
};
