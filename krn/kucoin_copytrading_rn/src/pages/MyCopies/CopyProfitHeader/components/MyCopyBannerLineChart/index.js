import React, {memo} from 'react';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {windowWidth} from 'constants/styles';
import {useMakeMainPageProfitLineConfig} from 'hooks/copyTrade/charts/useMakeMainPageProfitLineConfig';
import {convertPxToReal} from 'utils/computedPx';

const MyCopyBannerLineChart = ({pnlDateList}) => {
  const option = useMakeMainPageProfitLineConfig({
    xData: pnlDateList?.map(i => i.date) || [],
    yData: pnlDateList?.map(i => i.totalPnl) || [],
  });

  return (
    <DynamicEcharts
      option={option}
      width={windowWidth - 32}
      height={convertPxToReal(137)}
    />
  );
};

export default memo(MyCopyBannerLineChart);
