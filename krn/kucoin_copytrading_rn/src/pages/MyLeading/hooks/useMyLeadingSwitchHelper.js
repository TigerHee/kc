import {useMemoizedFn} from 'ahooks';
import {useEffect, useState} from 'react';

import useTracker from 'hooks/useTracker';
import {
  MY_LEADING_LIST_TYPE,
  MY_LEADING_RENDER_ITEM_TYPE,
  MyLeadListType2TrackPayloadMap,
  RANGE_LIST_TYPE,
} from '../constant';
import {useStore} from './useStore';

const makeRenderCardType = ({tabValue, rangeValue}) => {
  switch (tabValue) {
    case MY_LEADING_LIST_TYPE.myFollower:
      return MY_LEADING_RENDER_ITEM_TYPE.myFollower;

    case MY_LEADING_LIST_TYPE.myPosition:
      return rangeValue === RANGE_LIST_TYPE.current
        ? MY_LEADING_RENDER_ITEM_TYPE.myPositionCurrent
        : MY_LEADING_RENDER_ITEM_TYPE.myPositionHistory;
    default:
      return undefined;
  }
};

export const useMyLeadingSwitchHelper = () => {
  const [tabValue, setTabValue] = useState(MY_LEADING_LIST_TYPE.myPosition);
  const [rangeValue, setRangeValue] = useState(RANGE_LIST_TYPE.current);
  const {dispatch} = useStore();
  const {onClickTrackInMainMyLeadPage} = useTracker();

  const handleTabChange = useMemoizedFn(val => {
    // 一级tab 切换埋点
    MyLeadListType2TrackPayloadMap[val] &&
      onClickTrackInMainMyLeadPage(MyLeadListType2TrackPayloadMap[val]);

    setTabValue(val);
  });
  const handleRangeChange = useMemoizedFn(setRangeValue);

  /** 根据tabValue和rangeValue生成的MY_LEADING_RENDER_ITEM_TYPE的值 */
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
