/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@kufox/mui/emotion';
import { useSelector } from 'dva';

import KCFooter from 'components/Footer/KCFooter';

jest.mock('react-router', () => ({
  __esModule: true,
  useHistory: () => ({ push: jest.fn(), location: { pathname: '/spotlight' } }),
}));

// 模拟 theme
const theme = {
  colors: { text40: '#333333', primary: '#01BC8D', text: '#000D1D' },
  breakpoints: {
    down: () => {},
    up: () => {},
  },
};

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      app: {},
      user: {},
      categories: {},
    })),
  };
});

describe('KCFooter', () => {
  afterEach(() => {
    useSelector.mockClear();
  });
  test('KCFooter should in Document', () => {
    const mockState = {
      app: {
        currentLang: 'en_US',
      },
    };
    useSelector.mockImplementation((selector) => selector(mockState));
    const onClickBack = jest.fn();
    const { container } = render(
      <ThemeProvider onClickBack={onClickBack} theme={theme}>
        <KCFooter />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
  test('KCFooter should in Document with background', () => {
    const mockState = {
      app: {
        currentLang: 'en_US',
      },
    };
    useSelector.mockImplementation((selector) => selector(mockState));
    const onClickBack = jest.fn();
    const { container } = render(
      <ThemeProvider onClickBack={onClickBack} theme={theme}>
        <KCFooter background="#181e29" />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
});
