/**
 * Owner: jesse.shao@kupotech.com
 */
import {
  toUpper,
  some,
  startsWith,
} from 'lodash';

export const SHORT_LANGS = ['zh_CN', 'zh_HK', 'ja_JP'];

export const LONG_TITLE_LANGS = [
  'it_IT',
  'ms_MY',
  'ru_RU',
  'fr_FR',
  'vi_VN',
  'pt_PT',
  'es_ES',
  'tr_TR',
  'ms_MY',
];

// id_ID ms_MY nl_NL
export const MAXLENGTH_LANGS = [
  'de_DE',
  'ms_MY',
  'nl_NL',
  'ru_RU',
  'fr_FR',
  'vi_VN',
  'pt_PT',
  'es_ES',
  'ms_MY',
  'fil_PH',
];

export const staticHosts = ['http://', 'https://'];

/**
 * 是否http开头
 * @param {*} url 
 */
export const isHttps = (url) => {
  return some(staticHosts, (prefix) => startsWith(
    toUpper(url),
    toUpper(prefix)
  ));
}

export const getWebHost = (host, { https = true } = {}) => {
  if (!host) return;
  if (isHttps(host)) return host;
  if (startsWith(host, 'www')) {
    const prefix = https ? 'https://' : 'http://';
    return `${prefix}${host}`;
  }
  return host
}
