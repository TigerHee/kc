import {isNil} from 'lodash';
import React, {useMemo} from 'react';
import {getBaseCurrency} from 'site/tenant';

import Descriptions from 'components/Common/Descriptions';
import {ValueText} from 'components/Common/Descriptions/styles';
import useLang from 'hooks/useLang';
import ExtraCard from '../components/ExtraCard';
import {RightTextNumberFormat, RightTextPercent} from './styles';
import {usePullOverViewData} from './usePullOverViewData';

const makeConfigItems = (_t, overViewData) => {
  const {
    aum,
    copyTradingPnl,
    leadPrincipal,
    tradingFrequency,
    profitSharingRatio,
  } = overViewData || {};
  return [
    {
      label: _t('3e17be0948f64000a2da', {symbol: getBaseCurrency()}),
      key: 'leadTraderInvestment',
      tip: _t('3dca165c00974000aa37'),
      children: (
        <ValueText numberOfLines={1}>
          <RightTextNumberFormat isAumNumber>
            {leadPrincipal}
          </RightTextNumberFormat>
        </ValueText>
      ),
    },
    {
      label: _t('8d73446ded454000ae7b', {symbol: getBaseCurrency()}),
      key: 'aum',
      children: (
        <ValueText numberOfLines={1}>
          <RightTextNumberFormat isAumNumber>{aum}</RightTextNumberFormat>
        </ValueText>
      ),
      tip: _t('371bb8d3d9294000aa0e'),
    },
    {
      label: _t('6171e28582e84000a21a', {symbol: getBaseCurrency()}),
      key: 'currentCopyTraderPnL',
      children: (
        <ValueText numberOfLines={1}>
          <RightTextNumberFormat isProfitNumber isPositive>
            {copyTradingPnl}
          </RightTextNumberFormat>
        </ValueText>
      ),
    },
    {
      label: _t('c9e75b81a8324000a85f'),
      key: 'profitSharingRatio',
      children: (
        <ValueText numberOfLines={1}>
          <RightTextPercent>{profitSharingRatio}</RightTextPercent>
        </ValueText>
      ),
    },
    {
      label: _t('964c3c66ea1a4000a1e5'),
      tip: _t('8632761cd63e4000a1ce'),
      key: 'tradeFrequency',
      children: !isNil(tradingFrequency)
        ? _t('b03945df3dcc4000ad3b', {
            x: `${tradingFrequency > 0 ? tradingFrequency : '<1'}`,
          })
        : '-',
    },
  ];
};
const Performance = () => {
  const {overViewData} = usePullOverViewData();
  const {_t} = useLang();
  const items = useMemo(
    () => makeConfigItems(_t, overViewData),
    [_t, overViewData],
  );

  return (
    <ExtraCard
      title={_t('ca58c94697434000a491')}
      tip={_t('7efb342d0c3e4000ae1a')}>
      <Descriptions items={items} />
    </ExtraCard>
  );
};

export default Performance;
