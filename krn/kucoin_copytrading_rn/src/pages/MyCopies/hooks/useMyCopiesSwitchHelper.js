import {useMemoizedFn} from 'ahooks';
import {useEffect, useState} from 'react';

import {
  MY_COPY_LIST_TYPE,
  MY_COPY_RENDER_ITEM_TYPE,
  RANGE_LIST_TYPE,
} from '../constant';
import {useStore} from './useStore';

const makeRenderCardType = ({tabValue, rangeValue}) => {
  switch (tabValue) {
    case MY_COPY_LIST_TYPE.myAttention:
      return MY_COPY_RENDER_ITEM_TYPE.myAttention;
    case MY_COPY_LIST_TYPE.myTrader:
      return rangeValue === RANGE_LIST_TYPE.current
        ? MY_COPY_RENDER_ITEM_TYPE.myTradeCurrent
        : MY_COPY_RENDER_ITEM_TYPE.myTradeHistory;
    case MY_COPY_LIST_TYPE.myPosition:
      return rangeValue === RANGE_LIST_TYPE.current
        ? MY_COPY_RENDER_ITEM_TYPE.myPositionCurrent
        : MY_COPY_RENDER_ITEM_TYPE.myPositionHistory;
    default:
      return undefined;
  }
};

export const useMyCopiesSwitchHelper = () => {
  const [tabValue, setTabValue] = useState(MY_COPY_LIST_TYPE.myPosition);
  const [rangeValue, setRangeValue] = useState(RANGE_LIST_TYPE.current);
  const {dispatch} = useStore();
  const handleTabChange = useMemoizedFn(setTabValue);
  const handleRangeChange = useMemoizedFn(setRangeValue);

  /** 根据tabValue和rangeValue生成的MY_COPY_RENDER_ITEM_TYPE的值 */
  const asyncStoreRenderType = useMemoizedFn(({tabValue, rangeValue}) => {
    dispatch({
      type: 'asyncRenderCardType',
      payload: makeRenderCardType({tabValue, rangeValue}),
    });
  });

  useEffect(() => {
    asyncStoreRenderType({tabValue, rangeValue});
  }, [tabValue, rangeValue, asyncStoreRenderType]);

  return {
    handleTabChange,
    handleRangeChange,
    rangeValue,
    tabValue,
  };
};
