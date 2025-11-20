/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-11-17 16:10:43
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-05-07 18:07:33
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/hooks/useOrderType.js
 * @Description:
 */
/*
 * @owner: borden@kupotech.com
 */
import { useSelector, shallowEqual } from 'dva';
import { useEtfCoin } from 'utils/hooks';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';
import { ORDER_TYPES_MAP } from '../config';
import { isTriggerTrade, isMarketTrade } from '../utils';

const plainObj = {};

export default function useOrderType(orderType) {
  const _orderType = useSelector((state) => state.tradeForm.type);

  if (!orderType) {
    orderType = _orderType;
  }

  return {
    orderType,
    isMarket: isMarketTrade(orderType),
    isTrigger: isTriggerTrade(orderType),
    orderTypeConfig: ORDER_TYPES_MAP[orderType] || plainObj,
  };
}

export const getOrderType = (orderType) => {
  if (!orderType) {
    orderType = getStateFromStore((state) => state.tradeForm.type);
  }

  return {
    orderType,
    isMarket: isMarketTrade(orderType),
    isTrigger: isTriggerTrade(orderType),
    orderTypeConfig: ORDER_TYPES_MAP[orderType] || plainObj,
  };
};

/**
 * 获取订单类型是否可用状态
 */
export const useOrderTypeEnable = () => {
  const etfCoin = useEtfCoin();
  const isEtfCoin = !!etfCoin;
  return useSelector(({ trade }) => {
    const { ocoEnable, tsoEnable, tradeType } = trade || {};
    // 杠杆,合约 暂时不支持，高级限价单 advancedLimit
    const isSupportAdvancedLimit = TRADE_TYPES_CONFIG[tradeType]?.isSupportAdvancedLimit;
    const isSupportTimeWeightedOrder = TRADE_TYPES_CONFIG[tradeType]?.isSupportTimeWeightedOrder;
    return {
      ocoEnable,
      tsoEnable,
      isSupportAdvancedLimit,
      isSupportTimeWeightedOrder,
      isEtfCoin,
    };
  }, shallowEqual);
};
