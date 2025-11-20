import React, {memo, useMemo} from 'react';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {windowWidth} from 'constants/styles';
import {useMakeMainPageProfitLineConfig} from 'hooks/copyTrade/charts/useMakeMainPageProfitLineConfig';
import {convertPxToReal} from 'utils/computedPx';
import {safeArray} from 'utils/helper';

const MyLeadingBannerLineChart = ({pnlList}) => {
  const safePnlList = safeArray(pnlList);
  const xData = useMemo(
    () =>
      safePnlList.map(item => {
        const date = parseInt(item.statisticsAt, 10);
        return date;
      }) || {},
    [safePnlList],
  );

  const yData = useMemo(
    () =>
      safePnlList.map(item => {
        const pnl = parseFloat(item.pnl);
        return isNaN(pnl) ? 0 : pnl;
      }) || [],
    [safePnlList],
  );

  const option = useMakeMainPageProfitLineConfig({
    xData,
    yData,
  });

  return (
    <DynamicEcharts
      option={option}
      // 屏幕宽带减去两边间距16px
      width={windowWidth - 32}
      height={convertPxToReal(137)}
    />
  );
};

export default memo(MyLeadingBannerLineChart);
