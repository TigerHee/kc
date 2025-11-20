import {useMemoizedFn} from 'ahooks';
import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {View} from 'react-native';

import {usePullMyLeadPnlSummary} from '../hooks/usePullMyLeadPnlSummary';
import {useSyncAppLeadInfoUpdate} from '../hooks/useSyncAppLeadInfoUpdate';
import ProfitContent from './ProfitContent';
import TradeListSwitchTab from './TradeListSwitchTab';

const ProfitHeader = forwardRef((props, ref) => {
  const {myCopyFollowersCount} = props;
  const {data: leadSummary, refetch} = usePullMyLeadPnlSummary();
  useSyncAppLeadInfoUpdate({leadSummary});

  const refreshSummaryData = useMemoizedFn(() => {
    return refetch();
  });

  useImperativeHandle(
    ref,
    () => ({
      refreshSummaryData,
    }),
    [refreshSummaryData],
  );

  return (
    <View>
      <ProfitContent leadSummary={leadSummary} />
      <TradeListSwitchTab myCopyFollowersCount={myCopyFollowersCount} />
    </View>
  );
});

export default memo(ProfitHeader);
