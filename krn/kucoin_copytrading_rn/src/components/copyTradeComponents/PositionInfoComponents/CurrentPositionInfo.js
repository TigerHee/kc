import {useMemoizedFn} from 'ahooks';
import {noop} from 'lodash';
import React, {memo, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';

import Card from 'components/Common/Card';
import Descriptions from 'components/Common/Descriptions';
import {gotoLeadTrade} from 'utils/native-router-helper';
import CurrentPositionActionFooter from './components/CurrentPositionActionFooter';
import PositionPnlInfo from './components/PositionPnlInfo';
import TagUserInfoBar from './components/TagUserInfoBar';
import {useMakePositionItems} from './hooks/useMakePositionItems';

const CurrentPositionInfo = ({
  info = {},
  isLeadPosition = false,
  hiddenPositionAction = false,
  positionLeadUserInfo: propPositionLeadUserInfo = false,
  isMyFollowPosition = false,
  // 仓位底部操作按钮（平仓 止盈止损操作后回调）
  positionActionCallback = noop,
  // 头像不可点击 进入详情页 （用于交易员详情页面仓位展示不需要点击）
  avatarNotPress = false,
  // 点击卡片进入带单页（对应 symbol）
  enablePressCardToLead = false,

  //分享海报场景，用于分享海报时的场景区分 需求底部按钮文案
  sharePostScene,
}) => {
  const {pnl, symbol, pnlRatio, traderInfoResponse} = info;

  const {uid} =
    useSelector(state => state.leadInfo.activeLeadSubAccountInfo) || {};
  const currentItems = useMakePositionItems({
    positionInfo: info,
    isHistory: false,
    isLeadPosition,
  });

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
        info={info}
        positionLeadUserInfo={positionLeadUserInfo}
        blockId="myPositionCurrent"
        avatarNotPress={avatarNotPress}
        sharePostScene={sharePostScene}
      />
      <PositionPnlInfo pnl={pnl} pnlRatio={pnlRatio} />
      <Descriptions
        styles={{
          itemStyles: {
            wrap: css`
              margin-bottom: 8px;
            `,
          },
        }}
        items={currentItems}
      />
      {!hiddenPositionAction && (
        <CurrentPositionActionFooter
          isLeadPosition={isLeadPosition}
          needTpSlBtn
          positionInfo={info}
          onPressCallback={positionActionCallback}
        />
      )}
    </Card>
  );
};

export default memo(CurrentPositionInfo);
