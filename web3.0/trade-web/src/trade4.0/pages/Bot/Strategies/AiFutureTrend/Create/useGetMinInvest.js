/**
 * Owner: mike@kupotech.com
 */
import { useLayoutEffect } from 'react';
import { getMinInvestCacheKey } from '../util';
import useWatch from 'Bot/hooks/useSimpleWatch';
import { useDispatch, useSelector } from 'dva';

export default (params, setMergeState) => {
  const dispatch = useDispatch();
  useWatch([params.symbol, params.leverage, params.pullBack], () => {
    dispatch({
      type: 'aifuturetrend/getMinInvest',
      payload: params,
    });
  });

  const minInvestMap = useSelector((state) => state.aifuturetrend.minInvestMap);
  const cacheKey = getMinInvestCacheKey(params);
  useLayoutEffect(() => {
    setMergeState({
      minInvestment: minInvestMap[cacheKey],
    });
  }, [minInvestMap[cacheKey]]);
};
