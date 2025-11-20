import {APP2COPY_NAVIGATION_POINTS} from 'pages/Main/constant';
import {getBaseCurrency} from 'site/tenant';
import {openNative} from '@krn/bridge';
import {gotoCheckLoginPage} from '@krn/toolkit';

import {getNativeInfo} from './helper';

/** 进入划转页面 */
export const gotoTransferPageByCoin = depositCurrency =>
  openNative(`/account/transfer?coin=${depositCurrency || getBaseCurrency()}`);

/** 进入充值页面 */
export const gotoDepositPageByCoin = depositCurrency =>
  openNative(`/account/deposit?coin=${depositCurrency || getBaseCurrency()}`);

/** 进入快捷USDT买币页面 */
export const gotoOTCPage = () =>
  openNative(`/otc?mode=0&type=2&market=${getBaseCurrency()}`);

/** 发起带单 */
export const gotoLeadTrade = (leadUserId, params) => {
  const {symbol} = params || {};
  const symbolParam = symbol ? `&symbol=${symbol}` : '';
  openNative(`/kumex/trade?leadUserId=${leadUserId}${symbolParam}`);
};

/** 进入行情下 跟单主页 我的带单 */
export const gotoMainLeadPage = () => {
  openNative(
    `/quotes?mainTab=copyTrading&uiStateValue=${APP2COPY_NAVIGATION_POINTS.myLeading}`,
  );
};
/** 进入行情下 跟单主页 我的跟单 */
export const gotoMainCopyPage = () => {
  openNative(
    `/quotes?mainTab=copyTrading&uiStateValue=${APP2COPY_NAVIGATION_POINTS.myCopy}`,
  );
};

/** 进入行情下 跟单主页 */
export const gotoMainCopyHome = () => {
  openNative(
    `/quotes?mainTab=copyTrading&uiStateValue=${APP2COPY_NAVIGATION_POINTS.copyHome}`,
  );
};

/** 跳转合约K线 */
export const gotoSymbolKumexMarket = symbolCode =>
  openNative(`/kumex/market?symbol=${symbolCode}`);

export const gotoLoginPage = gotoCheckLoginPage;

// 打开 h5 链接
export const openH5Link = async url => {
  const nativeInfo = await getNativeInfo();
  const {webApiHost} = nativeInfo;
  const joinFlag = url.includes('?') ? '&' : '?';
  const _url = `${url}${joinFlag}&loading=2&appNeedLang=true`;

  const encodedUrl = encodeURIComponent(`https://${webApiHost}${_url}`);
  openNative(`/link?url=${encodedUrl}`);
};

/**
 * 通过ID打开支持链接
 * @param {string} id - 支持页面的ID
 */
export const openSupportLinkById = id => {
  openH5Link(`/support/${id}`);
};
