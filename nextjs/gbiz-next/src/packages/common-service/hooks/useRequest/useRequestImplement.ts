/*
 * @owner: borden@kupotech.com
 */

import { useEventCallback } from '@kux/mui-next';
import { useMemo, useEffect, useState, useCallback } from 'react';
import useLatest from '../useLatest';
import Fetch from './Fetch';

function useRequestImplement(
  service: any,
  options: any = {},
  plugins: any[] = []
): any {
  const { manual = false, ready = true, ...rest } = options;
  const fetchOptions: any = {
    manual,
    ready,
    ...rest,
  };

  const [, setState] = useState<any>({});
  const serviceRef = useLatest(service);

  const update = useCallback(() => setState({}), []);

  const fetchInstance = useMemo(() => {
    const initState = plugins
      .map((p: any) => p?.onInit?.(fetchOptions))
      .filter(Boolean);

    return new Fetch(serviceRef, fetchOptions, update, Object.assign({}, ...initState));
  }, []);

  fetchInstance.options = fetchOptions;

  // 注入所有的插件

  fetchInstance.pluginImpls = plugins.map((p: any) => p(fetchInstance, fetchOptions));

  useEffect(() => {
    if (!manual && ready) {
      // useCachePlugin 可以在初始化时从缓存中设置 fetchInstance.state.params
      const params = fetchInstance.state.params || options.defaultParams || [];
      fetchInstance.run(...params);
    }

    return () => {
      fetchInstance.cancel();
    };
  }, []);

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    cancel: useEventCallback(fetchInstance.cancel.bind(fetchInstance)),
    refresh: useEventCallback(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useEventCallback(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useEventCallback(fetchInstance.run.bind(fetchInstance)),
    runAsync: useEventCallback(fetchInstance.runAsync.bind(fetchInstance)),
  };
}

export default useRequestImplement;
