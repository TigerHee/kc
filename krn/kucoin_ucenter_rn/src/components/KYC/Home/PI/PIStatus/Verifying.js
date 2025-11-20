import React, {useMemo} from 'react';
import useLang from 'hooks/useLang';
import IdentityIPFlow from 'components/KYC/Home/PI/Common/IdentityIPFlow';
import {StepDesc, PIFlowWrapper, PIFlowDesc} from '../style';
import {MessageWarning} from '../../VerifyArea';

export default () => {
  const {_t} = useLang();

  const msgText = useMemo(() => {
    return _t('kyc.homepage.describe.verifying');
  }, []);

  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />

        <MessageWarning>{msgText}</MessageWarning>
      </PIFlowWrapper>
    </>
  );
};
