/*
 * Owner: terry@kupotech.com
 */
export default {
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