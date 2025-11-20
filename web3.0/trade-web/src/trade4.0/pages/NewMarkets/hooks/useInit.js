/*
 * @Owner: Clyne@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { useEffect } from 'react';
import {
  ALL,
  BUSINESS_ENUM,
  FAVOR_ENUM,
  LIST_TYPE,
  MARGIN_SECOND_OPTIONS,
  MARKET_INIT_EVENT,
  PAGE_SIZE,
  namespace,
} from '../config';
import { getTab, useTab } from '../components/MarketTabs/hooks/useTabs';
import { getStore } from 'src/utils/createApp';
import { getTabType, useTabType } from '../components/Content/hooks/useType';
import { getResponseDataKey } from '../utils';
import { getTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES, ISOLATED, MARGIN, SPOT } from 'src/trade4.0/meta/const';
import { event } from 'src/trade4.0/utils/event';

export const useInit = () => {
  useInitNav();
  useInitList();
  useInitFav();
};

/**
 * UX提了一个优化，下拉的时候如果当前是业务类型的tab，tab就定位到对应交易类型
 */
export const useInitEvent = () => {
  const { isSearch } = useTabType();
  // search类型的tab切换不缓存
  const { onChange } = useTab(1, !isSearch, true);
  useEffect(() => {
    event.on(MARKET_INIT_EVENT, (e) => {
      const { firstActive = '', secondActive, listType: listT } = getTab();
      const { isBusiness } = getTabType({ firstActive, secondActive, listType: listT });
      const tradeType = getTradeType();
      // 业务的一级tab映射
      const firstTypeMap = {
        [FUTURES]: BUSINESS_ENUM.FUTURES,
        [SPOT]: BUSINESS_ENUM.SPOT,
        [MARGIN]: BUSINESS_ENUM.MARGIN,
        [ISOLATED]: BUSINESS_ENUM.MARGIN,
      };

      // 杠杠的时候二级需要区分逐仓和全仓
      const secondTypeMap = {
        [ISOLATED]: MARGIN_SECOND_OPTIONS[0].value,
        [MARGIN]: MARGIN_SECOND_OPTIONS[1].value,
      };

      const typeDataKey = firstTypeMap[tradeType];
      const secTypeDataKey = secondTypeMap[tradeType];
      if (isBusiness && firstActive.indexOf(tradeType) !== 0 && typeDataKey) {
        console.log('====init Market Event', typeDataKey, secTypeDataKey);
        onChange(e, typeDataKey, undefined, secTypeDataKey);
      }
    });

    return () => event.off(MARKET_INIT_EVENT);
  }, [onChange]);
};

/**
 * 初始化列表
 */
export const useInitList = () => {
  const dispatch = useDispatch();
  const timestamp = useSelector((state) => state[namespace].timestamp);
  // nav初始化完成后，拉去列表数据
  useEffect(() => {
    if (!timestamp) {
      return;
    }
    const {
      sortField,
      sortType,
      currentPage,
      keyword,
      isNext = false,
    } = getStore().getState()[namespace];
    const { firstActive, secondActive, thirdActive, listType } = getTab();
    const tabInfo = getTabType({ firstActive, secondActive, listType });
    const { isCoin, isFavor, isMargin, isSearchAll, isFavorMargin } = tabInfo;
    let tabType = firstActive;
    const responseKey = getResponseDataKey(tabInfo);
    // 哎，接口不知道咋设计的，全部查询的时候，按照二级的方式传递
    let subCategory =
      thirdActive && thirdActive !== ALL ? [secondActive, thirdActive].join(',') : secondActive;
    let pageSize = PAGE_SIZE;
    // 币种根自选有点特殊
    if (isFavor) {
      tabType = FAVOR_ENUM.FAVOR;
      pageSize = 200;
      subCategory = secondActive;
    } else if (isCoin) {
      tabType = LIST_TYPE.COIN;
      subCategory = firstActive;
    }

    const payload = {
      pageSize,
      currentPage,
      sortField,
      keyword,
      sortType,
      // 币种的
      tabType,
      subCategory: isMargin ? '' : subCategory,
      isNext,
      responseKey,
      isSearchAll,
      marginType: isMargin ? subCategory : '',
    };

    // 这里有点特殊，杠杠没有自选使用现货的
    if (isFavorMargin) {
      payload.subCategory = FAVOR_ENUM.SPOT;
      payload.marginType = '';
    }

    dispatch({
      type: `${namespace}/getList`,
      payload,
    });
  }, [dispatch, timestamp]);
};

/**
 * 初始化nav
 */
export const useInitNav = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: `${namespace}/getNav`,
    });
  }, [dispatch]);
};

/**
 * 初始化Fav
 */
export const useInitFav = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: `${namespace}/getCollect`,
    });
  }, [dispatch]);
};

/**
 * float
 */
export const useInitFloat = (isFloat) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: { isFloat },
    });
  }, [isFloat, dispatch]);
};
