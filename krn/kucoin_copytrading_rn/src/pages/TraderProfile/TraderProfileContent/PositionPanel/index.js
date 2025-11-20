import {usePullSummaryQuery} from 'pages/TraderProfile/hooks/usePullSummaryQuery';
import React, {memo, useMemo, useState} from 'react';

import CurrentPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/CurrentPositionInfo';
import HistoryPositionInfo from 'components/copyTradeComponents/PositionInfoComponents/HistoryPositionInfo';
import FlatList from 'components/FlatList';
import {SharePostSceneType} from 'hooks/copyTrade/useShare/constant';
import {useListReachBottomLoadData} from 'hooks/flatList/useListReachBottomLoadData';
import {PanelWrap} from '../components';
import {RANGE_LIST_TYPE} from '../constant';
import RangeTabs from './RangeTabs';
import {useDataSource} from './useDataSource';

const PositionItem = memo(({rangeValue, info, positionLeadUserInfo}) => {
  if (rangeValue === RANGE_LIST_TYPE.current) {
    return (
      <CurrentPositionInfo
        isLeadPosition
        positionLeadUserInfo={positionLeadUserInfo}
        info={info}
        hiddenPositionAction
        avatarNotPress
        sharePostScene={SharePostSceneType.Common}
      />
    );
  }

  return (
    <HistoryPositionInfo
      isLeadPosition
      positionLeadUserInfo={positionLeadUserInfo}
      info={info}
      avatarNotPress
      sharePostScene={SharePostSceneType.Common}
    />
  );
});

const PositionPanel = props => {
  const [rangeValue, setRangeValue] = useState(RANGE_LIST_TYPE.current);
  const {dataSource, onEndReached, isLoading} = useDataSource({rangeValue});
  const {data: summaryDataResp} = usePullSummaryQuery();

  const positionLeadUserInfo = useMemo(() => {
    const {avatar, nickName, leadConfigId} = summaryDataResp?.data || {};
    return {
      avatarUrl: avatar,
      nickName,
      leadConfigId,
    };
  }, [summaryDataResp]);

  const {flatListonEndReached} = useListReachBottomLoadData(
    props,
    onEndReached,
  );
  return (
    <PanelWrap>
      <FlatList
        onEndReached={flatListonEndReached}
        loading={isLoading}
        initialNumToRender={5}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
        data={dataSource}
        scrollEnabled={false}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({item}) => (
          <PositionItem
            positionLeadUserInfo={positionLeadUserInfo}
            rangeValue={rangeValue}
            info={item}
          />
        )}
        ListHeaderComponent={
          <RangeTabs
            rangeValue={rangeValue}
            handleRangeChange={setRangeValue}
          />
        }
      />
    </PanelWrap>
  );
};

export default memo(PositionPanel);
