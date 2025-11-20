/**
 * Owner: roger@kupotech.com
 */
import { tenantConfig } from '../tenantConfig';

const siteConfig = window._WEB_RELATION_ || {};

siteConfig.KUMEX_TRADE = tenantConfig.KUMEX_TRADE;

export default siteConfig;
