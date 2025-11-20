import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
// eslint-disable-next-line import/no-extraneous-dependencies
import {ThemeProvider as EThemeProvider} from '@emotion/react';
import {ThemeProvider} from '@krn/ui';
import {cleanup, render} from '@testing-library/react-native';

import {DEFAULT_LANG} from 'config/';
import BaseLayout from './BaseLayout';

import 'utils/computedPx';
global.React = React;

afterEach(cleanup);

const initialState = {
  loading: {
    effects: [],
  },
  app: {
    userInfo: {},
  },
  user: {
    isLogin: false,
  },
  futures: {
    futuresCurrenciesMap: {},
  },
  categories: {
    coinDict: {
      BTC: {
        currencyName: 'bitcoin',
      },
    },
  },
};

const mockStore = configureStore();
let store;

const themeMockOptions = {
  appVersion: '3.60.0',
  lang: DEFAULT_LANG,
};

export const customRender = (children, state) => {
  store = mockStore({...initialState, ...state});

  return render(
    <Provider store={store}>
      <ThemeProvider
        {...themeMockOptions}
        EmotionProviderInstance={EThemeProvider}>
        <BaseLayout>{children}</BaseLayout>

        {/* <BaseLayout lang={'en-us'}>{children}</BaseLayout> */}
      </ThemeProvider>
    </Provider>,
  );
};
