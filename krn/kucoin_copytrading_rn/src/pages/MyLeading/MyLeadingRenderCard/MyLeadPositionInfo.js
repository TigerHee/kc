import React, {memo} from 'react';
import {useSelector} from 'react-redux';

import CurrentPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/CurrentPositionInfo';
import HistoryPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/HistoryPositionInfo';

export const MyLeadCurrentPositionInfo = memo(props => {
  const {
    avatar,
    nickName,
    configId: leadConfigId,
  } = useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const {refetchCurList, ...others} = props;
  const positionLeadUserInfo = {
    avatarUrl: avatar,
    nickName,
    leadConfigId,
  };

  return (
    <CurrentPositionInfo
      enablePressCardToLead
      isLeadPosition
      positionLeadUserInfo={positionLeadUserInfo}
      positionActionCallback={refetchCurList}
      {...others}
    />
  );
});

export const MyLeadHistoryPositionInfo = memo(props => {
  const {
    avatar,
    nickName,
    configId: leadConfigId,
  } = useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const positionLeadUserInfo = {
    avatarUrl: avatar,
    nickName,
    leadConfigId,
  };
  return (
    <HistoryPositionInfo
      isLeadPosition
      enablePressCardToLead
      positionLeadUserInfo={positionLeadUserInfo}
      {...props}
    />
  );
});
