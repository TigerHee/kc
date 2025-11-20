/**
 * Owner: mike@kupotech.com
 */
import invert from 'lodash/invert';
import { isFutureSymbol, isSpotSymbol } from './helper';
import * as paths from 'paths';
import { pathToRegexp } from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { _t } from 'Bot/utils/lang';
import { currentLang } from '@kucoin-base/i18n';
import isEmpty from 'lodash/isEmpty';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
// usdt交易对在运行中，创建显示3位小数
export const usdtInputPrecision = 3;
// 机器人语言key前缀
export const getLangKey = (key) => `B_${key}`;

// 策略id映射表
const strategiesIdsMap = {
  1: 'classicgrid',
  2: 'automaticinverst',
  3: 'futuregrid',
  4: 'smarttrade',
  5: 'infinitygrid',
  7: 'martingale',
  8: 'superai',
  9: 'aiFutureBilater',
  10: 'leverageGrid',
  11: 'aispottrend',
  12: 'futuremartingale',
  13: 'aifuturetrend',
};
export const maxBots = 30;
export const strategiesMap = {
  ...strategiesIdsMap,
  ...invert(strategiesIdsMap),
};

export const stras = [
  {
    key: 'GRID', // 后端代码使用的名字
    name: '现货网格',
    botName: 'classicgrid', // 前端代码使用的名字， 模型名字
    lang: 'classicgrid', // 展示的名字
    id: 1,
    indexTag: ['volatile'],
    href: '/spot/grid',
    note: 'clsgrid.note', // 简短描述
    pathReg: `/(spotgrid)/:symbol?`, // 用于匹配路径
    pathCreate: `/spotgrid/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/classicgrid-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/classicgrid-dark.svg').default,
    runningDropdownConfig: {
      // 运行中下拉按钮配置
      menus: ['onTriggerInvestment', 'onTriggerPriceRange'],
    },
  },
  {
    key: 'CONTRACT_GRID',
    name: '合约网格',
    botName: 'futuregrid',
    lang: 'futuregrid',
    id: 3,
    indexTag: ['professional', 'bearmarket'],
    href: '/futures/grid',
    note: 'futrgrid.note',
    isFuture: true,
    pathReg: `/(futuresgrid)/:symbol?`, // 用于匹配路径
    pathCreate: `/futuresgrid/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/futuregrid-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/futuregrid-dark.svg').default,
    runningDropdownConfig: {
      menus: ['onTriggerInvestment'],
    },
  },
  {
    key: 'MARTIN_GALE',
    name: '马丁格尔',
    botName: 'martingale',
    lang: 'matingale',
    id: 7,
    indexTag: ['bullmarket'],
    note: 'batchbuysell',
    pathReg: `/(martingale)/:symbol?`, // 用于匹配路径
    pathCreate: `/martingale/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/martingale-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/martingale-dark.svg').default,
  },
  {
    key: 'POSITION',
    name: '智能持仓',
    botName: 'smarttrade',
    lang: 'smarttrade',
    id: 4,
    indexTag: ['bullmarket'],
    note: 'smart.note',
    pathReg: `/(rebalance)/:symbol?`, // 用于匹配路径
    pathCreate: `/rebalance/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/smarttrade-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/smarttrade-dark.svg').default,
    symbolCheck: {
      // 是否需要检查交易对和策略匹配情况
      check: false,
    },
    runningDropdownConfig: {
      menus: ['onTriggerInvestment'],
    },
  },
  {
    key: 'INFINITY_GRID',
    name: '无限网格',
    botName: 'infinitygrid',
    lang: 'infinitygrid',
    id: 5,
    indexTag: ['volatile'],
    href: '/infinity/grid',
    note: 'infnty.note',
    pathReg: `/(infinitygrid)/:symbol?`, // 用于匹配路径
    pathCreate: `/infinitygrid/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/infinitygrid-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/infinitygrid-dark.svg').default,
    runningDropdownConfig: {
      menus: ['onTriggerInvestment', 'onTriggerPriceRange'],
    },
  },
  {
    key: 'AIP',
    name: '极速定投',
    botName: 'automaticinverst',
    lang: 'automaticinverst',
    id: 2,
    indexTag: ['bullmarket'],
    note: 'auto.note',
    pathReg: `/(dca)/:symbol?`, // 用于匹配路径
    pathCreate: `/dca/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/automaticinverst-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/automaticinverst-dark.svg').default,
  },
  {
    key: 'SPOT_AI_GRID',
    name: '超级网格',
    botName: 'superai',
    lang: 'superAITab',
    id: 8,
    indexTag: ['newbie', 'volatile'],
    note: 'clsgrid.note',
    pathReg: `/(supergrid)/:symbol?`, // 用于匹配路径
    pathCreate: `/supergrid/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/superai-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/superai-dark.svg').default,
  },
  {
    key: 'WIN_TWO_WAY',
    name: 'AI双向赢',
    botName: 'aiFutureBilater',
    lang: 'aiFutureBilater',
    note: 'aiFutureBilaterFeatures',
    id: 9,
    indexTag: ['newbie', 'volatile'], // 首页用到的标签
    isFuture: true,
    pathReg: `/(dualfuturesai)/:symbol?`, // 用于匹配路径
    pathCreate: `/dualfuturesai/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/aifuturebilater-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/aifuturebilater-dark.svg').default,
  },
  {
    key: 'MARGIN_GRID',
    name: '杠杆网格',
    botName: 'leveragegrid',
    lang: 'margingrid',
    note: 'clsgrid.note',
    // 该策略暂时不支持排行榜
    id: 10,
    indexTag: ['professional', 'volatile'],
    pathReg: `/(margingrid)/:symbol?`, // 用于匹配路径
    pathCreate: `/margingrid/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/leveragegrid-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/leveragegrid-dark.svg').default,
    runningDropdownConfig: {
      menus: ['onTriggerInvestment'],
    },
  },
  {
    key: 'CTA',
    name: '趋势跟踪',
    botName: 'aispottrend',
    lang: 'aispottrend',
    note: 'aispottrend.note',
    id: 11,
    indexTag: ['newbie', 'bullmarket', 'Hot'],
    pathReg: `/(cta)/:symbol?`, // 用于匹配路径
    pathCreate: `/cta/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/aispottrend-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/aispottrend-dark.svg').default,
  },
  {
    key: 'FUTURES_MARTIN_GALE',
    name: '合约马丁',
    botName: 'futuremartingale', // NOTICE 和lang字段有区别
    lang: 'futurematingale',
    note: 'futurematingale.note',
    id: 12,
    indexTag: ['professional', 'volatile'],
    isFuture: true,
    pathReg: `/(martingale)/:symbol?`, // 用于匹配路径
    pathCreate: `/martingale/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/futuremartingale-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/futuremartingale-dark.svg').default,
    runningDropdownConfig: {
      menus: ['onTriggerInvestment'],
    },
  },
  {
    key: 'FUTURES_CTA',
    name: '合约趋势跟踪',
    botName: 'aifuturetrend',
    lang: 'aifuturetrend',
    id: 13,
    indexTag: ['newbie', 'bullmarket', 'New'],
    note: 'aifuturetrend.note',
    isFuture: true,
    pathReg: `/(cta)/:symbol?`, // 用于匹配路径
    pathCreate: `/cta/:symbol`, // 用于生成路径
    lightIcon: require('@/assets/bot/strategyIcon/aifuturetrend-light.svg').default,
    darkIcon: require('@/assets/bot/strategyIcon/aifuturetrend-dark.svg').default,
  },
];
const dftSymbol = {
  spot: 'BTC-USDT',
  future: 'XBTUSDTM',
};

/**
 * @description: 根据路径判断当前是哪一个策略
 * @return {*}
 */
export const whichStrategyByPath = (location) => {
  const { pathname } = location;

  let strategy = null;
  for (let index = 0; index < stras.length; index++) {
    const meta = stras[index];
    const { pathReg, isFuture } = meta;
    // start: false 不匹配开头
    const pathRe = pathToRegexp(pathReg, null, { start: false });
    const execResult = pathRe.exec(pathname);

    if (execResult) {
      const symbol = execResult.slice(1)?.pop() ?? dftSymbol.spot;
      // 第一个都是策略类型
      if (execResult[1]) {
        if (isFuture) {
          // 交易对都在路径尾部
          // 现货马丁/合约马丁 匹配路径一样, 需要通过交易对类型区分
          if (isFutureSymbol(symbol)) {
            strategy = {
              ...meta,
              symbol,
            };
            break;
          }
        } else if (isSpotSymbol(symbol)) {
          strategy = {
            ...meta,
            symbol,
          };
          break;
        }
      }
    }
  }
  // const dft = {
  //   ...stras[0],
  //   symbol: defaultCreateSymbol.spot.create,
  // };
  return strategy;
};
/**
 * @description: 通过策略路径判断是合约、现货
 * @param {*} pathname
 * @return {*}
 */
export const getTradeTypeByBotPathname = (pathname) => {
  // 具体策略路径匹配
  const meta = whichStrategyByPath({ pathname });
  if (meta) {
    return meta.isFuture ? TRADE_TYPES_CONFIG.FUTURES.key : TRADE_TYPES_CONFIG.TRADE.key;
  }
  // 一级主入口路径匹配
  const firstLevelReg = /strategy\/([A-Z]{2,}(?:-[A-Z]{2,}|[A-Z]{3,}))$/;
  const results = pathname.match(firstLevelReg);
  if (results && results[1]) {
    return isFutureSymbol(results[1])
      ? TRADE_TYPES_CONFIG.FUTURES.key
      : TRADE_TYPES_CONFIG.TRADE.key;
  }
};

export const whichStrategyByBotId = (id) => {
  return strasMap.get(Number(id));
};
/**
 * @description: 粗略检查策略 和 交易对是否匹配； 如何合约策略 匹配 BTC-USDT这种
 * @param {*} id 策略ID
 * @param {*} symbol
 * @return {*} symbol
 */
export const checkSymbolMatchByBotId = (id, symbol) => {
  const meta = strasMap.get(Number(id));
  if (meta) {
    // symbol存在, 需要简单校验
    if (symbol) {
      // 判断策略是合约, 交易对也必须是合约交易对
      if (meta.isFuture) {
        if (!isFutureSymbol(symbol)) {
          symbol = dftSymbol.future;
        }
      } else if (!isSpotSymbol(symbol)) {
        symbol = dftSymbol.spot;
      }
    }
  }
  return symbol;
};
/**
 * @description: 在matchSymbolMap中检查交易对是否和策略匹配
 * @param {*} id
 * @param {*} symbol
 * @param {*} matchSymbolMap
 * @return {*}
 */
export const isSymbolMatchByBotId = (id, symbol, matchSymbolMap) => {
  //  智能持仓是在创建页面选择的币种， 不需要校验
  if (isEmpty(matchSymbolMap)) return true;

  const meta = strasMap.get(id);

  if (meta?.symbolCheck?.check === false) return true;

  return matchSymbolMap[symbol]?.includes(id);
};
/**
 * @description: 根据id设置路径
 * @param {*} id
 * @param {string?} symbol
 * @return {*}
 */
export const createPathById = (id, symbol) => {
  if (!id) {
    return `${paths.STRATEGY}/${symbol ?? ''}`;
  }
  const meta = strasMap.get(Number(id));
  if (meta) {
    // 检查策略和交易对的匹配情况
    symbol = checkSymbolMatchByBotId(id, symbol);

    const path = meta.pathCreate.replace(':symbol', symbol ?? '');
    return `${paths.STRATEGY}${path}`;
  }
  return null;
};
/**
 * @description: trade里面调用, 不传symbol; 生成不带symbol的地址
 * @param {*} location
 * @return {*}
 */
export const createPathByLocation = (location) => {
  const meta = whichStrategyByPath(location);
  const path = createPathById(meta?.id);
  return path;
};
/**
 * @description: 刷新路由, 进入某个策略的创建页面
 * 路由变化, 会自动同步路径上的策略到BotStatus
 * @param {number?} id 为空进入策略列表
 * @param {string?} symbol
 * @return {*}
 */
export const routeToBotById = (id, symbol) => {
  return routerRedux.replace(createPathById(id, symbol));
};
// id map
export const strasMap = new Map();
stras.forEach((item) => {
  strasMap.set(item.id, item);
});

// key map
export const strasNameMap = new Map();
stras.forEach((item) => {
  strasNameMap.set(item.key, item);
});

export const availableStras = stras;
// 轮训时间
export const countDownSeconds = 10 * 1000;
export const maxQuotaPrecision = 12;
// 现货网格保守手续费
export const feeRate = 4 / 1000;
export const couponPrecision = {
  // 卡券精度
  idealPrecision: 3, // 卡券理想精度
  realEffectivePrecision: 2, // 如果理想精度下为0， 就一直取到有值得2位小数
};
// 关闭页面判断是否只能原路退回的数字100000usdt
export const usdtLimit = 100000;

// 关闭机器人的配置参数
export const closeParams = {
  1: { sellAllBase: false, buyBase: false }, // 原样返回
  2: { sellAllBase: false, buyBase: true }, // 全部兑换成base: 用quota买base
  3: { sellAllBase: true, buyBase: false }, // 全部兑换成quota: 用base卖的quota
};

// 视频教程配置
const howto = {
  [strategiesMap.classicgrid]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/2022/12/%E7%8E%B0%E8%B4%A7%E7%BD%91%E6%A0%BC%E8%A7%86%E9%A2%91_APP_%E5%AD%97%E5%B9%95%E7%89%88.mp4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/static/video/2022/12/%E7%8E%B0%E8%B4%A7%E7%BD%91%E6%A0%BC%E8%A7%86%E9%A2%91_APP_%E5%AD%97%E5%B9%95%E7%89%88.mp4',
    },
  },
  [strategiesMap.futuregrid]: {
    en_US: {
      src: 'https://assets.staticimg.com/robot-static/future-en.mp4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/robot-static/future-zh.mp4',
    },
  },
  [strategiesMap.aiFutureBilater]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/2023/07/DualFutures+AI.mp4',
    },
  },
  [strategiesMap.smarttrade]: {
    en_US: {
      src: 'https://assets.staticimg.com/robot-static/smart_trade_en.mp4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/robot-static/smart_trade_zh.mp4',
    },
  },
  [strategiesMap.automaticinverst]: {
    en_US: {
      src: 'https://assets.staticimg.com/robot-static/DCA-en3.mp4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/robot-static/DCA.mp4',
    },
  },
  [strategiesMap.infinitygrid]: {
    en_US: {
      src: 'https://assets.staticimg.com/robot-static/infinity_grid_en.MP4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/robot-static/infinity_grid_en.MP4',
    },
  },
  [strategiesMap.martingale]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/2022/12/KuCoin+Martingale+Bot+Tutorial+Video.mp4',
    },
    zh_HK: {
      src: 'https://assets.staticimg.com/static/video/2022/12/KuCoin+Martingale+Bot+Tutorial+Video.mp4',
    },
  },
  [strategiesMap.leverageGrid]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/The-Margin-Grid-Trading-BOT-Tutorial.mp4',
    },
  },
  [strategiesMap.aispottrend]: {
    en_US: {
      src: 'https://assets.staticimg.com/cms/media/AI_Spot_Trend.mp4',
    },
  },
  [strategiesMap.futuremartingale]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/2023/12/Futures_Martingale.mp4',
    },
  },
  [strategiesMap.aifuturetrend]: {
    en_US: {
      src: 'https://assets.staticimg.com/static/video/AI_Futures_Trend.mp4',
    },
  },
};
// 视频教程配置
export const getVideoConfig = (type) => {
  const v = howto[String(type)];
  if (v) {
    return v[currentLang] ?? v.en_US;
  }
  return {};
};

// 策略的文字描述
export const getStrategiesDescription = (type) => {
  const des = {
    name: '',
    id: type,
    type,
    straName: '',
    note: '',
    indexTag: '',
    description: '',
    lightIcon: '',
    darkIcon: '',
    market: {
      type: 1,
      name: '',
      feature: '',
    },
    videoConfig: {
      src: '',
      poster: '',
    },
  };
  const meta = strasMap.get(type);
  if (!meta) {
    return des;
  }

  des.name = meta.lang;
  des.straName = meta.key;
  des.note = meta.note;
  des.indexTag = meta.indexTag;

  des.userId = meta.userId;

  des.lightIcon = meta.lightIcon;
  des.darkIcon = meta.darkIcon;
  des.videoConfig = getVideoConfig(type);
  if (type === 8) {
    // 现货网格_超级AI
    des.name = 'jL2pkgVPkeZ7J7cLogeA9f';
  }

  return des;
};

const DEFAULTFUTURESYMBOL = () => ({
  symbolName: `BTC/USDT ${_t('perpetual_contract')}`,
  symbolCode: 'XBTUSDTM',
  partition: 'USDT',
  precision: 1,
  lastTradedPrice: 0,
  changeRate: 0,
});
// 默认创建 下架之后 显示的币种
export const defaultCreateSymbol = {
  spot: {
    create: 'BTC-USDT',
    invalid: 'KCS-USDT',
  },
  future: {
    create: DEFAULTFUTURESYMBOL,
    invalid: DEFAULTFUTURESYMBOL,
  },
};

// 合约类型策略, 投资额度精度长度限制在8位以内
export const getInputMaxInvestPrecision = (precision) => {
  const inputMaxInvestPrecision = 8;
  return Math.min(precision, inputMaxInvestPrecision);
};
