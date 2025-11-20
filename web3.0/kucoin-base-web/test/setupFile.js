// jest global config

// global.$KcSensors = {
//   init: jest.fn(() => jest.fn()),
//   observeExpose: jest.fn(),
//   trackClick: jest.fn(),
//   getAnonymousID: () => 123,
//   spm: {
//     getSiteId: () => 'public',
//     getPageId: () => 'page',
//   },
// };

// global.System = {
//   import: () => {
//     return new Promise((res, rej) => {
//       res();
//     });
//   },
// };
// global.Sentry = {
//   onLoad:() => {},
//   init: () => {},
//   configureScope: () => {},
//   captureException: () => {},
//   captureEvent: () => {},
//   captureMessage: () => {}
// }

global.__KC_LANGUAGES__ = {
  __ALL__: [
    'de_DE',
    'en_US',
    'es_ES',
    'fr_FR',
    'ko_KR',
    'nl_NL',
    'pt_PT',
    'ru_RU',
    'tr_TR',
    'vi_VN',
    // 'zh_CN',
    'zh_HK',
    'it_IT',
    'id_ID',
    'ms_MY',
    'hi_IN',
    'th_TH',
    'ja_JP',
    'bn_BD',
    'pl_PL',
    'fil_PH',
    'ar_AE',
    'ur_PK',
    'uk_UA',
  ],
};
global.__KC_LANGUAGES_BASE_MAP__ = {
  baseToLang: {
    "de": "de_DE",
    "es": "es_ES",
    "fr": "fr_FR",
    "ko": "ko_KR",
    "nl": "nl_NL",
    "pt": "pt_PT",
    "ru": "ru_RU",
    "tr": "tr_TR",
    "vi": "vi_VN",
    "zh-hant": "zh_HK",
    "it": "it_IT",
    "id": "id_ID",
    "ms": "ms_MY",
    "hi": "hi_IN",
    "th": "th_TH",
    "ja": "ja_JP",
    "bn": "bn_BD",
    "pl": "pl_PL",
    "fil": "fil_PH",
    "ar": "ar_AE",
    "ur": "ur_PK",
    "uk": "uk_UA",
  },
  langToBase: {
    "de_DE": "de",
    "es_ES": "es",
    "fr_FR": "fr",
    "ko_KR": "ko",
    "nl_NL": "nl",
    "pt_PT": "pt",
    "ru_RU": "ru",
    "tr_TR": "tr",
    "vi_VN": "vi",
    "zh_HK": "zh-hant",
    "it_IT": "it",
    "id_ID": "id",
    "ms_MY": "ms",
    "hi_IN": "hi",
    "th_TH": "th",
    "ja_JP": "ja",
    "bn_BD": "bn",
    "pl_PL": "pl",
    "fil_PH": "fil",
    "ar_AE": "ar",
    "ur_PK": "ur",
    "uk_UA": "uk",
  },
};
global._LANG_DOMAIN_ = ['www.kucoin.'];
global._DEFAULT_LANG_ = 'en_US';
global._DEFAULT_LOCALE_ = 'en';
global._SAFE_WEB_DOMAIN_ = ['kucoin.net', 'kucoin.com', 'kucoin.cloud', 'kucoin.biz', 'kucoin.top', 'kucoin.plus', 'kucoin.work', 'kumex.com', 'pool-x.io', 'kucoin.zendesk.com', 'www.kucoin.com'];
