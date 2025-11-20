/**
 * Owner: mike@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';

/**
 * @description: 初始化交易对数据
 * @param {*} symbol
 * @return {*}
 */
const useInitParamsBySymbol = (symbol, setMergeState) => {
  const createPageParams = useSelector((state) => state.aifuturetrend.createPageParams);
  const createChart = useSelector((state) => state.aifuturetrend.createChart);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'aifuturetrend/getCreatePageChart',
      payload: {
        type: 'init',
        symbol,
      },
    }).then((params) => {
      if (params) {
        setMergeState({
          pullBack: params.defaultPullBack,
          leverage: params.defaultLeverage,
          minInvestment: params.minInvestment,
        });
      }
    });
  }, [symbol]);
  const noMore = createChart.noMore;
  const onFetchMore = useCallback(
    (endTime = Date.now()) => {
      if (noMore) return;
      console.log('fetchMore');
      dispatch({
        type: `aifuturetrend/getCreatePageChart`,
        payload: {
          type: 'fetchMore',
          symbol,
          endTime: moment(endTime).valueOf(),
        },
      });
    },
    [symbol, noMore],
  );
  useEffect(() => {
    return () => {
      dispatch({
        type: 'aifuturetrend/update',
        payload: {
          createChart: {
            noMore: false,
            hourKline: [],
            arbitrageInfo: [],
          },
        },
      });
    };
  }, []);
  return {
    createParams: createPageParams[symbol] ?? {
      minInvestment: 0, // 最小投资额
      maxInvestment: 100000, // 最大投资额
      hourKline: [], // 小时K线收盘价
      arbitrageInfo: [], // 套利信息
      maxLeverage: 10,
      defaultLeverage: 5,
      defaultPullBack: 50,
    },
    onFetchMore,
    createChart,
  };
};
export default useInitParamsBySymbol;
