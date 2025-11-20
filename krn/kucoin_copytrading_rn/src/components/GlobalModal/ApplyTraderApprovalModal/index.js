import React, {memo} from 'react';
import {Button, Confirm} from '@krn/ui';

import modalBgImg from 'assets/applyTrade/approve-pass-modal-bg.png';
import modalTopImg from 'assets/applyTrade/approve-pass-modal-top.png';
import {ContentWrap, Desc, Title, TopImage} from './styles';

const Content = ({gotoTradePage}) => {
  return (
    <ContentWrap source={modalBgImg}>
      <TopImage source={modalTopImg} />
      <Title>Congratulation</Title>
      <Desc>You have become a trading expert</Desc>
      <Button onPress={gotoTradePage}>TradeNow</Button>
    </ContentWrap>
  );
};

const ApplyTraderApprovalModal = ({visible, onClose}) => {
  const gotoTradePage = () => {
    //TODO
    onClose();
  };

  return (
    <Confirm show={visible} onClose={onClose} showCloseX>
      <Content gotoTradePage={gotoTradePage} />
    </Confirm>
  );
};

export default memo(ApplyTraderApprovalModal);
