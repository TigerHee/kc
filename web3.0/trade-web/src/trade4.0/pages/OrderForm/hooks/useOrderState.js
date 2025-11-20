/**
 * Owner: odan.ou@kupotech.com
 */
import useCountDown from '@/hooks/useCountDown';
import { isDisplayAuction } from '@/meta/multiTenantSetting';
import { getSymbolAuctionInfo } from '@/utils/business';
import { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

/**
 * 是否允许切换订单类型
 * 集合竞价阶段不允许切换
 */
const useOrderState = () => {
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const symbolsMap = useSelector((state) => state.symbols.symbolsMap, shallowEqual);
  const auctionWhiteAllowList = useSelector(
    (state) => state.callAuction.auctionWhiteAllowList,
    shallowEqual,
  );
  const auctionWhiteAllowStatusMap = useSelector(
    (state) => state.callAuction.auctionWhiteAllowStatusMap,
    shallowEqual,
  );

  const {
    showAuction: showAuctionState,
    allowAuctionTrade,
    previewEnableShow,
  } = getSymbolAuctionInfo(
    symbolsMap[currentSymbol],
    auctionWhiteAllowList,
    auctionWhiteAllowStatusMap,
  );

  const showAuction = !!showAuctionState;

  /**
   * 禁止下单
   */
  const disabledOrder = useMemo(() => {
    // 展示集合竞价且允许下单为false时禁止下单
    const auctionDisabled = !!(showAuction && !allowAuctionTrade);
    // 预览时禁止下单
    return auctionDisabled || !!previewEnableShow;
  }, [allowAuctionTrade, showAuction, previewEnableShow]);

  const disabledRes = useMemo(() => {
    return {
      /**
       * 禁止下单
       */
      disabledOrder,
      /**
       * 展示集合竞价
       */
      showAuction,
    };
  }, [showAuction, disabledOrder]);

  return disabledRes;
};

/**
 * 判断当前交易对是否集合竞价第三阶段阶段
 */
export const useAuctionThirdStep = () => {
  const dispatch = useDispatch();

  const currentSymbol = useSelector((state) => state.trade.currentSymbol);

  const auctionConf = useSelector(
    (state) => state.callAuction.auctionMap[currentSymbol]?.auctionConf,
    shallowEqual,
  );

  const { remainingTimeFromSecondStageEnd = 0, remainingTimeFromThirdStageEnd = 0 } =
    auctionConf || {};

  const hasData = Object.keys(auctionConf || {}).length !== 0;

  // 获取集合竞价倒计时信息
  const getCountDownInfo = useCallback(() => {
    dispatch({
      type: 'callAuction/getAuctionConf',
      payload: {
        coinPair: currentSymbol,
      },
    });
  }, [currentSymbol]);

  // 获取币对信息
  const getSymbolsInfo = useCallback(() => {
    return dispatch({ type: 'symbols/pullSymbols' });
  }, [dispatch]);

  // 第二阶段
  const countDown2 = useCountDown(remainingTimeFromSecondStageEnd, {
    onRest: getCountDownInfo,
    onFinish: getSymbolsInfo,
    isEnd: hasData && remainingTimeFromSecondStageEnd <= 0,
  });

  // 第三阶段
  const countDown3 = useCountDown(countDown2.isEnd ? remainingTimeFromThirdStageEnd : 0, {
    onRest: getCountDownInfo,
    onFinish: getSymbolsInfo,
    isEnd: hasData && remainingTimeFromThirdStageEnd <= 0,
  });

  const { isEnd: isSecondEnd } = countDown2;
  const { isEnd } = countDown3;

  useEffect(() => {
    dispatch({
      type: 'callAuction/update',
      payload: {
        isThirdStep: isSecondEnd && !isEnd,
      },
    });
  }, [isSecondEnd, isEnd]);
};

/**
 * 集合竞价初始化
 */
export const useAuctionInit = () => {
  const dispatch = useDispatch();

  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const isLogin = useSelector((state) => state.user.isLogin);
  const auctionWhiteAllowList = useSelector(
    (state) => state.callAuction.auctionWhiteAllowList,
    shallowEqual,
  );

  // 多站点是否可以展示
  const isAuctionSiteShow = isDisplayAuction();

  useEffect(() => {
    if (isAuctionSiteShow) {
      dispatch({
        type: 'callAuction/getAuctionWhiteAllowList@polling',
      });
      return () => {
        dispatch({
          type: 'callAuction/getAuctionWhiteAllowList@polling:cancel',
        });
      };
    }
  }, [dispatch]);

  useEffect(() => {
    // 登陆且有开启白名单的symbol再查询用户白名单状态
    if (isLogin && currentSymbol && auctionWhiteAllowList?.includes(currentSymbol)) {
      dispatch({
        type: 'callAuction/getAuctionWhiteStatus',
        payload: {
          symbol: currentSymbol,
        },
      });
    }
  }, [dispatch, currentSymbol, isLogin, auctionWhiteAllowList]);
};

export default useOrderState;
