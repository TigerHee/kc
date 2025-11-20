/**
 * Owner: garuda@kupotech.com
 * 定义基础变量
 */

const { NODE_ENV, ANALYZER, USELESS, THEMES = '' } = process.env;

console.log('NODE_ENV ===', NODE_ENV);

const { version, name } = require('../package.json');

const isProd = NODE_ENV === 'production';

const analyzer = ANALYZER === 'true';
const analyzer_useless = USELESS === 'true';
const isTest = false;

// 首页24h全站数据货币单位
const HOME_CURRENCY = 'USDT';

const storagePrefix = 'kucoinv2';

const STORAGE_MARKET_FILTER = 'market_filter';
const STORAGE_MARKET_SORTER = 'market_sorter';

// 默认语言 这个语言是 webpack 构建时加到 _RUNTIME_CONFIG_ 配置里了，运行时用的runtimeConfig。多租户改造，这里拿不到 window，在runtimeConfig覆盖。
const DEFAULT_LANG = 'en_US';
const DEFAULT_LOCALE = 'en';

// 跟踪邀请渠道的字段
const UTM_SOURCES = ['utm_source', 'utm_campaign', 'utm_medium'];

const RCODE = 'rcode';

const maxPrecision = 8;

const MaxNotification = 5;

/**
 * CMS 组件配置 router => [keys...]
 *  keys为不含语言的前缀部分
 */
const CmsComponents = {
  /** 通用 */
  _: [
    'cms.common',
    // 'com.newFooter.links',
    // 'com.newFooter.copyright',
    // 'com.copyright',
  ],
  combine: ['com.head', 'com.newheader.logo'],
  /** 首页 */
  // '/': [
  //   'com.index.body.bottom',
  // ],
};

const CmsComponentsCDNHost = 'https://assets.staticimg.com/cms-static';

// 仅用于买卖盘深度合并用的精度
const maxDecimalsPrecision = 10;

const FINGERPRINT_URLS = [
  {
    url: '/margin-polymerize/orders',
    event: 'trade-margin',
  },
  {
    url: '/margin-polymerize/auto/borrow/order',
    event: 'trade-margin',
  },
  {
    url: '/margin-polymerize/margin/stop-order',
    event: 'trade-margin',
  },
  {
    url: '/margin-polymerize/margin/oco-order',
    event: 'trade-margin',
  },
  {
    url: '/margin-polymerize/margin/tso-order',
    event: 'trade-margin',
  },
  {
    url: '/trade/orders',
    event: 'trade-spot',
  },
  {
    url: '/advanced-order/oco/order',
    event: 'trade-spot',
  },
  {
    url: '/advanced-order/tso/order',
    event: 'trade-spot',
  },
  {
    url: '/advanced-order/stoporder',
    event: 'trade-spot',
  },
  {
    url: '/kumex-trade/orders',
    event: 'trade-futures',
  },
  {
    url: '/ucenter/verify-validation-code',
    event: 'verify-validation-code-trade-hall',
  },
  {
    url: '/ucenter/check-required-validations',
    event: 'check-required-validations-trade-hall',
  },
  {
    url: '/kumex-trial/orders', // 合约-体验金下单
    event: 'trade-futures-trial',
  },
  {
    url: '/kumex-trade/updateStopOrdersFromShortcut', // 合约-止盈止损
    event: 'trade-futures-updateStopOrdersFromShortcut',
  },
  {
    url: '/kumex-trial/updateStopOrdersFromShortcut', // 合约-体验金止盈止损
    event: 'trade-futures-trial-updateStopOrdersFromShortcut',
  },
];

module.exports = {
  isProd,
  version,
  name,
  THEMES,
  analyzer,
  isTest,
  maxPrecision,
  MaxNotification,
  analyzer_useless,
  CmsComponents,
  storagePrefix,
  HOME_CURRENCY,
  UTM_SOURCES,
  RCODE,
  STORAGE_MARKET_FILTER,
  STORAGE_MARKET_SORTER,
  maxDecimalsPrecision,
  CmsComponentsCDNHost,
  FINGERPRINT_URLS,
  DEFAULT_LANG,
  DEFAULT_LOCALE,
};
