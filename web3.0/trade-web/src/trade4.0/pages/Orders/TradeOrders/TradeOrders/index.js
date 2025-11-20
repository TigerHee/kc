/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:22:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-12-13 16:52:05
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/TradeOrders/TradeOrders/index.js
 * @Description:当前委托列表，包含
 */
import React, { useState, useCallback, useContext } from 'react';
import useShowMarginMask from '@/hooks/useShowMarginMask';

import { dealDetailOrderDict as orderDict } from '@/pages/Orders/Common/OrderConfig';
import OrderList from '@/pages/Orders/Common/OrderListCommon';
import FuturesTradeHistory from '@/pages/Orders/FuturesOrders/TradeHistory';
import { _t } from 'utils/lang';
import { useTradeOrderProps } from '../hooks/useTradeOrdersData';
import { WrapperContext } from '@/pages/Orders/TradeOrders/config';
import { OrderWrapper, OrderMaskWraperWrapper } from '@/pages/Orders/Common/style';
import { useOrderTypeChange } from '@/pages/Orders/Common/hooks/useOrderTypeChange';
import { FUTURES } from '@/meta/const';
import FiltersBar from '@/pages/Orders/Common/OrderListCommon/FiltersBar';
import { SYMBOL_FILTER_ENUM } from '../../FuturesOrders/config';

const { namespace, ...orderObj } = orderDict[0];

const TradeOrders = () => {
  const { tradeType, tabObj, isLogin, currentSymbol } = useTradeOrderProps();
  console.log(tradeType, 'tradeType');
  const screen = useContext(WrapperContext);
  const MarginMask = useShowMarginMask();

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
      <FiltersBar
        handleFilterShow={handleFilterShow}
        namespace={namespace}
        active={activeHideOther}
        screen={screen}
        data-inspector="trade-tradeHistory-header"
        futuresType={SYMBOL_FILTER_ENUM.FUTURES_TRADE_HISTORY}
      />
      {tradeType === FUTURES ? (
        <FuturesTradeHistory />
      ) : (
        <OrderList {...orderObj} namespace={namespace} screen={screen} showFilter={showFilter} />
      )}
    </OrderWrapper>
  );
};

export default React.memo(TradeOrders);
