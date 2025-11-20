/**
 * Owner: Clyne@kupotech.com
 */

import React, { memo } from 'react';

import { useGetLeverage } from 'src/trade4.0/hooks/futures/useLeverage';
import { floadToPercent, formatNumber } from 'src/trade4.0/utils/format';
import { greaterThan, lessThan } from 'utils/operation';

import Text from '@/components/Text';
import { getIMR, getMMR } from '@/hooks/futures/useCalcData';
import { calcIsolatedRiskRate } from '@/pages/Futures/calc';
import { Decimal, _t, fx, styled, toPercent, useGetRiskRate } from '@/pages/Futures/import';

import { POS_RISK_RATE, useShowFallback } from '../../../hooks/useShowFallback';

import { CROSS } from '../../config';

const OverLayWrapper = styled.div`
  .item-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name {
      color: ${(props) => {
        return fx.color(props, props.theme.colors.mode === 'light' ? 'textEmphasis' : 'text60');
      }};
    }
    .value {
      color: ${(props) => {
        return fx.color(props, props.theme.colors.mode === 'light' ? 'textEmphasis' : 'text');
      }};
    }
    .name + .value {
      padding-left: 20px;
    }
  }
  .item-box + .item-box {
    margin-top: 4px;
  }
`;

const OverLay = ({ symbol, marginMode }) => {
  const leverage = useGetLeverage({ symbol, marginMode });
  const MMR = getMMR(symbol);
  const IMR = getIMR({ symbol, leverage });

  const IMRText = formatNumber(IMR, { pointed: true, round: Decimal.ROUND_UP, fixed: 4 });
  const MMRText = formatNumber(MMR, { pointed: true, round: Decimal.ROUND_UP, fixed: 4 });
  const options = { isPositive: false, precision: 2, dropZ: false };
  return (
    <OverLayWrapper>
      <div className="item-box">
        <div className="name">{`${_t('risk.limit.initialMargin')}(IMR)`}</div>
        <div className="value">{floadToPercent(IMRText, options)}</div>
      </div>
      <div className="item-box">
        <div className="name">{`${_t('risk.limit.maintainMargin')}(MMR)`}</div>
        <div className="value">{floadToPercent(MMRText, options)}</div>
      </div>
    </OverLayWrapper>
  );
};

const RiskRate = ({ row }) => {
  const { symbol, marginMode, isTrialFunds, maintMargin, posMaint } = row;
  let rate = useGetRiskRate(symbol, marginMode);
  const text = useShowFallback({
    marginMode,
    value: rate,
    type: POS_RISK_RATE,
  });
  if (isTrialFunds) {
    rate = calcIsolatedRiskRate({
      isolatedTotalMargin: maintMargin,
      isolatedMM: posMaint,
    });
  }
  if (rate === undefined || text === '--') {
    return '--';
  }
  if (lessThan(rate)(0)) {
    rate = 1;
  }
  const rateText = toPercent(rate, 2, false, Decimal.ROUND_UP);

  // 全仓展示IMR，MMR
  if (marginMode === CROSS) {
    return (
      <Text cursor="help" tips={<OverLay symbol={symbol} marginMode={marginMode} />}>
        <div className="text-color">{rateText}</div>
      </Text>
    );
  }

  return <div className="text-color">{rateText}</div>;
};

export default memo(RiskRate);
