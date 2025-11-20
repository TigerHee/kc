/**
 * Owner: garuda@kupotech.com
 * 该 hooks 初始化 futuresForm 需要的数据
 */
import React, { useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isEqual, includes, throttle } from 'lodash';

import {
  evtEmitter,
  MISOPERATION_KEY,
  PRICE_DEVIATION_KEY,
  greaterThan,
  FUTURES,
  MARGIN_MODE_ISOLATED,
} from '../builtinCommon';

import {
  useAvailableBalance,
  useSwitchTrialFund,
  useUserFee,
  useGetMaxLeverage,
  useGetLeverage,
  useGetBestTickerForSymbol,
  useLastPrice,
  usePullBestTicker,
  useGetBuySell1,
  useMarkPrice,
  useIndexPrice,
  useGetPosition,
  useGetSymbolInfo,
  useGetCurrentSymbol,
  useUnit,
  useSetUnit,
  useMarginMode,
  useGetLocalSetting,
  useGetUserOpenFutures,
  isSpotTypeSymbol,
} from '../builtinHooks';
import { useGetActiveTab } from '../hooks/useGetData';

const eventHandle = evtEmitter.getEvt();

// 更新最新成交价
const UpdateLastPrice = memo(() => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const lastPrice = useLastPrice(currentSymbol);

  useEffect(() => {
    if (lastPrice > 0) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          lastPrice,
        },
      });
    }
  }, [dispatch, lastPrice]);

  return null;
});

// 更新买卖盘
const UpdateOrderBook = memo(() => {
  const prevOrderBook = useRef(null);
  const currentSymbol = useGetCurrentSymbol();
  const dispatch = useDispatch();
  // 获取买一卖一
  const orderBook = useGetBuySell1(currentSymbol);
  // 获取最佳行情
  const bestInfo = useGetBestTickerForSymbol(currentSymbol);

  // 更新兜底买一卖一
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        bid1: bestInfo?.bid1,
        ask1: bestInfo?.ask1,
      },
    });
  }, [bestInfo, dispatch]);

  // 交易大厅取值跟专业版不一样，需要注意
  // 手动控制，买卖盘值是否更新
  const updateOrderBook = useMemo(() => {
    if (isEqual(orderBook, prevOrderBook.current)) {
      return false;
    }
    // 买一卖一值不为真
    if (!orderBook?.buy1 && !orderBook?.sell1) {
      return false;
    }
    return orderBook;
  }, [orderBook]);

  // 1000 ms 节流更新买一卖一价格
  const throttleUpdateOrderBook = useCallback(
    throttle((data) => {
      if (!data) return;
      prevOrderBook.current = orderBook;
      const { buy1, sell1 } = data;
      dispatch({
        type: 'futuresForm/update',
        payload: {
          bid1: buy1 || 0,
          ask1: sell1 || 0,
        },
      });
    }, 1000),
    [dispatch],
  );

  useEffect(() => {
    throttleUpdateOrderBook(updateOrderBook);
  }, [throttleUpdateOrderBook, updateOrderBook, dispatch]);

  return null;
});

// 更新外部仓位
const UpdatePositionSize = memo(() => {
  const dispatch = useDispatch();
  const { switchTrialFund } = useSwitchTrialFund();
  const currentSymbol = useGetCurrentSymbol();
  // 依赖外部仓位列表
  const positions = useGetPosition({
    condition: (p) => {
      return p.isOpen && p.symbol === currentSymbol && !!p.isTrialFunds === !!switchTrialFund;
    },
  });
  // 更新对应的 positionSize
  useEffect(() => {
    // 获取当前持仓数量，如果不存在则返回0
    const currentSize = positions[0]?.currentQty || 0;

    dispatch({
      type: 'futuresForm/update',
      payload: {
        positionSize: currentSize,
      },
    });
  }, [dispatch, positions, currentSymbol]);

  return null;
});

// 更新标记价格/指数价格
const UpdateMPAndIP = memo(() => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const markPrice = useMarkPrice(currentSymbol);
  const indexPrice = useIndexPrice(currentSymbol);

  // 更新标记价格
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        markPrice,
      },
    });
  }, [dispatch, markPrice]);

  // 更新指数价格
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        indexPrice,
      },
    });
  }, [dispatch, indexPrice]);

  return null;
});

// 更新余额
const UpdateAvailableBalance = memo(() => {
  const dispatch = useDispatch();
  const symbol = useGetCurrentSymbol();
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { switchTrialFund } = useSwitchTrialFund();
  // 获取可用余额
  const availableBalance = useAvailableBalance(symbolInfo?.settleCurrency, switchTrialFund);

  // 更新余额
  useEffect(() => {
    if (availableBalance == null) return;
    dispatch({
      type: 'futuresForm/update',
      payload: {
        availableBalance,
      },
    });
  }, [dispatch, availableBalance]);

  return null;
});

// 更新 SymbolInfo
const UpdateSymbolInfo = memo(() => {
  const prevSymbolInfo = useRef(null);
  const dispatch = useDispatch();
  const symbol = useGetCurrentSymbol();
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  console.log('symbolInfo --->', symbolInfo, symbol);
  useEffect(() => {
    // 交易对需要是合约 && 不相同
    const isSpotSymbol = isSpotTypeSymbol(symbolInfo.symbol);
    if (!isEqual(prevSymbolInfo.current, symbolInfo) && !isSpotSymbol) {
      prevSymbolInfo.current = symbolInfo;
      dispatch({
        type: 'futuresForm/update',
        payload: { symbolInfo, currentSymbol: symbol },
      });
    }
  }, [dispatch, symbol, symbolInfo]);

  return null;
});

// 更新 偏好设置值
const UpdateSetting = memo(() => {
  const dispatch = useDispatch();
  const confirmConfig = useSelector((state) => state.futuresSetting.confirmConfig);
  const { retentionData, confirmModal } = useGetLocalSetting();

  // 更新深入买卖盘以及价差确认
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        priceGapConfirm: includes(confirmConfig, PRICE_DEVIATION_KEY),
        deepConfirm: includes(confirmConfig, MISOPERATION_KEY),
        authAdvancedOrder: true, // 交易大厅没有该值的配置
        authStopOrder: true, // 交易大厅没有该值的配置
        authPnl: true, // 交易大厅没有该值的配置
      },
    });
  }, [confirmConfig, dispatch]);

  // 更新下单是否缓存
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        openStash: retentionData,
      },
    });
    // 如果下单缓存勾选叉掉，则清空之前的缓存值
    if (!retentionData) {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          stashCache: null,
        },
      });
    }
  }, [retentionData, dispatch]);

  // 更新下单确认
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        confirmOrder: confirmModal,
      },
    });
  }, [confirmModal, dispatch]);

  return null;
});

// 监听 symbol 以及 orderType 的更改用来更新下单缓存值以及计算器缓存值
export const UpdateStashCache = memo(() => {
  const dispatch = useDispatch();
  const currentSymbol = useGetCurrentSymbol();
  const { orderType } = useGetActiveTab();
  // 切换 symbol 或者 type 清空缓存值
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        calcStashCache: null,
        stashCache: null,
      },
    });
  }, [dispatch, currentSymbol, orderType]);

  return null;
});

// 更新用户信息
export const UpdateUserInfo = memo(() => {
  const dispatch = useDispatch();
  const symbol = useGetCurrentSymbol();
  const isLogin = useSelector((state) => state.user.isLogin);
  const securtyStatus = useSelector((state) => state.user.securtyStatus);
  const { takerFeeRate, fixTakerFee } = useUserFee();
  const { switchTrialFund } = useSwitchTrialFund();
  const { getMarginModeForSymbol } = useMarginMode();

  const marginMode = getMarginModeForSymbol(symbol);
  const userMaxLeverage = useGetMaxLeverage({
    symbol,
    marginMode,
    switchTrialFund,
    isUser: true,
  });

  const userLeverage = useGetLeverage({ symbol, marginMode });

  const leverage = useMemo(() => {
    if (!userMaxLeverage) return userLeverage;
    // 逐仓因为不是全局杠杆，需要款住用户的当前杠杆值
    if (marginMode === MARGIN_MODE_ISOLATED) {
      return greaterThan(userLeverage)(userMaxLeverage) ? userMaxLeverage : userLeverage;
    }
    return userLeverage;
  }, [marginMode, userLeverage, userMaxLeverage]);

  // 更新用户费率
  useEffect(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        takerFeeRate,
        fixTakerFee,
      },
    });
  }, [dispatch, takerFeeRate, fixTakerFee]);

  // 更新登陆状态以及校验状态
  useEffect(() => {
    dispatch({ type: 'futuresForm/update', payload: { isLogin, securtyStatus } });
  }, [dispatch, isLogin, securtyStatus]);

  // 更新用户杠杆
  useEffect(() => {
    if (leverage) {
      dispatch({ type: 'futuresForm/update', payload: { leverage } });
    }
  }, [dispatch, leverage]);

  // 更新用户最大杠杆
  useEffect(() => {
    if (userMaxLeverage) {
      dispatch({ type: 'futuresForm/update', payload: { userMaxLeverage } });
    }
  }, [dispatch, userMaxLeverage]);

  return null;
});

const FuturesInit = memo(() => {
  const dispatch = useDispatch();

  const currentSymbol = useGetCurrentSymbol();
  const isOpenFutures = useGetUserOpenFutures();
  const tradingUnit = useUnit();

  const pullBestTicker = usePullBestTicker();

  // 获取 unit 修改
  const onSetUnit = useSetUnit();

  // 更新交易单位
  useEffect(() => {
    dispatch({ type: 'futuresForm/update', payload: { tradingUnit } });
  }, [dispatch, tradingUnit]);

  // 更新合约状态
  useEffect(() => {
    dispatch({ type: 'futuresForm/update', payload: { isOpen: isOpenFutures } });
  }, [dispatch, isOpenFutures]);

  // 监听 tradingUnit 修改
  useEffect(() => {
    eventHandle.on('km@setUnit', onSetUnit);
    return () => {
      eventHandle.off('km@setUnit', onSetUnit);
    };
  }, [onSetUnit]);

  // 获取最佳行情
  useEffect(() => {
    if (currentSymbol && !isSpotTypeSymbol(currentSymbol)) {
      pullBestTicker(currentSymbol);
    }
  }, [currentSymbol, pullBestTicker]);

  return (
    <>
      <UpdateLastPrice />
      <UpdateOrderBook />
      <UpdatePositionSize />
      <UpdateMPAndIP />
      <UpdateAvailableBalance />
      <UpdateSymbolInfo />
      <UpdateSetting />
      <UpdateStashCache />
      <UpdateUserInfo />
    </>
  );
});

export default FuturesInit;
