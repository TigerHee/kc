/*
 * @owner: borden@kupotech.com
 */
import { useRef, useEffect } from 'react';
import { checkIsStale, execMaybeAsyncFn } from '../../../tools';
import { trigger, subscribe } from '../utils/cacheSubscribe';
import { setCachePromise, getCachePromise } from '../utils/cachePromise';
import { getCache, setCache, track, trackSwr } from '../utils/cache';

const useCachePlugin = (
  fetchInstance: any,
  {
    cacheKey,
    promiseCacheKey,
    staleTime = 0,
    setCache: customSetCache,
    getCache: customGetCache,
  }: any
): any => {
  const unSubscribeRef = useRef<() => void>(undefined);
  const currentPromiseRef = useRef<Promise<any>>(undefined);

  const _getCache = async (key: any, params: any): Promise<any> => {
    const ret = await execMaybeAsyncFn(customGetCache, params);

    if (ret) return ret;

    const cache = await getCache(key);

    return cache;
  };

  const _setCache = (key: any, cachedData: any): void => {
    if (customSetCache) {
      customSetCache(cachedData);
    } else {
      setCache(key, cachedData);
    }
    trigger(key, cachedData.data);
  };

  useEffect(() => {
    return () => {
      unSubscribeRef.current?.();
    };
  }, []);

  if (!cacheKey) {
    return {};
  }

  return {
    onBefore: async (params: any): Promise<any> => {
      const cacheData = await _getCache(cacheKey, params);

      if (!cacheData || !Object.hasOwnProperty.call(cacheData, 'data')) {
        track({ cacheKey, result: 'no_cache' });

        return {};
      }

      if (cacheData.time === 0 || checkIsStale(staleTime, cacheData.time)) {
        track({ cacheKey, result: 'cached' });
        return {
          loading: false,
          data: cacheData?.data,
          error: undefined,
          returnNow: true,
        };
      }

      // 上报走到swr的过期时间等信息
      trackSwr(cacheKey, staleTime, cacheData);
      return {
        error: undefined,
        data: cacheData.data,
      };
    },

    onRequest: (service: any, args: any): any => {
      const _promiseCacheKey = promiseCacheKey || cacheKey;

      let servicePromise = getCachePromise(_promiseCacheKey);

      if (servicePromise && servicePromise !== currentPromiseRef.current) {
        return { servicePromise };
      }

      servicePromise = service(...args);

      currentPromiseRef.current = servicePromise;

      setCachePromise(_promiseCacheKey, servicePromise);

      return { servicePromise };
    },

    onSuccess: (data: any): void => {
      if (cacheKey) {
        unSubscribeRef.current?.();

        _setCache(cacheKey, {
          data,
          time: Date.now(),
        });

        unSubscribeRef.current = subscribe(cacheKey, (d: any) => {
          fetchInstance.setState({ data: d });
        });
      }
    },
  };
};

export default useCachePlugin;
