/*
 * owner: Clyne@kupotech.com
 */
import { createContext } from 'react';
import storage from 'utils/storage';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'orderBook';
// blockid
export const blockid = name;

// 买卖盘类型枚举
export const ORDER_BOOK_ALL = 'all';
export const ORDER_BOOK_BUY = 'buy';
export const ORDER_BOOK_SELL = 'sell';

export const tipEvent = 'orderBookTipsEvent';

export const eventName = `screen_${name}_change`;

export const colorMap = {
  buy: 'primary',
  sell: 'secondary',
  buy12: 'primary12',
  sell12: 'secondary12',
};

// =============== model相关 ===============

// 组件dva models
export const namespace = '$orderbook';

// 请求，socket数据长度, 这里要注意最大只能是50，因为socket返回的为50档
export const dataSize = 50;

export const orderbooksLoop = 15 * 1000;
export const netAssetsLoop = 15 * 1000;

// 买卖盘动画
export const ANIMATE_ENABLED_STORAGE_KEY = 'orderbook_animate_enabled';
// 买卖盘数量展示类型
export const ORDER_BOOK_AMOUNT_TYPE_STORAGE_KEY = 'orderbook_amount_type';
// 买卖盘档位
export const ORDER_BOOK_LADDER_STORAGE_KEY = 'orderbook_ladder';
// 买卖盘分布类型
export const ORDER_BOOK_TYPE_STORAGE_KEY = 'orderbook_type';


export const defaultSellAndBuy = {
  // 买盘数据
  sell: [],
  // 买盘
  buy: [],
};

// ===================== 合约融合新增配置 =====================
export const AMOUNT_TYPE = 'amount';
export const CUMULATIVE_TYPE = 'cumulative';

// 默认类型设置
const defaultType = () => {
  const storageValue = storage.getItem(ORDER_BOOK_TYPE_STORAGE_KEY);
  if ([ORDER_BOOK_ALL, ORDER_BOOK_BUY, ORDER_BOOK_SELL].includes(storageValue)) {
    return storageValue;
  }
  return ORDER_BOOK_ALL;
};
// 默认数量展示类型设置
const defaultAmountType = () => {
  const storageValue = storage.getItem(ORDER_BOOK_AMOUNT_TYPE_STORAGE_KEY);
  if ([AMOUNT_TYPE, CUMULATIVE_TYPE].includes(storageValue)) {
    return storageValue;
  }
  return AMOUNT_TYPE;
};
// 默认动画展示设置
const defaultAnimateEnabled = () => {
  return storage.getItem(ANIMATE_ENABLED_STORAGE_KEY) !== false;
};

/**
 * @description: 默认的深度档位
 * @param {string} symbol 当前币种
 * @param {string} depthConfig 当前币种下的所有档位配置
 */
export const defaultDepthLadder = ({ symbol, depthConfig }) => {
  const storageValue = storage.getItem(ORDER_BOOK_LADDER_STORAGE_KEY) || {};
  const storageLadder = storageValue[symbol];
  // 缓存不存在，默认值取第一个
  if (!storageLadder) {
    return depthConfig[0].value;
  }
  // 缓存失效，默认取第一个
  const isValidLadder = depthConfig.some(e => String(e.value) === String(storageLadder));
  if (!isValidLadder) {
    return depthConfig[0].value;
  }
  // 缓存存在，设置为缓存档位
  return storageLadder;
};

// 组件默认 models值
export const defaultState = {
  // 深度配置
  depthConfig: [],
  // 当前深度值
  currentDepth: '',
  // 默认为全不类型
  type: defaultType(),
  // 数据结构暂时区分多个交易类型的多个交易对数据，目前初始化，轮训触发的时候会reset清空
  data: {},
  // 标记价格 用于合约
  markPrice: '',
  // 最新成交价格
  lastPrice: '',
  // 指数价格 用于合约
  indexPrice: '',
  // 净值（ETF的展示）
  netAssets: '',
  // adl队列 用于合约
  adlPct: '0',
  // 存在的订单价格list
  activeOrders: {
    // 当前用户自己挂的，卖盘的价格数据
    sell: [],
    // 当前用户自己挂的，买盘的价格数据
    buy: [],
  },
  // hoverindex，利用这个实现批量选中
  hoverIndex: -1,
  // hover的类型 ORDER_BOOK_BUY ORDER_BOOK_SELL
  hoverType: '',
  // hover的data,
  hoverData: [],
  // 数量精度（baseCurrency的币种精度，现货合约存在差异，这里统一一个字段处理）,
  amountPrecision: '',
  // 基础币种 用于展示amount，total
  baseCurrency: '',
  // 计价单位 用于展示price
  quoteCurrency: '',
  // 卖盘最大amount
  sellMaxAmount: 0,
  // 买盘最大amount
  buyMaxAmount: 0,
  // maxSum（合约显示PCT买卖盘比例使用）
  maxSum: 0,
  // ================== 合约融合 ==================
  // 数量展示类型， amount为常规数量，cumulative为深度模式
  amountType: defaultAmountType(),
  // 是否开启买卖盘动画
  isAnimateEnabled: defaultAnimateEnabled(),
};
