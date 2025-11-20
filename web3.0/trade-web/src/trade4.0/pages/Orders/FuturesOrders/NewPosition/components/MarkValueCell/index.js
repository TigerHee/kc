/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';
import { useGetPositionCalcData, PrettyCurrency } from '@/pages/Futures/import';
import { abs } from 'src/utils/operation';

const MarkValueCell = ({ row = {} }) => {
  const { symbol, settleCurrency, isTrialFunds, markValue: MV } = row;
  const { markValue } = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const positionMarkValue = isTrialFunds ? MV : markValue || MV;
  return (
    <div className="mark-value">
      <PrettyCurrency isShort value={abs(positionMarkValue).toString()} currency={settleCurrency} />
    </div>
  );
};

export default memo(MarkValueCell);
