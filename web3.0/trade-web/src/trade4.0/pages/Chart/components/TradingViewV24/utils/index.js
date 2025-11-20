/**
 * Owner: jessie@kupotech.com
 */

import { isNaN, get, toUpper } from 'lodash';
import moment from 'moment';
import { _t } from 'utils/lang';
import { transferNumDisplayByLang } from 'helper';
import { POLLING_TEN_SEC, POLLING_DISABLED_SEC } from 'utils/hooks/usePolling';
import { formatNumber } from '@/utils/format';
import { FUTURES } from '@/meta/const';
// import { getStore } from 'src/utils/createApp';
import { langMap, disabledFeatures, defaultOverrides, favorites } from '../config';
import genCustomIndicators from '../CustomIndicators';

export * from './event-helper';

// 转换单复数形式
const parseType = (textKey, currentLang, num) => {
  const pluralType = transferNumDisplayByLang(currentLang, num);
  const type = pluralType ? _t(textKey, { pluralType, num: `${num}` }) : '';
  return type;
};

// 转换为K线支持的语言
const transformLocale = (lang) => {
  return langMap[lang] || langMap.en_US;
};

export const getUdfTime = (isPoll) => (isPoll ? POLLING_TEN_SEC : POLLING_DISABLED_SEC); // 轮询时间

/**
 * Overrides
 * @params chartType
 * @params colors
 * @params overrides --- 自定义overrides，可覆盖预设值
 */
export const getOverridesByTheme = ({ colors = {}, overrides = {}, chartType }) => {
  const _overrides = chartType === 'timeline' ? { 'mainSeriesProperties.style': 2 } : {};
  return {
    'paneProperties.vertGridProperties.color': colors.cover4, // 网格线
    'paneProperties.horzGridProperties.color': colors.cover4, // 网格线
    'paneProperties.backgroundType': 'solid', // 背景类型有两种 solid ｜ gradient
    'paneProperties.background': colors.overlay,
    'scalesProperties.backgroundColor': colors.overlay,
    'scalesProperties.lineColor': colors.cover12,
    'scalesProperties.textColor': colors.text60,
    // Different chart types defaults
    // Candles styles
    'mainSeriesProperties.candleStyle.upColor': colors.primary,
    'mainSeriesProperties.candleStyle.downColor': colors.secondary,
    'mainSeriesProperties.candleStyle.borderUpColor': colors.primary,
    'mainSeriesProperties.candleStyle.borderDownColor': colors.secondary,
    'mainSeriesProperties.candleStyle.wickUpColor': colors.primary40,
    'mainSeriesProperties.candleStyle.wickDownColor': colors.secondary40,
    // Hollow Candles styles
    'mainSeriesProperties.hollowCandleStyle.upColor': colors.primary,
    'mainSeriesProperties.hollowCandleStyle.downColor': colors.secondary,
    'mainSeriesProperties.hollowCandleStyle.borderUpColor': colors.primary,
    'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.secondary,
    // Line styles
    'mainSeriesProperties.lineStyle.color': colors.primary,
    ...defaultOverrides,
    ...overrides,
    ..._overrides,
  };
};

/** get symbolType from topic */
export const getSymbolTypeFromTopic = (topic) => `${topic}`.split(':')[1];

export const getIntervalTypes = (interval) => {
  const resolution = +interval;
  let type = '8hour';
  if (!isNaN(resolution)) {
    if (resolution < 60) {
      type = `${resolution}min`;
    } else {
      type = `${resolution / 60}hour`;
    }
  } else if (interval.indexOf('D') > -1) {
    if (interval === 'D') {
      type = '1day';
    } else {
      type = interval.replace('D', 'day');
    }
  } else if (interval.indexOf('W') > -1) {
    if (interval === 'W') {
      type = '1week';
    } else {
      type = interval.replace('W', 'week');
    }
  } else if (interval.indexOf('M') > -1) {
    if (interval === 'M') {
      type = '1month';
    } else {
      type = interval.replace('M', 'month');
    }
  }
  return type;
};

/** get symbol && types */
export const getSymbolTypes = (props) => {
  const { symbol } = props;
  const interval = toUpper(props.interval);
  const resolution = +interval;
  let type = '8hour';
  if (!isNaN(resolution)) {
    if (resolution < 60) {
      type = `${resolution}min`;
    } else {
      type = `${resolution / 60}hour`;
    }
  } else if (interval.indexOf('D') > -1) {
    if (interval === 'D') {
      type = '1day';
    } else {
      type = interval.replace('D', 'day');
    }
  } else if (interval.indexOf('W') > -1) {
    if (interval === 'W') {
      type = '1week';
    } else {
      type = interval.replace('W', 'week');
    }
  } else if (interval.indexOf('M') > -1) {
    if (interval === 'M') {
      type = '1month';
    } else {
      type = interval.replace('M', 'month');
    }
  }
  return `${symbol}_${type}`;
};

export const getIntervalSeconds = (i) => {
  const interval = toUpper(i);
  const resolution = +interval;
  let second = 0;
  if (!isNaN(resolution)) {
    second = resolution * 60;
  } else if (interval.indexOf('D') > -1) {
    if (interval === 'D') {
      second = 24 * 60 * 60;
    } else {
      second = +interval.replace('D', '') * 24 * 60 * 60;
    }
  } else if (interval.indexOf('W') > -1) {
    if (interval === 'W') {
      second = 7 * 24 * 60 * 60;
    } else {
      second = +interval.replace('W', '') * 7 * 24 * 60 * 60;
    }
  } else if (interval.indexOf('M') > -1) {
    if (interval === 'M') {
      second = 31 * 24 * 60 * 60;
    } else {
      second = +interval.replace('M', '') * 31 * 24 * 60 * 60;
    }
  }
  return second * 1000;
};

export const getListenerGUID = (symbol, interval, tradeType) => {
  if (!symbol || !interval) return;
  if (tradeType === FUTURES) {
    return `${symbol}_#_${symbol}_#_${interval}`;
  }
  return `${symbol}_#_${symbol.split('-')[1]}_#_${interval}`;
};

/**
 * k线初始配置
 * @params lang --- 语言
 * @params chartType --- 图表类型 normal(default) ｜ multi ｜ h5
 * @params theme --- 主题 dark ｜ light
 */
export const getWidgetOptions = ({
  symbol,
  id,
  lang,
  datafeed,
  chartType = 'normal',
  theme,
  overrides,
  interval,
  colors = {},
  sizeType,
}) => {
  const widgetOptions = {
    locale: transformLocale(lang),
    theme,
    symbol,
    interval,
    autosize: true,
    container: id,
    datafeed,
    overrides: getOverridesByTheme({ colors, overrides, chartType }),
    studies_overrides: {
      'compare.plot.color': colors.complementary,
    },
    disabled_features: disabledFeatures[sizeType || chartType] || disabledFeatures.normal,
    enabled_features: sizeType === 'minHeight' ? ['volume_force_overlay'] : [],
    custom_css_url: `${_PUBLIC_PATH_}charting_library_24/custom.css`,
    favorites: favorites[chartType] || favorites.normal,
    auto_save_delay: 1, // 默认1s
    // study_count_limit: 10,
    toolbar_bg: 'rgba(0, 0, 0, 0)',
    loading_screen: { foregroundColor: colors.primary },
    customFormatters: {
      timeFormatter: {
        format: (date) => {
          return moment.utc(date).format('HH:mm:ss');
        },
      },
      dateFormatter: {
        format: (date) => {
          return moment.utc(date).format('YYYY/MM/DD');
        },
      },
      priceFormatterFactory: (symbolInfo, minTick) => {
        const pricescale = `${symbolInfo?.pricescale || 0}`;
        const precision = pricescale.length - 1 || 0;
        return {
          format: (price, signPositive) => {
            return formatNumber(price, { fixed: precision, dropZ: false });
          },
        };
      },
    },
    time_frames: [
      { text: '1d', resolution: '1', title: parseType('trading.view.day', lang, 1) },
      { text: '5d', resolution: '15', title: parseType('trading.view.day', lang, 5) },
      { text: '1m', resolution: '60', title: parseType('trading.view.month', lang, 1) },
      { text: '3m', resolution: '360', title: parseType('trading.view.month', lang, 3) },
      { text: '6m', resolution: '720', title: parseType('trading.view.month', lang, 6) },
      { text: '1y', resolution: '1D', title: parseType('trading.view.year', lang, 1) },
    ],
    library_path: `${_NATASHA_PATH_}/charting_library_24/`,
    custom_indicators_getter: genCustomIndicators,
    // debug: true,
  };
  return widgetOptions;
};

// 创建MovingAverage指标
export const createStudyMovingAverage = (tvWidget, color, input) => {
  if (tvWidget) {
    tvWidget.chart().createStudy(
      'Moving Average',
      true,
      false,
      ['', input, 'close', 0, 'SMA', input],
      {
        'Plot.color': color,
      },
      {
        disableUndo: true,
      },
    );
  }
};

/**
 * @description  创建指数价格线
 * @param symbol
 */
// export const createIndexLine = (symbol, chart) => {
//   try {
//     // 合约展示指数线
//     const globalState = getStore().getState();
//     const futuresSymbolsMap = get(globalState, 'symbols.futuresSymbolsMap') || {};
//     const { indexSymbol } = futuresSymbolsMap[symbol] || {};

//     if (indexSymbol && chart) {
//       const _indexSymbol =
//         indexSymbol.indexOf('.B') === 0 ? indexSymbol.replace('.B', '.K') : indexSymbol;

//       const studies = chart.getAllStudies();
//       // TODO 比对功能加入后这里判断方式需要改变
//       const compareIdx = studies.findIndex((item) => item.name === 'Compare');
//       const hasCompare = compareIdx !== -1;

//       if (hasCompare) {
//         chart.removeEntity(studies[compareIdx].id);
//       }

//       chart.createStudy('Compare', false, false, ['close', _indexSymbol], null, {
//         priceScale: 'as-series',
//       });

//       setTimeout(() => {
//         if (
//           chart &&
//           chart.getPanes &&
//           chart.getPanes() &&
//           chart.getPanes()[0] &&
//           chart.getPanes()[0].getRightPriceScales &&
//           chart.getPanes()[0].getRightPriceScales() &&
//           chart.getPanes()[0].getRightPriceScales()[0] &&
//           chart.getPanes()[0].getRightPriceScales()[0].setMode
//         ) {
//           chart.getPanes()[0].getRightPriceScales()[0].setMode(1);
//         }
//       }, 600);
//     }
//   } catch (error) {
//     console.log(error || 'create index line error');
//   }
// };

// 针对不同tradeType处理
// export const createConfigByTradeType = (tvWidget, tradeType, symbol) => {
//   if (tradeType === FUTURES) {
//     // 合约
//     if (symbol && tvWidget?.chart) {
//       const chart = tvWidget?.chart();
//       createIndexLine(symbol, chart);
//     }
//   } else {
//     // 其他
//     setTimeout(() => {
//       const chart = tvWidget?.chart();
//       if (
//         chart &&
//         chart.getPanes &&
//         chart.getPanes() &&
//         chart.getPanes()[0] &&
//         chart.getPanes()[0].getRightPriceScales &&
//         chart.getPanes()[0].getRightPriceScales() &&
//         chart.getPanes()[0].getRightPriceScales()[0] &&
//         chart.getPanes()[0].getRightPriceScales()[0].setMode
//       ) {
//         chart.getPanes()[0].getRightPriceScales()[0].setMode(1);
//       }
//     }, 600);
//   }
// };

// 新旧分开存储，不会有这个问题
// 获取到服务器端存储的指标，需要进行转换(新旧版本不一致，服务器端存储会导致问题)
// export const transformStudyName = (study) => {
//   if (study === 'Envelope') {
//     return 'Envelopes';
//   } else if (study === 'Money Flow') {
//     return 'Money Flow Index';
//   } else if (study === 'True Strength Indicator') {
//     return 'True Strength Index';
//   }
//   return study;
// };
