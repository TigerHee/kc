/*
 * Owner: jesse.shao@kupotech.com
 */
// import { MAX_WIDTH } from 'config';
import kcsensors, { KcSensorsLogin } from 'utils/kcsensors';

jest.mock('@kc/sensors', () => ({
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
}));

describe('kcsensors', () => {
  // beforeEach(() => {
  //   jest.resetModules();
  //   process.env.NODE_ENV = 'production';
  // });

  // Object.defineProperty(window, 'screen', {
  //   value: {
  //     width: 1420,
  //     height: 800,
  //   },
  // });

  it('should KcSensorsLogin', () => {
    expect(KcSensorsLogin()).toBeUndefined();
    expect(KcSensorsLogin()).toBeUndefined();
  });

  it('should initHandler', () => {
    expect(kcsensors()).toBeUndefined();
  });
  
});
