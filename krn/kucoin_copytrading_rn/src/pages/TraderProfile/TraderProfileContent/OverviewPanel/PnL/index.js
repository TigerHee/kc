import isEmpty from 'lodash/isEmpty';
import React, {memo} from 'react';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import CheckEmpty from '../components/CheckEmpty';
import ExtraCard from '../components/ExtraCard';
import ProfitAndRangeFilterBar from './ProfitAndRangeFilterBar';
import ProfitLineChart from './ProfitLineChart';
import ProfitRateSwitch from './ProfitRateSwitch';
import {usePullPnl} from './usePullPnl';

const PnL = () => {
  const {isLoading, pnlList, state, onChangeShowType, onChangePeriod} =
    usePullPnl();
  const {showType, period} = state;
  const latestPnlInfo = pnlList?.[pnlList?.length - 1] || {};
  const {_t} = useLang();

  return (
    <ExtraCard
      style={css`
        padding: 16px 0;
      `}
      title={_t('04dd5c384d3c4000ab23')}
      titleWrapStyle={css`
        max-width: 56%;
      `}
      titleStyle={css`
        padding: 0 16px;
      `}
      tip={_t('6503d455fe164000aadf')}
      rightNode={
        <ProfitRateSwitch value={showType} onChange={onChangeShowType} />
      }>
      <ProfitAndRangeFilterBar
        latestPnlInfo={latestPnlInfo}
        showType={showType}
        period={period}
        onChangePeriod={onChangePeriod}
      />
      <CheckEmpty isLoading={isLoading} isEmpty={isEmpty(pnlList)}>
        <ProfitLineChart pnlList={pnlList} showType={showType} />
      </CheckEmpty>
    </ExtraCard>
  );
};

export default memo(PnL);
