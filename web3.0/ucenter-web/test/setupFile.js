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

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

global.Sentry = {
  onLoad: () => {},
  init: () => {},
  configureScope: () => {},
  captureException: () => {},
  captureEvent: () => {},
  captureMessage: () => {},
};

jest.mock('./__mocks__/@kucoin-biz/compliantCenter.js');