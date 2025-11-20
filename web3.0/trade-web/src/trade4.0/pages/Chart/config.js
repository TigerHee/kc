/**
 * Owner: borden@kupotech.com
 */
import { createContext } from 'react';
import { includes, filter, map } from 'lodash';
import {
  KLINE_BOX_COUNT,
  KLINE_ACTIVE_IDX,
  KLINE_SYMBOLS,
  KLINE_INDEX_FAVORITES,
  KLINE_INDEX_TEMPLATES,
  KLINE_INTERVAL,
  KLINE_INTERVAL_FAVORITES,
  KLINE_KLINETYPE,
  KLINE_KLINETYPE_FAVORITES,
  KLINE_CHARTTYPE,
  KLINE_EXTRATOOL,
} from '@/storageKey/chart';
import {
  INTERVAL_SHOWN_LIST,
  KLINETYPE_SHOWN_LIST,
} from '@/pages/Chart/components/TradingViewV24/config';
import storage from '@/pages/Chart/utils/index';
import { isFuturesNew, FUTURES } from '@/meta/const';

const { getItem, setItem } = storage;

// wrapper context
export const WrapperContext = createContext('');
// 组件名称
export const name = 'chart';

export const eventName = `screen_${name}_change`;

// k线行情轮询时间
export const marketLoop = 10 * 1000;

// k线时间粒度默认值
export const DEFAULT_INTERVAL = '15';

// =============== model相关 ===============
// 组件dva models
export const namespace = '$tradeKline';

// k线Topic
export const topicName = '/market/candlesFrequency1000:{SYMBOL_LIST}';
export const futuresTopicName = '/contractMarket/limitCandle:{SYMBOL_LIST}';

// 用于区分交易融合后的symbolTabs
const tabsVersion = 'V1';

export const DEFAULT_SAVED_DATA = {
  [KLINE_INDEX_FAVORITES]: [],
  [KLINE_INTERVAL_FAVORITES]: INTERVAL_SHOWN_LIST,
  [KLINE_KLINETYPE_FAVORITES]: KLINETYPE_SHOWN_LIST,
  [KLINE_INTERVAL]: DEFAULT_INTERVAL,
  [KLINE_KLINETYPE]: 1,
  [KLINE_INDEX_TEMPLATES]: [],
};

const getInitialLocalData = () => {
  // 处理页面本地保存的kLineSymbols数据 (initData)
  // 检查本地boxCount是否存在且合法
  const localBoxCount = includes(['1', '4'], getItem(KLINE_BOX_COUNT))
    ? getItem(KLINE_BOX_COUNT)
    : '1';
  const localTabsVersion = getItem('tabsVersionKline');

  // 需要初始化数据
  const isInitData = localTabsVersion !== tabsVersion;

  let localActiveKlineIndex = isInitData ? 0 : +getItem(KLINE_ACTIVE_IDX);
  if (isNaN(localActiveKlineIndex) || +localBoxCount <= localActiveKlineIndex) {
    localActiveKlineIndex = 0;
  }

  let localKlineSymbols = isInitData ? [] : getItem(KLINE_SYMBOLS) || [];
  // 初始化检测是否有多个高亮，有就设置第一个为高亮
  let countIndex = 0;
  if (localKlineSymbols.length > 1) {
    localKlineSymbols.forEach((item) => {
      if (item.displayIndex === 0) {
        countIndex += 1;
      }
    });
  }
  if (countIndex > 1) {
    localKlineSymbols = localKlineSymbols.map((item, index) => {
      const newItem = item;
      if (index === 0) {
        newItem.displayIndex = 0;
      } else {
        newItem.displayIndex = 100;
      }
      return newItem;
    });
  }

  // 不支持合约，过滤掉相关内容
  if (!isFuturesNew()) {
    localActiveKlineIndex = 0;
    localKlineSymbols = filter(localKlineSymbols, (item) => item.tradeType !== FUTURES);
    // 重新排序
    map(localKlineSymbols, (item, index) => {
      const newItem = { ...item, newItem: index };
      return newItem;
    });

    setItem(KLINE_ACTIVE_IDX, localActiveKlineIndex);
    setItem(KLINE_SYMBOLS, localKlineSymbols);
  }

  setItem('tabsVersionKline', tabsVersion);
  return {
    boxCount: localBoxCount, // 一宫格 ｜ 多宫格
    activeIndex: localActiveKlineIndex, // k线box区域activeIndex
    kLineSymbols: localKlineSymbols,
    favorites: getItem(KLINE_INDEX_FAVORITES) || DEFAULT_SAVED_DATA[KLINE_INDEX_FAVORITES], // k线指标favorites
    studyTemplates: getItem(KLINE_INDEX_TEMPLATES) || DEFAULT_SAVED_DATA[KLINE_INDEX_TEMPLATES], // k线指标模版
    interval: getItem(KLINE_INTERVAL) || DEFAULT_SAVED_DATA[KLINE_INTERVAL],
    intervalFavorites:
      getItem(KLINE_INTERVAL_FAVORITES) || DEFAULT_SAVED_DATA[KLINE_INTERVAL_FAVORITES],
    klineType: getItem(KLINE_KLINETYPE) || DEFAULT_SAVED_DATA[KLINE_KLINETYPE],
    klineTypeFavorites:
      getItem(KLINE_KLINETYPE_FAVORITES) || DEFAULT_SAVED_DATA[KLINE_KLINETYPE_FAVORITES],
    chartType: getItem(KLINE_CHARTTYPE) || 'normal', // chartType -- timeline 分时图 | normal
    // 工具是否启动配置
    extraToolConfig: getItem(KLINE_EXTRATOOL) || {},
  };
};
// 组件默认 models值
export const defaultState = {
  // k线区域symbol 行情信息
  kLineTabsMarketMap: {},
  // k线支持的时间列表
  intervalList: [],
  // k线历史点位(bs)列表
  bsHistory: [],
  // 逐仓一键平仓BS点位列表
  isolatedLiquidationBSPoints: [],
  bsFilter: {},
  // k线服务器端存储数据，没获取时值为undefined，获取到结构为{ common: {}, inUse: bool } inUse为接口控制是否使用服务器端存储，正常为true
  klineConf: undefined,
  klineConfInUse: undefined,
  modalVisible: false, // 指标弹框
  activeStudies: [], // 选中的指标
  priceType: {},
  ...getInitialLocalData(),
};
