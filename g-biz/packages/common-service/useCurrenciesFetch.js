/*
 * @owner: borden@kupotech.com
 * @desc: 币服币种数据拉取，缓存在5分钟内保持新鲜，不发起请求
 */
import { useLatest } from '@kux/mui';
import cloneDeep from 'lodash/cloneDeep';
import { useRef, useEffect } from 'react';
import { getCurrencies } from './services';
import { checkIsStale, list2map } from './tools';
import { DEFAULT_OPTIONS, DEFAULT_STALE_TIME } from './config';
import { getCache, setCache } from './hooks/useRequest/utils/cache';
import useRequest from './hooks/useRequest';

export const CACHE_KEY = 'common-currencies';
const DEFAULT_DOMAINIDS = ['kucoin', 'pool', 'kumex'];
const DEFAULT_DOMAINIDS_STR = DEFAULT_DOMAINIDS.join(',');

function mergeData(data, cacheData) {
  if (!data?.length) return null;
  // 增量查询数据不会太多
  data.forEach((item) => {
    if (item.type !== -1) {
      cacheData[item.currency] = item;
    } else if (cacheData[item.currency]) {
      delete cacheData[item.currency];
    }
  });
  return cacheData;
}

export default function useCurrenciesFetch(options) {
  const {
    manual,
    onError,
    onSuccess,
    params = {},
    incrementalEnabled,
    staleTime = DEFAULT_STALE_TIME,
  } = options || {};
  const cache = useRef(null);
  const onSuccessRef = useLatest(onSuccess);
  const domainIdsFromParams = params.domainIds?.split(',') || DEFAULT_DOMAINIDS;

  const { data, loading, run } = useRequest(
    async (...rest) => {
      const res = await getCurrencies(...rest);
      return res?.data || {};
    },
    {
      ...DEFAULT_OPTIONS,
      manual,
      onError,
      staleTime,
      cacheKey: CACHE_KEY,
      // 不同参数得在不同纬度做节流
      promiseCacheKey: `${CACHE_KEY}_${params.domainIds || DEFAULT_DOMAINIDS_STR}`,
      // 读取缓存，过滤掉缓存尚新鲜的domainId参数并组装timeline参数实现增量拉取
      formatParams: async () => {
        const cacheData = cache.current = await getCache(CACHE_KEY);
        let domainIds;
        // 生成domainIds参数
        if (cacheData && Object.hasOwnProperty.call(cacheData, 'time')) {
          domainIds = domainIdsFromParams.filter((domainId) => {
            return (
              !cacheData.time?.[domainId] ||
              !checkIsStale(staleTime, cacheData.time[domainId])
            );
          });
        } else {
          domainIds = domainIdsFromParams;
        }

        const conditions = domainIds.map((domainId) => {
          const timeline = incrementalEnabled ? cacheData?.timeline?.[domainId] || 0 : 0;
          return {
            timeline,
            domainId,
            currencyType: 2,
            containsOff: Boolean(timeline),
          };
        });
        return conditions.length ? [conditions] : [];
      },
      formatResult: async (data) => {
        const cacheData = cache.current;
        return Object.keys(data.currencies).reduce(
          (acc, domainId) => {
            acc.timeline[domainId] = Math.max(
              data.timeline || 0,
              cacheData?.timeline?.[domainId] || 0,
            );
            acc.currencies[domainId] =
              incrementalEnabled && cacheData?.data[domainId]
                ? mergeData(data.currencies[domainId], cacheData.data[domainId])
                : list2map(data.currencies[domainId], 'currency');
            return acc;
          },
          { timeline: {}, currencies: {} },
        );
      },
      setCache: async ({ time, data }) => {
        const cacheData = cache.current || {};
        cacheData.timeline = { ...cacheData.timeline, ...data.timeline };
        Object.keys(data.currencies).forEach((domainId) => {
          cacheData.time = { ...cacheData.time, [domainId]: time };
          if (data.currencies[domainId]) {
            cacheData.data = {
              ...cacheData.data,
              [domainId]: data.currencies[domainId],
            };
          }
        });
        setCache(CACHE_KEY, cacheData);
      },
      getCache: async (reqParams) => {
        const cacheData = cache.current;
        if (!cacheData) return null;
        const currencies = domainIdsFromParams.reduce((acc, domainId) => {
          if (cacheData.data[domainId]) {
            acc[domainId] = cacheData.data[domainId];
          }
          return acc;
        }, {});
        return {
          // time为0代表直接使用缓存, 不发请求
          ...(!reqParams.length ? { time: 0 } : null),
          data: { currencies },
        };
      },
    },
  );

  useEffect(() => {
    if (data?.currencies) {
      const newData = domainIdsFromParams.reduce((acc, domainId) => {
        if (data.currencies[domainId]) {
          acc[domainId] = data.currencies[domainId];
        }
        return acc;
      }, {});
      if (onSuccessRef.current && Object.keys(newData).length > 0) {
        // 深拷贝一份，防止业务侧修改item字段，影响缓存的元数据
        onSuccessRef.current(cloneDeep(newData));
      }
    }
  }, [data]);

  return { run, loading };
}
