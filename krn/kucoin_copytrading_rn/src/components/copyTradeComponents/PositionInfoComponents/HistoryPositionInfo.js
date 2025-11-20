import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';

import Card from 'components/Common/Card';
import Descriptions from 'components/Common/Descriptions';
import {gotoLeadTrade} from 'utils/native-router-helper';
import TagUserInfoBar from './components/TagUserInfoBar';
import {useMakePositionItems} from './hooks/useMakePositionItems';

const HistoryPositionInfo = ({
  info = {},

  positionLeadUserInfo: propPositionLeadUserInfo = false,
  isCopying,
  isMyFollowPosition = false,
  // 头像不可点击 进入详情页 （用于交易员详情页面仓位展示不需要点击）
  avatarNotPress = false,
  // 点击卡片进入带单页（对应 symbol）
  enablePressCardToLead = false,
  //分享海报场景，用于分享海报时的场景区分 需求底部按钮文案
  sharePostScene,
}) => {
  const historyItems = useMakePositionItems({
    positionInfo: info,
    isHistory: true,
  });
  const {uid} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};

  const {traderInfoResponse, symbol} = info || {};

  const positionLeadUserInfo = useMemo(() => {
    if (propPositionLeadUserInfo) {
      return propPositionLeadUserInfo;
    }
    const {avatarUrl, nickName, leadConfigId} = traderInfoResponse || {};
    return {
      avatarUrl,
      nickName,
      leadConfigId,
    };
  }, [propPositionLeadUserInfo, traderInfoResponse]);

  const onPressCard = useMemoizedFn(() => {
    if (!enablePressCardToLead) return;
    gotoLeadTrade(uid, {symbol});
  });

  return (
    <Card onPress={onPressCard}>
      <TagUserInfoBar
        isMyFollowPosition={isMyFollowPosition}
        isHistory
        blockId="myPositionHistory"
        info={info}
        isCopying={isCopying}
        positionLeadUserInfo={positionLeadUserInfo}
        avatarNotPress={avatarNotPress}
        sharePostScene={sharePostScene}
      />

      <Descriptions
        styles={{
          itemStyles: {
            wrap: css`
              margin-bottom: 8px;
            `,
          },
        }}
        items={historyItems}
      />
    </Card>
  );
};

export default memo(HistoryPositionInfo);
