/**
 * Owner: borden@kupotech.com
 */
import { useMemo, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { map, isNaN, indexOf, remove } from 'lodash';
import { _t } from 'utils/lang';
import { WrapperContext } from '@/pages/Chart/config';
import {
  KLINE_INTERVAL_FAVORITES,
  KLINE_KLINETYPE_FAVORITES,
  KLINE_KLINETYPE,
  KLINE_INTERVAL,
} from '@/storageKey/chart';

import {
  INTERVAL_LIST,
  KLINETYPE_LIST,
  klineTypeMap,
} from '@/pages/Chart/components/TradingViewV24/config';
// import storage from '@/pages/Chart/utils/index';
import { useChartSavedData } from '@/pages/Chart/hooks/useChartSavedData';
import { transferNumDisplayByLang } from 'helper';
import { useBoxCount } from './useBoxCount';
import { namespace } from '../config';

const parseType = (i, currentLang) => {
  const resolution = +i;
  let num = 8;
  let textKey = 'trading.view.hour';
  if (!isNaN(resolution)) {
    num = resolution < 60 ? resolution : resolution / 60;
    textKey = resolution < 60 ? 'trading.view.minute' : 'trading.view.hour';
  } else if (i.indexOf('D') > -1) {
    num = i.replace('D', '') || '1';
    textKey = 'trading.view.day';
  } else if (i.indexOf('W') > -1) {
    num = i.replace('W', '') || '1';
    textKey = 'trading.view.week';
  } else if (i.indexOf('M') > -1) {
    num = i.replace('M', '') || '1';
    textKey = 'trading.view.month';
  }
  const pluralType = transferNumDisplayByLang(currentLang, num);
  const type = pluralType ? _t(textKey, { pluralType, num: `${num}` }) : '';
  return type;
};

// 显示收藏
export const useOuterShown = () => {
  const { boxCount } = useBoxCount();
  const screen = useContext(WrapperContext);
  const enableOuter = useMemo(() => {
    if (boxCount === '4' || screen === 'sm' || screen === 'md' || screen === 'lg') {
      return false;
    }
    return true;
  }, [boxCount, screen]);

  return enableOuter;
};

export const useInterval = () => {
  const interval = useSelector((state) => state[namespace].interval);
  const dispatch = useDispatch();
  const { updateKlineConf } = useChartSavedData();

  const onIntervalChange = useCallback(
    (v) => {
      dispatch({
        type: `${namespace}/update`,
        payload: { interval: v },
      });
      updateKlineConf(KLINE_INTERVAL, v);
    },
    [dispatch, updateKlineConf],
  );

  return { interval, onIntervalChange };
};

// toolbar 上显示的intervel list
export const useIntervalList = () => {
  const dispatch = useDispatch();
  const enableOuter = useOuterShown();
  const { updateKlineConf } = useChartSavedData();

  const currentLang = useSelector((state) => state.app.currentLang);
  const intervalList = useSelector((state) => state[namespace].intervalList);
  const intervalFavorites = useSelector((state) => state[namespace].intervalFavorites);

  // 显示在外部的list
  const displayList = useMemo(() => {
    if (!enableOuter) {
      return [];
    }
    return intervalFavorites;
  }, [enableOuter, intervalFavorites]);

  const list = useMemo(() => {
    const _intervalList = intervalList?.length ? intervalList : INTERVAL_LIST;

    return map(_intervalList, (i) => {
      return {
        value: i,
        valueLabel: parseType(i, currentLang),
        enable: indexOf(displayList, i) > -1,
      };
    });
  }, [currentLang, intervalList, displayList]);

  const addIntervalShow = useCallback(
    (value) => {
      const _intervalList = [...intervalFavorites];
      if (indexOf(_intervalList, value) === -1) {
        _intervalList.push(value);
        dispatch({ type: `${namespace}/update`, payload: { intervalFavorites: _intervalList } });
        updateKlineConf(KLINE_INTERVAL_FAVORITES, _intervalList);
      }
    },
    [intervalFavorites, updateKlineConf, dispatch],
  );

  const dropIntervalShow = useCallback(
    (value) => {
      const _intervalList = [...intervalFavorites];
      remove(_intervalList, (item) => item === value);
      dispatch({ type: `${namespace}/update`, payload: { intervalFavorites: _intervalList } });
      updateKlineConf(KLINE_INTERVAL_FAVORITES, _intervalList);
    },
    [intervalFavorites, updateKlineConf, dispatch],
  );

  return { intervalList: list, displayList, addIntervalShow, dropIntervalShow };
};

export const useKlineType = () => {
  const klineType = useSelector((state) => state[namespace].klineType);
  const dispatch = useDispatch();
  const { updateKlineConf } = useChartSavedData();

  const onKlineTypeChange = useCallback(
    (v) => {
      dispatch({
        type: `${namespace}/update`,
        payload: { klineType: v },
      });
      updateKlineConf(KLINE_KLINETYPE, v);
    },
    [dispatch, updateKlineConf],
  );

  return { klineType, onKlineTypeChange };
};

// toolbar 上显示的 klineType list
export const useKlineTypeList = () => {
  const dispatch = useDispatch();
  const enableOuter = useOuterShown();
  const { updateKlineConf } = useChartSavedData();

  const klineTypeFavorites = useSelector((state) => state[namespace].klineTypeFavorites);

  // 显示在外部的list
  const displayList = useMemo(() => {
    if (!enableOuter) {
      return [];
    }
    return klineTypeFavorites;
  }, [enableOuter, klineTypeFavorites]);

  const list = useMemo(() => {
    return map(KLINETYPE_LIST, (i) => {
      const item = klineTypeMap[i] || {};
      return {
        value: i,
        icon: item.icon,
        text: _t(item.text),
        enable: indexOf(displayList, i) > -1,
      };
    });
  }, [displayList]);

  const addKlineTypeShow = useCallback(
    (value) => {
      const _klineTypeList = [...klineTypeFavorites];
      if (indexOf(_klineTypeList, value) === -1) {
        _klineTypeList.push(value);
        dispatch({ type: `${namespace}/update`, payload: { klineTypeFavorites: _klineTypeList } });
        updateKlineConf(KLINE_KLINETYPE_FAVORITES, _klineTypeList);
      }
    },
    [klineTypeFavorites, updateKlineConf, dispatch],
  );

  const dropKlineTypeShow = useCallback(
    (value) => {
      const _klineTypeList = [...klineTypeFavorites];
      remove(_klineTypeList, (item) => item === value);
      dispatch({ type: `${namespace}/update`, payload: { klineTypeFavorites: _klineTypeList } });
      updateKlineConf(KLINE_KLINETYPE_FAVORITES, _klineTypeList);
    },
    [klineTypeFavorites, updateKlineConf, dispatch],
  );

  return { klineTypeList: list, displayList, addKlineTypeShow, dropKlineTypeShow };
};
