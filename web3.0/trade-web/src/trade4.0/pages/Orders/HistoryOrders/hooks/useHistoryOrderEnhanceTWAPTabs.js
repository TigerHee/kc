/**
 * Owner: harry.lai@kupotech.com
 */
import { useState, useMemo } from 'react';
import { SPOT } from 'src/trade4.0/meta/const';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';

/** 增强历史委托historyOrderDict配置支持TWAP现货订单Tabs切换 */
export const useHistoryOrderEnhanceTWAPTabs = (historyOrderDict) => {
  const [activeTabKey, setActiveTabKey] = useState(historyOrderDict[0].key);
  const tradeType = useTradeType();
  const isSpot = tradeType === SPOT;

  const currentTabOrderConfig = useMemo(() => {
    // 非现货场景，无twap tab栏， 直接返回公共orderHistory Dict配置
    if (!isSpot) {
      return historyOrderDict[0];
    }
    return historyOrderDict.find((i) => i.key === activeTabKey);
  }, [activeTabKey, isSpot]);

  return {
    currentTabOrderConfig,
    handleTabClick: setActiveTabKey,
    activeTabKey,
  };
};
