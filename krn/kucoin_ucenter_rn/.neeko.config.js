module.exports = {
  dir: './src/locales',
  standard: 'zh-CN.js',
  target: 'en-US.js',
  template: 'template.csv',
  jsSyntax: data => {
    return data.replace(/export default/, 'return');
  },
  jsTemplate: 'export default &{data}',
  ext: '.js',
  projectId: '1747527764ccc31d188665.72027584', // kucoin-ucenter-rn
  diffConfig: {
    // 需要扫描的目录，必填
    includeDirs: ['./src'],
    // 跳过扫描的目录
    excludeDirs: ['./src/locales'],
    // 扫描的文件后缀，必填
    ext: ['js', 'jsx'],
    // 国际化方法名，必填
    functionNames: ['_t'],
    keepKeys: [],
    keepKeysWithTaskId: [],
  },
  codeMap: {
    de_DE: 'de-DE',
    en: 'en-US',
    es_ES: 'es-ES',
    fr_FR: 'fr-FR',
    hi_IN: 'hi-IN',
    id_ID: 'id-ID',
    it_IT: 'it-IT',
    ko_KR: 'ko-KR',
    ms_MY: 'ms-MY',
    nl_NL: 'nl-NL',
    pt_PT: 'pt-PT',
    ru_RU: 'ru-RU',
    tr_TR: 'tr-TR',
    vi_VN: 'vi-VN',
    zh_CN: 'zh-CN',
    zh_HK: 'zh-HK',
    ja_JP: 'ja-JP',
    th_TH: 'th-TH',
    bn_BD: 'bn-BD',
    fil_PH: 'fil-PH',
    pl_PL: 'pl-PL',
    ar_001: 'ar-AE',
    ur_PK: 'ur-PK',
    uk_UA: 'uk-UA',
  },
};
