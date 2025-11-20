/**
 * Owner: tiger@kupotech.com
 */
import { useState, useEffect } from 'react';
import { isFunction } from 'lodash-es';
import { useSnackbar } from '@kux/mui';
import { CACHE_DATA } from '../config';

/**
 * params - 接口请求的参数，默认：{}
 * autoFetch - 是否自动触发请求，默认：true
 * ready - 是否可以开始请求了，默认：true
 * cacheKey - 缓存数据的key，默认：不缓存
 */
export default (serviceFn, otherProps = {}) => {
  const { params = {}, autoFetch = true, ready = true, cacheKey = '' } = otherProps;
  const { message } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [isFetchErr, setFetchErr] = useState(false);

  const onFetchData = (paramVal) => {
    if (cacheKey && CACHE_DATA[cacheKey]) {
      setData(CACHE_DATA[cacheKey]);
    } else {
      setLoading(true);
    }

    if (isFunction(serviceFn)) {
      setFetchErr(false);
      serviceFn(paramVal || params)
        .then((res) => {
          if (res?.success) {
            const data = res?.data || {};
            setData(data);

            if (cacheKey) {
              CACHE_DATA[cacheKey] = data;
            }
          }
        })
        .catch((err) => {
          setFetchErr(true);
          if (err?.msg) {
            message.error(err?.msg);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (autoFetch && ready) {
      onFetchData();
    }
  }, [autoFetch, ready]);

  return {
    loading,
    data,
    onFetchData,
    isFetchErr,
  };
};
