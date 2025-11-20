/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import TokenInfo from '@/pages/TokenInfo';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { getCoinInfo } from '@/hooks/common/useCoin';
import { _t } from 'src/utils/lang';
import { MODULES_MAP } from '../moduleConfig';

const Info = React.memo(() => {
  const currentSymbol = useGetCurrentSymbol();
  const baseCoinInfo = getCoinInfo({ symbol: currentSymbol });
  return (
    <TokenInfo
      symbol={baseCoinInfo.currency}
      type={baseCoinInfo.currencyType}
    />
  );
});

export const GROUP_1 = [
  MODULES_MAP.chart,
  MODULES_MAP.depth,
  MODULES_MAP.orderBook,
  MODULES_MAP.recentTrade,
  {
    id: 'tokenInfo',
    renderName: () => _t('bnvhrAUehCQoTZKREpDjyT'),
    getComponent: () => <Info />,
  },
];

export const GROUP_2 = [
  MODULES_MAP.openOrders,
  MODULES_MAP.orderHistory,
  MODULES_MAP.tradeHistory,
  MODULES_MAP.fund,
  MODULES_MAP.realisedPNL,
  MODULES_MAP.BotOrder,
];
