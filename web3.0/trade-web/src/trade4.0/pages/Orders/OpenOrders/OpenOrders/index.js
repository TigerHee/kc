/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-25 19:22:11
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-07 18:08:33
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/OpenOrders/OpenOrders/index.js
 * @Description:当前委托列表，包含
 */
import React, { useState, useEffect, useContext, useCallback, Fragment, useMemo } from 'react';
import { includes, find } from 'lodash';
import { ICQuestionOutlined } from '@kux/icons';
import Tooltip from '@mui/Tooltip';
// import useShowMarginMask from '@/hooks/useShowMarginMask';
import { openOrderDict, openOrderTWAPTabDict } from '@/pages/Orders/Common/OrderConfig';
import OrderList from '@/pages/Orders/Common/OrderListCommon';
import TradeTypesSelect from '@/pages/Orders/Common/TradeTypesSelect';
import { _t } from 'utils/lang';
import { useEtfCoin } from 'utils/hooks';
import OrderTabs from '@/pages/Orders/Common/OrderTabs';
import { useOpenOrderProps } from '@/pages/Orders/OpenOrders/hooks/useOpenOrdersData';
import { useOrderTypeChange } from '@/pages/Orders/Common/hooks/useOrderTypeChange';
import { WrapperContext } from '@/pages/Orders/OpenOrders/config';
import HideOtherPairsRadio from '@/pages/Orders/Common/HideOtherPairsRadio';
import SvgComponent from '@/components/SvgComponent';
import { triggerActive } from '@/hooks/futures/useActiveOrder';
import {
  useOrderListInit,
  useOrderListFilterData,
} from '@/pages/Orders/Common/hooks/useOrderListInit';
import socketStore from 'src/pages/Trade3.0/stores/store.socket';
import {
  OrderWrapper,
  OrderHeadBarWrapper,
  // OrderMaskWraperWrapper,
  CancelOperatorTitle,
} from '@/pages/Orders/Common/style';
import { Right, DividerWrapper } from '@/pages/Orders/Common/OrderListCommon/style';
import { FUTURES, SPOT } from '@/meta/const';
import AdvancedOrders from '@/pages/Orders/FuturesOrders/AdvancedOrders';
import FuturesOpenOrders from '@/pages/Orders/FuturesOrders/OpenOrders';
// import RealizedPNL from '@/pages/Orders/FuturesOrders/RealizedPNL';
import { pullOrderCurrent } from '../hooks/useSocketPull';
import SymbolFliterRadio from '../../Common/SymbolFliterRadio';
import { SYMBOL_FILTER_ENUM } from '../../FuturesOrders/config';
import MCancel from '../../FuturesOrders/components/MCancelAll';
import { triggerStop } from '@/hooks/futures/useOrderStop';

function findActiveByKey(array, key) {
  return array.find((item) => item.key === key);
}
const DEFAULT_ACTIVE_TAB_KEY = 'current';

const OpenOrders = () => {
  const { currentOrders, advancedOrders } = socketStore.useSelector((state) => state.socket);
  const screen = useContext(WrapperContext);
  // const hasOrdersDataChange = useRef(false);

  const [activeIndex, setActiveIndex] = useState(DEFAULT_ACTIVE_TAB_KEY);
  const [showFilter, setShowFilter] = useState(false);

  const { tabObj, isLogin, tradeType, currentSymbol } = useOpenOrderProps();
  const isFutures = tradeType === FUTURES;
  const etfCoin = useEtfCoin();

  const orderDict = useMemo(() => {
    // 非杠杠代币 && 现货 && 命中twap灰度时 展示
    if (!etfCoin && tradeType === SPOT) {
      return [...openOrderDict, openOrderTWAPTabDict];
    }
    return openOrderDict;
  }, [tradeType, etfCoin]);

  const { namespace, ...orderObj } = findActiveByKey(orderDict, activeIndex) || orderDict[0];
  const { showCancelVisible, disabledAllCancel } = useOrderListInit({
    namespace,
    type: orderObj.type,
  });
  useOrderTypeChange(namespace, tabObj, isLogin, tradeType, currentSymbol);

  const { hasFilter } = useOrderListFilterData({ namespace });

  /**
   * 处理变更筛选条件 tabs选中OrderConfig不存在 恢复默认选项
   */
  const autoResetDefaultTab = useCallback(() => {
    const isMatchValidTab = orderDict.some((i) => i.key === activeIndex);
    if (isMatchValidTab) return;
    setActiveIndex(DEFAULT_ACTIVE_TAB_KEY);
  }, [activeIndex, setActiveIndex, orderDict]);

  useEffect(() => {
    autoResetDefaultTab();
  }, [autoResetDefaultTab]);

  // 利用effect依赖，监听currentOrder， advanceOrders变化，执行订单的拉取与数量
  useEffect(() => {
    // 合约不走这里
    if (isFutures) {
      return;
    }
    // if (hasOrdersDataChange.current) {
    //   pullOrderCurrent(namespace);
    // } else {
    //   hasOrdersDataChange.current = true;
    // }
    // todo  会拉两次
    pullOrderCurrent(namespace);
  }, [currentOrders, namespace, advancedOrders, isFutures]);

  // const MarginMask = useShowMarginMask();

  let activeHideOther = false;
  // 判断model里面fliters的symbol值是否有值，有就是显示当前交易对
  if (tabObj[namespace]) {
    activeHideOther = true;
  } else {
    activeHideOther = false;
  }

  const handleFilterShow = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  const handleTabClick = useCallback(
    (index) => {
      const { subTabClick } = find(orderDict, { key: index }) || {};
      setActiveIndex(index);
      if (isFutures) {
        if (index === DEFAULT_ACTIVE_TAB_KEY) {
          triggerActive();
        } else {
          triggerStop();
        }
      }
      if (subTabClick) subTabClick();
    },
    [isFutures],
  );

  const breakPoint =
    isFutures || namespace === 'orderCurrent' ? ['sm', 'md', 'lg', 'lg1'] : ['sm', 'md', 'lg'];
  let activeToolbarType = '';
  if (isFutures) {
    const typeMap = {
      stop: SYMBOL_FILTER_ENUM.FUTURES_STOP_ORDER,
      current: SYMBOL_FILTER_ENUM.FUTURES_ACTIVE_ORDER,
    };
    activeToolbarType = typeMap[activeIndex] || '';
  }
  return (
    <OrderWrapper>
      <OrderHeadBarWrapper data-inspector="trade-openOrders-header">
        <TradeTypesSelect sensorKey="openOrders" />
        <DividerWrapper type="vertical" />
        <OrderTabs tabs={orderDict} activeIndex={activeIndex} handleTabClick={handleTabClick} />
        {/* 合约 symbolFilter*/}
        {!includes(breakPoint, screen) ? (
          isFutures ? (
            <SymbolFliterRadio dataKey={activeToolbarType} />
          ) : (
            <HideOtherPairsRadio
              namespace={namespace}
              active={activeHideOther}
              isOpenAndStopOrders
            />
          )
        ) : null}
      </OrderHeadBarWrapper>
      {includes(breakPoint, screen) ? (
        <OrderHeadBarWrapper className="open-order-bar">
          {/* 合约radio symbolfilter */}
          {isFutures ? (
            <SymbolFliterRadio dataKey={activeToolbarType} />
          ) : (
            <HideOtherPairsRadio
              namespace={namespace}
              active={activeHideOther}
              isOpenAndStopOrders
              style={{ marginLeft: 'unset' }}
            />
          )}
          <Right>
            {/* 合约不展示filter */}
            {isLogin && !isFutures ? (
              <Fragment>
                <SvgComponent
                  type="essential"
                  fileName="orders"
                  size={12}
                  onClick={handleFilterShow}
                  className={hasFilter ? 'active' : ''}
                />
                <DividerWrapper type="vertical" />
              </Fragment>
            ) : null}
            {/* 合约cancelAll */}
            {isFutures ? (
              <CancelOperatorTitle>
                <MCancel activeIndex={activeIndex} />
              </CancelOperatorTitle>
            ) : (
              <CancelOperatorTitle>
                <a
                  onClick={disabledAllCancel ? undefined : showCancelVisible}
                  disabled={disabledAllCancel}
                >
                  {_t('orders.c.cancel.multi')}
                </a>
                <Tooltip size="small" placement="top" title={_t('9JKe8WzurtuqacyVdAKcQK')}>
                  <ICQuestionOutlined size={12} />
                </Tooltip>
              </CancelOperatorTitle>
            )}
          </Right>
        </OrderHeadBarWrapper>
      ) : null}
      {tradeType === FUTURES ? (
        <>
          {activeIndex === 'stop' ? <AdvancedOrders /> : null}
          {activeIndex === 'current' ? <FuturesOpenOrders /> : null}
        </>
      ) : (
        <OrderList {...orderObj} namespace={namespace} screen={screen} showFilter={showFilter} />
      )}
    </OrderWrapper>
  );
};

export default React.memo(OpenOrders);
