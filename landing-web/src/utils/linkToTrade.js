/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 跳转到trade页面，更改localstorage的值
 * runtime: browser
 */
import router from 'umi/router';
import storage from 'utils/storage';
import coinReport from 'utils/coinReport';
import { TRADE_HOST } from 'utils/siteConfig';
import { getUtmLink } from 'utils/getUtm';
import { addLangToPath } from 'utils/lang';

// 新版本
export function linkToTrade(symbol, lang = window._DEFAULT_LANG_) {
  if (symbol) {
    coinReport(symbol, true);
    window.location.href = addLangToPath(getUtmLink(`${TRADE_HOST}/${symbol}`), lang);
  } else {
    window.location.href = addLangToPath(getUtmLink(TRADE_HOST), lang);
  }
}

// 旧版本
export function linkToTradeOld(symbol) {
  storage.removeItem('trade_box_count');
  storage.removeItem('trade_active_box_index');
  storage.removeItem('trade_order_btn_type');
  storage.removeItem('trade_selected_symbol_list');
  storage.setItem('trade_current_symbol', symbol);
  coinReport(symbol, true);
  router.push('/trade');
}

