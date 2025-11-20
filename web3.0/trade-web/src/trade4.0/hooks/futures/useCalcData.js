/**
 * Owner: garuda@kupotech.com
 * 计算的值
 */
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { get, throttle } from 'lodash';

import { getState, evtEmitter } from 'src/helper';
import { getStore } from 'utils/createApp';

import {
  getFuturesCrossConfigForSymbol,
  getSymbolInfo,
  useGetSymbolInfo,
} from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { MAX_CHANGE_SIZE, ORDER_ACTIVE_CHANGE } from '@/meta/futures';
import { calcIMR, calcMMR, calcPosOrderQty } from '@/pages/Futures/calc';
import { makeCalcOrder } from '@/pages/Futures/components/SocketDataFormulaCalc/makeCalcOrder';
import { CROSS } from '@/pages/Orders/FuturesOrders/NewPosition/config';

const event = evtEmitter.getEvt();
const emptyObject = {};
/**
 * 获取计算的 positionCalcData 值
 * @param symbol
 * @returns positionCalcData 值
 */
export const useGetPositionCalcData = (symbol) => {
  const data = useSelector((state) => {
    const ret = get(state, 'futures_calc_data.positionCalcData', emptyObject);
    return symbol ? ret[symbol] || emptyObject : ret;
  });
  return data;
};

/**
 * 获取全仓的风险率
 */
export const useGetRiskRate = (symbol, marginMode) => {
  const { settleCurrency } = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const crossRiskRate = useSelector((state) => {
    return get(state, `futures_calc_data.crossRiskRate.${settleCurrency}`, undefined);
  });
  const calcData = useGetPositionCalcData(symbol);
  const isolatedRiskRate = calcData?.isolatedRiskRate;
  return marginMode === CROSS ? crossRiskRate : isolatedRiskRate;
};

// 获取订单sizeMap
export const useGetCrossOrderSizeMap = () => {
  return useSelector((state) => state.futures_calc_data.orderSizeMap);
};

// 获取逐仓占用
export const useGetCrossIsolatedOrderMargin = () => {
  return useSelector((state) => state.futures_calc_data.isolatedOrderMarginMap);
};

// 获取持仓订单对冲占用
export const useGetCrossPosOrderMargin = () => {
  const posOrderMarginCurrency = useSelector(
    (state) => state.futures_calc_data.posOrderMarginCurrency,
  );
  const posOrderMarginSymbol = useSelector((state) => state.futures_calc_data.posOrderMarginSymbol);
  return {
    posOrderMarginCurrency,
    posOrderMarginSymbol,
  };
};

// 返回一个低频的 positionCalcData 值
export const getPositionCalcData = (symbol) => {
  const globalState = getStore().getState();
  const ret = get(globalState, 'futures_calc_data.positionCalcData', emptyObject);
  return symbol ? ret[symbol] || emptyObject : ret;
};

// MMR
export const getMMR = (symbol) => {
  const { MMR } = getPositionCalcData(symbol);
  let ret = MMR;
  // 无仓位
  if (MMR === undefined) {
    // 自有资金的活动委托
    // const orders = getActiveOrders({ dataType: ACTIVE_ORDER_ENUM.SELF });
    const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });
    const { m, mmrLimit, mmrLevConstant } = getFuturesCrossConfigForSymbol({ symbol });
    const { orderSizeMap } = makeCalcOrder();
    const position = { currentQty: 0, symbol };
    // 获取持仓挂单对冲数量
    const posOrderQty = calcPosOrderQty({ position, symbolInfo, orderMap: orderSizeMap });
    // 全仓MMR
    ret = calcMMR({ maxLev: mmrLevConstant, m, mmrLimit, posOrderQty });
  }
  return ret;
};

// IMR
export const getIMR = ({ symbol, leverage }) => {
  const { IMR } = getPositionCalcData(symbol);
  let ret = IMR;
  // 无仓位
  if (IMR === undefined) {
    const { f } = getFuturesCrossConfigForSymbol({ symbol });
    const MMR = getMMR(symbol);
    // 全仓IMR
    ret = calcIMR({ leverage, f, MMR });
  }
  return ret;
};

// 获取订单sizeMap
export const getCrossOrderSizeMap = () => {
  return getState((state) => state.futures_calc_data.orderSizeMap);
};

// 获取逐仓占用
export const getCrossIsolatedOrderMargin = () => {
  return getState((state) => state.futures_calc_data.isolatedOrderMarginMap);
};

// 获取持仓订单对冲占用
export const getCrossPosOrderMargin = () => {
  const posOrderMarginCurrency = getState(
    (state) => state.futures_calc_data.posOrderMarginCurrency,
  );
  const posOrderMarginSymbol = getState((state) => state.futures_calc_data.posOrderMarginSymbol);
  return {
    posOrderMarginCurrency,
    posOrderMarginSymbol,
  };
};

const eventHandle = ({ dispatch, userInfo, isAll, symbols }) => {
  if (userInfo) {
    const payload = { symbols: [] };
    if (!isAll) {
      payload.symbols = symbols;
    }
    dispatch({
      type: 'futures_calc_data/getCrossOrderCalcData',
      payload,
    });
  }
};
/**
 * 获取全仓订单计算数据
 */
export const useGetCrossOrdersCalcData = ({ symbols, isAll }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.user);
  useEffect(() => {
    eventHandle({ dispatch, userInfo, isAll, symbols });
  }, [dispatch, isAll, symbols, userInfo]);
};
/**
 * 监听全仓订单变化，触发计算数据
 */
let symbolArr = [];
export const useInitOrderChange = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.user);
  useEffect(() => {
    const handle = throttle(
      ({ isAll }) => {
        const symbols = [...new Set(symbolArr)];
        const symbolAll = isAll || symbolArr.length >= MAX_CHANGE_SIZE;
        eventHandle({ dispatch, userInfo, isAll, symbols: symbolAll ? [] : symbols });
        symbolArr = [];
        console.log('=====listener action');
      },
      1000,
      {
        leading: true, // 开始时立刻执行一次
        trailing: false, // 结束时立刻执行一次
      },
    );
    const cb = (data) => {
      console.log('=====listener on');
      const { symbols = [] } = data;
      symbolArr = symbolArr.concat(symbols);
      handle(data);
    };
    event.on(ORDER_ACTIVE_CHANGE, cb);
    return () => event.off(ORDER_ACTIVE_CHANGE, cb);
  }, [dispatch, userInfo]);
};

/**
 * 触发订单计算
 */
export const triggerOrderChange = (symbols) => {
  event.emit(ORDER_ACTIVE_CHANGE, { symbols, isAll: true });
};
