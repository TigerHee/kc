/**
 * Owner: jessie@kupotech.com
 */
import { useDebounceEffect } from 'ahooks';
import { useSelector, useDispatch } from 'dva';
import { useCallback, useMemo, useEffect } from 'react';
import { pick, throttle, uniqWith, isEqual } from 'lodash';
import { getIntervalTypes } from '@/pages/Chart/components/TradingViewV24/utils';
import { useTradeType } from '@/hooks/common/useTradeType';
import { namespace } from '@/pages/Chart/config';
import { ISOLATED } from '@/meta/const';
import { _t } from 'utils/lang';

// 历史成交点位list
const useOrderHistoryData = ({ chartType, tradeType, interval, symbol, begin }) => {
  const dispatch = useDispatch();
  const currentTradeType = useTradeType();

  const user = useSelector((state) => Boolean(state.user.user));
  const tradeMode = useSelector((state) => state.trade.tradeMode);
  const bsHistory = useSelector((state) => state[namespace].bsHistory);
  const extraToolConfig = useSelector((state) => state[namespace].extraToolConfig);
  const isolatedLiquidationBSPoints = useSelector(
    (state) => state[namespace].isolatedLiquidationBSPoints,
  );

  const { historyOrder } = extraToolConfig || {};
  const isIsolated = currentTradeType === ISOLATED;
  const canPullBsHistory = Boolean(
    user &&
    begin &&
    symbol &&
    interval &&
    chartType &&
    historyOrder &&
    interval !== '1' &&
    tradeMode === 'MANUAL' &&
    chartType !== 'timeline',
  );

  const pullBSHistory = useCallback(
    throttle(() => {
      dispatch({
        type: `${namespace}/getBSHistoryBySymbol`,
      });
    }, 1000),
    [],
  );

  useEffect(() => {
    if (user && historyOrder) {
      // 登陆时轮训拉取数据
      dispatch({
        type: `${namespace}/getBSHistoryBySymbol@polling`,
      });
      return () => {
        dispatch({ type: `${namespace}/getBSHistoryBySymbol@polling:cancel` });
      };
    }
  }, [user, historyOrder, dispatch]);

  useEffect(() => {
    if (canPullBsHistory) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          bsFilter: {
            tradeType,
            type: interval,
            symbol,
            begin,
          },
        },
      });
      pullBSHistory();
    }
  }, [
    begin,
    symbol,
    interval,
    tradeType,
    dispatch,
    pullBSHistory,
    canPullBsHistory,
  ]);

  // 防抖设置为3s, 解决切换type时begin连续变化3次的问题，
  // 考虑到BS点位只是个参考型数据，产品侧确认，可以接受延时拉取
  useDebounceEffect(
    () => {
      if (canPullBsHistory && isIsolated) {
        // console.log(`///////pullIsolatedLiquidationBSPoints`);
        dispatch({
          type: `${namespace}/pullIsolatedLiquidationBSPoints`,
        });
      }
    },
    [begin, symbol, interval, isIsolated, canPullBsHistory],
    { wait: 3000 },
  );

  const bsList = useMemo(() => {
    // 逐仓下，将一键平仓的记录合并到历史BS点位数据中，合并规则为：
    // 1、symbol和timeType一样说明是同一纬度的数据，才能进行合并
    // 2、date和side相同的项，保留历史BS点位数据中的，舍弃一键平仓记录中的
    const latitude = ['symbol', 'timeType'];
    const result =
      isIsolated && isolatedLiquidationBSPoints.length
        ? bsHistory?.length &&
          isEqual(pick(bsHistory[0], latitude), pick(isolatedLiquidationBSPoints[0], latitude))
          ? uniqWith(
              [...bsHistory, ...isolatedLiquidationBSPoints],
              (a, b) => a.date === b.date && a.side === b.side,
            )
          : isolatedLiquidationBSPoints
        : bsHistory;

    // 不显示bs点位
    if (
      !user ||
      !historyOrder ||
      !result?.length ||
      interval === '1' ||
      tradeMode !== 'MANUAL' ||
      chartType === 'timeline' ||
      !isEqual(pick(result[0], latitude), { // 过滤不符合的数据
        symbol,
        timeType: getIntervalTypes(interval),
      })
    ) {
      return [];
    }

    return result;
  }, [
    user,
    symbol,
    interval,
    chartType,
    tradeMode,
    bsHistory,
    isIsolated,
    historyOrder,
    isolatedLiquidationBSPoints,
  ]);

  return bsList;
};

export default useOrderHistoryData;
