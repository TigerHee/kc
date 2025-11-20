import React from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import FlatList from 'components/FlatList';
import {useDataSource} from './hooks/useDataSource';
import FollowerTopBar from './ProfitHeader/TradeListSwitchTab/FollowerTopBar';
import MyFollowerItem from './MyFollowerItem';

export const SharingList = ({isShowCumulativeProfit}) => {
  const {dataSource, myCopyFollowersCount, isLoading, onEndReached} =
    useDataSource({
      isShowCumulativeProfit,
    });
  return (
    <View
      style={css`
        flex: 1;
      `}>
      <FollowerTopBar myCopyFollowersCount={myCopyFollowersCount} />
      <FlatList
        style={css`
          flex: 1;
          background-color: red;
        `}
        initialNumToRender={5}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index}`}
        onEndReached={onEndReached}
        loading={isLoading}
        data={dataSource}
        renderItem={({item}) => (
          <MyFollowerItem
            isShowCumulativeProfit={isShowCumulativeProfit}
            data={item}
          />
        )}
      />
    </View>
  );
};
