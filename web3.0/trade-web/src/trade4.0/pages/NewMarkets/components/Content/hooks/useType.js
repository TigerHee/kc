/*
 * @Owner: Clyne@kupotech.com
 */
import { useCallback } from 'react';
import { FUTURES, ISOLATED, MARGIN, SPOT } from 'src/trade4.0/meta/const';
import { ALL, BUSINESS_ENUM, FAVOR_ENUM, LIST_TYPE, MARGIN_ENUM } from '../../../config';
import { useTab } from '../../MarketTabs/hooks/useTabs';

export const useType = () => {
  const { isCoin, isFutures } = useTabType();
  // 兄弟们，这里有先后顺序，修改需要注意，
  // 合约类型
  if (isFutures) {
    return FUTURES;
    // 币种类型
  } else if (isCoin) {
    return LIST_TYPE.COIN;
  }
};

export const getTabType = ({ listType, firstActive, secondActive }) => {
  const isSearch = listType === LIST_TYPE.SEARCH;
  const isBusiness = listType === LIST_TYPE.BUSINESS;
  // 自选
  const isFavor = firstActive === FAVOR_ENUM.FAVOR;
  // 业务类型 && 合约
  const isBusinessFutures = isBusiness && firstActive === BUSINESS_ENUM.FUTURES;
  // 业务类型 && 现货
  const isBusinessSpot = isBusiness && firstActive === BUSINESS_ENUM.SPOT;
  // 业务类型 && 杠杆
  const isBusinessMargin = isBusiness && firstActive === BUSINESS_ENUM.MARGIN;
  // 业务类型 && 逐仓杠杠
  const isBusinessIsolatedMargin = isBusinessMargin && secondActive === MARGIN_ENUM.ISOLATED;
  // 业务类型 && 全仓杠杠
  const isBusinessTradeMargin = isBusinessMargin && secondActive === MARGIN_ENUM.MARGIN_TRADE;
  // 自选 && 合约
  const isFavorFutures = isFavor && secondActive === FAVOR_ENUM.FUTURES;
  // 自选 && 现货
  const isFavorSpot = isFavor && secondActive === FAVOR_ENUM.SPOT;
  // 自选 && 杠杆
  const isFavorMargin = isFavor && secondActive === FAVOR_ENUM.MARGIN;
  const isSearchAll = isSearch && firstActive === ALL;
  const isSearchSpot = isSearch && firstActive === BUSINESS_ENUM.SPOT;
  const isSearchFutures = isSearch && firstActive === BUSINESS_ENUM.FUTURES;
  const isSearchMargin = isSearch && firstActive === BUSINESS_ENUM.MARGIN;
  // 是否是合约，杠杆，现货
  const isFutures = isBusinessFutures || isFavorFutures || isSearchFutures;
  const isSpot = isBusinessSpot || isFavorSpot || isSearchSpot;
  const isMargin = isBusinessMargin || isFavorMargin || isSearchMargin;

  // 币种，(listType为币种 && 非自选） || 自选币种
  const isCoin =
    (listType === LIST_TYPE.COIN && !isFavor) || (isFavor && secondActive === FAVOR_ENUM.COIN);

  // 自选 && coin
  const isFavorCoin = isFavor && secondActive === FAVOR_ENUM.COIN;
  const isListCoin = listType === LIST_TYPE.COIN && !isFavor;

  return {
    listType,
    isListCoin,
    // 自选
    isFavor,
    isFavorCoin,
    isFavorSpot,
    isFavorMargin,
    isFavorFutures,
    // 类型
    isCoin,
    isFutures,
    isSpot,
    isMargin,
    // 业务类型
    isBusiness,
    isBusinessSpot,
    isBusinessMargin,
    isBusinessIsolatedMargin,
    isBusinessTradeMargin,
    isBusinessFutures,
    // 搜索
    isSearch,
    isSearchAll,
    isSearchSpot,
    isSearchFutures,
    isSearchMargin,
  };
};

export const useTabType = () => {
  const { listType, firstActive, secondActive } = useTab();
  const retInfo = getTabType({ listType, firstActive, secondActive });
  const { isBusinessIsolatedMargin, isBusinessMargin, isFutures, isSpot, isFavorMargin } = retInfo;

  const getItemTradeType = useCallback(
    (tradeType) => {
      if (tradeType) {
        return tradeType;
      }
      if (isSpot || isFavorMargin) {
        return SPOT;
      } else if (isFutures) {
        return FUTURES;
      } else if (isBusinessIsolatedMargin) {
        return ISOLATED;
      } else if (isBusinessMargin) {
        return MARGIN;
      }
    },
    [isBusinessIsolatedMargin, isBusinessMargin, isFavorMargin, isFutures, isSpot],
  );
  return { ...retInfo, getItemTradeType };
};
