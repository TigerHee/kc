/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider as KufoxProvider } from '@kufox/mui';
import { ThemeProvider as KuxProvider } from '@kux/mui';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

global.React = React;

const initialState = {
  loading: {
    effects: [],
  },
  user: {
    isLogin: false,
  },
  categories: {
    coinDict: {
      BTC: {
        currencyName: 'bitcoin',
      },
    },
  },
  coinin: {
    chainInfo: [],
  },
  withdraw: {
    chainInfo: [],
  },
  currency: {
    currency: 'USD',
    prices: {
      BTC: 50000,
      ETH: 4000,
    },
  },
  user_assets: {
    lockAmount: 10.0,
  },
};

const mockStore = configureStore();
let store;

export const customRender = (children, state) => {
  store = mockStore({ ...initialState, ...state });
  const res = render(
    <KufoxProvider>
      <KuxProvider>
        <Provider store={store}>{children}</Provider>
      </KuxProvider>
    </KufoxProvider>,
  );

  const rerender = (children) =>
    res.rerender(
      <KufoxProvider>
        <KuxProvider>
          <Provider store={store}>{children}</Provider>
        </KuxProvider>
      </KufoxProvider>,
    );
  return { ...res, rerender };
};
