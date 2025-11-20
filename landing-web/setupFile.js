// jest global config
// 废弃，改成从@kc/sensors加载
global.$KcSensors = {
  init: jest.fn(() => jest.fn()),
  observeExpose: jest.fn(() => jest.fn()),
  trackClick: jest.fn(),
  _KC_REPORT_: {
    logAction: jest.fn(() => jest.fn()),
  },
  spmStorage: {
    initSpmParam: () => {},
  },
  getAnonymousID: () => 123,
  track: () => null,

  spm: {
    getSiteId: () => 'public',
    getPageId: () => 'page',
    compose: (e) => e,
  },
  login: () => {},
};

global._SAFE_WEB_DOMAIN_ = [
  'kucoin.net',
  'kucoin.com',
  'kucoin.biz',
  'kucoin.top',
  'kucoin.plus',
  'kucoin.work',
  'kumex.com',
  'pool-x.io',
  'kucoin.zendesk.com', // zendesk三方站点
];

global.__KC_LANGUAGES__ = {
  __ALL__: [
    "de_DE",
    "en_US",
    "es_ES",
    "fr_FR",
    "ko_KR",
    "nl_NL",
    "pt_PT",
    "ru_RU",
    "tr_TR",
    "vi_VN",
    "zh_HK",
    "it_IT",
    "id_ID",
    "ms_MY",
    "hi_IN",
    "th_TH",
    "ja_JP",
    "bn_BD",
    "pl_PL",
    "fil_PH",
    "ar_AE",
    "ur_PK",
    "uk_UA",
  ]
}

global.__KC_LANGUAGES_BASE_MAP__ = {
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
    "uk_UA": "uk"
  }
};


global._LANG_DOMAIN_ = ['www.kucoin.', 'trade.kucoin.', 'futures.kucoin.', 'm.kucoin.'];

global._DEFAULT_LANG_ = 'en_US';

global._DEFAULT_LOCALE_ = 'en';

global._BRAND_SITE_ = 'KC';

global._BASE_CURRENCY_ = 'USDT';

jest.mock('@kc/socket', () => {
  return jest.fn(() => Promise.resolve({
    default: {
      setHost: jest.fn(),
      setDelay: jest.fn(),
      setCsrf: jest.fn(),
      connected: jest.fn(),
      getInstance: () => ({
        subscribe: jest.fn(),
        topicMessage: jest.fn(),
      })
    }
  }));
});

jest.mock('@kc/sensors', () => {
  return jest.fn(() => Promise.resolve({
    default: {
      init: jest.fn(() => jest.fn()),
      registerProject: jest.fn(),
      observeExpose: jest.fn(() => jest.fn()),
      trackClick: jest.fn(),
      _KC_REPORT_: {
        logAction: jest.fn(() => jest.fn()),
      },
      spmStorage: {
        initSpmParam: () => { },
      },
      getAnonymousID: () => 123,
      track: () => null,

      spm: {
        getSiteId: () => 'public',
        getPageId: () => 'page',
        compose: (e) => e,
      },
      login: () => { },
    }
  }))
});

global.System = {
  import: () => {
    return new Promise((res, rej) => {
      res();
    });
  },
};

global.routerBase = '/land'


global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('utils/jsBridge', () => {
  return {
    __esModule: true,
    default: {
      init: jest.fn(),
      open: jest.fn(),
      isApp: () => false,
    },
  };
});

jest.mock('@remote/common-base', () => {
  return {
    __esModule: true,
    default: {
      checkIfXgrayNeedReload: jest.fn(() => null),
      xgrayCheck: jest.fn(() => null),
    }
  }
})