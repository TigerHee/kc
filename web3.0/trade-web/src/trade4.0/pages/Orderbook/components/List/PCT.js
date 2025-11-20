/*
 * owner: Clyne@kupotech.com
 */
import { useSelector } from 'dva';
import { useThrottleEffect } from 'ahooks';
import React, { memo, useState } from 'react';
import { CUMULATIVE_TYPE, namespace } from '@/pages/Orderbook/config';
import { Pct } from './style';

// 合约融合，
// 数量宽度百分比 = 当前的amount / 买or卖盘中最大的Amount值
// 深度宽度百分比 = 当前total / 买卖盘中最大的累积数量
const calcPct = ({ amount, total, maxAmount, amountType }) => {
  let result = 0;
  if (amountType === CUMULATIVE_TYPE) {
    result = total ? Math.min(Number(total) / Number(maxAmount), 1) : 0;
  } else { // 数量模式
    result = amount ? Math.min(Number(amount) / Number(maxAmount), 1) : 0;
  }
  return isNaN(result) ? 0 : result;
};

const transitionDuration = 300;

const PCT = memo(({ type, amount, total }) => {
  const amountType = useSelector((state) => state[namespace].amountType);
  const maxAmount = useSelector((state) => state[namespace][`${type}MaxAmount`]);
  const isAnimateEnabled = useSelector((state) => state[namespace].isAnimateEnabled);

  const [pct, setPct] = useState(() => {
    return calcPct({ amount, total, maxAmount, amountType }) || 0;
  });

  useThrottleEffect(
    () => {
      const result = calcPct({ amount, total, maxAmount, amountType });
      setPct(result);
    },
    [amount, total, maxAmount, amountType],
    {
      leading: false,
      wait: transitionDuration,
    },
  );

  return (
    <Pct
      type={type}
      isAnimateEnabled={isAnimateEnabled}
      style={{
        transform: `scaleX(${pct})`,
        transitionDuration: `${transitionDuration}ms`,
      }}
    />
  );
});

export default PCT;
