import {useMemoizedFn} from 'ahooks';
import React, {memo, useMemo, useRef} from 'react';

import {PullFlatList} from 'components/PullToRefresh/PullFlatList';
import {useListReachBottomLoadData} from 'hooks/flatList/useListReachBottomLoadData';
import {MyCopyUnLoginEmptyHocWrap} from './components/MyCopyUnLoginEmpty';
import {useDataSource} from './hooks/useDataSource';
import {MyCopiesProviderContainer} from './hooks/useStore';
import CopyProfitHeader from './CopyProfitHeader';
import MyCopyRenderCard from './MyCopyRenderCard';
import {MyCopiesListWrap} from './styles';

const MyCopiesFlatList = memo(props => {
  const profitHeaderRef = useRef(null);

  const {
    dataSource,
    onEndReached,
    isLoading,
    isFetching,
    keyExtractor,
    refetch,
  } = useDataSource();

  const {flatListonEndReached} = useListReachBottomLoadData(
    props,
    onEndReached,
  );

  const handleRefresh = useMemoizedFn(async () => {
    const refetchMyLeadSummary =
      profitHeaderRef.current?.refreshSummaryData || (() => Promise.resolve());
    return await Promise.all([refetch(), refetchMyLeadSummary()]);
  });

  return useMemo(
    () => (
      <MyCopyUnLoginEmptyHocWrap>
        <PullFlatList
          onRefresh={handleRefresh}
          loading={isLoading}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          data={dataSource}
          keyExtractor={keyExtractor}
          renderItem={({item}) => (
            <MyCopyRenderCard info={item} refetchCurList={refetch} />
          )}
          ListHeaderComponent={<CopyProfitHeader ref={profitHeaderRef} />}
          onEndReached={flatListonEndReached}
          isFetching={isFetching}
        />
      </MyCopyUnLoginEmptyHocWrap>
    ),
    [
      dataSource,
      flatListonEndReached,
      handleRefresh,
      isFetching,
      isLoading,
      keyExtractor,
    ],
  );
});

const MyCopies = props => {
  return (
    <MyCopiesProviderContainer>
      <MyCopiesListWrap>
        <MyCopiesFlatList {...props} />
      </MyCopiesListWrap>
    </MyCopiesProviderContainer>
  );
};

export default memo(MyCopies);
