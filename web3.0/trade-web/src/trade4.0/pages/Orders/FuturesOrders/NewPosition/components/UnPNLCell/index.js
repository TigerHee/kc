/**
 * Owner: clyne@kupotech.com
 */

import React, { memo, useMemo } from 'react';

import Decimal from 'decimal.js';

import { siteCfg } from 'config';

import SafeLink from 'src/components/SafeLink';
import { greaterThan } from 'utils/operation';

import Text from '@/components/Text';
import {
  PrettyCurrency,
  toPercent,
  styled,
  fx,
  useGetPositionCalcData,
  useI18n,
} from '@/pages/Futures/import';

import { POS_ROE, useShowFallback } from '@/pages/Orders/FuturesOrders/hooks/useShowFallback';

const UnRNLCellWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  white-space: normal;
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
  >span {
    margin-right: 2px;
  }
`;

const ContentWrapper = styled.div`
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
`;

const UnRNLCell = ({ row = {} }) => {
  const { _t } = useI18n();
  const { unrealisedPnl, settleCurrency, unrealisedRoePcnt, isTrialFunds, symbol, marginMode } =
    row || {};
  const calcData = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const unPnl = isTrialFunds ? unrealisedPnl : calcData?.unPnl || '-';
  const ROE = isTrialFunds ? unrealisedRoePcnt : calcData?.ROE || '-';
  const color = greaterThan(unPnl)(0) ? 'primary' : 'secondary';
  const roeText = useShowFallback({
    marginMode,
    value: ROE !== '-' ? toPercent(ROE, 2, false, Decimal.ROUND_DOWN, true) : '-',
    type: POS_ROE,
  });

  return (
    <UnRNLCellWrapper color={color} className="sm-item">
      <ContentWrapper color={color}>
        <PrettyCurrency isShort value={unPnl} currency={settleCurrency} />
      </ContentWrapper>
      <span>{`(${roeText})`}</span>
    </UnRNLCellWrapper>
  );
};

export default memo(UnRNLCell);
