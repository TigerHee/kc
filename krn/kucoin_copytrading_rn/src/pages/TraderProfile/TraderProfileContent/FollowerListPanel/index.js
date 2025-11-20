import React, {memo} from 'react';

import FlatList from 'components/FlatList';
import {FlatListVisualConfigPropsMap} from 'components/FlatList/constant';
import {useListReachBottomLoadData} from 'hooks/flatList/useListReachBottomLoadData';
import {PanelWrap} from '../components';
import ListTopBar from './ListTopBar';
import MyFollowerItem from './MyFollowerItem';
import {useDataSource} from './useDataSource';

const FollowerListPanel = props => {
  const {dataSource, onEndReached, isLoading} = useDataSource();
  const {flatListonEndReached} = useListReachBottomLoadData(
    props,
    onEndReached,
  );

  return (
    <PanelWrap>
      <FlatList
        initialNumToRender={5}
        loading={isLoading}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
        data={dataSource}
        scrollEnabled={false}
        onEndReached={flatListonEndReached}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(item, idx) =>
          `${item?.nickName}_${item?.uid}_${item.no}` || idx
        }
        ListHeaderComponent={<ListTopBar />}
        renderItem={({item}) => <MyFollowerItem data={item} />}
        {...FlatListVisualConfigPropsMap.smallCard}
      />
    </PanelWrap>
  );
};

export default memo(FollowerListPanel);
