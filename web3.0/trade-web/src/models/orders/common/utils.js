/**
 * Owner: harry.lai@kupotech.com
 */
import {
  cancelAllOrders,
  cancelOCOOrder,
  cancelOrder,
  cancelSingleTWAPOrder,
  cancelTSO,
  cancelTWAPOrders,
  newCancelAllStopOrder,
  newCancelStopOrdersById,
} from 'services/order';
import { SPOT } from '@/meta/const';

/**
 *
 * @param {namespace, tradeType, isStop }
 * @returns cancelAllApi: (params) => void
 */
export const getCancelAllApi = ({ namespace, tradeType, isStop }) => {
  // 时间加权 取消委托订单
  const isSpotTWAP = tradeType === SPOT && namespace === 'orderTwap';

  if (isSpotTWAP) return cancelTWAPOrders;

  if (isStop) return newCancelAllStopOrder;

  return cancelAllOrders;
};

/**
 *
 * @param {namespace, tradeType, isStop }
 * @returns cancelSpecifyOrderApi: (orderId) => void
 */
export const getCancelSpecifyOrderApi = ({ namespace, tradeType, isStop, isOCO, isTSO }) => {
  const isSpotTWAP = tradeType === SPOT && namespace === 'orderTwap';
  // TWAP订单列表， 撤销单笔TWAP
  if (isSpotTWAP) {
    return cancelSingleTWAPOrder;
  }

  let stepFn = newCancelStopOrdersById;
  if (isOCO) {
    stepFn = cancelOCOOrder;
  } else if (isTSO) {
    // 跟踪委托
    stepFn = cancelTSO;
  }

  return isStop ? stepFn : cancelOrder;
};
