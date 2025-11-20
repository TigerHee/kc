/**
 * Owner: willen@kupotech.com
 */
import { Snackbar as KuxSnackbar, ThemeProvider as KuxProvider } from '@kux/mui';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

global.React = React;

const initialState = {
  loading: {
    effects: [],
  },
  user: {
    isLogin: false,
  },
  security_new: {
    retryAfterSeconds: 0,
  },
  categories: {
    coinDict: {
      BTC: {
        currencyName: 'bitcoin',
      },
    },
  },
  rebind_phone: {
    fields: {
      frontPic: { imgUrl: 'test-url' },
    },
    fieldLoading: {},
  },
};

const mockStore = configureStore();
let store;

export const customRender = (children, state) => {
  store = mockStore({ ...initialState, ...state });
  const res = render(
    <KuxProvider>
      <KuxSnackbar.SnackbarProvider>
        <Router history={createMemoryHistory()}>
          <Provider store={store}>{children}</Provider>
        </Router>
      </KuxSnackbar.SnackbarProvider>
    </KuxProvider>,
  );

  const rerender = (children) =>
    res.rerender(
      <KuxProvider>
        <KuxSnackbar.SnackbarProvider>
          <Provider store={store}>{children}</Provider>
        </KuxSnackbar.SnackbarProvider>
      </KuxProvider>,
    );
  return { ...res, rerender };
};
