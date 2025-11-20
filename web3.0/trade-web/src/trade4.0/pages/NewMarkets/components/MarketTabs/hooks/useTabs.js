/*
 * @Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { BUSINESS_ENUM, LIST_TYPE, namespace } from '../../../config';
import { getStore } from 'src/utils/createApp';
import { setTabCache } from '../../../utils';
import { cloneDeep, get } from 'lodash';
import { useTabType } from '../../Content/hooks/useType';
import { commonSensors } from 'src/trade4.0/meta/sensors';

/**
 * tabs hooks
 */
export const useTab = (level, isSaveCache = true, isMarketInit) => {
  const dispatch = useDispatch();
  const nav = useSelector((state) => state[namespace].nav);

  // 业务类型
  const { active: listType } = nav;

  // 一级
  const firstActive = get(nav, `${listType}.active`);
  const firstOptions = get(nav, `${listType}.options`);

  // 二级
  const secondActive = get(nav, `${listType}.children.${firstActive}.active`);
  const secondOptions = get(nav, `${listType}.children.${firstActive}.options`);

  // 三级
  const thirdActive = get(
    nav,
    `${listType}.children.${firstActive}.children.${secondActive}.active`,
  );

  const thirdOptions = get(
    nav,
    `${listType}.children.${firstActive}.children.${secondActive}.options`,
  );

  // onChange
  const onChange = useCallback(
    (e, v, listTypeValue, level2TabValue) => {
      const _listType = listTypeValue || listType;
      const navData = cloneDeep(getStore().getState()[namespace].nav);
      if (level === 1) {
        if (navData[_listType].active === v && level2TabValue === undefined) {
          return;
        }
        // 业务也切换
        if (_listType !== LIST_TYPE.COIN) {
          commonSensors.newMarkets.businessSwitch.click(v);
        }
        // 初始化的时候会有可能会设置1级的同时，设置2级，
        // TODO，这个目前实现不太优雅，后续优化
        if (isMarketInit && level2TabValue) {
          navData[_listType].children[BUSINESS_ENUM.MARGIN].active = level2TabValue;
        }
        navData[_listType].active = v;
      } else if (level === 2) {
        navData[_listType].children[firstActive].active = v;
      } else if (level === 3) {
        navData[_listType].children[firstActive].children[secondActive].active = v;
      }
      // 参数组装
      const payload = {
        nav: {
          ...navData,
        },
        currentPage: 1,
        timestamp: Date.now(),
        isNext: false,
        data: 'updating',
      };
      dispatch({
        type: `${namespace}/update`,
        payload,
      });
      isSaveCache && setTabCache(navData);
    },
    [listType, level, dispatch, isSaveCache, isMarketInit, firstActive, secondActive],
  );
  return {
    listType,
    firstActive,
    firstOptions,
    secondActive,
    secondOptions,
    thirdActive,
    thirdOptions,
    onChange,
  };
};

/**
 * 获取tab active值
 */
export const getTab = () => {
  const { nav } = getStore().getState()[namespace];
  // 业务类型
  const { active: listType } = nav;

  // 一级
  const firstActive = get(nav, `${listType}.active`);

  // 二级
  const secondActive = get(nav, `${listType}.children.${firstActive}.active`);

  // 三级
  const thirdActive = get(
    nav,
    `${listType}.children.${firstActive}.children.${secondActive}.active`,
  );
  return { firstActive, secondActive, thirdActive, listType };
};

/**
 * 一级tabs右侧的切换按钮操作变化
 */
export const useListTypeChange = () => {
  const dispatch = useDispatch();
  const { isBusiness, listType } = useTabType();
  // 切换变化函数
  const onChange = useCallback(() => {
    const value = isBusiness ? LIST_TYPE.COIN : LIST_TYPE.BUSINESS;
    commonSensors.newMarkets.coinSwitch.click(value);
    const navData = cloneDeep(getStore().getState()[namespace].nav);
    navData.active = value;
    dispatch({
      type: `${namespace}/update`,
      payload: {
        nav: navData,
        lastListType: value,
        timestamp: Date.now(),
        currentPage: 1,
        data: [],
      },
    });
  }, [isBusiness, dispatch]);

  return { onChange, listType };
};
