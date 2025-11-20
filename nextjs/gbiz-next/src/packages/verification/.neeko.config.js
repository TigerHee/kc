module.exports = {
  dir: '../../locales',
  standard: 'en.js',
  target: 'bn_BD.js',
  template: 'template.csv',
  jsSyntax: ``,
  jsTemplate: '',
  ext: '.json',
  nextNS: 'verification',
  projectId: '5354846868e7a6143b13a9.25517076', // 项目名：kucoin-gbiz-next-verification
  diffConfig: {
    // 需要扫描的目录，必填
    includeDirs: ['./'],
    // 跳过扫描的目录
    excludeDirs: ['./static'],
    // 扫描的文件后缀，必填
    ext: ['js', 'jsx', 'ts', 'tsx'],
    // 国际化方法名，必填
    functionNames: ['_t', '_tHTML'],
    keepKeys: [],
    keepKeysWithTaskId: [
      // '525f4b8c-1c61-4178-a91d-2c16fe2ada47',
      // 'c18d7804-5bc2-4879-808c-a72a03b841b5',
    ],
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
