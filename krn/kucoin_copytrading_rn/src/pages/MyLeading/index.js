import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo, useRef} from 'react';

import {FlatListVisualConfigPropsMap} from 'components/FlatList/constant';
import {PullFlatList} from 'components/PullToRefresh/PullFlatList';
import {useListReachBottomLoadData} from 'hooks/flatList/useListReachBottomLoadData';
import {useDataSource} from './hooks/useDataSource';
import {MyLeadingProviderContainer} from './hooks/useStore';
import MyLeadingRenderCard from './MyLeadingRenderCard';
import MyLeadListEmpty from './MyLeadListEmpty';
import ProfitHeader from './ProfitHeader';
import {MyLeadingListWrap} from './styles';

const MyLeadingFlatList = memo(props => {
  const profitHeaderRef = useRef(null);

  const {
    dataSource,
    onEndReached,
    isLoading,
    myCopyFollowersCount,
    keyExtractor,
    isFetching,
    refetch,
  } = useDataSource();

  const {flatListonEndReached} = useListReachBottomLoadData(
    props,
    onEndReached,
  );

  const handleRefresh = useMemoizedFn(async () => {
    const refetchMyCopySummary =
      profitHeaderRef.current?.refreshSummaryData || (() => Promise.resolve());
    return await Promise.all([refetch(), refetchMyCopySummary()]);
  });

  return useMemo(
    () => (
      <PullFlatList
        loading={isLoading}
        onRefresh={handleRefresh}
        isFetching={isFetching}
        data={dataSource}
        keyExtractor={keyExtractor}
        renderItem={({item}) => (
          <MyLeadingRenderCard info={item} refetchCurList={refetch} />
        )}
        ListHeaderComponent={
          <ProfitHeader
            ref={profitHeaderRef}
            myCopyFollowersCount={myCopyFollowersCount}
          />
        }
        ListEmptyComponent={
          <MyLeadListEmpty loading={isLoading} size={dataSource?.length} />
        }
        onEndReached={flatListonEndReached}
        {...FlatListVisualConfigPropsMap.largeCard}
      />
    ),
    [
      isLoading,
      handleRefresh,
      isFetching,
      dataSource,
      keyExtractor,
      myCopyFollowersCount,
      flatListonEndReached,
    ],
  );
});

const MyLeading = props => {
  return (
    <MyLeadingProviderContainer>
      <MyLeadingListWrap>
        <MyLeadingFlatList {...props} />
      </MyLeadingListWrap>
    </MyLeadingProviderContainer>
  );
};

export default memo(MyLeading);
