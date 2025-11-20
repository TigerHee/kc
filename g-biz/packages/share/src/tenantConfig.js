/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2025-06-10 20:19:03
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-06-10 20:24:24
 * @FilePath: /g-biz/packages/share/src/tenantConfig.js
 * @Description: 分享组件的多租户配置
 *
 *
 */
import logoPng from './asset/kucoin.png';
import logoThPng from './asset/kucoin-th.png';
import logoTrPng from './asset/kucoin-tr.png';

/** 默认配置 */
const defaultConfig = {
  shareFooterLogo: window._BRAND_LOGO_MINI_ || logoPng, // 分享组件底部站点logo
};

/** global站配置 */
const KC = {
  ...defaultConfig,
};

/** 泰国站配置 */
const TH = {
  ...defaultConfig,
  shareFooterLogo: window._BRAND_LOGO_MINI_ || logoThPng, // 分享组件底部站点logo
};

/** 土耳其站配置 */
const TR = {
  ...defaultConfig,
  shareFooterLogo: window._BRAND_LOGO_MINI_ || logoTrPng, // 分享组件底部站点logo
};

/** claim 站配置 */
const CL = {
  ...defaultConfig,
};

const tenant = window._BRAND_SITE_ || 'KC';
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
  }[tenant] || KC;

export { tenantConfig, tenant };
