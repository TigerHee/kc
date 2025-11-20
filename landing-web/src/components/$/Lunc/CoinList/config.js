/**
 * Owner: jesse.shao@kupotech.com
 */
import { M_KUCOIN_HOST, TRADE_HOST, KUMEX_HOST } from 'utils/siteConfig';

export const THEME_COLOR = { primary: '#4440FF', surface: '#B9C9FE', background: '#C1D0FF' };

// 去交易的跳转添加
export const TRADE_URL = {
  SPOT: {
    appUrl: `/trade?symbol=`,
    pcUrl: `${TRADE_HOST}/`,
    h5Url: `${M_KUCOIN_HOST}/trade/`,
  },
  FUTURES: {
    appUrl: `/kumex/trade?symbol=`,
    pcUrl: `${KUMEX_HOST}/trade/`,
    h5Url: `${KUMEX_HOST}/lite/brawl/`,
  },
};

export const SYMBOLS = ['LUNC-USDT', 'LUNA-USDT'];

export const SYMBOLS_CONFIG = [
  {
    contractSymbol: 'LUNCUSDTM',
    currency: 'LUNC',
    ifContract: true,
    spotSymbol: 'LUNC-USDT',
    symbol: 'LUNC-USDT',
  },
  {
    contractSymbol: 'LUNAUSDTM',
    currency: 'LUNA',
    ifContract: true,
    spotSymbol: 'LUNA-USDT',
    symbol: 'LUNA-USDT',
  },
];
