import {useMemoizedFn} from 'ahooks';
import {usePullMyCopyPnlSummary} from 'pages/MyCopies/hooks/usePullMyCopyPnlSummary';
import {usePullMyLeadPnlSummary} from 'pages/MyLeading/hooks/usePullMyLeadPnlSummary';
import React, {forwardRef, memo, useImperativeHandle} from 'react';
import {useSelector} from 'react-redux';

import CopyTradeProfit from './TopAreaContent/CopyTradeProfit';
import LeadTradeProfit from './TopAreaContent/LeadTradeProfit';
import {TopAreaContentWrapper} from './styles';

const TopArea = forwardRef((_props, ref) => {
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);
  const {data: myCopySummaryData, refetch: refetchMyCopySummary} =
    usePullMyCopyPnlSummary();
  const {data: myLeadSummaryData, refetch: refetchMyLeadSummary} =
    usePullMyLeadPnlSummary();

  const refreshSummaryData = useMemoizedFn(async () => {
    return await Promise.all([refetchMyCopySummary(), refetchMyLeadSummary()]);
  });

  useImperativeHandle(
    ref,
    () => ({
      refreshSummaryData,
    }),
    [refreshSummaryData],
  );

  return (
    <TopAreaContentWrapper>
      {isLeadTrader ? (
        <LeadTradeProfit
          summaryData={myLeadSummaryData}
          myCopySummaryData={myCopySummaryData}
        />
      ) : (
        <CopyTradeProfit summaryData={myCopySummaryData} />
      )}
    </TopAreaContentWrapper>
  );
});

export default memo(TopArea);
