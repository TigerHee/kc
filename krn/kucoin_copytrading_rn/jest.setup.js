import MockAsyncStorage from 'mock-async-storage';

import 'utils/computedPx';

const mockImpl = new MockAsyncStorage();

// 由于 ci 环境速度慢，将 jest 超时时间增加到 10 秒
jest.setTimeout(10000);
jest.mock('react-native-webview', () => {
  const React = require('react');
  const {View} = require('react-native');

  const refOverride = {
    goBack: jest.fn(),
    goForward: jest.fn(),
    reload: jest.fn(),
    stopLoading: jest.fn(),
    injectJavaScript: jest.fn(),
    requestFocus: jest.fn(),
    postMessage: jest.fn(),
    clearFormData: jest.fn(),
    clearCache: jest.fn(),
    clearHistory: jest.fn(),
  };
  const MockWebView = React.forwardRef((props, ref) => {
    React.useEffect(() => {
      ref.current = refOverride;
    }, []);
    return <View {...props} ref={ref} />;
  });

  return {
    __esModule: true,
    WebView: MockWebView,
    default: MockWebView,
  };
});

jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent');
  return {
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
  };
});

jest.mock('react-native/Libraries/Storage/AsyncStorage', () => mockImpl);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@miblanchard/react-native-slider', () => 'Slider');

//  warning resulted by useLinking due to usage of NavigationContainer
jest.mock('@react-navigation/native/lib/commonjs/useLinking.native', () => ({
  default: () => ({getInitialState: {then: () => null}}),
  __esModule: true,
}));

//  Animated: `useNativeDriver` is not supported warning
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

global.fetch = jest.fn((...args) => {
  console.warn('global.fetch needs to be mocked in tests', ...args);
  throw new Error('global.fetch needs to be mocked in tests');
});
global.FormData = class FormData {
  constructor() {
    this.data = {};
  }

  append(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  entries() {
    return Object.entries(this.data);
  }
  keys() {
    return Object.keys(this.data);
  }
  has(key) {
    if (key in this.data) {
      return true;
    }
    return false;
  }
};

jest.mock('@krn/toolkit', () => ({
  tenant: {
    getSiteType: () => 'global',
    getBaseCurrency: () => ({
      brandName: 'KuCoin',
      siteType: 'global',
      siteBaseCurrency: 'USDT',
    }),
  },

  storage: {
    setItem: jest.fn(), // Mock storage.setItem 方法
    getItem: jest.fn(),
  },
  sentry: {
    initSentry: jest.fn(),
    reportIntlMissing: jest.fn(),
  },
}));

jest.mock(
  './package.json',
  () => ({
    name: 'mock-app',
    version: '0.0.0-test',
  }),
  {virtual: true},
);

// Mock `
jest.mock('@sentry/react-native', () => ({
  captureEvent: jest.fn(),
}));
