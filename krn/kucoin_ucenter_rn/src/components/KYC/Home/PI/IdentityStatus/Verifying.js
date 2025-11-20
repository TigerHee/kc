import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import useLang from 'hooks/useLang';
import IdentityIPFlow from 'components/KYC/Home/PI/Common/IdentityIPFlow';
import {StepDesc, PIFlowWrapper, PIFlowDesc} from '../style';
import {MessageWarning} from '../../VerifyArea';

export default ({fake}) => {
  const {_t} = useLang();
  const {verifyType} = useSelector(s => s.kyc.kycInfo);

  const msgText = useMemo(() => {
    if (fake) {
      return _t('qMtT86sT5eodpqQEM6Wn49');
    }
    if (Number(verifyType) === 0) {
      return _t('kyc.app.verifying.manual');
    }
    return _t('kyc.homepage.describe.verifying');
  }, [fake]);

  return (
    <>
      <StepDesc>{_t('5a1ff894e2854000a49c')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow />

        <MessageWarning>{msgText}</MessageWarning>
      </PIFlowWrapper>
    </>
  );
};
