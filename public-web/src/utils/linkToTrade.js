/**
 * Owner: willen@kupotech.com
 */
/**
 * 跳转到trade页面，更改localstorage的值
 * runtime: browser
 */
import { addLangToPath } from 'tools/i18n';
import coinReport from 'utils/coinReport';
import { getUtmLink } from 'utils/getUtm';
import siteConfig from 'utils/siteConfig';

const { TRADE_HOST } = siteConfig;

// 新版本
export function linkToTrade(symbol, formatUrl = (v) => v) {
  if (symbol) {
    coinReport(symbol, true);
    window.location.href = formatUrl(addLangToPath(getUtmLink(`${TRADE_HOST}/${symbol}`)));
  } else {
    window.location.href = formatUrl(addLangToPath(getUtmLink(`${TRADE_HOST}`)));
  }
}

export function getTradeUrl(symbol, formatUrl = (v) => v) {
  if (symbol) {
    return formatUrl(addLangToPath(getUtmLink(`${TRADE_HOST}/${symbol}`)));
  } else {
    return formatUrl(addLangToPath(getUtmLink(`${TRADE_HOST}`)));
  }
}
