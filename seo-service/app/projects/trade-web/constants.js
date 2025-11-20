/**
 * Owner: Chelsey.Fan@kupotech.com
 */
/**
 * 为空，默认是英文, 多语言简写 en
 */
const EmptyLang = 'en';

/**
 * 为空，默认是英文，多语言全文 en_us
 */
const EmptyFullLang = 'en_us';

/**
 * 处理英语默认下的语言为空的情况
 * @param {string} lang
 */
const langHandle = lang => lang || EmptyLang;

const defLangToEmpty = lang =>
  (lang === EmptyLang || lang === EmptyFullLang ? '' : lang);

const fullLangHandle = fullLang => fullLang || EmptyFullLang;
const getUrlPath = (path, prefix = true) =>
  (path ? (prefix ? `/${path}` : `${path}/`) : '');
const reg = /\/en/i;
module.exports = {
  EmptyLang,
  langHandle,
  EmptyFullLang,
  fullLangHandle,
  defLangToEmpty,
  getUrlPath,
  reg,
};
