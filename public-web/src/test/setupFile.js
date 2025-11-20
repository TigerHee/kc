/**
 * Owner: willen@kupotech.com
 */
// jest global config
global.$KcSensors = {
  init: jest.fn(() => jest.fn()),
  observeExpose: jest.fn(),
  trackClick: jest.fn(),
  getAnonymousID: () => 123,
  track: () => null,

  spm: {
    getSiteId: () => 'public',
    getPageId: () => 'page',
    compose: (e) => e,
  },
};

global.System = {
  import: () => {
    return new Promise((res, rej) => {
      res();
    });
  },
};

// global.matchMedia =
//   global.matchMedia ||
//   function () {
//     return {
//       matches: false,
//       addListener: function () {},
//       removeListener: function () {},
//     };
//   };

global._DEFAULT_LANG_ = 'en_US';
global._DEFAULT_LOCALE_ = 'en';
global._SAFE_WEB_DOMAIN_ = [
  'kucoin.net',
  'kucoin.com',
  'kucoin.cloud',
  'kucoin.biz',
  'kucoin.top',
  'kucoin.plus',
  'kucoin.work',
  'kumex.com',
  'pool-x.io',
  'kucoin.zendesk.com',
  'www.kucoin.com',
];

global.Sentry = {
  onLoad: () => {},
};

