import React, {memo} from 'react';

import DynamicEcharts from 'components/Common/DynamicEcharts';
import {convertPxToReal} from 'utils/computedPx';
import {useMakeOptions} from './useMakeOptions';

const HoldingScatter = ({distributionData}) => {
  const option = useMakeOptions({
    distributionData,
  });

  return (
    <DynamicEcharts
      option={option}
      width={convertPxToReal(343)}
      height={convertPxToReal(220)}
    />
  );
};

export default memo(HoldingScatter);
