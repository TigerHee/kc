/**
 * Owner: larvide.peng@kupotech.com
 * 
 * 组件多租户适配逻辑
 */

/** 当前站点小logo */
export function getBrandMiniLogo() {
  return app.global?._BRAND_LOGO_MINI_;
}