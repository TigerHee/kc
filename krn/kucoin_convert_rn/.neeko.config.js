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
  projectId: '40704176629204db6844c7.77926139',
  diffConfig: {
    includeDirs: ['./src'],
    excludeDirs: ['./src/locales'],
    ext: ['js'],
    functionNames: ['_t'],
    keepKeys: [

    ], // 需保留的key
    keepKeysWithTaskId: [

    ], // 保留产品翻译平台taskId关联的key
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
  // branch: '',
  // includeTags: [''],
};
