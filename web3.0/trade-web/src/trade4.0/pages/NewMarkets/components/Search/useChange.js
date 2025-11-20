/*
 * @Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';
import { cloneDeep, debounce } from 'lodash';
import { useDispatch } from 'dva';
import {
  LIST_TYPE,
  SEARCH_FORM_EVENT,
  SEARCH_KEY,
  defaultSearchData,
  namespace,
} from '../../config';
import { getStore } from 'src/utils/createApp';
import { event } from '@/utils/event';
import { commonSensors } from 'src/trade4.0/meta/sensors';

export const useChange = (form) => {
  const dispatch = useDispatch();
  // 搜索
  const searchAction = useCallback(
    (keyword) => {
      const { nav } = cloneDeep(getStore().getState()[namespace]);
      dispatch({
        type: `${namespace}/update`,
        payload: {
          keyword,
          currentPage: 1,
          isNext: false,
          timestamp: Date.now(),
        },
      });
    },
    [dispatch],
  );
  // onChange
  const onChange = useCallback(
    debounce((values) => {
      const searchVal = values[SEARCH_KEY];
      const { nav, lastListType } = cloneDeep(getStore().getState()[namespace]);
      const listType = nav.active;
      // 不为search类型
      if (searchVal && listType !== LIST_TYPE.SEARCH) {
        nav.active = LIST_TYPE.SEARCH;
        dispatch({
          type: `${namespace}/update`,
          payload: {
            nav,
            lastListType: listType,
          },
        });
        commonSensors.newMarkets.searchActive.click();
        // 退出search状态
      } else if (!searchVal) {
        nav.active = lastListType;
        dispatch({
          type: `${namespace}/update`,
          payload: {
            nav,
            keyword: '',
            searchData: defaultSearchData,
            timestamp: Date.now(),
            searchTime: Date.now(),
            data: [],
          },
        });
      }
      if (searchVal) {
        searchAction(searchVal);
      }
    }, 250),
    [dispatch, searchAction],
  );
  return { onChange };
};

export const useReset = () => {
  const dispatch = useDispatch();
  const reset = useCallback(() => {
    const { nav, lastListType, keyword } = cloneDeep(getStore().getState()[namespace]);
    nav.active = lastListType;
    // 有keyword再退出
    if (keyword) {
      dispatch({
        type: `${namespace}/update`,
        payload: {
          nav,
          lastListType: '',
          keyword: '',
          searchData: defaultSearchData,
          timestamp: Date.now(),
          searchTime: Date.now(),
        },
      });
    }
  }, [dispatch]);
  return { reset };
};
