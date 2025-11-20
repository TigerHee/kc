/**
 * Owner: victor.ren@kupotech.com
 */
import siteConfig from 'utils/siteConfig';

const { KUCOIN_HOST } = siteConfig;

const host = window ? window.location.host : KUCOIN_HOST;
const isDev =
  process.env.NODE_ENV === 'development' ||
  host.includes('localhost') ||
  host.includes('127.0.0.1');

export const IS_TEST_ENV = host.includes('.net');

export const _DEV_ = isDev;
export const IS_PROD = !isDev && !IS_TEST_ENV && process.env.NODE_ENV === 'production';
