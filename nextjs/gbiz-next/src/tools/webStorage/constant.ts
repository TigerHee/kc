/**
 * Owner: garuda@kupotech.com
 */
import { bootConfig } from 'kc-next/boot';

export const getBrandSite = () => bootConfig?._BRAND_SITE_ || ''; // 获取当前站点

export const brandPrefix = '!_'; // 私有 key 前缀
