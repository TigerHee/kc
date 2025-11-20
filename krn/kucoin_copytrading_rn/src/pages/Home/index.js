import {useMemoizedFn, useSetState} from 'ahooks';
import React, {memo, useRef} from 'react';

import {FlatListVisualConfigPropsMap} from 'components/FlatList/constant';
import {PullFlatList} from 'components/PullToRefresh/PullFlatList';
import {useListReachBottomLoadData} from 'hooks/flatList/useListReachBottomLoadData';
import {useDataSource} from './hooks/useDataSource';
import ContentListHeader from './HomeContentListHeader';
import MarketBoardTraderCardInfoItem from './MarketBoardTraderCardInfoItem';
import {HomeWrap} from './styles';
import TopArea from './TopArea';
import TraderInfoListFilterBar from './TraderInfoListFilterBar';

const Home = props => {
  const [formState, updateFormState] = useSetState({
    sort: 'ranking_score', // 默认综合排序
  });

  const {dataSource, isLoading, onEndReached, isFetching} = useDataSource({
    formState,
  });

  const {flatListonEndReached} = useListReachBottomLoadData(
    props,
    onEndReached,
  );

  const topAreaRef = useRef(null);
  const handleRefresh = useMemoizedFn(async () => {
    await topAreaRef.current?.refreshSummaryData?.();
  });

  return (
    <HomeWrap>
      <PullFlatList
        onEndReached={flatListonEndReached}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={true}
        keyExtractor={(item, index) =>
          `${item?.nickName}_${item?.daysAsLeader}_${index}` || index
        }
        renderItem={({item}) => <MarketBoardTraderCardInfoItem info={item} />}
        ListHeaderComponent={
          <ContentListHeader
            formState={formState}
            updateFormState={updateFormState}
            topArea={<TopArea ref={topAreaRef} />}>
            <TraderInfoListFilterBar
              formState={formState}
              updateFormState={updateFormState}
            />
          </ContentListHeader>
        }
        loading={isLoading}
        isFetching={isFetching}
        data={dataSource}
        {...FlatListVisualConfigPropsMap.largeCard}
      />
    </HomeWrap>
  );
};

export default memo(Home);
