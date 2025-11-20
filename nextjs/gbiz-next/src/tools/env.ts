/**
 * Owner: victor.ren@kupotech.com
 */
const host = typeof window !== 'undefined' ? window.location.host : 'www.kucoin.com';
const isDev = process.env.NODE_ENV === 'development';

export const IS_TEST_ENV = host.includes('kucoin.net');

export const _DEV_ = isDev;
export const IS_PROD = !isDev && !IS_TEST_ENV && process.env.NODE_ENV === 'production';
