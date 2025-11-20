/**
 * Owner: jesse.shao@kupotech.com
 */
import { M_KUCOIN_HOST, TRADE_HOST, KUMEX_HOST } from 'utils/siteConfig';

export const THEME_COLOR = { primary: '#4440FF', surface: '#B9C9FE', background: '#C1D0FF' };

// 去交易的跳转添加 @todo 暂时产品还没给链接
export const TRADE_URL = {
  SPOT: {
    appUrl: `/trade?symbol=LUNC-USDT`,
    pcUrl: `${TRADE_HOST}/LUNC-USDT`,
    h5Url: `${M_KUCOIN_HOST}/trade/LUNC-USDT`,
  },
  FUTURE: {
    appUrl: `/kumex/trade?symbol=LUNCUSDTM`,
    pcUrl: `${KUMEX_HOST}/trade/LUNCUSDTM`,
    h5Url: `${KUMEX_HOST}/lite/brawl/LUNCUSDTM`,
  },
};
