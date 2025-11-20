import 'regenerator-runtime/runtime';

import React from 'react';
import 'mutationobserver-shim'; // mutationobserver polyfill
import { render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { ThemeProvider as KufoxProvider } from '@kufox/mui';
import { ThemeProvider as KuxProvider, Snackbar, Notification } from '@kux/mui';
import 'jest-canvas-mock';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import prices from './_mock_/prices.json';
import rates from './_mock_/rates.json';
import categories from './_mock_/categories.json';
import symbols from './_mock_/symbols.json';
import marginMeta from './_mock_/marginMeta.json';
import leveragedTokens from './_mock_/leveragedTokens.json';
import trade from './_mock_/trade.json';
import tradeForm from './_mock_/tradeForm.json';
import theme from './_mock_/theme.json';
import user_assets from './_mock_/user_assets.json';
import user from './_mock_/user.json';
import isolated from './_mock_/isolated.json';
import grid from './_mock_/grid.json';
import overview from './_mock_/overview.json';
import components from './_mock_/components.json';
import homepage from './_mock_/homepage.json';
import sentry from '@kucoin-biz/sentry';
import collectionSensorsStore from './_mock_/collectionSensorsStore.json';
import LocalStorageMock from './mockProperty/localStroageMock';
import NavigatorMock from './mockProperty/NavigatorMock';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

jest.mock('services/workers/websocket.worker', () => ({
  ...jest.requireActual('services/workers/websocket.worker'),
  __esModule: true,
  default: require('./_mock_/worker'),
}));

const mockSystemjsImport = jest.fn(async (moduleName) => {
  const modules = {
    '@kucoin-biz/sentry': sentry,
  };
  const res = await modules[moduleName];
  return res || null;
});

global.Systemjs = { import: mockSystemjsImport };

const initialState = {
  app: {
    currentLang: 'en_US',
  },
  categories: {
    coinDict: [],
    ...categories,
  },
  loading: {
    effects: [],
  },
  user: {
    isLogin: false,
  },
  currency: {
    currency: 'USD',
    currencyList: Object.keys(rates).filter((key) => key !== 'CNY'),
    prices: prices,
    rates: rates,
  },
  symbols,
  marginMeta,
  leveragedTokens,
  trade,
  tradeForm,
  theme,
  grid,
  user,
  user_assets,
  isolated,
  overview,
  components,
  homepage,
  collectionSensorsStore,
};

const Providers = ({ children }) => {
  return (
    <KufoxProvider>
      <KuxProvider>
        {children}
        {/* <NotificationProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </NotificationProvider> */}
      </KuxProvider>
    </KufoxProvider>
  );
};

const mockStore = configureStore();
let store;

export const renderWithTheme = (children, preLoadedState = {}) => {
  store = mockStore(initialState, preLoadedState);
  const wrapper = render(
    <Providers>
      <Provider store={store}>{children}</Provider>
    </Providers>,
  );

  const { rerender } = wrapper;
  const rerenderWithTheme = (newChildren) =>
    rerender(
      <Providers>
        <Provider store={store}>{newChildren}</Provider>
      </Providers>,
    );

  return {
    wrapper,
    children,
    rerenderWithTheme,
  };
};

export const renderWithHook = (hook, ...rest) => {
  const wrapper = ({ children }) => {
    store = mockStore(initialState);
    return (
      <Providers>
        <Provider store={store}>{children}</Provider>
      </Providers>
    );
  };

  const res = renderHook(() => hook(), { wrapper, ...rest });
  return res;
};

export const customRender = (ui, { store = mockStore({}), ...options } = {}) => {
  const StoreProvider = ({ children }) => {
    return (
      <Provider store={store}>
        <Providers>{children}</Providers>
      </Provider>
    );
  };
  return render(ui, { wrapper: StoreProvider, ...options });
};

export * from '@testing-library/react';

// ===== mock 代码统一运行 ===== //
const mockWindowFunctionMap = {
  localStorage: new LocalStorageMock(jest),
  navigator: new NavigatorMock(jest),
};

const originWindow = { ...global.window };

// 将 window 下的某个对象设置为 mock 模式
global.window.setMock = (key) => {
  if (key) {
    const mockFn = mockWindowFunctionMap[key];
    if (!mockFn) {
      throw new TypeError(`未增加 window 下的 ${key} 方法，请添加！`);
    }
    Object.defineProperty(window, key, {
      writable: true,
      value: mockFn,
    });
    return;
  }
  Object.keys(mockWindowFunctionMap).forEach((eachKey) => {
    const mockFn = mockWindowFunctionMap[eachKey];
    Object.defineProperty(window, eachKey, {
      writable: true,
      value: mockFn,
    });
  });
};

// 将 window 下的某个对象重置为初始值
global.window.resetMock = (key) => {
  if (key) {
    Object.defineProperty(window, key, {
      writable: true,
      value: originWindow[key],
    });
    return;
  }
  Object.keys(mockWindowFunctionMap).forEach((eachKey) => {
    Object.defineProperty(window, eachKey, {
      writable: true,
      value: originWindow[eachKey],
    });
  });
};

/**
 * @param object 指定的原型
 * @param key 指定的 原型上的 key
 * @param prototypeSetting 自定义原型实现
 */
global.window.setPrototypeMock = (object, key, prototypeSetting) => {
  let store = null;
  const originValue = object[key];

  if (prototypeSetting) {
    Object.defineProperty(object, key, prototypeSetting);
  } else {
    Object.defineProperty(object, key, {
      get: () => {
        return store;
      },
      set: (v) => {
        store = v;
      },
    });
  }
  return {
    mockRestory: () => {
      object[key] = originValue;
    },
  };
};
