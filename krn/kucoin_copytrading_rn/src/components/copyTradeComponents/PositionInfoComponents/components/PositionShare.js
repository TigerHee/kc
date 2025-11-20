import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';

import {ShareIcon} from 'components/Common/SvgIcon';
import {largeHitSlop} from 'constants/index';
import {useMakePositionSharePayload} from '../hooks/useMakePositionSharePayload';

const PositionShare = ({
  blockId,
  info,
  positionLeadUserInfo,
  isMyFollowPosition,
  //分享海报场景，用于分享海报时的场景区分 需求底部按钮文案
  sharePostScene,
}) => {
  const {onSharePosition} = useMakePositionSharePayload({
    info,
    positionLeadUserInfo,
    isMyFollowPosition,
    blockId,
    sharePostScene,
  });

  return (
    <TouchableOpacity
      hitSlop={largeHitSlop}
      activeOpacity={0.8}
      onPress={onSharePosition}>
      <ShareIcon />
    </TouchableOpacity>
  );
};

export default memo(PositionShare);
