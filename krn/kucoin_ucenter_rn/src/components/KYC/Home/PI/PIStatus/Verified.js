import React from 'react';
import {openNative} from '@krn/bridge';
import useLang from 'hooks/useLang';
import {PIFlowWrapper, PIFlowTitle, ButtonBox} from '../style';
import OutlinedButton from 'components/KYC/Home/PI/Common/OutlinedButton';

export default () => {
  const {_t} = useLang();

  const onTrade = () => {
    openNative('/kumex/trade');
  };

  return (
    <PIFlowWrapper isLittleMt={true}>
      <PIFlowTitle>{_t('3ff88d144e9c4000ae2c')}</PIFlowTitle>
      <ButtonBox>
        <OutlinedButton onPress={onTrade}>
          {_t('b25a376c082f4000a1ab')}
        </OutlinedButton>
      </ButtonBox>
    </PIFlowWrapper>
  );
};
