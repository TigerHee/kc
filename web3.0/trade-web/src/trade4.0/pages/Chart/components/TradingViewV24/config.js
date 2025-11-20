/**
 * Owner: jessie@kupotech.com
 */

// 新增语言时需查看tv是否支持，支持补充到下面
export const langMap = {
  ar_AE: 'ar',
  de_DE: 'de',
  en_US: 'en',
  es_ES: 'es',
  fr_FR: 'fr',
  ja_JP: 'ja',
  id_ID: 'id_ID',
  it_IT: 'it',
  ko_KR: 'ko',
  ms_MY: 'ms_MY',
  nl_NL: 'nl_NL',
  pt_PT: 'pt',
  ru_RU: 'ru',
  th_TH: 'th',
  tr_TR: 'tr',
  vi_VN: 'vi',
  zh_CN: 'zh',
  zh_HK: 'zh_TW',
};

// k线配置 常规overrides
export const defaultOverrides = {
  'paneProperties.axisProperties.log': false,
  'paneProperties.axisProperties.isInverted': false,
  'paneProperties.axisProperties.indexedTo100': false,
  'paneProperties.axisProperties.percentage': false,
  'paneProperties.axisProperties.alignLabels': true,
  'paneProperties.legendProperties.showSeriesTitle': false,
  'paneProperties.legendProperties.showLegend': false,

  'mainSeriesProperties.visible': true,
  'mainSeriesProperties.priceAxisProperties.autoScale': true,
  'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
  'mainSeriesProperties.priceAxisProperties.log': false,
  'mainSeriesProperties.priceAxisProperties.logDisabled': false,
  'mainSeriesProperties.priceAxisProperties.percentage': false,
  'mainSeriesProperties.priceAxisProperties.percentageDisabled': false,
  'mainSeriesProperties.priceAxisProperties.alignLabels': true,
  'mainSeriesProperties.priceAxisProperties.isInverted': false,
  'mainSeriesProperties.showCountdown': true, // 显示倒计时

  'scalesProperties.fontSize': 12,
  'scalesProperties.showSymbolLabels': false,

  'symbolWatermarkProperties.visibility': false, // 控制水印是否显示
};

const commonDisabledFeatures = [
  'display_market_status',
  'header_widget',
  'volume_force_overlay',
  'symbol_search_hot_key',
];

// k线配置 常规 disabledFeatures
const normalDisabledFeatures = [...commonDisabledFeatures];

// k线配置 timeline disabledFeatures
const timelineDisabledFeatures = ['use_localstorage_for_settings', ...commonDisabledFeatures];

// k线配置 多宫格 disabledFeatures
const multifyDisabledFeatures = [
  'use_localstorage_for_settings',
  'timeframes_toolbar',
  'go_to_date',
  'left_toolbar',
  'control_bar',
  ...commonDisabledFeatures,
];

// k线配置 h5 disabledFeatures
const h5DisabledFeatures = [...multifyDisabledFeatures];

// k线配置 minHeight disabledFeatures
const minHeighthDisabledFeatures = [
  'use_localstorage_for_settings',
  'timeframes_toolbar',
  'go_to_date',
  'left_toolbar',
  'control_bar',
  'display_market_status',
  'header_widget',
];

// k线配置 minHeight disabledFeatures
const middleHeighthDisabledFeatures = [
  'go_to_date',
  'timeframes_toolbar',
  ...commonDisabledFeatures,
];

export const disabledFeatures = {
  normal: normalDisabledFeatures,
  timeline: timelineDisabledFeatures,
  multi: multifyDisabledFeatures,
  h5: multifyDisabledFeatures,
  minWidth: multifyDisabledFeatures,
  minHeight: minHeighthDisabledFeatures,
  middleHeight: middleHeighthDisabledFeatures,
};

export const favorites = {
  normal: {
    intervals: ['1', '3', '5', '15', '30', '60', '240', '1D', '1W', '1M'],
  },
  timeline: {
    intervals: ['1', '3', '5', '15', '30', '60', '240', '1D', '1W', '1M'],
  },
  multi: {
    intervals: [],
  },
  h5: {
    intervals: [],
  },
};

// 时间选择下拉框数据（所有支持的时间周期，接口返回为准，以下为默认值）
export const INTERVAL_LIST = [
  '1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '240',
  '360',
  '720',
  '1D',
  '1W',
  '1M',
];
// 时间选择页面展示数据 （页面默认展示时间周期）
export const INTERVAL_SHOWN_LIST = ['15', '60', '480', '1D', '1M'];

export const klineTypeMap = {
  0: {
    icon: 'kline-type-bars',
    text: 'o4uULyZ7davmehdfhgdbzy',
  },
  1: {
    icon: 'kline-type-candles',
    text: 'wWnvXv5em6At8crWPJj3SJ',
  },
  2: {
    icon: 'kline-type-line',
    text: 'pheW1TXmQDR316pBtZfLGV',
  },
  3: {
    icon: 'kline-type-area',
    text: 'kazVZ5TvfkXektRNrJRvWd',
  },
  8: {
    icon: 'kline-type-heikin-ashi',
    text: 'f3CfJqHRZ56k4LjKnxc55h',
  },
  9: {
    icon: 'kline-type-hollow-candles',
    text: 'sAioHSHh2XrnWUqyqeYDZs',
  },
  10: {
    icon: 'kline-type-baseline',
    text: 'pVBxhHGo1FTSRfCpc4RTdn',
  },
};

// klineType选择下拉框数据(显示数据固定)
export const KLINETYPE_LIST = [0, 1, 9, 8, 2, 3, 10];

// klineType选择页面展示数据
export const KLINETYPE_SHOWN_LIST = [];
