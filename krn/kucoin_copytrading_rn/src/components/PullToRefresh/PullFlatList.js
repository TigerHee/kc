import React, {memo, useState} from 'react';

import FlatList from 'components/FlatList';
import {timeoutPromise} from 'utils/helper';
import LoadingHeader from './LoadingHeader';
import PullToRefresh from '.';

export const PullFlatList = memo(props => {
  const {onRefresh, ...otherProps} = props;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        // 超时 10 秒 忽略
        await timeoutPromise(onRefresh(), 10000);
      }
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  return (
    <PullToRefresh
      HeaderComponent={LoadingHeader}
      headerHeight={100}
      refreshTriggerHeight={100}
      refreshingHoldHeight={100}
      refreshing={refreshing}
      onRefresh={handleRefresh}>
      <FlatList {...otherProps} scrollEventThrottle={16} />
    </PullToRefresh>
  );
});
