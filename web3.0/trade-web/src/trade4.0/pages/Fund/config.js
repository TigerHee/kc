/**
 * Owner: mike@kupotech.com
 */
import { MARGIN, SPOT, ISOLATED, FUTURES, isFuturesCrossNew } from '@/meta/const';
import { createContext } from 'react';
import { _t, addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';
import { useDispatch } from 'dva';
import { commonSensorsFunc } from '@/meta/sensors';
import { SYMBOL_FILTER_ENUM } from '../Orders/FuturesOrders/config';
// wrapper context
export const WrapperContext = createContext('');

export const name = 'fund';
//                 sm =>md=>lg=> lg1 => lg2
const breakPoints = [280, 580, 768, 1024];
//                      sm   =>md  =>lg =>lg1 => lg2  ==> lg3
const IsolatedBreakPoints = [280, 580, 768, 1024, 1280];

const futuresBreakPoints = [280, 580, 768, 1024, 1280];
// 资产头部checkbox配置
export const fundTableHeadFilterCfg = new Map([
  [
    SPOT,
    {
      cacheKey: 'fund_hideSmallAssets', // 本地存储key
      modelKey: 'isHideSmallAssets', // model key
      langKey: 'hideassets', // 语言key
      breakPoints,
      FundTable: require('./Spot').default,
    },
  ],
  [
    MARGIN,
    {
      cacheKey: 'fund_liability_only',
      modelKey: 'isLiabilityOnly',
      langKey: 'showliabilityonly', // 语言key
      breakPoints,
      FundTable: require('./Cross').default,
    },
  ],
  [
    ISOLATED,
    {
      cacheKey: 'fund_currentPair_only',
      modelKey: 'isCurrencyPairOnly',
      langKey: 'currentpaironly', // 语言key
      breakPoints: IsolatedBreakPoints,
      FundTable: require('./Isolated').default,
    },
  ],
  // 新增合约配置
  [
    FUTURES,
    {
      cacheKey: SYMBOL_FILTER_ENUM.FUTURES_POSITION,
      modelKey: SYMBOL_FILTER_ENUM.FUTURES_POSITION,
      langKey: 'jcJhqdVxw9W7LG9o3E2NPz', // 语言key
      breakPoints: futuresBreakPoints,
      FundTable: require('../Orders/FuturesOrders/NewPosition').default,
    },
  ],
]);

export const jump = {
  deposit: (currency) => {
    commonSensorsFunc(['assetTab', 8, 'click'], currency);
    return window.open(addLangToPath(`${siteCfg.KUCOIN_HOST}/assets/coin/${currency}`), '_blank');
  },
  withdraw: (currency) => {
    commonSensorsFunc(['assetTab', 10, 'click'], currency);
    return window.open(
      addLangToPath(`${siteCfg.KUCOIN_HOST}/assets/withdraw/${currency}`),
      '_blank',
    );
  },
  useTransfer: ({ currency, ...rest }) => {
    const dispatch = useDispatch();
    return () => {
      commonSensorsFunc(['assetTab', 9, 'click'], currency);
      dispatch({
        type: 'transfer/updateTransferConfig',
        payload: {
          visible: true,
          initCurrency: currency,
          ...rest,
        },
      });
    };
  },
  useChangeSymbol: (symbolCode) => {
    const dispatch = useDispatch();
    return () =>
      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: { symbol: symbolCode },
      });
  },
};
