/**
 * Owner: vijay.zhou@kupotech.com
 */
module.exports = {
  dir: './src/locale',
  standard: 'zh_CN.js',
  target: 'en_US.js',
  template: 'template.csv',
  jsSyntax: (data) => {
    return data.replace(/export default/, 'return');
  },
  jsTemplate: 'export default &{data}',
  ext: '.js',
  projectId: '400827276731bdd22cb399.38969366', // 项目名：kucoin-gbiz-verification
  diffConfig: {
    // 需要扫描的目录，必填
    includeDirs: ['./src'],
    // 跳过扫描的目录
    excludeDirs: ['./src/locale'],
    // 扫描的文件后缀，必填
    ext: ['js', 'jsx'],
    // 国际化方法名，必填
    functionNames: ['_t', '.t', '_tHTML', '.tHTML'],
    keepKeys: [],
    keepKeysWithTaskId: [],
  },
  codeMap: {
    ur_PK: 'ur_PK',
    ar_001: 'ar_AE',
    de_DE: 'de_DE',
    en: 'en_US',
    es_ES: 'es_ES',
    fr_FR: 'fr_FR',
    hi_IN: 'hi_IN',
    id_ID: 'id_ID',
    it_IT: 'it_IT',
    ko_KR: 'ko_KR',
    ms_MY: 'ms_MY',
    nl_NL: 'nl_NL',
    pt_PT: 'pt_PT',
    ru_RU: 'ru_RU',
    tr_TR: 'tr_TR',
    vi_VN: 'vi_VN',
    zh_CN: 'zh_CN',
    zh_HK: 'zh_HK',
    ja_JP: 'ja_JP',
    th_TH: 'th_TH',
    bn_BD: 'bn_BD',
    fil_PH: 'fil_PH',
    pl_PL: 'pl_PL',
    uk_UA: 'uk_UA',
  },
};
