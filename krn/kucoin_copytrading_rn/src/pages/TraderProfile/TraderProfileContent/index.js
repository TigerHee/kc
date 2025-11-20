import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo} from 'react';
import {css} from '@emotion/native';

import ScrollableTabView from 'components/ScrollableTabView';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import {ProfileTabIdx2TrackIdMap} from './constant';
import FollowerListPanel from './FollowerListPanel';
import OverviewPanel from './OverviewPanel';
import PositionPanel from './PositionPanel';

const TraderProfileContent = props => {
  const {bannerContent = null} = props;
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const onTabChangeTrack = useMemoizedFn(idx => {
    onClickTrack({
      blockId: 'button',
      locationId: ProfileTabIdx2TrackIdMap[idx],
    });
  });

  const stacks = useMemo(
    () => [
      {screen: OverviewPanel, tabLabel: _t('6d6c1cb79e414000a155')},
      {
        screen: PositionPanel,
        tabLabel: _t('8a730b6974294000af53'),
      },
      {screen: FollowerListPanel, tabLabel: _t('b81f6a03d5574000ae53')},
    ],
    [_t],
  );

  return (
    <ScrollableTabView
      tabsOuterWrapStyle={css`
        background-color: #121212;
      `}
      onTabChange={onTabChangeTrack}
      stacks={stacks}
      header={bannerContent}
    />
  );
};

export default memo(TraderProfileContent);
