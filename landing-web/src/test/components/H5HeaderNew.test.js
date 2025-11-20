/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from '@kufox/mui/emotion';

import H5HeaderNew from 'components/H5HeaderNew';

jest.mock('react-router',() => {
  const originalModule = jest.requireActual('react-router');
  return {
    __esModule: true,
    ...originalModule,
    default: null,
    useHistory: () => ({ push: jest.fn(), goBack: jest.fn() }),
  };
});


jest.mock('react-router-dom',() => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    default: null,
    matchPath: () => ({ params: { lng: 'zh-hans' } }),
  };
});

// 模拟kufox/mui theme
const theme = {
  colors: { text40: '#333333', primary: '#01BC8D', text: '#000D1D' },
  breakpoints: {
    down: () => {},
    up: () => {},
  },
};

describe('H5HeaderNew', () => {
  test('H5HeaderNew should in Document', () => {
    const onClickBack = jest.fn();
    const { container, baseElement } = render(
      <ThemeProvider onClickBack={onClickBack} theme={theme}>
        <H5HeaderNew />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
    fireEvent.click(baseElement.querySelector('.Ku-new-h5-header-img-button'));
  });

  test('H5HeaderNew should in Document without onClickBack', () => {
    const { container, baseElement } = render(
      <ThemeProvider onClickBack={'test'} theme={theme}>
        <H5HeaderNew />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
    fireEvent.click(baseElement.querySelector('.Ku-new-h5-header-img-button'));
  });

  test('H5HeaderNew in App', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <H5HeaderNew isInApp />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  test('H5HeaderNew layoutType is left', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <H5HeaderNew layoutType="left" />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });

  test('H5HeaderNew is fixed && layoutType is left', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <H5HeaderNew fixed layoutType="left" />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
  test('H5HeaderNew is fixed && layoutType is left && inApp', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <H5HeaderNew isInApp fixed layoutType="left" />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
  test('H5HeaderNew is fixed && layoutType is not left', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <H5HeaderNew fixed />
      </ThemeProvider>,
    );
    expect(container).toBeInTheDocument();
  });
});
