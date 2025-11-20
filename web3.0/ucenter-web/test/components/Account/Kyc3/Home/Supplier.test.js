import Supplier from 'src/components/Account/Kyc/OcrSupplier/index.js';
import { customRender } from 'test/setup';

const originStore = {
  kyc: {
    kycInfo: {
      verifyStatus: -1,
      regionType: 3,
      primaryVerifyStatus: -1,
    },
    kyc2ChannelInfo: {},
  },
};

jest.mock('@kc/sentry', () => ({
  __esModule: true,
  ...jest.requireActual('@kc/sentry'),
  captureException: jest.fn(),
}));

jest.mock('tools/i18n', () => ({
  __esModule: true,
  ...jest.requireActual('tools/i18n'),
  getAllLocaleMap: jest.fn().mockReturnValue({}),
}));

jest.mock('src/services/kyc', () => ({
  __esModule: true,
  getAdvanceResult: jest.fn().mockResolvedValue({ data: true, success: true }),
  getLegoAdvanceResult: jest.fn().mockResolvedValue({ data: true, success: true }),
}));

describe('test Supplier', () => {
  const originRequestIdleCallback = window.requestIdleCallback;
  const originCcancelIdleCallback = window.cancelIdleCallback;
  const originMediaDevices = navigator.mediaDevices;

  window.requestIdleCallback = jest.fn();
  window.cancelIdleCallback = jest.fn();
  navigator.mediaDevices = {
    enumerateDevices: jest.fn().mockResolvedValue([{}]),
  };

  afterAll(() => {
    window.requestIdleCallback = originRequestIdleCallback;
    window.cancelIdleCallback = originCcancelIdleCallback;
    navigator.mediaDevices = originMediaDevices;
  });

  test('test Supplier', () => {
    customRender(<Supplier currentRoute="SUMSUB" />, originStore);
    customRender(<Supplier currentRoute="jumio" />, originStore);
    customRender(<Supplier currentRoute="legoIndex" />, originStore);
    customRender(<Supplier currentRoute="legoCamera" />, originStore);
    customRender(<Supplier currentRoute="facial" />, originStore);
    customRender(<Supplier currentRoute="facial_qrcode" />, originStore);
    customRender(<Supplier currentRoute="advanceIframe" />, originStore);
  });
});
