/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-04-23 11:21:55
 * @Description: 获取当前支持的交易类型
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { pick, get, isEmpty } from 'lodash';
import * as paths from 'paths';
import { siteCfg } from 'config';
import { _t, _tHTML } from 'utils/lang';
import { trackClick } from 'utils/ga';
import { ACCOUNT_CODE } from 'components/KcTransferModal/config';
import { TRADES_FOR_KCSENSORS } from 'pages/Trade3.0/components/TradeBox/const';
import { crossSensors, isolatedSensors } from 'components/Margin/sensors';
import { isABNew, isFuturesNew } from '@/meta/const';

const { MAINSITE_HOST } = siteCfg;
// 杠杆(全仓/逐仓)切换时保存在storage里的key
export const MARGIN_TYPE_FOR_STORAGE = 'marginType';
// 上次保存的交易类型
export const TYPE_FOR_STORAGE = 'trade3.dealtype';

const TRADE_TYPES_CONFIG_BASE = {
  // 现货币币
  TRADE: {
    // 用作kyc埋点，区分业务线
    soure: 'TRADE',
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
    validateOcoFunc: (fn = Function.prototype) => {
      fn({ type: 'trade/ocoValidation' });
    },
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
          orderType: orderTypeSelf || TRADES_FOR_KCSENSORS[orderType] || '',
        });
      },
      sellButton: ({ currentSymbol, orderType, orderTypeSelf }) => {
        const [base] = currentSymbol.split('-');
        trackClick(['sell', '1'], {
          coin: base,
          orderType: orderTypeSelf || TRADES_FOR_KCSENSORS[orderType] || '',
        });
      },
    },
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
  // 全仓杠杆
  MARGIN_TRADE: {
    soure: 'LEVERAGE',
    key: 'MARGIN_TRADE',
    code: 'crossMargin',
    path: paths.MARGIN,
    label1: () => _t('cross'),
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
    isOCODisplay: false,
    validateOcoFunc: Function.prototype, // 后续需使用直接用TRADE下的相应函数替换
    sensorsFunc: (path = [], data) => {
      const func = get(crossSensors, path);
      if (func) func(data);
    },
    getTradeResult: (params = {}) => ({
      ...pick(params, [
        'trade_pair',
        'trade_currency',
        'trade_type',
        'pricing_type',
        'is_success',
        'fail_reason',
        'leverage_multiplier',
      ]),
      trade_service_type: 'cross',
    }),
    orderLink: `${MAINSITE_HOST}/order/margin`,
    fallbackType: 'MARGIN_ISOLATED_TRADE',
    checkIsForbiddenTrade: ({ symbolsMap = {}, currentSymbol }) => {
      const { enableTrading = true } = symbolsMap[currentSymbol] || {};
      return !enableTrading;
    },
    trade_category: 'margin',
  },
  // 逐仓杠杆
  MARGIN_ISOLATED_TRADE: {
    soure: 'LEVERAGE',
    key: 'MARGIN_ISOLATED_TRADE',
    code: 'isolatedMargin',
    path: paths.ISOLATED,
    label1: () => _t('isolated'),
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
    sensorsFunc: (path = [], data) => {
      const func = get(isolatedSensors, path);
      if (func) func(data);
    },
    getTradeResult: (params = {}) => ({
      ...pick(params, [
        'trade_pair',
        'trade_currency',
        'trade_type',
        'pricing_type',
        'is_success',
        'fail_reason',
        'leverage_multiplier',
      ]),
      trade_service_type: 'isolated',
    }),
    orderLink: `${MAINSITE_HOST}/order/isolated`,
    fallbackType: 'MARGIN_TRADE',
    isOCODisplay: false,
    validateOcoFunc: Function.prototype,
    checkIsForbiddenTrade: ({ isolatedSymbolsMap = {}, currentSymbol }) => {
      const { tradeEnable = true } = isolatedSymbolsMap[currentSymbol] || {};
      return !tradeEnable;
    },
    trade_category: 'margin',
  },
  // 现货网格
  GRID: {
    soure: 'ROBOT',
    key: 'GRID',
    code: 'grid',
    path: paths.GRID,
    label: () => _t('tradeType.spotGrid'),
    label1: () => _t('tradeType.spotGrid'),
    initDict: () => [[ACCOUNT_CODE.MAIN], [ACCOUNT_CODE.TRADE]],
    isOCODisplay: false,
    orderLink: `${MAINSITE_HOST}/trading-bot`,
  },
};

// 这个地方会有 trade3.0 影响，需要同时开启新版跟合约才赋值
const TRADE_TYPES_CONFIG =
  isABNew() && isFuturesNew()
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
          orderLink: `${MAINSITE_HOST}/order/futures/order-history`,
        },
      }
    : TRADE_TYPES_CONFIG_BASE;

export { TRADE_TYPES_CONFIG };

// 杠杆交易类型(全仓/逐仓)
export const MARGIN_TRADE_TYPE = {
  MARGIN_TRADE: TRADE_TYPES_CONFIG.MARGIN_TRADE,
  MARGIN_ISOLATED_TRADE: TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE,
};
export const checkIsMargin = (tradeType) => !!MARGIN_TRADE_TYPE[tradeType];
export const checkIsBotsMode = (tradeType) => tradeType === TRADE_TYPES_CONFIG.GRID.key;
// 杠杆神策埋点(new)
export const MarginSensors = (tradeType, ...rest) => {
  const func = TRADE_TYPES_CONFIG?.[tradeType]?.sensorsFunc;
  if (func) func(...rest);
};

const useTradeTypes = (symbol) => {
  const dispatch = useDispatch();
  const { currentSymbol, tradeType } = useSelector((state) => state.trade);
  const { marginSymbolsMap } = useSelector((state) => state.symbols);
  const _symbol = symbol || currentSymbol;

  const [tradeTypes, setTradeTypes] = useState([]);
  // 交易类型-币币交易必有
  useEffect(() => {
    const symbolConfig = marginSymbolsMap[_symbol] || {};
    const nextTradeTypes = [TRADE_TYPES_CONFIG.TRADE.key];
    if (symbolConfig.isMarginEnabled) {
      nextTradeTypes.push(TRADE_TYPES_CONFIG.MARGIN_TRADE.key);
    }
    if (symbolConfig.isIsolatedEnabled) {
      nextTradeTypes.push(TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key);
    }
    setTradeTypes(nextTradeTypes);
  }, [_symbol, marginSymbolsMap]);

  // 当前币种支持的交易类型不包含当前交易类型时，将当前交易类型切换至币币交易
  // 如果gridSymbolsMap接口数据还没有回来，路由指定grid, 这里就会发生切换到币币，所以加上了判断空
  useEffect(() => {
    if (
      tradeTypes.length &&
      !tradeTypes.includes(tradeType) &&
      JSON.stringify(marginSymbolsMap) !== '{}'
    ) {
      let nextTradeType = TRADE_TYPES_CONFIG.TRADE.key;
      const { fallbackType } = TRADE_TYPES_CONFIG[tradeType] || {};
      if (tradeTypes.includes(fallbackType)) {
        nextTradeType = fallbackType;
      }
      dispatch({
        type: 'trade/update_trade_type',
        payload: {
          tradeType: nextTradeType,
        },
      });
    }
  }, [tradeTypes, tradeType, marginSymbolsMap, dispatch]);

  return tradeTypes;
};

export default useTradeTypes;
