import React, {memo} from 'react';

import CurrentPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/CurrentPositionInfo';
import HistoryPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/HistoryPositionInfo';

export const MyCopyCurrentPositionInfo = memo(props => {
  const {refetchCurList, ...others} = props;

  return (
    <CurrentPositionInfo
      isMyFollowPosition
      positionActionCallback={refetchCurList}
      {...others}
    />
  );
});

export const MyCopyHistoryPositionInfo = memo(props => {
  return <HistoryPositionInfo isMyFollowPosition {...props} />;
});
