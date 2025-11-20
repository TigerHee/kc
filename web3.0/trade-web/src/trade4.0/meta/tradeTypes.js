/*
 * @owner: borden@kupotech.com
 */
import * as paths from 'paths';
import { siteCfg } from 'config';
import { pick } from 'lodash';
import { _t, _tHTML } from 'src/utils/lang';
import { trackClick } from 'src/utils/ga';
import { ORDER_TYPES_MAP } from '@/pages/OrderForm/config';
import {
  spotSensors,
  crossSensors,
  isolatedSensors,
  genSensorsFunc,
  futuresSensors,
} from './sensors';
import { ACCOUNT_CODE, isFuturesNew } from './const';
import { pathToRegexp } from 'path-to-regexp';

const { MAINSITE_HOST } = siteCfg;

/**
 * 杠杆(全仓/逐仓)切换时保存在storage里的key
 */
export const MARGIN_TYPE_FOR_STORAGE = 'marginType';
/**
 * 上次保存的交易类型
 */
export const TYPE_FOR_STORAGE = 'trade3.dealtype';
/**
 * 交易类型统一配置
 */
const TRADE_TYPES_CONFIG_BASE = {
  TRADE: {
    key: 'TRADE',
    code: 'spot',
    path: paths.HOME,
    label1: () => _t('tradeType.trade'),
    label2: () => _t('tradeType.trade'),
    initDict: () => [[ACCOUNT_CODE.MAIN], [ACCOUNT_CODE.TRADE]],
    accountCode: ACCOUNT_CODE.TRADE,
    orderLink: `${MAINSITE_HOST}/order/trade`,
    isOCODisplay: true,
    showTSO: true, // 展示跟踪委托
    isSupportAdvancedLimit: true,
    isSupportTimeWeightedOrder: true,
    // 埋点
    gaFunc: {
      transferOkButton: () => trackClick(['transferConfirm', '1']),
      transferButton: () => {
        trackClick(['transfer', '5']);
      },
      shiftCategory: () => {
        trackClick(['shiftCategory', '1']);
      },
      buyButton: ({ currentSymbol, orderType, orderTypeSelf }) => {
        const [base] = currentSymbol.split('-');
        trackClick(['buy', '1'], {
          coin: base,
          orderType: orderTypeSelf || ORDER_TYPES_MAP[orderType]?.sensorKey || '',
        });
      },
      sellButton: ({ currentSymbol, orderType, orderTypeSelf }) => {
        const [base] = currentSymbol.split('-');
        trackClick(['sell', '1'], {
          coin: base,
          orderType: orderTypeSelf || ORDER_TYPES_MAP[orderType]?.sensorKey || '',
        });
      },
    },
    sensorsFunc: genSensorsFunc(spotSensors),
    // 取消委托上报神策的事件名
    cancelOrderResultEventName: 'spot_cancel_order_result',
    // 拼接神策上报的下单结果
    getTradeResult: (params = {}) => ({
      ...pick(params, [
        'trade_pair',
        'trade_currency',
        'trade_type',
        'pricing_type',
        'is_success',
        'fail_reason',
        'fail_reason_code',
      ]),
      trade_service_type: 'spot',
    }),
    // 检查是否冻结交易
    checkIsForbiddenTrade: ({ symbolsMap = {}, currentSymbol }) => {
      const { enableTrading = true, isAuctionEnabled } = symbolsMap[currentSymbol] || {};
      return !enableTrading && isAuctionEnabled !== true;
    },
    trade_category: 'spot',
  },
  MARGIN_TRADE: {
    key: 'MARGIN_TRADE',
    code: 'crossMargin',
    path: paths.MARGIN,
    label1: () => _t('crossMargin'),
    label2: () => _t('crossMargin'),
    accountName: () => _t('crossMargin.account'),
    iconText: (lang) => (lang === 'zh_CN' ? '全' : 'Mg'),
    multiDescTitle: (params = {}) => _t('newAssets.crossMargin.title', params),
    multiDesc: () => _t('cross.multi.desc'),
    noBalanceTip: () => _tHTML('cross.position.noBalance'),
    initDict: () => [[ACCOUNT_CODE.TRADE], [ACCOUNT_CODE.MARGIN]],
    updateUserLeverageEffect: 'marginMeta/updateUserLeverage',
    updateUserLeverageReducer: 'marginMeta/changeUserLeverage',
    realLeverageEffect: 'marginMeta/getCurrentRealLeverage',
    borrowSizeEffect: 'marginMeta/getMaxBorrowSizeMap',
    computeBorrowSizeEffect: 'marginMeta/computeMaxBorrowSizeMap',
    postBorrowEffect: 'marginBorrow/postBorrow',
    postRepayEffect: 'marginBorrow/postRepay',
    updateAutoRepayEffect: 'marginMeta/postAutoRepayConfig',
    accountCode: ACCOUNT_CODE.MARGIN,
    borrowTypeKey: 'borrowType',
    sensorsFunc: genSensorsFunc(crossSensors),
    getTradeResult: (params = {}) => ({
      ...pick(params, [
        'trade_pair',
        'trade_currency',
        'trade_type',
        'pricing_type',
        'is_success',
        'fail_reason',
        'fail_reason_code',
        'leverage_multiplier',
      ]),
      trade_service_type: 'cross',
    }),
    orderLink: `${MAINSITE_HOST}/order/margin`,
    isOCODisplay: true,
    showTSO: true, // 展示跟踪委托
    isSupportAdvancedLimit: true,
    isSupportTimeWeightedOrder: false,
    fallbackType: 'MARGIN_ISOLATED_TRADE',
    checkIsForbiddenTrade: ({ symbolsMap = {}, currentSymbol }) => {
      const { enableTrading = true } = symbolsMap[currentSymbol] || {};
      return !enableTrading;
    },
    needCheckBPP: true,
    trade_category: 'margin',
    // 判断交易对是否支持当前交易类型
    checkIsSupportBySymbol: ({ isMarginEnabled }) => isMarginEnabled,
  },
  MARGIN_ISOLATED_TRADE: {
    key: 'MARGIN_ISOLATED_TRADE',
    code: 'isolatedMargin',
    path: paths.ISOLATED,
    label1: () => _t('isolatedMargin'),
    label2: () => _t('isolatedMargin'),
    accountName: () => _t('isolatedMargin.account'),
    iconText: (lang) => (lang === 'zh_CN' ? '逐' : 'Is'),
    multiDescTitle: (params = {}) => _t('isolated.isolated.multi', params),
    multiDesc: () => _t('isolated.multi.desc'),
    noBalanceTip: (params) => _tHTML('isolated.position.noBalance', params),
    initDict: (symbol) => [[ACCOUNT_CODE.TRADE], [ACCOUNT_CODE.ISOLATED, symbol]],
    updateUserLeverageEffect: 'isolated/updateUserLeverage',
    updateUserLeverageReducer: 'isolated/changeUserLeverage',
    realLeverageEffect: 'isolated/getCurrentRealLeverage',
    borrowSizeEffect: 'isolated/getMaxBorrowSizeMap',
    computeBorrowSizeEffect: 'isolated/computeMaxBorrowSizeMap',
    postBorrowEffect: 'isolated/postBorrow',
    postRepayEffect: 'isolated/postRepay',
    updateAutoRepayEffect: 'isolated/updateAutoRepay',
    accountCode: ACCOUNT_CODE.ISOLATED,
    borrowTypeKey: 'isolatedBorrowType',
    sensorsFunc: genSensorsFunc(isolatedSensors),
    getTradeResult: (params = {}) => ({
      ...pick(params, [
        'trade_pair',
        'trade_currency',
        'trade_type',
        'pricing_type',
        'is_success',
        'fail_reason',
        'fail_reason_code',
        'leverage_multiplier',
      ]),
      trade_service_type: 'isolated',
    }),
    orderLink: `${MAINSITE_HOST}/order/isolated`,
    isOCODisplay: true,
    showTSO: true, // 展示跟踪委托
    isSupportAdvancedLimit: true,
    isSupportTimeWeightedOrder: false,
    fallbackType: 'MARGIN_TRADE',
    checkIsForbiddenTrade: ({ isolatedSymbolsMap = {}, currentSymbol }) => {
      const { tradeEnable = true } = isolatedSymbolsMap[currentSymbol] || {};
      return !tradeEnable;
    },
    trade_category: 'margin',
    checkIsSupportBySymbol: ({ isIsolatedEnabled }) => isIsolatedEnabled,
  },
};

// 如果开启合约，赋值 config
const TRADE_TYPES_CONFIG = isFuturesNew()
  ? {
      ...TRADE_TYPES_CONFIG_BASE,
      FUTURES: {
        soure: 'FUTURES',
        key: 'FUTURES',
        code: 'futures',
        path: paths.FUTURES,
        label: () => _t('tradeType.kumex'),
        label1: () => _t('tradeType.kumex'),
        initDict: () => [[ACCOUNT_CODE.MAIN], [ACCOUNT_CODE.CONTRACT]], // TIPS: Futures 后续优化
        isOCODisplay: false,
        isSupportAdvancedLimit: false,
        isSupportTimeWeightedOrder: false,
        orderLink: `${MAINSITE_HOST}/order/futures/order-history`,
        sensorsFunc: genSensorsFunc(futuresSensors),
      },
    }
  : TRADE_TYPES_CONFIG_BASE;

export { TRADE_TYPES_CONFIG };

/**
 * @description: 手动交易/策略交易
 * @return {*}
 */
export const TRADEMODE_META = {
  keys: {
    MANUAL: 'MANUAL',
    BOTTRADE: 'BOTTRADE',
  },
  botTradeMeta: {
    key: 'strategy',
    path: paths.STRATEGY,
    // regPath: `${paths.STRATEGY}/(.*)?`,
    regPath: '/strategy/:strategyName?/:symbol?',
  },
};

/**
 * @description: 判断是否是策略模式
 * @param {*} pathname
 * @return {*}
 */
export const isBotTradeByPathname = (pathname) => {
  const pathRe = pathToRegexp(TRADEMODE_META.botTradeMeta.regPath, null, { start: false });
  const execResult = pathRe.exec(pathname);
  return !!execResult;
};

/**
 * 获取symbol从path中
 */
export const getSymbolByPath = (pathname) => {
  const pathRe = pathToRegexp(`${paths.STRATEGY}/:symbol`);
  const execResult = pathRe.exec(pathname);
  console.log(execResult);
  if (execResult && execResult[1]) {
    return execResult[1];
  }
};

window.getSymbolByPath = getSymbolByPath;

/**
 * 杠杆交易类型
 */
// 杠杆交易类型(全仓/逐仓)
export const MARGIN_TRADE_TYPE = {
  MARGIN_TRADE: TRADE_TYPES_CONFIG.MARGIN_TRADE,
  MARGIN_ISOLATED_TRADE: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE,
};

/**
 * 检查是否杠杆交易
 * @param {*} tradeType
 * @returns boolean
 */
export const checkIsMargin = (tradeType) => Boolean(MARGIN_TRADE_TYPE[tradeType]);

// /**
//  *
//  * @param {*} tradeType 交易类型
//  * @param {*} symbol 交易对
//  * @returns string
//  */
// export const getPath = (tradeType = TRADE_TYPES_CONFIG.TRADE.key, paramSymbol = 'BTC-USDT') => {
//   if (!TRADE_TYPES_CONFIG[tradeType]?.path) return '';
//   let symbol = paramSymbol;
//   // 匹配到合约的交割，直接重定向到 BTC-USDT
//   if (symbol.match('XBT') && !symbol.match('-') && !symbol.match(/(USDTM|USDCM|USDM)/)) {
//     symbol = 'BTC-USDT';
//   }
//   // 匹配到其它合约类型，会去掉M，拼接上 -
//   if (symbol.match(/(USDTM|USDCM|USDM)/) && !symbol.match('-')) {
//     symbol = symbol.replace(/(USDTM|USDCM|USDM)/, (match) => {
//       return `-${match.slice(0, -1)}`;
//     });
//     symbol = symbol.replace('XBT', 'BTC');
//   }
//   return concatPath(TRADE_TYPES_CONFIG[tradeType].path, symbol);
// };

/**
 * 交易类型对应的地址列表
 */
export const PATHS_CONFIG = Object.values(TRADE_TYPES_CONFIG).map((item) => {
  return item.path;
});
