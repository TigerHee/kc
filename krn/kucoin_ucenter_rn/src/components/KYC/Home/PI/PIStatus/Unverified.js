import React from 'react';
import {Button} from '@krn/ui';
import useLang from 'hooks/useLang';
import IdentityIPFlow from 'components/KYC/Home/PI/Common/IdentityIPFlow';
import {StepDesc, PIFlowWrapper, PIFlowDesc, ButtonBox} from '../style';
import {ArrowRight} from '../../VerifyArea';

export default ({onPIVerify}) => {
  const {_t} = useLang();

  return (
    <>
      <StepDesc>{_t('f4ad443067954000a54a')}</StepDesc>
      <PIFlowWrapper isLittleMt={true}>
        <PIFlowDesc>{_t('a251c2923cb54000a15c')}</PIFlowDesc>
        <IdentityIPFlow type="PI" />

        <ButtonBox>
          <Button onPress={onPIVerify} afterIcon={<ArrowRight />}>
            {_t('kyc.homepage.describe.button')}
          </Button>
        </ButtonBox>
      </PIFlowWrapper>
    </>
  );
};
