import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {View} from 'react-native';

import {TraderCardUserIc} from 'components/Common/SvgIcon';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import {commonStyles, RowWrap} from 'constants/styles';
import {useGotoProfit} from 'hooks/copyTrade/useGotoProfit';
import useTracker from 'hooks/useTracker';
import {
  AllPersonText,
  ExistPersonText,
  InfoWrap,
  TraderInfoUserIconWrap,
  TraderName,
  TraderOverviewItemWrap,
  userInfoStyles,
} from './styles';

const TraderOverviewItem = ({info, index}) => {
  const {
    nickName,
    leadConfigId,
    avatarUrl,
    maxCopyUserCount,
    currentCopyUserCount,
  } = info || {};
  const {onClickTrack} = useTracker();

  const {gotoProfit} = useGotoProfit();

  const onPressToProfit = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'searchResult',
      locationId: 'result',
      properties: {index},
    });

    gotoProfit(info);
  }, [gotoProfit, leadConfigId]);

  return (
    <TraderOverviewItemWrap onPress={onPressToProfit}>
      <UserAvatar
        styles={userInfoStyles}
        userInfo={{
          avatarUrl,
          nickName,
        }}
      />
      <InfoWrap>
        <TraderName>{nickName}</TraderName>
        <View style={commonStyles.flexRowCenter}>
          <TraderInfoUserIconWrap>
            <TraderCardUserIc />
          </TraderInfoUserIconWrap>
          <RowWrap>
            <ExistPersonText>{currentCopyUserCount}</ExistPersonText>
            <AllPersonText>/</AllPersonText>
            <AllPersonText>{maxCopyUserCount}</AllPersonText>
          </RowWrap>
        </View>
      </InfoWrap>
    </TraderOverviewItemWrap>
  );
};

export default memo(TraderOverviewItem);
