import {useMemoizedFn} from 'ahooks';
import {useMemo} from 'react';

import {useStore} from './useStore';

export const useFilterHelper = () => {
  const {state} = useStore();
  const {renderCardType, filterValuesMap} = state;

  const filterValues = useMemo(() => {
    return filterValuesMap?.[renderCardType] || {};
  }, [renderCardType, filterValuesMap]);

  const {dispatch} = useStore();

  const setFilterValues = useMemoizedFn(values => {
    dispatch({
      type: 'setFilterValues',
      payload: {
        ...filterValues,
        ...values,
      },
    });
  });

  return {filterValues, setFilterValues};
};
