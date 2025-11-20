/**
 * Owner: solar@kupotech.com
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MODEL_NAMESPACE } from '../constants';

export function useTransferSelector(selector) {
  return useSelector((state) => selector(state[MODEL_NAMESPACE]));
}

export function useTransferDispatch() {
  const dispatch = useDispatch();
  return useCallback(
    ({ type, payload }) => {
      return dispatch({
        type: `${MODEL_NAMESPACE}/${type}`,
        payload,
      });
    },
    [dispatch],
  );
}

export function useTransferLoading(effects) {
  return useSelector((state) => state.loading.effects[`${MODEL_NAMESPACE}/${effects}`]);
}
