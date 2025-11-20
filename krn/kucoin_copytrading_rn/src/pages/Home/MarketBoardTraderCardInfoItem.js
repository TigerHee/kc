import React, {memo} from 'react';

import TraderInfoCard from 'components/copyTradeComponents/TraderInfoComponents/TraderInfoCard';
import {CardBottomBg, MarketBoardTraderCardWrap} from './styles';

const MarketBoardTraderCardInfoItem = props => {
  const {info} = props;

  return (
    <MarketBoardTraderCardWrap>
      <TraderInfoCard
        showLeadAmount
        info={info}
        pageId="B20CopyTradeCopyTradeMain"
        homeNewUI
      />
      <CardBottomBg />
    </MarketBoardTraderCardWrap>
  );
};

export default memo(MarketBoardTraderCardInfoItem);
