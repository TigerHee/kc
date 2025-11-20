/**
 * Owner: victor.ren@kupotech.com
 */
import siteConfig from 'utils/siteConfig';

const { KUCOIN_HOST } = siteConfig;

const host = window ? window.location.host : KUCOIN_HOST;
const isDev = process.env.NODE_ENV === 'development';

export const IS_TEST_ENV = host.includes('.net');

export const _DEV_ = isDev;
export const IS_PROD_ENV = !_DEV_ && !window.location.host.includes('.net');
