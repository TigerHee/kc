/**
 * Owner: garuda@kupotech.com
 * 有仓位时，杠杆对应风险限额的最大可开
 */

import React, { useMemo } from 'react';

import PrettyCurrency from '@/components/PrettyCurrency';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import {
  useRiskLimit,
} from '@/hooks/futures/useGetUserFuturesInfo';
import { _t, styled, FUTURES } from '@/pages/Futures/import';

import { findRiskLimitItem } from './utils';

const TipBox = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${(props) => props.theme.colors.primary};
  }
  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text60};
  }
  .value {
    margin-left: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
`;
const MaxOpenTip = ({ leverage, symbol }) => {
  const { riskLimits } = useRiskLimit();
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const maxRiskLimit = useMemo(() => {
    if (!riskLimits?.length) return false;
    const findItem = findRiskLimitItem(riskLimits, leverage);
    return findItem?.maxRiskLimit;
  }, [leverage, riskLimits]);

  return (
    <TipBox>
      <span className="label">{_t('risk.limit.leverageLimit')}</span>
      <span className="value">
        {maxRiskLimit ? (
          <PrettyCurrency isShort value={maxRiskLimit} currency={symbolInfo?.settleCurrency} />
        ) : (
          '--'
        )}
      </span>
    </TipBox>
  );
};

export default React.memo(MaxOpenTip);
