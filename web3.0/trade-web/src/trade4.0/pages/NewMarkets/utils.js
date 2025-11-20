/*
 * @Owner: Clyne@kupotech.com
 */
import { filter, forEach, get, includes } from 'lodash';
import storage from 'src/utils/storage';
import {
  ALL_OPTIONS,
  BUSINESS_ENUM,
  COIN_FIRST_OPTIONS,
  FAVOR_CACHE_KEY,
  FAVOR_ENUM,
  FAVOR_SECOND_OPTIONS,
  LIST_TYPE,
  MARKET_CACHE_KEY,
  availablePlatesId,
} from './config';

/**
 * 获取tab的key
 */
export const getTabCache = () => {
  return storage.getItem(MARKET_CACHE_KEY);
};

export const setTabCache = (cache) => {
  // storage.setItem(MARKET_CACHE_KEY, cache);
};

export const getFavCache = () => {
  return storage.getItem(FAVOR_CACHE_KEY);
};

export const setFavCache = (value) => {
  // return storage.setItem(FAVOR_CACHE_KEY, value);
};

/**
 * 获取fav的参数key，用于接口，也用于获取数据的key
 */
export const getFavKey = ({ isFutures, isSpot, isCoin, isMargin }) => {
  let dataKey = '';
  if (isCoin) {
    dataKey = FAVOR_ENUM.COIN;
  } else if (isFutures) {
    dataKey = FAVOR_ENUM.FUTURES;
  } else if (isSpot) {
    dataKey = FAVOR_ENUM.SPOT;
  } else if (isMargin) {
    dataKey = FAVOR_ENUM.MARGIN;
  }
  return dataKey;
};

export const getResponseDataKey = ({
  isFavorCoin,
  isFavorSpot,
  isFavorMargin,
  isFavorFutures,
  isListCoin,
  isFutures,
  isSpot,
  isMargin,
}) => {
  if (isFavorCoin) {
    return 'favouriteCurrencies';
  }
  if (isFavorSpot || isFavorMargin) {
    return 'favouriteSpotSymbols';
  }
  if (isFavorFutures) {
    return 'favouriteKumexSymbols';
  }
  if (isListCoin) {
    return 'currencies';
  }
  if (isSpot) {
    return 'spotSymbols';
  }
  if (isMargin) {
    return 'marginSymbols';
  }
  if (isFutures) {
    return 'kumexSymbols';
  }
};
/**
 * 格式化现货nav数据
 */
export const formatSpotNav = (spotData, spotNewData, nav) => {
  const spotNav = nav[LIST_TYPE.BUSINESS].children[BUSINESS_ENUM.SPOT];
  const spotOptions = [];
  const spotChildren = {};
  const markMap = {};

  forEach(spotData, ({ displayName, label, name }) => {
    // option
    markMap[name] = {
      label: displayName,
      isNew: label === 2,
      isHot: label === 1,
      value: name,
      isNotI18n: true,
    };
  });
  forEach(spotNewData, ({ name, subCategories: quotes }) => {
    spotOptions.push({
      label: name,
      value: name,
      isNotI18n: true,
    });
    // children
    if (quotes && quotes.length > 0) {
      const childOptions = [ALL_OPTIONS];
      forEach(quotes, (v) => {
        childOptions.push(markMap[v] || { label: v, value: v, isNotI18n: true });
      });
      const childrenActive = get(spotNav, `children.${name}.active`);
      spotChildren[name] = {
        active: getNavActive(childOptions, childrenActive),
        options: childOptions,
      };
    }
  });
  const active = getNavActive(spotOptions, spotNav.active);

  nav[LIST_TYPE.BUSINESS].children[BUSINESS_ENUM.SPOT] = {
    active,
    options: spotOptions,
    children: spotChildren,
  };
};

/**
 * 格式化合约nav数据
 */
export const formatFuturesNav = (data, nav, currentLang = 'en_US') => {
  try {
    const futuresNav = nav[LIST_TYPE.BUSINESS].children[BUSINESS_ENUM.FUTURES];
    const futuresOptions = [];
    const futuresChildren = {};
    forEach(data, ({ displayName, id, children, hotMark }) => {
      const display = JSON.parse(displayName)[currentLang];
      futuresOptions.push({
        label: display,
        value: id,
        isNotI18n: true,
        isHot: hotMark === '1',
      });

      if (children && children.length > 0) {
        const childOptions = [ALL_OPTIONS];
        forEach(children, ({ displayName: childDisplay, id: childId, hotMark: childHotMark }) => {
          const childrenDisplay = JSON.parse(childDisplay)[currentLang];
          childOptions.push({
            label: childrenDisplay,
            value: childId,
            isNotI18n: true,
            isHot: childHotMark === '1',
          });
        });

        const childrenActive = get(futuresNav, `children.${id}.active`);
        futuresChildren[id] = {
          active: getNavActive(childOptions, childrenActive),
          options: childOptions,
        };
      }
    });
    nav[LIST_TYPE.BUSINESS].children[BUSINESS_ENUM.FUTURES] = {
      options: futuresOptions,
      active: getNavActive(futuresOptions, futuresNav.active),
      children: futuresChildren,
    };
  } catch (e) {
    console.error('=== futures nav format error', e);
  }
};

/**
 * 格式化币种nav数据
 */
export const formatCoinNav = (data, nav) => {
  const coinNav = nav[LIST_TYPE.COIN];
  const coinOptions = COIN_FIRST_OPTIONS;
  /**
   * TODO，待优化，trade-public-web神奇的逻辑，根它保持一致,接口查询回来，filter后，只显示下面availablePlatesId的分类，
   * 这个思路还是牛掰
   */
  const navData = filter(data, (item) => includes(availablePlatesId, item.tagId));
  forEach(navData, ({ title, tagId }) => {
    // option
    coinOptions.push({
      label: title,
      value: tagId,
      isNotI18n: true,
    });
  });

  const active = getNavActive(coinOptions, coinNav.active);
  nav[LIST_TYPE.COIN] = {
    active,
    options: coinOptions,
    children: {
      [FAVOR_ENUM.FAVOR]: {
        active: FAVOR_ENUM.SPOT,
        options: FAVOR_SECOND_OPTIONS,
      },
    },
  };
};

/**
 * 获取，检查tab的value是否存在options中，存在则返回原值，不存在返回options第一个
 */
export const getNavActive = (options, v) => {
  const ret = filter(options, ({ value }) => value === v);
  return ret.length > 0 ? v : options[0].value;
};
