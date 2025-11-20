import React, {memo} from 'react';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {useMakeOptions} from './useMakeOptions';

const LineChart = ({totalPnlDate}) => {
  const options = useMakeOptions({totalPnlDate});

  return <DynamicEcharts option={options} width={'120px'} height={'50px'} />;
};

export default memo(LineChart);
