/**
 * Owner: mike@kupotech.com
 */
const path = require('path');
const root = __dirname.replace('/src/trade4.0/pages/Bot', '');
const dir = path.join(root, 'public/BotLocale');

module.exports = {
  dir,
  standard: 'zh_CN.js',
  target: 'en_US.js',
  template: 'template.csv',
  jsSyntax: `
    let content = '';
    const _KC_PAGE_LANG_LOADER = (key, value) => content = value;

    {_SYNTAX_LOCALE_CONTENT_}

    return content;`,
  jsTemplate: `/* eslint-disable */
  _KC_PAGE_LANG_LOADER("&{code}", &{data})`,
  ext: '.js',
  projectId: '4274827861e63f8e1954e1.80739142',
  codeMap: {
    en: 'en_US',
    ru_RU: 'ru_RU',
    tr_TR: 'tr_TR',
    zh_CN: 'zh_CN',
    ko_KR: 'ko_KR',
    zh_HK: 'zh_HK',
    ja_JP: 'ja_JP',
    pt_PT: 'pt_PT',
    nl_NL: 'nl_NL',
    de_DE: 'de_DE',
    fr_FR: 'fr_FR',
    es_ES: 'es_ES',
    vi_VN: 'vi_VN',
    it_IT: 'it_IT',
    ms_MY: 'ms_MY',
    id_ID: 'id_ID',
    hi_IN: 'hi_IN',
    th_TH: 'th_TH',
    bn_BD: 'bn_BD',
    pl_PL: 'pl_PL',
    fil_PH: 'fil_PH',
    ar_001: 'ar_AE',
    ur_PK: 'ur_PK',
    uk_UA: 'uk_UA',
  },
};
