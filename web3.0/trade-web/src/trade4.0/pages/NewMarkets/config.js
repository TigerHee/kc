/*
 * @Owner: Clyne@kupotech.com
 */
import { filter } from 'lodash';
import { createContext } from 'react';
// import { getFavCache, getTabCache } from './utils';
import { isDisplayFutures, isDisplayMargin } from '@/meta/multiTenantSetting';
// wrapper context
export const WrapperContext = createContext('');

export const SwitchContext = createContext(false);

export const SEARCH_FORM_EVENT = 'SEARCH_FORM_EVENT';

export const MARKET_SOCKET_EVENT = 'MARKET_SOCKET_EVENT';

export const MARKET_RESUBSCRIBE_EVENT = 'MARKET_RESUBSCRIBE_EVENT';

// 初始化的时候当是业务类型的tab的时候，需要定位到对应交易类型的tab上
export const MARKET_INIT_EVENT = 'MARKET_INIT_EVENT';

/**
 * TODO，待优化，trade-public-web神奇的逻辑，根它保持一致,接口查询回来，filter后，只显示下面的分类，
 * 这个思路还是牛掰
 */
export const availablePlatesId = [
  '6231ee26226318dcd0d676ac', //   infrastructure
  '6231ee26226318dcd0d676a9', //   payments
  '6231ee26226318dcd0d6769c', //   memes
  '6231ee26226318dcd0d676b0', //   solana-ecosystem
  '6231ee26226318dcd0d676ae', //   defi
  '6231ee26226318dcd0d676af', //   cosmos-ecosystem
  '6231ee26226318dcd0d676ad', //   nft
  '6231ee26226318dcd0d676a2', //   web3
  '6231ee26226318dcd0d676b7', //   terra-ecosystem
  '6231ee26226318dcd0d676aa', //   gaming
  '6231ee26226318dcd0d676a8', //   metaverse
  '6231ee26226318dcd0d676b5', //   kcc-ecosystem
  '6279d4670f55c60001b6f65f', //   kucoin-features
  '6369cfd201e21b0001295bc5', //   sports-coins
];

// 组件名称
export const name = 'newMarkets';
export const namespace = 'newMarkets';

export const blockId = name;

// search Key
export const SEARCH_KEY = 'searchKey';

// ============ 请求参数枚举 ============
// sort排序字段
export const SORT_ENUM = {
  ASC: 'ASC',
  DESC: 'DESC',
};

// sort field
export const SORT_FIELD_ENUM = {
  SYMBOL_CODE: 'symbolCode',
  LAST_PRICE: 'lastTradePrice',
  CHANGE_RATE_24: 'changeRate24h',
};

/**
 * market列表类型
 */
export const LIST_TYPE = {
  // 业务类型
  BUSINESS: 'BUSINESS',
  // 币种类型
  COIN: 'ALL_CURRENCY',
  // 搜索类型
  SEARCH: 'SEARCH',
};

/**
 * 业务类型tab枚举
 */
export const BUSINESS_ENUM = {
  // 币币
  SPOT: 'SPOT',
  // 杠杆
  MARGIN: 'MARGIN',
  // 合约
  FUTURES: 'FUTURE',
};

/**
 * 自选枚举
 * 单独拿出来，因为它即在业务类型展示也在coin类型展示
 */
export const FAVOR_ENUM = {
  FAVOR: 'FAVOURITE',
  COIN: 'coin',
  SPOT: 'spot',
  MARGIN: 'margin',
  FUTURES: 'future',
};

/**
 * ALL
 */
export const ALL = 'all';

/**
 * 业务一级分类options
 */
export const BUSINESS_FIRST_OPTIONS = [
  // 自选
  {
    label: '8qmvETCYyz7Rdv8geatk9b',
    value: FAVOR_ENUM.FAVOR,
  },
  // 币币
  {
    label: 'tradeType.trade',
    value: BUSINESS_ENUM.SPOT,
  },
  // 杠杆
  ...(isDisplayMargin() ? [{
    label: 'tradeType.margin',
    value: BUSINESS_ENUM.MARGIN,
  }] : []),
  // 合约
  ...(isDisplayFutures() ? [{
    label: 'tradeType.kumex',
    value: BUSINESS_ENUM.FUTURES,
  }] : []),
];

export const ALL_OPTIONS = {
  label: 'all',
  value: ALL,
};

/**
 * 搜索类型一级分类options
 */
export const SEARCH_FIRST_OPTIONS = [ALL_OPTIONS].concat(
  filter(BUSINESS_FIRST_OPTIONS, ({ value }) => value !== FAVOR_ENUM.FAVOR),
);

/**
 * 币种一级分类options，
 * 币种的一级分类需要根接口返回的进行组装，需要注意下
 */
export const COIN_FIRST_OPTIONS = [
  // 自选
  {
    label: '8qmvETCYyz7Rdv8geatk9b',
    value: FAVOR_ENUM.FAVOR,
  },
  // all
  ALL_OPTIONS,
];

/**
 * 自选二级分类options
 */
export const FAVOR_SECOND_OPTIONS = [
  { label: 'trans.currency', value: FAVOR_ENUM.COIN },
  {
    label: 'tradeType.trade',
    value: FAVOR_ENUM.SPOT,
  },
  // 杠杆
  ...(isDisplayMargin() ? [{
    label: 'tradeType.margin',
    value: FAVOR_ENUM.MARGIN,
  }] : []),
  // 合约
  ...(isDisplayFutures() ? [{
    label: 'tradeType.kumex',
    value: FAVOR_ENUM.FUTURES,
  }] : []),
];

export const MARGIN_ENUM = {
  ISOLATED: 'isolated',
  MARGIN_TRADE: 'marginTrade',
};

/**
 * margin 二级分类
 */
export const MARGIN_SECOND_OPTIONS = [
  {
    label: 'isolated',
    value: 'isolated',
  },
  {
    label: 'cross',
    value: 'marginTrade',
  },
];
/**
 * 类型缓存key
 */
export const MARKET_CACHE_KEY = 'MARKET_CACHE_KEY';
export const FAVOR_CACHE_KEY = 'FAVOR_CACHE_KEY';

/**
 * 分页数目
 */
export const PAGE_SIZE = 50;

/**
 * all search items数目
 */
export const ITEM_GROUPS_NUM = 5;

/**
 * 默认导航条数据
 */
export const DEFAULT_NAV = {
  active: LIST_TYPE.BUSINESS,
  // 币种数据源key
  [LIST_TYPE.COIN]: {
    active: ALL_OPTIONS.value,
    options: COIN_FIRST_OPTIONS,
    children: {
      // 自选
      [FAVOR_ENUM.FAVOR]: {
        active: FAVOR_ENUM.SPOT,
        options: FAVOR_SECOND_OPTIONS,
        children: {},
      },
    },
  },
  // 业务，
  [LIST_TYPE.BUSINESS]: {
    active: BUSINESS_ENUM.SPOT,
    options: BUSINESS_FIRST_OPTIONS,
    children: {
      // 自选
      [FAVOR_ENUM.FAVOR]: {
        active: FAVOR_ENUM.SPOT,
        options: FAVOR_SECOND_OPTIONS,
        children: {},
      },
      // 业务spot
      [BUSINESS_ENUM.SPOT]: {
        active: '',
        options: [],
        // 现货二级
        children: {},
      },
      ...(isDisplayMargin() ? {
        // 业务杠杆
      [BUSINESS_ENUM.MARGIN]: {
        active: MARGIN_ENUM.ISOLATED,
        options: MARGIN_SECOND_OPTIONS,
        children: {},
      },
      } : {}),
      ...(isDisplayFutures() ? {
         // 业务合约
      [BUSINESS_ENUM.FUTURES]: {
        active: '',
        options: [],
        children: {},
      },
      } : {}),
    },
  },
  // Search
  [LIST_TYPE.SEARCH]: {
    active: ALL_OPTIONS.value,
    options: SEARCH_FIRST_OPTIONS,
    children: {},
  },
};

/**
 * 默认search数据
 */
export const defaultSearchData = {
  [BUSINESS_ENUM.SPOT]: {
    total: 0,
    data: [],
  },
  ...(isDisplayMargin() ? {
    [BUSINESS_ENUM.MARGIN]: {
      total: 0,
      data: [],
    },
  } : {}),
  ...(isDisplayFutures() ? {
    [BUSINESS_ENUM.FUTURES]: {
      total: 0,
      data: [],
    },
  } : {}),
};

/**
 * 默认收藏数据
 */
export const defaultFav = {
  [FAVOR_ENUM.COIN]: [],
  ...(isDisplayFutures() ? {
    [FAVOR_ENUM.FUTURES]: [],
  } : {}),
  ...(isDisplayMargin() ? {
    [FAVOR_ENUM.MARGIN]: [],
  } : {}),
   [FAVOR_ENUM.SPOT]: [],
};

/**
 * default state
 */
export const defaultState = {
  // ===================== tab =====================
  // nav Data
  nav: DEFAULT_NAV,
  // nav: DEFAULT_NAV,
  // ===================== header =====================
  coinSort: '',
  pairSort: '',
  lastPriceSort: '',
  changeSort: '',
  // ===================== data =====================
  timestamp: '',
  data: [],
  // ===================== 除tab的请求参数 start =====================
  currentPage: 1,
  // 排序字段（按照sortField字段排序，目前只有3个值，见SORT_FIELD_ENUM）
  sortField: '',
  // 排序类型 见SORT_ENUM
  sortType: '',
  // ===================== end =====================
  total: 0,
  searchData: defaultSearchData,
  searchTime: '',
  fav: defaultFav,
  //
  keyword: '',
  symbols: [],
  lastSymbols: [],
};
