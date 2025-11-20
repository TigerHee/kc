const sensors = {
  registerProject: jest.fn(),
  trackClick: jest.fn(),
  track: jest.fn(),
  spm: {
    compose: jest.fn(() => ''),
    getSiteId: jest.fn(() => 'site'),
    getPageId: jest.fn(() => 'page'),
  },
  spmStorage: {
    initSpmParam: jest.fn(),
    saveSpm2SessionStorage: jest.fn(),
  },
  getAnonymousID: jest.fn(() => 123),
  observeExpose: jest.fn(() => jest.fn()),
  fastFetchABTest: jest.fn(),
};

module.exports = sensors;
