import {useMemoizedFn} from 'ahooks';
import React, {forwardRef, memo, useImperativeHandle} from 'react';

import {usePullMyCopyPnlSummary} from '../hooks/usePullMyCopyPnlSummary';
import CopyProfitContent from './CopyProfitContent';
import {CopyProfitHeaderWrap} from './styles';
import TradeListSwitchTab from './TradeListSwitchTab';

const CopyProfitHeader = forwardRef((_props, ref) => {
  const {data: copySummary, refetch} = usePullMyCopyPnlSummary();
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
    <CopyProfitHeaderWrap>
      <CopyProfitContent copySummary={copySummary} />
      <TradeListSwitchTab />
    </CopyProfitHeaderWrap>
  );
});

export default memo(CopyProfitHeader);
