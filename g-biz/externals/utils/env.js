/**
 * Owner: odan.ou@kupotech.com
 */

export const siteConfig = window._WEB_RELATION_ || {};
const { KUCOIN_HOST } = siteConfig;
const host = window ? window.location.host : KUCOIN_HOST;
const isDev = process.env.NODE_ENV === 'development' || host.includes('localhost');

export const IS_TEST_ENV = host.includes('.net');

export const _DEV_ = isDev;
export const IS_PROD = !isDev && !IS_TEST_ENV && process.env.NODE_ENV === 'production';
