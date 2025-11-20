import React from 'react';
import {openNative} from '@krn/bridge';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {PIFlowWrapper, PIFlowTitle, ButtonBox} from '../style';
import OutlinedButton from 'components/KYC/Home/PI/Common/OutlinedButton';

export default ({trackStatus}) => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const onDeposit = () => {
    onClickTrack({
      blockId: 'Deposit',
      locationId: '1',
      properties: {
        kyc_homepage_status: trackStatus,
      },
    });
    openNative('/account/deposit');
  };

  return (
    <PIFlowWrapper isLittleMt={true}>
      <PIFlowTitle>{_t('ea30c66967424000ad95')}</PIFlowTitle>
      <ButtonBox>
        <OutlinedButton onPress={onDeposit}>
          {_t('kyc.homepage.verified.button')}
        </OutlinedButton>
      </ButtonBox>
    </PIFlowWrapper>
  );
};
