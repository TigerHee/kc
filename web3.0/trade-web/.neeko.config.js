module.exports = {
  dir: './public/locale',
  standard: 'en_US.js',
  target: 'bn_BD.js',
  template: 'template.csv',
  jsSyntax: `
    let content = '';
    const _KC_PAGE_LANG_LOADER = (key, value) => content = value;

    {_SYNTAX_LOCALE_CONTENT_}

    return content;`,
  jsTemplate: `_KC_PAGE_LANG_LOADER("&{code}", &{data})`,
  ext: '.js',
  projectId: '7918317561b2fc3eb7d526.54486247',
  codeMap: {
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
    ar_001: 'ar_AE',
    ur_PK: 'ur_PK',
    uk_UA: 'uk_UA',
  },
  includeTags: [], // 如果只想局部更新自己提交的翻译，就配置includeTags为自己翻译任务的标签
  diffConfig: {
    includeDirs: ['./src'],
    excludeDirs: ['./src/.umi', './src/services'], // 跳过扫描的目录
    ext: ['js', 'jsx', 'ts', 'tsx'], // 扫描的文件后缀
    functionNames: ['_t', '_tHTML'],
    keepKeys: [
      'position.list.ADL_LONG',
      'position.list.ADL_SHORT',
      'position.list.CLOSE_LONG',
      'position.list.CLOSE_SHORT',
      'position.list.LIQUID_LONG',
      'position.list.LIQUID_SHORT',
      'futuresAssets.USDC',
      'futuresAssets.USDT',
      'position.confirm.dec.buy',
      'position.confirm.dec.sell',
      'stopClose.loss.tip',
      'stopClose.profit.tip',
      'adjust.risk.limit',
      'risk.limit.autoChange.title',
      'risk.limit.changeTips',
      'risk.limit.contentLow',
      'risk.limit.guideChange',
      'risk.limit.successTips',
      'risk.limit.successTitle',
      'view.risk.limit',
    ], // 需保留的key
    keepKeysWithTaskId: [], // 保留产品翻译平台taskId关联的key
  },
};
