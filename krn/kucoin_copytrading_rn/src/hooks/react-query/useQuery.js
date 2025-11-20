import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useQuery as innerUseQuery} from '@tanstack/react-query';

import useIsFocused from 'hooks/hybridNavigation/useIsFocused';
import showError from 'utils/showError';

export const useQuery = options => {
  const dispatch = useDispatch();
  const {
    onError,
    refetchOnFocus = false, // refetchOnFocus = true 时监听页面进入前台, 基于onHide onshow 事件 ，用于 rn 与原生或app 后台切换时 refetch
    refetchIntervalInBackground = false,
    ...other
  } = options || {};

  const isFocused = useIsFocused();

  const queryResult = innerUseQuery({
    onError: error => {
      const errorHandler = () => {
        showError({...error, ...(error?.responseJson || null)}, dispatch);
      };
      if (typeof onError === 'function') {
        onError(error, errorHandler);
      } else {
        errorHandler();
      }
    },
    refetchIntervalInBackground,
    refetchOnFocus,
    ...other,
  });

  useEffect(() => {
    if (
      refetchOnFocus &&
      options.enabled !== false &&
      !queryResult?.isFetching &&
      queryResult?.refetch
    ) {
      queryResult.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, refetchOnFocus]);

  return queryResult;
};
