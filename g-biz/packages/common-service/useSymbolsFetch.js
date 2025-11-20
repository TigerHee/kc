/*
 * @owner: borden@kupotech.com
 * @desc: 币服币对数据拉取，先从缓存中读取。如果存在，则将缓存中的timeline携带发起请求(查询增量)；如果不存在，则直接请求全量数据
 */
import { useLatest } from '@kux/mui';
import cloneDeep from 'lodash/cloneDeep';
import { useRef, useEffect } from 'react';
import { getSymbols } from './services';
import useRequest from './hooks/useRequest';
import { getCache, setCache } from './hooks/useRequest/utils/cache';
import { DEFAULT_OPTIONS, DEFAULT_STALE_TIME } from './config';
import { checkIsStale, list2map } from './tools';

export const CACHE_KEY = 'common-symbols';

function mergeData(data, cacheData) {
  if (!data?.length) return null;
  // 增量查询数据不会太多
  data.forEach((item) => {
    if (item.display && item.isEnabled) {
      cacheData[item.code] = item;
    } else if (cacheData[item.code]) {
      delete cacheData[item.code];
    }
  });
  return cacheData;
}

export default function useSymbolsFetch(options) {
  const { manual, onSuccess, onError, staleTime = DEFAULT_STALE_TIME } = options || {};

  const cache = useRef(null);
  const onSuccessRef = useLatest(onSuccess);

  const { data, loading, run } = useRequest(
    async (...rest) => {
      const res = await getSymbols(...rest);
      return res?.data || {};
    },
    {
      ...DEFAULT_OPTIONS,
      manual,
      onError,
      staleTime, // 默认5mins
      cacheKey: CACHE_KEY, // 不设置无法缓存回调
      formatParams: async () => {
        const cacheData = cache.current = await getCache(CACHE_KEY);
        const { timeline } = cacheData?.data || {};
        return timeline ? [
          {
            timeline, // 增量拉取的时间起点
            containsOff: true, // 是否包含下架数据
          },
        ] : [];
      },
      formatResult: async (data) => {
        const cacheData = cache.current;
        return {
          timeline: Math.max(data.timeline || 0, cacheData?.data?.timeline || 0),
          symbols: cacheData?.data.symbols
            ? mergeData(data.symbols, cacheData.data.symbols)
            : list2map(data.symbols, 'code'),
        };
      },
      setCache: async ({ time, data }) => {
        const cacheData = cache.current || {};
        cacheData.time = time;
        cacheData.data = {
          ...cacheData.data,
          timeline: data.timeline,
          ...data.symbols ? { symbols: data.symbols } : null,
        };
        setCache(CACHE_KEY, cacheData);
      },
      getCache: async () => {
        const cacheData = cache.current;
        // 缓存不存在，直接请求
        if (!cacheData) return null;
        const ret = {
          // time为0代表直接使用缓存, 不发请求
          ...(checkIsStale(staleTime, cacheData.time) ? { time: 0 } : null),
          data: { symbols: cacheData.data.symbols },
        };
        return ret;
      },
    },
  );

  useEffect(() => {
    if (data?.symbols && onSuccessRef.current) {
      // 深拷贝一份，防止业务侧修改item字段，影响缓存的元数据
      onSuccessRef.current(cloneDeep(data.symbols));
    }
  }, [data]);

  return { run, loading };
}
