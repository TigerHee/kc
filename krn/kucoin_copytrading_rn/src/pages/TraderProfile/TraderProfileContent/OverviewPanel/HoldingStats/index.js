import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import CheckEmpty from '../components/CheckEmpty';
import DatePicker from '../components/DatePicker';
import ExtraCard from '../components/ExtraCard';
import HoldingScatter from './HoldingScatter';
import {usePullDistributionData} from './usePullHoldStats';

const HoldingStats = () => {
  const {isLoading, distributionData, period, onChangePeriod} =
    usePullDistributionData();
  const {_t} = useLang();
  return (
    <ExtraCard
      style={css`
        padding: 16px 0;
      `}
      titleWrapStyle={css`
        max-width: 58%;
      `}
      titleStyle={css`
        padding: 0 16px;
      `}
      title={_t('7f7183468ba94000af91')}
      tip={_t('ca4207572c9a4000a7cb')}
      rightNode={<DatePicker value={period} onChange={onChangePeriod} />}>
      <CheckEmpty isLoading={isLoading} isEmpty={isEmpty(distributionData)}>
        <HoldingScatter distributionData={distributionData} />
      </CheckEmpty>
    </ExtraCard>
  );
};

export default HoldingStats;
