/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:22:11
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-05 19:11:40
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/HistoryOrders/HistoryOrders/index.js
 * @Description:当前委托列表，包含
 */
import React, { useState, useCallback, useContext } from 'react';
import OrderList from '@/pages/Orders/Common/OrderListCommon';
import { useOrderTypeChange } from '@/pages/Orders/Common/hooks/useOrderTypeChange';
import { WrapperContext } from '@/pages/Orders/HistoryOrders/config';
import { OrderWrapper } from '@/pages/Orders/Common/style';
import { FUTURES } from '@/meta/const';
import FuturesOrderHistory from '@/pages/Orders/FuturesOrders/OrderHistory';
import { _t } from 'utils/lang';
import { historyOrderDict } from '../../Common/OrderConfig';
import FiltersBarArea from './FiltersBarArea';
import { useHistoryOrderProps } from '../hooks/useHistoryOrdersData';
import { useHistoryOrderEnhanceTWAPTabs } from '../hooks/useHistoryOrderEnhanceTWAPTabs';

const HistoryOrders = () => {
  const { tradeType, tabObj, isLogin, currentSymbol } = useHistoryOrderProps();
  const screen = useContext(WrapperContext);
  const { currentTabOrderConfig, activeTabKey, handleTabClick } =
    useHistoryOrderEnhanceTWAPTabs(historyOrderDict);
  const { namespace, ...orderObj } = currentTabOrderConfig;
  useOrderTypeChange(namespace, tabObj, isLogin, tradeType, currentSymbol);
  const [showFilter, setShowFilter] = useState(false);

  let activeHideOther = false;
  if (tabObj[namespace]?.symbol) {
    activeHideOther = true;
  } else {
    activeHideOther = false;
  }

  const handleFilterShow = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  return (
    <OrderWrapper>
      <FiltersBarArea
        handleFilterShow={handleFilterShow}
        screen={screen}
        activeHideOther={activeHideOther}
        namespace={namespace}
        tabs={historyOrderDict}
        activeTabKey={activeTabKey}
        handleTabClick={handleTabClick}
        tradeType={tradeType}
      />
      {tradeType === FUTURES ? (
        <FuturesOrderHistory />
      ) : (
        <OrderList {...orderObj} namespace={namespace} screen={screen} showFilter={showFilter} />
      )}
    </OrderWrapper>
  );
};

export default React.memo(HistoryOrders);
