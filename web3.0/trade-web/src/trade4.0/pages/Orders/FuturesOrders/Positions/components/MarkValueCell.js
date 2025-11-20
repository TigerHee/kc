/**
 * Owner: garuda@kupotech.com
 */
import React, { memo } from 'react';

import { _t } from 'utils/lang';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';

import PrettyCurrency from '@/components/PrettyCurrency';

const MarkValueCell = ({ row = {} }) => {
  const { symbol, settleCurrency, isTrialFunds, markValue: MV } = row;
  const { markValue } = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const positionMarkValue = isTrialFunds ? MV : markValue || MV;

  return (
    <div className="mark-value">
      <PrettyCurrency isShort value={positionMarkValue} currency={settleCurrency} />
    </div>
  );
};

export default memo(MarkValueCell);
